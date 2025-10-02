"use client";

import { useState } from "react";
import IntroScreen from "@/components/screens/IntroScreen";
import TokenScreen from "@/components/screens/TokenScreen";
import BasicInfoScreen from "@/components/screens/BasicInfoScreen";
import GoalsScreen from "@/components/screens/GoalsScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import SummaryScreen from "@/components/screens/SummaryScreen";
import SidebarLayout from "@/components/layout/SidebarLayout";

export default function Home() {
  const [step, setStep] = useState(0);
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

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

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
        <SidebarLayout formData={formData}>
          {renderScreen()}
        </SidebarLayout>
      ) : (
        renderScreen()
      )}
    </div>
  );
}
