"use client"; // enable client-side interactivity

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  // form state for username and password
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  // error message to display on failed login
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // prevent page reload

    // check against our test credentials
    if (identifier === "Xiberlinc" && password === "123456") {
      // on success, navigate to the chart step
      router.push("/flow/charts");
    } else {
      // show error message
      setError("Invalid username or password");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">User Login</h1>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded shadow"
      >
        {/* Username field */}
        <label className="block mb-4">
          <span className="text-sm">Username</span>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1"
            placeholder="Xiberlinc"
          />
        </label>

        {/* Password field */}
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1"
            placeholder="123456"
          />
        </label>

        {/* Display error if login fails */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
