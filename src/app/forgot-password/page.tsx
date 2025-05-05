"use client";

import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import supabase from "@/app/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const stars = useMemo(
    () =>
      [...Array(40)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      alert("Error sending reset email: " + error.message);
    } else {
      alert("A reset email has been sent! Check your mailbox.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden font-sans">
      {/* Background of stars */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              animation: `twinkle ${star.duration}s infinite`,
            }}
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-md p-8 rounded-xl bg-gray-950/80 shadow-2xl"
      >
        <div className="flex justify-center items-center gap-2 mb-6">
          <Star className="text-yellow-400 w-7 h-7" />
          <h2 className="text-2xl font-bold text-blue-400">Password recovery</h2>
          <Star className="text-yellow-400 w-7 h-7" />
        </div>

        <p className="text-sm text-gray-400 mb-4 text-center">
          Enter your email address and we will send you a link to reset your password.
        </p>

        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full p-3 rounded bg-gray-800 text-white mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
          disabled={loading}
        >
          {loading ? "Sending...": "Send reset link"}
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Remember your password??{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log back in
          </Link>
        </p>
      </form>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }
      `}</style>
    </main>
  );
}
