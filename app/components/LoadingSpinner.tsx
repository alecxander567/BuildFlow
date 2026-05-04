"use client";

interface LoadingSpinnerProps {
  /** Visual variant */
  variant?: "spinner" | "dots" | "pulse";
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Optional label shown below the spinner */
  label?: string;
  /** Fill the parent container and center */
  fullScreen?: boolean;
}

const sizeMap = {
  sm: {
    ring: "h-5 w-5",
    border: "border-2",
    dot: "h-1.5 w-1.5",
    pulse: "h-8 w-8",
  },
  md: {
    ring: "h-8 w-8",
    border: "border-2",
    dot: "h-2 w-2",
    pulse: "h-12 w-12",
  },
  lg: {
    ring: "h-12 w-12",
    border: "border-[3px]",
    dot: "h-2.5 w-2.5",
    pulse: "h-16 w-16",
  },
};

export default function LoadingSpinner({
  variant = "spinner",
  size = "md",
  label,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const s = sizeMap[size];

  const inner = (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === "spinner" && (
        <div
          className={`${s.ring} ${s.border} rounded-full border-[#EDE8E2] border-t-[#E8610A] animate-spin`}
          role="status"
          aria-label={label ?? "Loading"}
        />
      )}

      {variant === "dots" && (
        <div
          className="flex items-center gap-1.5"
          role="status"
          aria-label={label ?? "Loading"}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`${s.dot} rounded-full bg-[#E8610A] animate-bounce`}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <div
          className="relative flex items-center justify-center"
          role="status"
          aria-label={label ?? "Loading"}>
          {/* Outer pulse ring */}
          <span
            className={`absolute ${s.pulse} rounded-full bg-[#E8610A]/20 animate-ping`}
            style={{ animationDuration: "1.2s" }}
          />
          {/* Inner solid circle */}
          <span
            className={`relative ${s.ring} rounded-full bg-[#E8610A]/30 flex items-center justify-center`}>
            <span className={`${s.dot} rounded-full bg-[#E8610A]`} />
          </span>
        </div>
      )}

      {label && (
        <p
          className="text-xs font-medium text-[#B0ADA7] tracking-wide"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center py-20">
        {inner}
      </div>
    );
  }

  return inner;
}

export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-52 rounded-2xl border border-[#EDE8E2] bg-white overflow-hidden">
          {/* image strip */}
          <div className="h-2 w-full bg-gradient-to-r from-[#F2EDE7] via-[#EDE8E2] to-[#F2EDE7] animate-pulse" />
          <div className="p-5 flex flex-col gap-3">
            {/* title */}
            <div className="h-4 w-3/5 rounded-lg bg-[#F2EDE7] animate-pulse" />
            {/* desc lines */}
            <div className="h-3 w-full rounded-lg bg-[#F2EDE7] animate-pulse" />
            <div className="h-3 w-4/5 rounded-lg bg-[#F2EDE7] animate-pulse" />
            {/* progress bar */}
            <div className="mt-1 h-2 w-full rounded-full bg-[#F2EDE7] animate-pulse" />
            {/* tags */}
            <div className="mt-auto flex gap-2">
              <div className="h-5 w-14 rounded-full bg-[#F2EDE7] animate-pulse" />
              <div className="h-5 w-10 rounded-full bg-[#F2EDE7] animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
