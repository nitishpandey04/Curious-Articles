"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={() => signIn()}
    >
      Sign In
    </button>
  );
}
