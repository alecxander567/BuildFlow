"use client";

import { useState } from "react";
import Link from "next/link";
import { useResetPassword } from "@/app/hooks/useResetPassword";
import AuthAlert from "@/app/components/AuthAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { sendReset, loading, status, clearStatus } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendReset(email);
  };

  const isSuccess = status?.type === "success";

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#F9F7F4]">
      <div className="relative hidden md:flex md:w-[45%] flex-col justify-center overflow-hidden bg-[#E8610A] p-10 lg:p-14">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 600 900"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true">
          <circle cx="580" cy="-40" r="260" fill="rgba(255,255,255,0.06)" />
          <circle cx="-60" cy="820" r="300" fill="rgba(0,0,0,0.07)" />
          <circle cx="300" cy="450" r="400" fill="rgba(255,255,255,0.03)" />
          <line
            x1="0"
            y1="900"
            x2="600"
            y2="0"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />
          <line
            x1="600"
            y1="900"
            x2="0"
            y2="400"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
          <line
            x1="150"
            y1="0"
            x2="150"
            y2="900"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="1"
          />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border border-white/30 bg-white/15">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              BuildFlow
            </span>
          </div>

          <h1 className="font-display text-[clamp(28px,3.5vw,46px)] font-extrabold leading-[1.1] tracking-[-1.5px] text-white mb-5">
            Happens to
            <br />
            the best
            <br />
            of us.
          </h1>
          <p className="max-w-[260px] text-sm leading-relaxed text-white/70">
            Enter your email and we&apos;ll send a reset link straight to your
            inbox. You&apos;ll be back in your workspace in no time.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-10 md:px-12 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 md:hidden">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[#E8610A]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-[#1A1916]">
              BuildFlow
            </span>
          </div>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF0E7] border border-[#F5C89A]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8610A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="M21 2l-9.6 9.6" />
              <path d="M15.5 7.5l3 3L22 7l-3-3" />
            </svg>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-[#1A1916] mb-1.5">
            Forgot password?
          </h2>
          <p className="text-sm leading-relaxed text-[#72706A] mb-6">
            No worries. Enter your email and we&apos;ll send you a reset link.
          </p>

          <AuthAlert status={status} onClose={clearStatus} />

          {!isSuccess ?
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-[#72706A]">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] px-3.5 py-2.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#E8610A] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#D15508] active:scale-[0.987] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Sending link..." : "Send reset link"}
              </button>
            </form>
          : <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => sendReset(email)}
                disabled={loading}
                className="w-full rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-3 text-sm font-medium text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Resending..." : "Resend email"}
              </button>
            </div>
          }

          <p className="mt-6 text-center text-sm text-[#72706A]">
            Remember it now?{" "}
            <Link
              href="/"
              className="font-semibold text-[#E8610A] hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
