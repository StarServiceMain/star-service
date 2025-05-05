"use client";

import { Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white font-sans relative overflow-hidden">
      {/* Stars in the background */}
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

      <div className="z-10 text-center max-w-xl p-6 bg-gray-950/80 rounded-xl shadow-2xl">
        <div className="flex justify-center items-center gap-2 mb-6">
          <Star className="text-yellow-400 w-8 h-8" />
          <h1 className="text-4xl font-bold text-blue-400">Star Service</h1>
          <Star className="text-yellow-400 w-8 h-8" />
        </div>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          
          An innovative platform for rating your employees
           Top-notch service
          Join now and enjoy a smart, efficient and professional system.
        </p>

        <div className="flex justify-center gap-6">
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white text-md font-semibold transition">
              Register now
            </button>
          </Link>

          <Link href="/login">
            <button className="bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg text-blue-400 text-md font-semibold transition">
              Log in
            </button>
          </Link>
        </div>
      </div>

      {/* Star animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
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
