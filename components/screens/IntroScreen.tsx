"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useState } from "react";

interface IntroScreenProps {
  onNext: () => void;
}

export default function IntroScreen({ onNext }: IntroScreenProps) {
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    try {
      setLoading(true)
      await api.health()
      await api.createSession()
      try { localStorage.setItem('petraf_progress', '0') } catch {}
    } catch (e) {
      // swallow for mock
    } finally {
      setLoading(false)
      onNext()
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

        <Button
          onClick={handleStart}
          className="bg-black hover:bg-gray-800 text-white px-16 py-6 rounded-full text-lg font-medium"
        >
          {loading ? "Loading..." : "Get Started"}
        </Button>
      </main>
    </div>
  );
}
