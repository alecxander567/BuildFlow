"use client";

import { useState, useEffect } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/app/hooks/useAuth";
import AuthAlert from "@/app/components/AuthAlert";

const PILLS = ["Task boards", "Tool hub", "Timelines", "Team flow"];
const AVATARS = [
  { initials: "JK", bg: "bg-[#C85208]" },
  { initials: "ML", bg: "bg-[#B84A06]" },
  { initials: "SR", bg: "bg-[#A34204]" },
  { initials: "TA", bg: "bg-[#8F3A02]" },
];

export default function LoginPage() {
  const router = useRouter(); 
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    signIn,
    signInWithGoogle,
    signInWithGithub,
    loading,
    status,
    clearStatus,
    user,
    authLoading, 
  } = useAuth();

  // Add redirect guard - redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard"); 
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F7F4]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E8610A] border-t-transparent mx-auto"></div>
          <p className="text-sm text-[#72706A]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, don't render the login form (redirect will happen)
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#F9F7F4]">
      {/* Rest of your existing JSX remains exactly the same */}
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

        <div className="relative z-10 pt-0">
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
            Welcome back
          </h2>
          <p className="text-sm leading-relaxed text-[#B0ADA7] mb-6">
            Sign in to your BuildFlow workspace.
          </p>

          <AuthAlert status={status} onClose={clearStatus} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#B0ADA7]">
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pw"
                  className="text-xs font-medium text-[#B0ADA7]">
                  Password
                </label>
                <Link
                  href="/ForgotPasswordPage"
                  className="text-xs font-medium text-[#E8610A] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="pw"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-2.5 pl-3.5 pr-10 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0ADA7] hover:text-[#B0ADA7] transition-colors">
                  {showPassword ?
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
                  : <svg
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
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-[#E8610A] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#D15508] active:scale-[0.987] disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Signing in..." : "Sign in to BuildFlow"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8E4DE]" />
            <span className="text-xs text-[#B0ADA7] whitespace-nowrap">
              or continue with
            </span>
            <div className="h-px flex-1 bg-[#E8E4DE]" />
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-2.5 text-sm font-medium text-[#1A1916] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] disabled:opacity-50 disabled:cursor-not-allowed">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={signInWithGithub}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-2.5 text-sm font-medium text-[#1A1916] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] disabled:opacity-50 disabled:cursor-not-allowed">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#1A1916"
                aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#B0ADA7]">
            No account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#E8610A] hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
