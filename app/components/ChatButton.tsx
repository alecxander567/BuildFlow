"use client";

import { useState, useEffect } from "react";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Subtle entrance animation on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Show tooltip after hover lingers a moment
  useEffect(() => {
    if (!isHovered) {
      setShowTooltip(false);
      return;
    }
    const t = setTimeout(() => setShowTooltip(true), 400);
    return () => clearTimeout(t);
  }, [isHovered]);

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes cb-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.55); opacity: 0;   }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        @keyframes cb-pop-in {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes cb-tooltip-in {
          from { opacity: 0; transform: translateX(6px); }
          to   { opacity: 1; transform: translateX(0);   }
        }
        .cb-root {
          animation: cb-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        .cb-pulse-ring {
          animation: cb-pulse 2.2s ease-out infinite;
        }
        .cb-tooltip {
          animation: cb-tooltip-in 0.18s ease forwards;
        }
      `}</style>

      <div
        className={`fixed z-50 transition-all duration-300 ${
          // On mobile: bottom-center above nav-safe area; on desktop: bottom-right corner
          "bottom-5 right-5 sm:bottom-6 sm:right-6"
        } ${mounted ? "cb-root" : "opacity-0"}`}
        style={{ willChange: "transform" }}>
        {/* Tooltip — shown on hover, desktop only */}
        {showTooltip && !isOpen && (
          <div className="cb-tooltip pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 hidden sm:block">
            <div
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold shadow-md"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              }}>
              AI Assistant
              {/* Arrow */}
              <span
                className="absolute right-[-5px] top-1/2 -translate-y-1/2 border-4 border-transparent"
                style={{ borderLeftColor: "var(--border)" }}
              />
            </div>
          </div>
        )}

        {/* Pulse ring — only when closed */}
        {!isOpen && (
          <span
            className="cb-pulse-ring pointer-events-none absolute inset-0 rounded-full"
            style={{ backgroundColor: "var(--accent)", opacity: 0.5 }}
          />
        )}

        {/* The ball itself */}
        <button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className="relative flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
          style={{
            // Slightly smaller on mobile (44px), comfortable on desktop (48px)
            width: "clamp(44px, 6vw, 48px)",
            height: "clamp(44px, 6vw, 48px)",
            backgroundColor:
              isHovered ? "var(--accent-hover)" : "var(--accent)",
            boxShadow:
              isHovered ?
                "0 6px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)"
              : "0 3px 12px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.10)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}>
          {/* Icon — morphs between chat and close */}
          <span
            className="transition-all duration-200"
            style={{
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              opacity: 1,
            }}>
            {
              isOpen ?
                // Close ×
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                // Chat bubble
              : <svg
                  width="18"
                  height="18"
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
    </>
  );
}
