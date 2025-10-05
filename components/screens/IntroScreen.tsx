"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useState } from "react";
import DebugResumeToken from "@/components/DebugResumeToken";

interface IntroScreenProps {
  onNext: () => void;
}

export default function IntroScreen({ onNext }: IntroScreenProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      setLoading(true)
      setError(null);
      await api.health()
      const session = await api.createSession()
      // Store session_id and resume_token if needed, for now just progress
      try { 
        localStorage.setItem('petraf_session_id', session.session_id);
        localStorage.setItem('petraf_resume_token', session.resume_token);
        localStorage.setItem('petraf_progress', '0');
      } catch {}
      onNext()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to start session: ${message}`);
      console.error(e);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white px-6 py-4">
        <div className="bg-gray-200 px-6 py-3 rounded text-lg font-bold text-gray-700 inline-block">
          LOGO
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 text-center">
          Goal-Setting Assistant
        </h1>

        <p className="text-center text-gray-600 max-w-3xl mb-12 leading-relaxed">
          This is a placeholder description of the flow and overview. Use this to verify layout and spacing while we wire the mock APIs.
        </p>

        {error && (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        )}

        <Button
          onClick={handleStart}
          className="bg-black hover:bg-gray-800 text-white px-16 py-6 rounded-full text-lg font-medium"
        >
          {loading ? "Loading..." : "Get Started"}
        </Button>
        <DebugResumeToken />
      </main>
    </div>
  );
}
