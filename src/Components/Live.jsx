import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Live.css';

export default function Live({ role = 'client' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [input, setInput] = useState('');

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Connect to the Render Socket.IO backend
  useEffect(() => {
    socketRef.current = io(
      'https://elonixx-chat-backend.onrender.com',
      {
        transports: ['websocket']
      }
    );

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to chat server:', socket.id);
    });

    socket.on('chat-history', (history) => {
      setMessages(history);
    });

    socket.on('new-message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);

      if (
        !isOpenRef.current &&
        newMsg.from === 'client' &&
        role === 'admin'
      ) {
        setUnread((prev) => prev + 1);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [role]);

  // Automatically scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setUnread(0);
    }
  };

  const sendReply = () => {
    const text = input.trim();

    if (!text) return;

    if (!socketRef.current) {
      console.error('Socket is not available.');
      return;
    }

    if (!socketRef.current.connected) {
      console.error('Chat server is not connected.');
      return;
    }

    const newMsg = {
      id: Date.now(),
      from: role,
      text
    };

    // Send message to the Socket.IO server.
    // The server will broadcast it back to all connected users.
    socketRef.current.emit('send-message', newMsg);

    setInput('');
  };

  return (
    <>
      <button
        className="chat-bubble"
        onClick={toggleChat}
      >
        <span className="chat-icon">💬</span>

        {unread > 0 && (
          <span className="chat-badge">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="chat-window">
          <header className="chat-header">
            <h4>
              Live Chat {role === 'admin' ? '(Admin)' : ''}
            </h4>

            <button
              className="close-btn"
              onClick={toggleChat}
            >
              ×
            </button>
          </header>

          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`msg ${msg.from}`}
              >
                {msg.text}
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          <footer className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendReply();
                }
              }}
            />

            <button onClick={sendReply}>
              Send
            </button>
          </footer>
        </div>
      )}
    </>
  );
}