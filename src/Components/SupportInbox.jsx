import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./SupportInbox.css";

const CHAT_URL = "https://elonixx-chat-backend.onrender.com";

export default function SupportInbox({ token }) {
  const [threads, setThreads] = useState([]);
  const [activeUserId, setActiveUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const activeUserIdRef = useRef(activeUserId);
  activeUserIdRef.current = activeUserId;

  const activeThread = useMemo(
    () => threads.find((thread) => thread.userId === activeUserId) || null,
    [threads, activeUserId]
  );

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(CHAT_URL, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError("");
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err) => {
      setConnected(false);
      setError(err?.message || "Could not connect to support chat.");
    });
    socket.on("support:error", (message) => setError(message || "Chat request failed."));
    socket.on("support:threads", (items) => {
      setThreads(Array.isArray(items) ? items : []);
    });
    socket.on("support:thread-updated", (thread) => {
      if (!thread?.userId) return;
      setThreads((current) => {
        const next = current.filter((item) => item.userId !== thread.userId);
        return [thread, ...next].sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        );
      });
    });
    socket.on("support:history", (payload) => {
      if (payload?.userId === activeUserIdRef.current) {
        setMessages(Array.isArray(payload.messages) ? payload.messages : []);
      }
    });
    socket.on("support:message", (message) => {
      if (!message?.userId) return;
      if (message.userId === activeUserIdRef.current) {
        setMessages((current) => current.some((item) => item.id === message.id)
          ? current
          : [...current, message]);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !connected || !activeUserId) {
      setMessages([]);
      return;
    }
    setMessages([]);
    socket.emit("support:join", { userId: activeUserId }, (result) => {
      if (!result?.ok) setError(result?.error || "Could not open this conversation.");
      else setMessages(result.messages || []);
    });
  }, [activeUserId, connected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    const text = draft.trim();
    const socket = socketRef.current;
    if (!text || !activeUserId || !socket?.connected || sending) return;

    setSending(true);
    setError("");
    socket.emit("support:send", { userId: activeUserId, text }, (result) => {
      setSending(false);
      if (!result?.ok) {
        setError(result?.error || "Message could not be sent.");
        return;
      }
      if (result.message) {
        setMessages((current) => current.some((item) => item.id === result.message.id)
          ? current
          : [...current, result.message]);
      }
      setDraft("");
    });
  }, [activeUserId, draft, sending]);

  return (
    <section className="support-inbox" aria-label="Client support inbox">
      <header className="support-inbox-heading">
        <div>
          <h2>Client Support Inbox</h2>
          <p>Reply to clients who have started a support conversation.</p>
        </div>
        <span className={connected ? "support-connection is-online" : "support-connection"}>
          <i /> {connected ? "Connected" : "Connecting"}
        </span>
      </header>

      <div className="support-safety-note">
        Never ask clients for passwords, PINs, one-time codes, or payment to release funds.
      </div>

      {error && <p className="support-error" role="alert">{error}</p>}

      <div className="support-inbox-grid">
        <aside className="support-thread-list" aria-label="Open conversations">
          <h3>Client-started conversations</h3>
          {threads.length === 0 ? (
            <p className="support-empty">No clients have started a conversation.</p>
          ) : threads.map((thread) => (
            <button
              type="button"
              key={thread.userId}
              className={`support-thread ${thread.userId === activeUserId ? "selected" : ""}`}
              onClick={() => setActiveUserId(thread.userId)}
            >
              <span className="support-thread-avatar">
                {(thread.userName || "C").slice(0, 1).toUpperCase()}
              </span>
              <span className="support-thread-copy">
                <strong>{thread.userName || "Client"}</strong>
                <small>{thread.lastMessage || "Conversation opened"}</small>
              </span>
              <time>{thread.updatedAt ? new Date(thread.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</time>
            </button>
          ))}
        </aside>

        <div className="support-conversation">
          {activeThread ? (
            <>
              <header className="support-conversation-heading">
                <strong>{activeThread.userName || "Client"}</strong>
                <small>Support conversation</small>
              </header>
              <div className="support-message-list" aria-live="polite">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`support-message ${message.senderRole === "admin" ? "from-admin" : "from-client"}`}
                  >
                    <p>{message.text}</p>
                    <time>{message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}</time>
                  </article>
                ))}
                <div ref={bottomRef} />
              </div>
              <form className="support-reply" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={2000}
                  placeholder="Write a support reply…"
                  aria-label="Write a support reply"
                />
                <button type="submit" disabled={!connected || sending || !draft.trim()}>
                  {sending ? "Sending…" : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="support-no-selection">
              <strong>Select a client conversation</strong>
              <p>Only client-opened conversations appear in this inbox.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
