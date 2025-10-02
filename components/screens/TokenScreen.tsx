"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TokenScreenProps {
  onNext: () => void;
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function TokenScreen({ onNext, formData, updateFormData }: TokenScreenProps) {
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

        <p className="text-center text-gray-600 max-w-3xl mb-8 leading-relaxed">
          続きから始めます記載する、この文章はダミーです、テキストの大きさや行間を確認するために入力しています。この文章はダミーです、テキストの大きさや行間を確認するために入力しています。
        </p>

        <div className="w-full max-w-md mb-12">
          <Label htmlFor="token" className="text-sm font-medium text-gray-700 mb-2 block">
            トークン
          </Label>
          <Input
            id="token"
            type="text"
            placeholder="adhfasdlkfhalkdfladfadsf"
            value={formData.token}
            onChange={(e) => updateFormData("token", e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          onClick={onNext}
          className="bg-black hover:bg-gray-800 text-white px-16 py-6 rounded-full text-lg font-medium"
        >
          続ける
        </Button>
      </main>
    </div>
  );
}
