"use client";

import Link from "next/link";
import { Leaf, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Email / Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (
        error &&
        typeof error === "object" &&
        "code" in error
      ) {
        const code = (error as { code: string }).code;

        switch (code) {
          case "auth/invalid-credential":
            setError("Invalid email or password.");
            break;

          case "auth/user-not-found":
            setError("No account found with this email.");
            break;

          case "auth/wrong-password":
            setError("Incorrect password.");
            break;

          case "auth/invalid-email":
            setError("Please enter a valid email address.");
            break;

          case "auth/too-many-requests":
            setError(
              "Too many failed attempts. Please try again later."
            );
            break;

          default:
            setError("Login failed. Please try again.");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);

      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Google login error:", error);

      if (
        error &&
        typeof error === "object" &&
        "code" in error
      ) {
        const code = (error as { code: string }).code;

        switch (code) {
          case "auth/popup-closed-by-user":
            setError("Google sign-in was cancelled.");
            break;

          case "auth/popup-blocked":
            setError(
              "Google sign-in popup was blocked by your browser."
            );
            break;

          case "auth/account-exists-with-different-credential":
            setError(
              "An account already exists with this email using another sign-in method."
            );
            break;

          default:
            setError("Google sign-in failed. Please try again.");
        }
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050706] px-5 text-[#f4f7f4]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-15%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#7dff9a]/[0.035] blur-[130px]" />
      </div>

      <div className="relative w-full max-w-[430px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#7dff9a]/20 bg-[#7dff9a]/10">
            <Leaf size={26} className="text-[#7dff9a]" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
            AgroPulse{" "}
            <span className="text-[#7dff9a]">AI</span>
          </h1>

          <p className="mt-2 text-xs text-[#667269]">
            Intelligent agricultural command center
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Welcome back
            </h2>

            <p className="mt-1 text-xs text-[#667269]">
              Sign in to access your farm intelligence dashboard.
            </p>
          </div>

          {/* Email Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-wider text-[#667269]">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667269]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-[#4f5b53] focus:border-[#7dff9a]/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-wider text-[#667269]">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667269]"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-[#4f5b53] focus:border-[#7dff9a]/40"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-3 py-2 text-[10px] leading-4 text-[#ff7b7b]">
                {error}
              </div>
            )}

            {/* Email Sign In */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7dff9a] py-3 text-xs font-semibold text-[#071008] transition hover:bg-[#9affad] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#071008]/30 border-t-[#071008]" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />

            <span className="text-[9px] uppercase tracking-wider text-[#4f5b53]">
              OR
            </span>

            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs font-medium text-white transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Connecting to Google...
              </>
            ) : (
              <>
                {/* Google Logo */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.78-.07-1.53-.22-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.38Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.04H3.28v2.53A9.74 9.74 0 0 0 12 21.7Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.53 13.78A5.86 5.86 0 0 1 6.22 12c0-.62.11-1.22.31-1.78V7.69H3.28A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.31l3.25-2.53Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.18c1.43 0 2.72.49 3.74 1.45l2.8-2.8C16.84 3.24 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53C7.3 7.9 9.46 6.18 12 6.18Z"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </button>

          {/* Continue without signing in */}
          <Link
            href="/"
            className="mt-5 block text-center text-[10px] text-[#667269] transition hover:text-white"
          >
            Continue without signing in
          </Link>
        </div>

        <p className="mt-6 text-center text-[9px] text-[#4f5b53]">
          AgroPulse AI · Agricultural Intelligence Platform
        </p>
      </div>
    </main>
  );
}