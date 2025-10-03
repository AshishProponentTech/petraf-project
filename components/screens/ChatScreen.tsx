"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Copy, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface ChatScreenProps {
  onNext: () => void;
  formData: any;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatScreen({ onNext, formData }: ChatScreenProps) {
  const [phase, setPhase] = useState<"g4" | "g6" | "g8">("g4")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Tell me about your vision in 2-3 years.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState<number | null>(null)
  const [scoreBreakdown, setScoreBreakdown] = useState<
    { name: string; value: number }[] | null
  >(null)

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (inputValue.trim().length < 3) {
      toast({ title: 'Message too short', description: 'Please enter at least 3 characters.' })
      return
    }

    const userText = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    // Stream a mock assistant reply
    let acc = "";
    const stream =
      phase === "g4"
        ? api.streamG4Collect()
        : phase === "g6"
        ? api.streamG6Collect()
        : api.streamG8Collect()
    for await (const evt of stream) {
      if (evt.event === "message") {
        acc += evt.data.content;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "assistant") {
            return [...prev.slice(0, -1), { role: "assistant", content: acc }];
          }
          return [...prev, { role: "assistant", content: acc }];
        });
      }
    }

    // Mock scoring after completion
    if (phase === "g4") {
      setScore(9.2)
      setScoreBreakdown([
        { name: "Specificity", value: 9.0 },
        { name: "Measurability", value: 8.5 },
        { name: "Time-bound", value: 10.0 },
        { name: "Alignment", value: 9.5 },
      ])
      try { localStorage.setItem('petraf_progress', '33') } catch {}
    } else if (phase === "g6") {
      setScore(8.7)
      setScoreBreakdown([
        { name: "Clarity", value: 8.8 },
        { name: "Relevance", value: 8.6 },
        { name: "Completeness", value: 8.7 },
      ])
      try { localStorage.setItem('petraf_progress', '66') } catch {}
    } else {
      setScore(9.0)
      setScoreBreakdown([
        { name: "Specificity", value: 9.1 },
        { name: "Measurability", value: 9.0 },
        { name: "Time-bound", value: 9.0 },
        { name: "Relevance", value: 9.0 },
      ])
      try { localStorage.setItem('petraf_progress', '100') } catch {}
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 md:py-8 pb-20 sm:pb-24">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/* Phase toggles */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <Button
              variant={phase === "g4" ? "default" : "outline"}
              onClick={() => {
                setPhase("g4")
                setMessages([
                  { role: "assistant", content: "Tell me about your vision in 2-3 years." },
                ])
                setScore(null)
                setScoreBreakdown(null)
              }}
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
              g4 Future
            </Button>
            <Button
              variant={phase === "g6" ? "default" : "outline"}
              onClick={() => {
                setPhase("g6")
                setMessages([
                  { role: "assistant", content: "What core values matter most to you at work?" },
                ])
                setScore(null)
                setScoreBreakdown(null)
              }}
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
              g6 Values
            </Button>
            <Button
              variant={phase === "g8" ? "default" : "outline"}
              onClick={() => {
                setPhase("g8")
                setMessages([
                  { role: "assistant", content: "Share concrete actions for the next 6 months." },
                ])
                setScore(null)
                setScoreBreakdown(null)
              }}
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
              g8 Actions
            </Button>
          </div>

          {/* Heading */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
              Tell us about your future vision
            </h2>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
              This is placeholder helper text to verify layout and spacing for the chat screen.
              It will be replaced once real prompts are connected.
            </p>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div key={index} className="space-y-2 sm:space-y-3 max-w-full px-1">
              {message.role === "assistant" ? (
                <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-bold text-xs sm:text-sm">■</span>
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base break-words">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-2 sm:p-3 md:p-4 max-w-[90%] sm:max-w-[85%]">
                    <p className="text-xs sm:text-sm md:text-base break-words">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Example reference message */}
          <div className="bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm text-gray-600 mx-1">
            Example placeholder: "How will you contribute to the company?"
          </div>

          {/* Mock scoring panel */}
          {score !== null && (
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm mx-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm sm:text-base">Score</div>
                <div className="text-base sm:text-lg font-bold">{score.toFixed(1)}/10</div>
              </div>
              {scoreBreakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                  {scoreBreakdown.map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{c.name}</span>
                      <span className="font-medium">{c.value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input area at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 flex items-center gap-1 sm:gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 sm:px-4 py-2 sm:py-3 focus-within:border-gray-400 focus-within:bg-white transition-colors">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-1 sm:px-2 text-sm sm:text-base resize-none"
                style={{ minHeight: '20px', maxHeight: '120px' }}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                size="icon"
                className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
