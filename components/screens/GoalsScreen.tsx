"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface GoalsScreenProps {
  onNext: () => void;
  onBack: () => void;
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function GoalsScreen({ onNext, onBack, formData, updateFormData }: GoalsScreenProps) {
  const addSuperiorGoal = () => {
    updateFormData("superiorGoals", [...formData.superiorGoals, ""]);
  };

  const updateSuperiorGoal = (index: number, value: string) => {
    const newGoals = [...formData.superiorGoals];
    newGoals[index] = value;
    updateFormData("superiorGoals", newGoals);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-5xl mx-auto gap-4">
          <div className="bg-gray-200 px-6 py-3 rounded text-lg font-bold text-gray-700 text-center md:text-left">
            LOGO
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium whitespace-nowrap">1. 基本情報</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-24 h-1 bg-blue-500 rounded"></div>
              <span className="font-medium whitespace-nowrap">2. 方針・計画</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-24 h-1 bg-gray-300 rounded"></div>
              <span className="text-gray-400 whitespace-nowrap">3. 上位方針</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-gray-900">
            方針・計画
          </h1>

          <div className="space-y-8">
            {/* 部門の方針 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                所属部門の今期の方針、目標を入力してください
              </Label>
              <Textarea
                placeholder="この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。"
                value={formData.departmentGoal}
                onChange={(e) => updateFormData("departmentGoal", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* 全社の方針 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                全社の今期の方針を入力してください
              </Label>
              <Textarea
                placeholder="この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。"
                value={formData.companyGoal}
                onChange={(e) => updateFormData("companyGoal", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* 上位方針 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                上位方針を一つずつ入れてください
              </Label>
              <div className="space-y-3">
                {formData.superiorGoals.map((goal: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <Input
                      placeholder="この文章はダミーです。テキストの大きさ、行間を確認するために入力しています。"
                      value={goal}
                      onChange={(e) => updateSuperiorGoal(index, e.target.value)}
                      className="flex-1"
                    />
                    {index === formData.superiorGoals.length - 1 && (
                      <Button
                        onClick={addSuperiorGoal}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
            <Button
              onClick={onBack}
              variant="outline"
              className="px-12 py-6 rounded-full text-lg font-medium w-full sm:w-auto"
            >
              戻る
            </Button>
            <Button
              onClick={onNext}
              className="bg-black hover:bg-gray-800 text-white px-12 py-6 rounded-full text-lg font-medium w-full sm:w-auto"
            >
              次へ
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
