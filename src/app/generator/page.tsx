"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import LORForm from "@/components/LORForm";
import LORPreview from "@/components/LORPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { exportToPDF, exportToDOCX } from "@/lib/export-utils";
import { toast } from "sonner";

interface LORFormData {
  applicantName: string;
  relationship: string;
  durationKnown: string;
  institution: string;
  targetProgram: string;
  targetInstitution: string;
  fieldDomain: string;
  observedQualities: string;
  achievements: string;
  softTraits: string;
  anecdote: string;
  referrerName: string;
  referrerTitle: string;
  referrerEmail: string;
  tone: string;
  lorType: string;
  recommendationStrength: string;
}

export default function GeneratorPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [generatedContent, setGeneratedContent] = useState("");
  const [currentFormData, setCurrentFormData] = useState<LORFormData | null>(null);
  const [currentLetterId, setCurrentLetterId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleGenerate = async (formData: LORFormData) => {
    setGenerating(true);
    setCurrentFormData(formData);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/generate-lor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate LOR");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      toast.success("Letter generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (content: string) => {
    if (!currentFormData) {
      toast.error("No form data available");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const method = currentLetterId ? "PUT" : "POST";
      const url = currentLetterId
        ? `/api/letters?id=${currentLetterId}`
        : "/api/letters";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...currentFormData,
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save letter");
      }

      const data = await response.json();
      setCurrentLetterId(data.id);
      setGeneratedContent(content);
      toast.success("Letter saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save letter");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!generatedContent) return;
    
    setExporting(true);
    try {
      await exportToPDF(generatedContent);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    if (!generatedContent) return;
    
    setExporting(true);
    try {
      await exportToDOCX(generatedContent);
      toast.success("DOCX exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export DOCX");
    } finally {
      setExporting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold">LOR Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{session.user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Professional Letter of Recommendation Generator
          </h2>
          <p className="text-muted-foreground">
            Create personalized, credible letters of recommendation for college admissions,
            jobs, and scholarships
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-6">Letter Details</h3>
            <LORForm onGenerate={handleGenerate} loading={generating} />
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
            <h3 className="text-xl font-semibold mb-6">Generated Letter</h3>
            <div className="flex-1 min-h-0">
              <LORPreview
                content={generatedContent}
                onSave={handleSave}
                onExportPDF={handleExportPDF}
                onExportDOCX={handleExportDOCX}
                saving={saving}
                exporting={exporting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
