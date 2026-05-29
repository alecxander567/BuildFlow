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
          0%   { transform: scale(1);   opacity: 0.4; }
          80%  { transform: scale(1.7); opacity: 0;   }
          100% { transform: scale(1.7); opacity: 0;   }
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
          transform: `translateY(-50%) translateX(${idleOffset})`,
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: mounted ? 1 : 0,
        }}>
        {/* Tooltip */}
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
          {/* Pulse ring */}
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
              if (idle) {
                cancelIdleTimer();
                startIdleTimer();
              }
            }}
            aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: isOpen || isHovered ? "50%" : "50% 36% 36% 50%",
              backgroundColor: "var(--accent)",
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
              {
                isOpen ?
                  // Close × when chat is open
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
                  // botlight.svg when closed — same src used in ChatWindow
                : <img
                    src="/botlight.svg"
                    alt="AI Assistant"
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                      // Invert to white so it's visible on the accent background
                      filter: "brightness(0) invert(1)",
                    }}
                  />

              }
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
