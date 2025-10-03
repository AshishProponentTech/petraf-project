"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface TokenScreenProps {
  onNext: () => void;
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function TokenScreen({ onNext, formData, updateFormData }: TokenScreenProps) {
  const [submitting, setSubmitting] = useState(false)

  const validateToken = (t: string) => {
    if (!t || t.trim().length < 20) return false
    // simple mock check: looks like a JWT header prefix
    return t.includes('.') || t.startsWith('eyJ')
  }

  const handleContinue = async () => {
    const t = formData.token
    if (!t || !t.trim()) {
      toast({ title: 'Token required', description: 'Please paste your resume token.' })
      return
    }
    if (!validateToken(t.trim())) {
      toast({ title: 'Invalid token', description: 'The token format looks incorrect.' })
      return
    }
    setSubmitting(true)
    try {
      // proceed to next step in mock
      onNext()
    } finally {
      setSubmitting(false)
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

        <p className="text-center text-gray-600 max-w-3xl mb-8 leading-relaxed">
          Continue from where you left off. This is placeholder text to verify layout and spacing while we wire the mock resume token flow.
        </p>

        <div className="w-full max-w-md mb-12">
          <Label htmlFor="token" className="text-sm font-medium text-gray-700 mb-2 block">
            Token
          </Label>
          <Input
            id="token"
            type="text"
            placeholder="paste resume token"
            value={formData.token}
            onChange={(e) => updateFormData("token", e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          onClick={handleContinue}
          className="bg-black hover:bg-gray-800 text-white px-16 py-6 rounded-full text-lg font-medium"
        >
          {submitting ? 'Checking…' : 'Continue'}
        </Button>
      </main>
    </div>
  );
}
