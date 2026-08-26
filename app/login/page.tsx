"use client";

import Link from "next/link";
import { Leaf, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
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

  // --------------------------------------------------
  // EMAIL / PASSWORD LOGIN
  // --------------------------------------------------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Successful login
      window.location.href = "/";
    } catch (error: any) {
      console.error("Email sign-in error:", error);

      switch (error?.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
          setError("No account exists with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later."
          );
          break;

        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;

        default:
          setError(
            error?.code
              ? `${error.code}: ${error.message}`
              : "Sign-in failed. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // GOOGLE LOGIN
  // --------------------------------------------------

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      // Optional: always show Google account selection
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      console.log("Google login successful:", result.user);

      // Successful login
      window.location.href = "/";
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      /*
       * Show the actual Firebase error.
       * This is useful while we are testing the deployment.
       */
      setError(
        error?.code
          ? `${error.code}: ${error.message}`
          : "Google sign-in failed. Please try again."
      );
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

      <div className="relative w-full max-w-[540px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#7dff9a]/20 bg-[#7dff9a]/10">
            <Leaf
              size={26}
              className="text-[#7dff9a]"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
            AgroPulse{" "}
            <span className="text-[#7dff9a]">
              AI
            </span>
          </h1>

          <p className="mt-2 text-xs text-[#667269]">
            Intelligent agricultural command center
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-7 shadow-2xl">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Welcome back
            </h2>

            <p className="mt-1 text-xs text-[#667269]">
              Sign in to access your farm intelligence
              dashboard.
            </p>
          </div>

          {/* Email / Password form */}
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
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
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="farmer@example.com"
                  autoComplete="email"
                  disabled={loading || googleLoading}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-[#4f5b53] focus:border-[#7dff9a]/40 disabled:cursor-not-allowed disabled:opacity-50"
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
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading || googleLoading}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-[#4f5b53] focus:border-[#7dff9a]/40 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-3 py-2.5 text-[10px] leading-4 text-[#ff7b7b]">
                {error}
              </div>
            )}

            {/* Email login */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7dff9a] py-3 text-xs font-semibold text-[#071008] transition hover:bg-[#9affad] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
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
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />

            <span className="text-[9px] uppercase tracking-wider text-[#4f5b53]">
              OR
            </span>

            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 text-xs font-medium text-white transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                Signing in with Google...
              </>
            ) : (
              <>
                {/* Google G */}
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.42h3.14c1.84-1.69 2.92-4.18 2.92-7.18Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.8c2.63 0 4.84-.87 6.45-2.35l-3.14-2.42c-.87.58-1.98.93-3.31.93-2.55 0-4.71-1.72-5.49-4.04H3.26v2.5A9.74 9.74 0 0 0 12 21.8Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.51 13.92A5.85 5.85 0 0 1 6.2 12c0-.67.11-1.32.31-1.92v-2.5H3.26A9.76 9.76 0 0 0 2.23 12c0 1.57.38 3.05 1.03 4.42l3.25-2.5Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.04c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.13 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.74 5.38l3.25 2.5C7.29 7.76 9.45 6.04 12 6.04Z"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </button>

          {/* Continue without login */}
          <Link
            href="/"
            className="mt-6 block text-center text-[10px] text-[#667269] transition hover:text-white"
          >
            Continue without signing in
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[9px] text-[#4f5b53]">
          AgroPulse AI · Agricultural Intelligence
          Platform
        </p>
      </div>
    </main>
  );
}