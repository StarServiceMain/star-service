"use client";

import { Mail, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תוכל לשלב API לשליחת קישור לאיפוס סיסמה
    console.log("Request password reset for:", email);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden font-sans">
      {/* רקע של כוכבים */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
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
          <h2 className="text-2xl font-bold text-blue-400">שחזור סיסמה</h2>
          <Star className="text-yellow-400 w-7 h-7" />
        </div>

        <p className="text-sm text-gray-400 mb-4 text-center">
          הזן את כתובת האימייל שלך ונשלח אליך קישור לאיפוס הסיסמה.
        </p>

        <label className="block text-sm text-gray-300 mb-1">אימייל</label>
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
        >
          שלח קישור לאיפוס
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          נזכרת בסיסמה?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            חזור להתחברות
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