import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Live.css";

const CHAT_URL = "https://elonixx-chat-backend.onrender.com";

export default function Live({ role = "client", token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!isOpen || role !== "client" || !token) return undefined;

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
        setMessages(Array.isArray(result.messages) ? result.messages : []);
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
      setMessages(Array.isArray(payload?.messages) ? payload.messages : []);
    });
    socket.on("support:message", (message) => {
      if (!message?.id) return;
      setMessages((current) => current.some((item) => item.id === message.id)
        ? current
        : [...current, message]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, role, token]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

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
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        aria-expanded={isOpen}
      >
        <span className="chat-icon" aria-hidden="true">💬</span>
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
