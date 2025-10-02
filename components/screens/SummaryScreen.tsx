"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SummaryScreenProps {
  formData: any;
}

export default function SummaryScreen({ formData }: SummaryScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-black"></div>
            <h2 className="text-xl font-bold">基本情報</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">所属部門</Label>
                <Input value={formData.department} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">役職</Label>
                <Input value={formData.position} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">等級</Label>
                <Input value={formData.grade} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">勤続年数</Label>
                <Select value={formData.yearsOfService} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1年</SelectItem>
                    <SelectItem value="2">2年</SelectItem>
                    <SelectItem value="3">3年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">年齢</Label>
                <Select value={formData.age} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20s">20代</SelectItem>
                    <SelectItem value="30s">30代</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">職種</Label>
                <Input value={formData.jobType} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">3年後のあなたの姿</Label>
              <Input value="◯◯" readOnly className="bg-gray-50" />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-black"></div>
            <h2 className="text-xl font-bold">方針・計画</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                所属部門の今期の方針・計画
              </Label>
              <Textarea
                value={formData.departmentGoal}
                readOnly
                className="bg-gray-50 min-h-[100px] resize-none"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
