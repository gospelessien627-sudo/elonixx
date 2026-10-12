import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Live.css";

const CHAT_URL = "https://elonixx-chat-backend.onrender.com";

function getReadKey(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return `supportChatLastRead:${payload.userId || "client"}`;
  } catch {
    return "supportChatLastRead:client";
  }
}

function saveLastReadMessage(messages, readKey) {
  const lastAdminMessage = [...messages].reverse().find((message) => message.senderRole === "admin");
  if (!lastAdminMessage?.id) return;
  try {
    localStorage.setItem(readKey, lastAdminMessage.id);
  } catch {
    // Chat still works if browser storage is unavailable.
  }
}

function countUnreadAdminMessages(messages, readKey) {
  let lastReadId = "";
  try {
    lastReadId = localStorage.getItem(readKey) || "";
  } catch {
    return 0;
  }
  if (!lastReadId) return messages.filter((message) => message.senderRole === "admin").length;

  const lastReadIndex = messages.findIndex((message) => message.id === lastReadId);
  if (lastReadIndex < 0) return 0;
  return messages.slice(lastReadIndex + 1).filter((message) => message.senderRole === "admin").length;
}

export default function Live({ role = "client", token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const isOpenRef = useRef(isOpen);
  const messagesRef = useRef(messages);
  const readKey = token ? getReadKey(token) : "";

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Stay connected while the chat is closed so admin replies can update the badge immediately.
  useEffect(() => {
    if (role !== "client" || !token) {
      setConnected(false);
      setUnreadCount(0);
      setMessages([]);
      return undefined;
    }

    const socket = io(CHAT_URL, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
    });
    socketRef.current = socket;

    const openConversation = () => {
      setConnected(true);
      setError("");
      socket.emit("support:open", (result) => {
        if (!result?.ok) {
          setError(result?.error || "Could not open support chat.");
          return;
        }
        const history = Array.isArray(result.messages) ? result.messages : [];
        messagesRef.current = history;
        setMessages(history);
        if (isOpenRef.current) {
          saveLastReadMessage(history, readKey);
          setUnreadCount(0);
        } else {
          setUnreadCount(countUnreadAdminMessages(history, readKey));
        }
      });
    };

    socket.on("connect", openConversation);
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err) => {
      setConnected(false);
      setError(err?.message || "Could not connect to support chat.");
    });
    socket.on("support:error", (message) => setError(message || "Chat request failed."));
    socket.on("support:history", (payload) => {
      const history = Array.isArray(payload?.messages) ? payload.messages : [];
      messagesRef.current = history;
      setMessages(history);
      if (isOpenRef.current) {
        saveLastReadMessage(history, readKey);
        setUnreadCount(0);
      } else {
        setUnreadCount(countUnreadAdminMessages(history, readKey));
      }
    });
    socket.on("support:message", (message) => {
      if (!message?.id) return;
      const current = messagesRef.current;
      if (current.some((item) => item.id === message.id)) return;
      const updated = [...current, message];
      messagesRef.current = updated;
      setMessages(updated);

      if (message.senderRole === "admin") {
        if (isOpenRef.current) {
          saveLastReadMessage(updated, readKey);
        } else {
          setUnreadCount((count) => count + 1);
        }
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [role, token, readKey]);

  useEffect(() => {
    if (!isOpen) return;
    setUnreadCount(0);
    saveLastReadMessage(messagesRef.current, readKey);
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, readKey, messages]);

  const toggleChat = () => {
    if (!isOpen) {
      setUnreadCount(0);
      saveLastReadMessage(messagesRef.current, readKey);
    }
    setIsOpen((open) => !open);
  };

  const sendMessage = () => {
    const text = input.trim();
    const socket = socketRef.current;
    if (!text || !socket?.connected || sending) return;

    setSending(true);
    setError("");
    socket.emit("support:send", { text }, (result) => {
      setSending(false);
      if (!result?.ok) {
        setError(result?.error || "Message could not be sent.");
        return;
      }
      setInput("");
    });
  };

  return (
    <>
      <button
        type="button"
        className="chat-bubble"
        onClick={toggleChat}
        aria-label={unreadCount ? `Open support chat, ${unreadCount} unread admin messages` : isOpen ? "Close support chat" : "Open support chat"}
        aria-expanded={isOpen}
      >
        <span className="chat-icon" aria-hidden="true">💬</span>
        {unreadCount > 0 && (
          <span className="chat-unread-badge" aria-label={`${unreadCount} unread messages`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section className="chat-window" aria-label="Customer support chat">
          <header className="chat-header">
            <div>
              <h4>Customer Support</h4>
              <small>{connected ? "Connected" : "Connecting…"}</small>
            </div>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close support chat"
            >×</button>
          </header>

          <p className="chat-safety-note">
            Support will never ask for your password, PIN, one-time code, or a payment to release funds.
          </p>

          {!token && <p className="chat-error">Sign in to start a support conversation.</p>}
          {error && <p className="chat-error" role="alert">{error}</p>}

          <div className="chat-body" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`msg ${message.senderRole === "admin" ? "admin" : "client"}`}
              >
                {message.text}
                <small>{message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</small>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="chat-footer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message…"
              maxLength={2000}
              aria-label="Type a support message"
              disabled={!connected || !token}
            />
            <button type="submit" disabled={!connected || !token || sending || !input.trim()}>
              {sending ? "…" : "Send"}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
