"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO: call your auth API
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (res.ok) {
      // on success, go to Step 1
      router.push("/flow/step1");
    } else {
      const msg = await res.text();
      setError(msg || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-semibold mb-4">Log In</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email or Username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com or username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mb-4"
        >
          Log In
        </button>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/flow/account/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
}
