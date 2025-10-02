"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function BasicInfoScreen({ onNext, onBack, formData, updateFormData }: BasicInfoScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="bg-gray-200 px-6 py-3 rounded text-lg font-bold text-gray-700">
            LOGO
          </div>
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-blue-500 rounded"></div>
              <span className="font-medium">1. 基本情報</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-gray-300 rounded"></div>
              <span className="text-gray-400">2. 方針・計画</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-gray-300 rounded"></div>
              <span className="text-gray-400">3. 上位方針</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-12 text-center text-gray-900">
            基本情報入力
          </h1>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="department" className="text-sm font-medium mb-2 block">
                  所属部門
                </Label>
                <Input
                  id="department"
                  placeholder="AA部門"
                  value={formData.department}
                  onChange={(e) => updateFormData("department", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="position" className="text-sm font-medium mb-2 block">
                  役職
                </Label>
                <Input
                  id="position"
                  placeholder="AA役職"
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="grade" className="text-sm font-medium mb-2 block">
                  等級
                </Label>
                <Input
                  id="grade"
                  placeholder="AA等級"
                  value={formData.grade}
                  onChange={(e) => updateFormData("grade", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="yearsOfService" className="text-sm font-medium mb-2 block">
                  勤続年数
                </Label>
                <Select
                  value={formData.yearsOfService}
                  onValueChange={(value) => updateFormData("yearsOfService", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1年</SelectItem>
                    <SelectItem value="2">2年</SelectItem>
                    <SelectItem value="3">3年</SelectItem>
                    <SelectItem value="5">5年</SelectItem>
                    <SelectItem value="10">10年以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age" className="text-sm font-medium mb-2 block">
                    年齢
                  </Label>
                  <Select
                    value={formData.age}
                    onValueChange={(value) => updateFormData("age", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20s">20代</SelectItem>
                      <SelectItem value="30s">30代</SelectItem>
                      <SelectItem value="40s">40代</SelectItem>
                      <SelectItem value="50s">50代</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobType" className="text-sm font-medium mb-2 block">
                    職種
                  </Label>
                  <Input
                    id="jobType"
                    placeholder="AA職種"
                    value={formData.jobType}
                    onChange={(e) => updateFormData("jobType", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-12">
            <Button
              onClick={onNext}
              className="bg-black hover:bg-gray-800 text-white px-12 py-6 rounded-full text-lg font-medium"
            >
              次へ
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
