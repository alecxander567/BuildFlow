// components/ChatWindow.tsx
"use client";

import { useEffect, useRef } from "react";
import { Message } from "./ChatTypes";

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  onClose: () => void;
}

export default function ChatWindow({
  isOpen,
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  onClose,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl shadow-2xl"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        animation: "slideUp 0.2s ease-out",
      }}>
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5">
          {/* Bot avatar in header */}
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--bg-secondary)" }}>
            <img
              src="/botlight.svg"
              alt="AI Assistant"
              className="h-5 w-5"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <h3
              className="text-sm font-semibold leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                color: "var(--text-primary)",
              }}>
              AI Assistant
            </h3>
            <div className="mt-1 flex items-center gap-1">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Online
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 transition-colors hover:bg-gray-100"
          style={{ color: "var(--text-muted)" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 flex items-end gap-2 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}>
            {/* Bot avatar beside AI messages */}
            {message.sender !== "user" && (
              <div
                className="mb-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--bg-secondary)" }}>
                <img
                  src="/botlight.svg"
                  alt="AI"
                  className="h-7 w-7"
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                message.sender === "user" ?
                  "rounded-br-none"
                : "rounded-bl-none"
              }`}
              style={{
                backgroundColor:
                  message.sender === "user" ?
                    "var(--accent)"
                  : "var(--bg-secondary)",
                color:
                  message.sender === "user" ? "white" : "var(--text-primary)",
              }}>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p
                className="mt-1 text-xs opacity-70"
                style={{
                  color:
                    message.sender === "user" ?
                      "rgba(255,255,255,0.8)"
                    : "var(--text-muted)",
                }}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator with avatar */}
        {isLoading && (
          <div className="mb-3 flex items-end gap-2 justify-start">
            <div
              className="mb-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--bg-secondary)" }}>
              <img
                src="/botlight.svg"
                alt="AI"
                className="h-7 w-7"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              className="rounded-2xl rounded-bl-none px-4 py-3"
              style={{ backgroundColor: "var(--bg-secondary)" }}>
              <div className="flex gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: "var(--text-muted)",
                    animation: "bounce 1.4s infinite ease-in-out",
                    animationDelay: "0ms",
                  }}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: "var(--text-muted)",
                    animation: "bounce 1.4s infinite ease-in-out",
                    animationDelay: "150ms",
                  }}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: "var(--text-muted)",
                    animation: "bounce 1.4s infinite ease-in-out",
                    animationDelay: "300ms",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <button
            onClick={onSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="rounded-xl px-3 py-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
            }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
