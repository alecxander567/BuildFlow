"use client";

import { useState, useEffect, useRef } from "react";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [idle, setIdle] = useState(false);
  const [mounted, setMounted] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  // After 3s of no interaction, go semi-transparent + half-docked into the edge
  const resetIdleTimer = () => {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!isOpen && !isHovered) {
      idleTimer.current = setTimeout(() => setIdle(true), 3000);
    }
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isHovered]);

  return (
    <>
      <style>{`
        @keyframes cb-pop {
          0%   { transform: translateY(-50%) translateX(38px) scale(0.5); opacity: 0; }
          65%  { transform: translateY(-50%) translateX(-4px) scale(1.06); opacity: 1; }
          100% { transform: translateY(-50%) translateX(0) scale(1); opacity: 1; }
        }
        @keyframes cb-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.45; }
          80%  { transform: scale(1.65); opacity: 0;    }
          100% { transform: scale(1.65); opacity: 0;    }
        }
        .cb-ring {
          animation: cb-pulse-ring 2.6s ease-out infinite;
        }
      `}</style>

      <div
        className="fixed z-50 right-0 top-1/2 flex items-center justify-end"
        style={{
          // Slide half off-screen when idle, fully visible when active
          transform: `translateY(-50%) translateX(${idle && !isHovered && !isOpen ? "44%" : "0%"})`,
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: mounted ? 1 : 0,
        }}>
        {/* Tooltip to the left — shows on hover */}
        <div
          style={{
            marginRight: "8px",
            pointerEvents: "none",
            opacity: isHovered && !isOpen ? 1 : 0,
            transform:
              isHovered && !isOpen ? "translateX(0)" : "translateX(10px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}>
          <div
            className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
            }}>
            AI Assistant
          </div>
        </div>

        {/* Ball container — handles the docked flat-edge shape */}
        <div
          className="relative flex items-center justify-center"
          style={{ marginRight: "-1px" }}>
          {/* Pulse ring — only when closed & not idle */}
          {!isOpen && !idle && (
            <span
              className="cb-ring pointer-events-none absolute inset-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
          )}

          <button
            onClick={onClick}
            onMouseEnter={() => {
              setIsHovered(true);
              resetIdleTimer();
            }}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // Slightly flat on the right when docked, perfect circle when active
              borderRadius: isOpen || isHovered ? "50%" : "50% 38% 38% 50%",
              backgroundColor: "var(--accent)",
              opacity: idle && !isHovered && !isOpen ? 0.5 : 1,
              boxShadow:
                isHovered || isOpen ?
                  "0 6px 20px rgba(0,0,0,0.22)"
                : "0 2px 10px rgba(0,0,0,0.18)",
              transform: isHovered ? "scale(1.12)" : "scale(1)",
              transition:
                "transform 0.2s ease, opacity 0.4s ease, border-radius 0.45s ease, box-shadow 0.2s ease",
              cursor: "pointer",
              border: "none",
              outline: "none",
            }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}>
              {isOpen ?
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              : <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
