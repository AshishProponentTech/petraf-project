"use client";

import { useEffect, useState } from "react";
import IntroScreen from "@/components/screens/IntroScreen";
import TokenScreen from "@/components/screens/TokenScreen";
import BasicInfoScreen from "@/components/screens/BasicInfoScreen";
import GoalsScreen from "@/components/screens/GoalsScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import SummaryScreen from "@/components/screens/SummaryScreen";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { api } from "@/src/lib/api";

export default function Home() {
  console.log("[API Setup] Using real API");
  const [step, setStep] = useState(0);
  const [hasResumeToken, setHasResumeToken] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    department: "",
    position: "",
    grade: "",
    yearsOfService: "",
    age: "",
    jobType: "",
    futureGoal: "",
    departmentGoal: "",
    companyGoal: "",
    superiorGoals: [""]
  });

  useEffect(() => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('resume_token='))
        ?.split('=')[1]
      if (token) {
        api.resumeSession(token).catch(() => {})
      }
    } catch {}
    // detect resume token presence for optional TokenScreen
    try {
      const urlToken = typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('resume') : null
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('petraf_resume_token') : null
      const cookieToken = (() => {
        try {
          return document.cookie.split('; ').find((r) => r.startsWith('resume_token='))?.split('=')[1]
        } catch { return null }
      })()
      if (urlToken || localToken || cookieToken) setHasResumeToken(true)
    } catch {}
  }, [])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => {
    // If moving forward from Intro (0) and user has an existing resume token,
    // show the TokenScreen (1). Otherwise skip TokenScreen for new users.
    if (prev === 0) {
      return hasResumeToken ? 1 : 2
    }
    return prev + 1
  });
  const prevStep = () => setStep(prev => prev - 1);
  const startNew = () => {
    setStep(0);
    setFormData({
      token: "",
      department: "",
      position: "",
      grade: "",
      yearsOfService: "",
      age: "",
      jobType: "",
      futureGoal: "",
      departmentGoal: "",
      companyGoal: "",
      superiorGoals: [""]
    });
    try { localStorage.setItem('petraf_progress', '0') } catch {}
  };

  const renderScreen = () => {
    switch (step) {
      case 0:
        return <IntroScreen onNext={nextStep} />;
      case 1:
        return <TokenScreen onNext={nextStep} formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BasicInfoScreen onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <GoalsScreen onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ChatScreen onNext={nextStep} formData={formData} />;
      case 5:
        return <SummaryScreen formData={formData} />;
      default:
        return <IntroScreen onNext={nextStep} />;
    }
  };

  const showSidebar = step >= 4;

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar ? (
        <SidebarLayout formData={formData} onStartNew={startNew}>
          {renderScreen()}
        </SidebarLayout>
      ) : (
        renderScreen()
      )}
    </div>
  );
}
