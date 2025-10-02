"use client";

import { Button } from "@/components/ui/button";

interface IntroScreenProps {
  onNext: () => void;
}

export default function IntroScreen({ onNext }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white px-6 py-4">
        <div className="bg-gray-200 px-6 py-3 rounded text-lg font-bold text-gray-700 inline-block">
          LOGO
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          目標設定サポートAI
        </h1>

        <p className="text-center text-gray-600 max-w-3xl mb-12 leading-relaxed">
          進め方や概要を記載する、この文章はダミーです、テキストの大きさや行間を確認するために入力しています。この文章はダミーです、テキストの大きさや行間を確認するために入力しています。
        </p>

        <Button
          onClick={onNext}
          className="bg-black hover:bg-gray-800 text-white px-16 py-6 rounded-full text-lg font-medium"
        >
          始める
        </Button>
      </main>
    </div>
  );
}
