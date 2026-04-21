"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import AuthAlert from "@/app/components/AuthAlert";

const PILLS = ["Task boards", "Tool hub", "Timelines", "Team flow"];

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signUp, loading, status, clearStatus } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, confirmPassword);
  };

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
            Your projects.
            <br />
            One clean
            <br />
            workspace.
          </h1>
          <p className="max-w-[260px] text-sm leading-relaxed text-white/70 mb-7">
            Organize tools, track progress, and ship faster — all in one place.
          </p>
          <div className="flex flex-wrap gap-2">
            {PILLS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/88">
                {label}
              </span>
            ))}
          </div>
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

          <h2 className="font-display text-2xl font-bold tracking-tight text-[#1A1916] mb-1.5">
            Create an account
          </h2>
          <p className="text-sm leading-relaxed text-[#72706A] mb-6">
            Start building with your team today.
          </p>

          <AuthAlert status={status} onClose={clearStatus} />

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

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pw"
                className="text-xs font-medium text-[#72706A]">
                Password
              </label>
              <div className="relative">
                <input
                  id="pw"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-2.5 pl-3.5 pr-10 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0ADA7] hover:text-[#72706A] transition-colors">
                  {showPassword ?
                    <EyeOffIcon />
                  : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm"
                className="text-xs font-medium text-[#72706A]">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-2.5 pl-3.5 pr-10 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0ADA7] hover:text-[#72706A] transition-colors">
                  {showConfirm ?
                    <EyeOffIcon />
                  : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-[#E8610A] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#D15508] active:scale-[0.987] disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#72706A]">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-semibold text-[#E8610A] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
