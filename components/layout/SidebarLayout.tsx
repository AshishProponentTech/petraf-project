"use client";

import { useEffect, useState } from "react";
import { Sparkles, ChevronRight, Grid2x2X as Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarLayoutProps {
  children: React.ReactNode;
  formData: any;
  onStartNew?: () => void;
}

export default function SidebarLayout({ children, formData, onStartNew }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false); // Info panel hidden by default on mobile
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('petraf_progress')
      if (stored) setProgress(Number(stored) || 0)
    } catch {}
  }, [])

  return (
    <div className="flex h-screen">
      <aside
        className={`border-r bg-white transition-all duration-300 ${
          isCollapsed ? "w-12 sm:w-16" : "w-64 sm:w-80"
        } flex flex-col`}
      >
        <div className="p-2 sm:p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg sm:text-xl">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:block">PetraF</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-full">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto h-8 w-8 sm:h-10 sm:w-10"
          >
            <Grid2X2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {!isCollapsed && (
          <>
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-4 flex-1 overflow-y-auto">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-1 sm:gap-2 text-sm sm:text-base"
                onClick={onStartNew}
              >
                <span className="text-sm sm:text-lg">✏️</span>
                <span>Start New</span>
              </Button>

              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium text-xs sm:text-sm">FY2025 Goal Setting</span>
                </div>
                <div className="ml-4 sm:ml-6 space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="truncate">Direction 1: …</div>
                  <div className="truncate">Direction 2: …</div>
                  <div className="truncate">Direction 3: …</div>
                  <div className="truncate">Direction 4: …</div>
                  <div className="truncate">Direction 5: …</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-4 sm:ml-6 mt-1 sm:mt-2 text-xs sm:text-sm">
                  <span className="mr-1 sm:mr-2">+</span>
                  Start with new theme
                </Button>
              </div>
            </div>

            <div className="p-2 sm:p-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-1 sm:gap-2 text-xs sm:text-sm">
                <Grid2X2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>View All</span>
              </Button>
              {/* Progress indicator */}
              <div className="mt-2 sm:mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded">
                  <div
                    className="h-full bg-blue-600 rounded transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white px-2 sm:px-4 md:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="bg-gray-200 px-3 sm:px-6 py-2 sm:py-3 rounded text-sm sm:text-lg font-bold text-gray-700 inline-block">
              LOGO
            </div>
            {/* Mobile info panel toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
              className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-20 sm:pb-24">{children}</main>

          {/* Mobile overlay for info panel */}
          {isInfoPanelOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsInfoPanelOpen(false)}
            />
          )}

          <aside className={`
            fixed lg:relative top-0 right-0 h-full lg:h-auto z-50 lg:z-auto
            w-80 lg:w-80 border-l-0 lg:border-l bg-white p-3 sm:p-4 md:p-6 overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${isInfoPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black"></div>
                <h3 className="font-bold text-sm sm:text-base">Basic Info</h3>
              </div>
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInfoPanelOpen(false)}
                className="lg:hidden h-6 w-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Department</Label>
                <Input value={formData.department} readOnly className="bg-gray-50 text-xs sm:text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Position</Label>
                <Input value={formData.position} readOnly className="bg-gray-50 text-xs sm:text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Grade</Label>
                <Input value={formData.grade} readOnly className="bg-gray-50 text-xs sm:text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Years of Service</Label>
                <Select value={formData.yearsOfService} disabled>
                  <SelectTrigger className="bg-gray-50 text-xs sm:text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1年</SelectItem>
                    <SelectItem value="2">2年</SelectItem>
                    <SelectItem value="3">3年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Age Range</Label>
                <Select value={formData.age} disabled>
                  <SelectTrigger className="bg-gray-50 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20s">20代</SelectItem>
                    <SelectItem value="30s">30代</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Job Type</Label>
                <Input value={formData.jobType} readOnly className="bg-gray-50 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Your 3-year vision</Label>
                <Input value="..." readOnly className="bg-gray-50 text-sm" />
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
