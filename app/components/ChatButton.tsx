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

  const startIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 3000);
  };

  const cancelIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIdle(false);
  };

  // Start idle countdown whenever chat is closed and not hovered
  useEffect(() => {
    if (!isOpen && !isHovered) {
      startIdleTimer();
    } else {
      cancelIdleTimer();
    }
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isHovered]);

  // When idle: slide most of the ball off-screen but leave an 10px sliver
  // so the user can always tap/hover that sliver to wake it back up.
  // The sliver is wide enough to be tappable on mobile (touch target ~10px
  // of the button is still on-screen, the hit-area extends with padding).
  const idleOffset = idle && !isHovered && !isOpen ? "26px" : "0px";

  return (
    <>
      <style>{`
        @keyframes cb-pop {
          0%   { opacity: 0; transform: translateY(-50%) translateX(40px) scale(0.5); }
          65%  { opacity: 1; transform: translateY(-50%) translateX(-4px) scale(1.06); }
          100% { opacity: 1; transform: translateY(-50%) translateX(0)    scale(1);    }
        }
        @keyframes cb-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.4; }
          80%  { transform: scale(1.7);  opacity: 0;   }
          100% { transform: scale(1.7);  opacity: 0;   }
        }
        .cb-entrance { animation: cb-pop 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .cb-ring      { animation: cb-pulse-ring 2.6s ease-out infinite; }
      `}</style>

      <div
        className={mounted ? "cb-entrance" : ""}
        style={{
          position: "fixed",
          zIndex: 50,
          right: 0,
          top: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          // Slide right by idleOffset, leaving a visible sliver
          transform: `translateY(-50%) translateX(${idleOffset})`,
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: mounted ? 1 : 0,
        }}>
        {/* Tooltip — left of ball, visible on hover when closed */}
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
            style={{
              whiteSpace: "nowrap",
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
            }}>
            {idle ? "Tap to wake" : "AI Assistant"}
          </div>
        </div>

        {/* Ball */}
        <div style={{ position: "relative", marginRight: "-1px" }}>
          {/* Pulse ring — only when fully visible and closed */}
          {!isOpen && !idle && (
            <span
              className="cb-ring"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "9999px",
                backgroundColor: "var(--accent)",
                pointerEvents: "none",
              }}
            />
          )}

          <button
            onClick={() => {
              cancelIdleTimer();
              onClick();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => {
              // On mobile, a touch wakes it if idle; second tap opens chat
              if (idle) {
                cancelIdleTimer();
                startIdleTimer(); // restart the 3s countdown after waking
              }
            }}
            aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // Flat right edge when docked, circle when active
              borderRadius: isOpen || isHovered ? "50%" : "50% 36% 36% 50%",
              backgroundColor: "var(--accent)",
              // Dimmer when idle so it's clearly "sleeping"
              opacity: idle && !isHovered && !isOpen ? 0.45 : 1,
              boxShadow:
                isHovered || isOpen ?
                  "0 6px 20px rgba(0,0,0,0.22)"
                : "0 2px 10px rgba(0,0,0,0.18)",
              transform: isHovered ? "scale(1.12)" : "scale(1)",
              transition:
                "transform 0.2s ease, opacity 0.4s ease, border-radius 0.4s ease, box-shadow 0.2s ease",
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
