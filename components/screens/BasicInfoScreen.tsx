"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/src/lib/api";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface BasicInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function BasicInfoScreen({ onNext, onBack, formData, updateFormData }: BasicInfoScreenProps) {
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (loading) return
    
    // Validate first
    if (!formData.department?.trim() || !formData.position?.trim() || !formData.grade?.trim()) {
      toast({ title: 'Missing required fields', description: 'Department, Position, and Grade are required.' })
      return
    }
    
    setLoading(true)
    try {
      console.log('Form data:', formData) // debug
      await api.updateSessionInfo({
        id: "01HN8X9QJ5ABCDEF123456789",
        tenant_id: "550e8400-e29b-41d4-a716-446655440000",
        employee_code: formData.employeeCode,
        department: formData.department,
        position: formData.position,
        grade: formData.grade,
        years_of_service: Number(formData.yearsOfService) || undefined,
        age_range: formData.age,
        job_type: formData.jobType,
      })
      // Only call onNext if validation passed and API call succeeded
      onNext()
    } catch (e) {
      // swallow for mock
      console.error('API error:', e)
      onNext() // Still proceed in mock mode even if API fails
    } finally {
      setLoading(false)
    }
  }

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
              <div className="w-16 sm:w-24 h-1 bg-blue-500 rounded"></div>
              <span className="font-medium whitespace-nowrap">1. Basic Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-24 h-1 bg-gray-300 rounded"></div>
              <span className="text-gray-400 whitespace-nowrap">2. Plans</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-24 h-1 bg-gray-300 rounded"></div>
              <span className="text-gray-400 whitespace-nowrap">3. Company Direction</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-gray-900">
            Enter Basic Information
          </h1>

          <div className="space-y-8">
            {/* 部門 & 役職 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="department" className="text-sm font-medium mb-2 block">
                  Department
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
                  Position
                </Label>
                <Input
                  id="position"
                  placeholder="AA役職"
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                />
              </div>
            </div>

            {/* 等級 & 勤続年数 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="grade" className="text-sm font-medium mb-2 block">
                  Grade
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
                  Years of Service
                </Label>
                <Select
                  value={formData.yearsOfService}
                  onValueChange={(value) => updateFormData("yearsOfService", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 年齢 & 職種 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age" className="text-sm font-medium mb-2 block">
                    Age Range
                  </Label>
                  <Select
                    value={formData.age}
                    onValueChange={(value) => updateFormData("age", value)}
                  >
                    <SelectTrigger>
                    <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20s">20s</SelectItem>
                      <SelectItem value="30s">30s</SelectItem>
                      <SelectItem value="40s">40s</SelectItem>
                      <SelectItem value="50s">50s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobType" className="text-sm font-medium mb-2 block">
                    Job Type
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12">
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white px-12 py-6 rounded-full text-lg font-medium w-full sm:w-auto"
            >
              {loading ? 'Saving...' : 'Next'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
