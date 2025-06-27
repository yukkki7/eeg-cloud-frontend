"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Welcome to EEG Cloud</h1>
      <p>Click the button below to start.</p>
      <button
        onClick={() => router.push("/flow/account/login")}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Log In
      </button>
    </div>
  );
}
