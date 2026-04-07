"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-sm text-gray-600 shadow-sm">
        Completing Google sign-in...
      </div>
    </main>
  );
}
