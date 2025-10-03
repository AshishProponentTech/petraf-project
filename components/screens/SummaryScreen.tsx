"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { api, GoalsGetResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SummaryScreenProps {
  formData: any;
}

export default function SummaryScreen({ formData }: SummaryScreenProps) {
  const [goals, setGoals] = useState<GoalsGetResponse | null>(null)

  useEffect(() => {
    api.getGoals().then(setGoals).catch(() => setGoals(null))
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.print()}>PDFダウンロード</Button>
          <Button variant="outline" onClick={() => navigator.share?.({ title: 'Petraf Goals', text: 'My goals summary' })}>共有</Button>
        </div>
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-black"></div>
            <h2 className="text-xl font-bold">Basic Information</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Department</Label>
                <Input value={formData.department} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Position</Label>
                <Input value={formData.position} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Grade</Label>
                <Input value={formData.grade} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Years of Service</Label>
                <Select value={formData.yearsOfService} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select" />
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
                <Label className="text-sm font-medium mb-2 block">Age Range</Label>
                <Select value={formData.age} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20s">20代</SelectItem>
                    <SelectItem value="30s">30代</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Job Type</Label>
                <Input value={formData.jobType} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Your 3-year vision</Label>
              <Input
                value={goals?.goals.find((g) => g.type === "future")?.content ?? ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-black"></div>
            <h2 className="text-xl font-bold">Plans</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Department Plan (this term)
              </Label>
              <Textarea
                value={formData.departmentGoal}
                readOnly
                className="bg-gray-50 min-h-[100px] resize-none"
              />
            </div>
          </div>
        </section>

        {/* Links visualization */}
        {goals && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-black"></div>
              <h2 className="text-xl font-bold">ゴールの関連</h2>
            </div>
            <div className="space-y-3 text-sm">
              {goals.goals.map((g) => (
                <div key={g.id} className="bg-white border rounded p-3">
                  <div className="font-medium mb-1">{g.type} - {g.phase}</div>
                  {g.links?.length ? (
                    <ul className="list-disc ml-5">
                      {g.links.map((l, i) => (
                        <li key={i}>{l.link_type} → {l.parent_goal_id} (strength: {l.strength})</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">リンクなし</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
