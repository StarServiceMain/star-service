"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/utils/supabase/client";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If already logged in – go to the dashboard
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]); // Dependency on router to avoid unnecessary callbacks

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset old errors
    setLoading(true); // Charging activation
    console.log("📥 Connecting in progress...");

    try {
      // Update to use signInWithPassword instead of signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false); // Stop loading after the request is complete

      if (error) {
        console.error("❌ Connection error:", error.message);
        // Handling errors clearly
        if (error.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password");
        } else {
          setError("An error occurred. Please try again..");
        }
      } else if (data?.session) {
        console.log("✅ Login successful! Transferring to dashboard...");
        router.push("/dashboard"); // Transfer to dashboard after login
      } else {
        setError("An unexpected error occurred. Please try again..");
      }
    } catch (err) {
      setLoading(false);
      console.error("❌ Unexpected error:", err);
      setError("An error occurred. Please try again..");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white font-sans relative overflow-hidden">
      {/* Background of stars */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 40 }).map((_, i) => (
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
        onSubmit={handleLogin}
        className="z-10 w-full max-w-md p-8 rounded-xl bg-gray-950/80 shadow-2xl"
      >
        <div className="flex justify-center items-center gap-2 mb-6">
          <Star className="text-yellow-400 w-7 h-7" />
          <h2 className="text-3xl font-bold text-blue-400">Account login</h2>
          <Star className="text-yellow-400 w-7 h-7" />
        </div>

        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full p-3 rounded bg-gray-800 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm text-gray-300 mb-1">password</label>
        <input
          type="password"
          required
          className="w-full p-3 rounded bg-gray-800 text-white mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-3 rounded transition`}
        >
          {loading ? "Connecting...": "Connect"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          You do not have an account.?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register now
          </Link>
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-400 hover:underline"
          >
            Forgot your password??
          </Link>
        </div>
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
