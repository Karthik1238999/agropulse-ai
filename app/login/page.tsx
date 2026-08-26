"use client";

import Link from "next/link";
import { Leaf, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Login successful
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Login error:", error);

      const firebaseError = error as {
        code?: string;
      };

      switch (firebaseError.code) {
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

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
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
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-6 shadow-2xl">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Welcome back
            </h2>

            <p className="mt-1 text-xs text-[#667269]">
              Sign in to access your farm intelligence dashboard.
            </p>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[10px] uppercase tracking-wider text-[#667269]"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667269]"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="farmer@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-[#4f5b53] focus:border-[#7dff9a]/40 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[10px] uppercase tracking-wider text-[#667269]"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667269]"
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-[#4f5b53] focus:border-[#7dff9a]/40 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-3 py-2 text-[10px] leading-4 text-[#ff7b7b]"
              >
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7dff9a] py-3 text-xs font-semibold text-[#071008] transition hover:bg-[#9affad] disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* Security notice */}
          <div className="mt-5 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.03] p-3">
            <p className="text-[9px] leading-4 text-[#667269]">
              Secure authentication powered by Firebase.
            </p>
          </div>

          {/* Continue without signing in */}
          <Link
            href="/"
            className="mt-5 block text-center text-[10px] text-[#667269] transition hover:text-white"
          >
            Continue without signing in
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[9px] text-[#4f5b53]">
          AgroPulse AI · Agricultural Intelligence Platform
        </p>
      </div>
    </main>
  );
}