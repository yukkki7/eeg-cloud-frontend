"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ApiResponse = { ok: boolean; error?: string };

// POST /api/auth/check-email
async function checkEmail(email: string): Promise<ApiResponse> {
  const res = await fetch("/api/auth/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (res.ok) return { ok: true };
  const { error } = await res.json();
  return { ok: false, error };
}

// POST /api/auth/check-username
async function checkUsername(username: string): Promise<ApiResponse> {
  const res = await fetch("/api/auth/check-username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (res.ok) return { ok: true };
  const { error } = await res.json();
  return { ok: false, error };
}

// POST /api/auth/signup
async function signup(
  email: string,
  username: string,
  password: string
): Promise<ApiResponse> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, username, password }),
  });
  if (res.ok) return { ok: true };
  const { error } = await res.json();
  return { ok: false, error };
}

export default function SignupPage() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // onBlur email uniqueness
  const handleEmailBlur = async () => {
    setEmailError(null);
    if (!email) return;
    const result = await checkEmail(email);
    if (!result.ok)
      setEmailError(result.error || "Email is already registered");
  };

  // onBlur username uniqueness
  const handleUsernameBlur = async () => {
    setUsernameError(null);
    if (!username) return;
    const result = await checkUsername(username);
    if (!result.ok) setUsernameError(result.error || "Username is taken");
  };

  // final submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // client-side validation
    if (!email || emailError) {
      setSubmitError("Please provide a valid, unused email address.");
      return;
    }
    if (!username || usernameError) {
      setSubmitError("Please choose a valid, unused username.");
      return;
    }
    if (!password) {
      setSubmitError("Please enter a password.");
      return;
    }
    if (password !== confirm) {
      setSubmitError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await signup(email, username, password);
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error || "Signup failed.");
      return;
    }

    // on success, go to next step
    router.push("/flow/step1");
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold">Create Account</h2>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            onBlur={handleEmailBlur}
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            required
          />
          {emailError && (
            <p className="text-red-600 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(null);
            }}
            onBlur={handleUsernameBlur}
            className="w-full border rounded px-3 py-2"
            placeholder="choose a username"
            required
          />
          {usernameError && (
            <p className="text-red-600 text-sm mt-1">{usernameError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Submission Error */}
        {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Signing Up…" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
