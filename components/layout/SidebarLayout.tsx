"use client";

import { useState } from "react";
import { Sparkles, ChevronRight, Grid2x2X as Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarLayoutProps {
  children: React.ReactNode;
  formData: any;
}

export default function SidebarLayout({ children, formData }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <aside
        className={`border-r bg-white transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-80"
        } flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <Sparkles className="w-6 h-6" />
              <span>PetraF</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            <Grid2X2 className="w-5 h-5" />
          </Button>
        </div>

        {!isCollapsed && (
          <>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <span className="text-lg">✏️</span>
                <span>新しく始める</span>
              </Button>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">2025年度目標設定</span>
                </div>
                <div className="ml-6 space-y-2 text-sm text-gray-600">
                  <div className="truncate">上位方針1：◯◯◯◯◯◯....</div>
                  <div className="truncate">上位方針2：◯◯◯◯◯◯....</div>
                  <div className="truncate">上位方針3：◯◯◯◯◯◯....</div>
                  <div className="truncate">上位方針4：◯◯◯◯◯◯....</div>
                  <div className="truncate">上位方針5：◯◯◯◯◯◯....</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-6 mt-2 text-sm">
                  <span className="mr-2">+</span>
                  新しいテーマで始める
                </Button>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Grid2X2 className="w-4 h-4" />
                <span>一覧で見る</span>
              </Button>
            </div>
          </>
        )}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white px-6 py-4">
          <div className="bg-gray-200 px-6 py-3 rounded text-lg font-bold text-gray-700 inline-block">
            LOGO
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>

          <aside className="w-80 border-l bg-white p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-black"></div>
              <h3 className="font-bold">基本情報</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">所属部門</Label>
                <Input value={formData.department} readOnly className="bg-gray-50 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">役職</Label>
                <Input value={formData.position} readOnly className="bg-gray-50 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">等級</Label>
                <Input value={formData.grade} readOnly className="bg-gray-50 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">勤続年数</Label>
                <Select value={formData.yearsOfService} disabled>
                  <SelectTrigger className="bg-gray-50 text-sm">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1年</SelectItem>
                    <SelectItem value="2">2年</SelectItem>
                    <SelectItem value="3">3年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">年齢</Label>
                <Select value={formData.age} disabled>
                  <SelectTrigger className="bg-gray-50 text-sm">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20s">20代</SelectItem>
                    <SelectItem value="30s">30代</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">職種</Label>
                <Input value={formData.jobType} readOnly className="bg-gray-50 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">3年後のあなたの姿</Label>
                <Input value="◯◯" readOnly className="bg-gray-50 text-sm" />
              </div>

              <Button variant="ghost" size="icon" className="w-full">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
