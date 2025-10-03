"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Copy, RefreshCw } from "lucide-react";

interface ChatScreenProps {
  onNext: () => void;
  formData: any;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatScreen({ onNext, formData }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "3年後のあなたの姿について教えてください",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages([
      ...messages,
      { role: "user", content: inputValue },
      {
        role: "assistant",
        content:
          "会社に貢献する、この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。",
      },
    ]);
    setInputValue("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              3年後のあなたの姿について教えてください
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              記載例などを表記。この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。
              この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。
            </p>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div key={index} className="space-y-4 max-w-full">
              {message.role === "assistant" && (
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-bold text-sm">■</span>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                      回答記載。{message.content}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Example reference message */}
          <div className="bg-gray-100 rounded-lg p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-600">
            会社に貢献する、この文章はダミーです？
          </div>

          {/* Another assistant reply */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-start gap-2 mb-2">
              <span className="font-bold text-sm">■</span>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                回答記載。この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t bg-white px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white border rounded-full px-3 sm:px-4 py-2">
            <Input
              placeholder="ここに記入してください"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 sm:px-2 text-sm sm:text-base"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-black hover:bg-gray-800 rounded-full h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
