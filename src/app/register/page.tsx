"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/utils/supabase/client";
import { Star } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { email, password } = form;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("❌ Registration error:", error.message);
      setError("Registration error: " + error.message);
    } else if (!data?.user) {
      setError("Registration was successful, but no user was returned..");
    } else {
      console.log("✅ Registered successfully! Adding to the table users...");

      // Add to table users
      const insertRes = await supabase.from("users").insert([
        {
          id: data.user.id,  // Important! This is the ID that auth returns
          email: email,
        },
      ]);

      if (insertRes.error) {
        console.error("❌ Error adding to table users:", insertRes.error.message);
        setError("Error saving user: " + insertRes.error.message);
      } else {
        console.log("✅ Successfully added to the table users!");
        setSuccess("You have successfully registered! Redirecting to the login page...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans relative overflow-hidden">
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

      <div className="w-full max-w-md bg-gray-950 rounded-2xl shadow-2xl p-10 relative z-10">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Star className="text-yellow-400 w-6 h-6" />
          <h1 className="text-3xl font-extrabold text-center tracking-wide text-blue-400">
            Service registration
          </h1>
          <Star className="text-yellow-400 w-6 h-6" />
        </div>

        <p className="text-sm text-center mb-8 text-gray-400">
          Register now to connect to the site
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            required
          />

          <label className="block mb-2 text-sm">password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg"
          >
            Register now
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>
        )}

        {success && (
          <p className="mt-4 text-center text-green-400 font-semibold">
            {success}
          </p>
        )}
      </div>

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
