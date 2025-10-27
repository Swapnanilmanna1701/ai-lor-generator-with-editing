"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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

interface LORFormProps {
  onGenerate: (data: LORFormData) => void;
  loading?: boolean;
}

export default function LORForm({ onGenerate, loading = false }: LORFormProps) {
  const [formData, setFormData] = useState<LORFormData>({
    applicantName: "",
    relationship: "",
    durationKnown: "",
    institution: "",
    targetProgram: "",
    targetInstitution: "",
    fieldDomain: "",
    observedQualities: "",
    achievements: "",
    softTraits: "",
    anecdote: "",
    referrerName: "",
    referrerTitle: "",
    referrerEmail: "",
    tone: "formal",
    lorType: "college",
    recommendationStrength: "strongly",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (field: keyof LORFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Applicant Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Applicant Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="applicantName">Applicant Name *</Label>
          <Input
            id="applicantName"
            placeholder="Enter the applicant's name"
            value={formData.applicantName}
            onChange={(e) => handleChange("applicantName", e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="relationship">Your Relationship *</Label>
            <Input
              id="relationship"
              placeholder="e.g., Professor, Manager"
              value={formData.relationship}
              onChange={(e) => handleChange("relationship", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationKnown">Duration Known *</Label>
            <Input
              id="durationKnown"
              placeholder="e.g., 2 years"
              value={formData.durationKnown}
              onChange={(e) => handleChange("durationKnown", e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">Your Institution/Company *</Label>
          <Input
            id="institution"
            placeholder="Your institution/company"
            value={formData.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Purpose of the LOR */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Purpose of the LOR</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetProgram">Target Program/Role *</Label>
            <Input
              id="targetProgram"
              placeholder="e.g., Master's in Computer Science"
              value={formData.targetProgram}
              onChange={(e) => handleChange("targetProgram", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetInstitution">Target Institution *</Label>
            <Input
              id="targetInstitution"
              placeholder="e.g., Stanford University"
              value={formData.targetInstitution}
              onChange={(e) => handleChange("targetInstitution", e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fieldDomain">Field/Domain *</Label>
          <Input
            id="fieldDomain"
            placeholder="e.g., Computer Science, Business Administration"
            value={formData.fieldDomain}
            onChange={(e) => handleChange("fieldDomain", e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Skills & Strengths */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills & Strengths</h3>

        <div className="space-y-2">
          <Label htmlFor="observedQualities">Observed Qualities *</Label>
          <Textarea
            id="observedQualities"
            placeholder="Describe specific skills, qualities, and behaviors you've observed..."
            value={formData.observedQualities}
            onChange={(e) => handleChange("observedQualities", e.target.value)}
            required
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achievements">Specific Achievements/Projects *</Label>
          <Textarea
            id="achievements"
            placeholder="Describe specific achievements, projects, or contributions..."
            value={formData.achievements}
            onChange={(e) => handleChange("achievements", e.target.value)}
            required
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="softTraits">Soft Traits/Character</Label>
          <Textarea
            id="softTraits"
            placeholder="e.g., excellent communication skills, strong work ethic, collaborative spirit..."
            value={formData.softTraits}
            onChange={(e) => handleChange("softTraits", e.target.value)}
            required
            disabled={loading}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anecdote">Specific Anecdote or Instance (Optional)</Label>
          <Textarea
            id="anecdote"
            placeholder="Can you share a specific anecdote or instance that best illustrates the candidate's strengths, character, or potential?"
            value={formData.anecdote}
            onChange={(e) => handleChange("anecdote", e.target.value)}
            disabled={loading}
            rows={3}
          />
        </div>
      </div>

      {/* Referrer Identity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Referrer Identity</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referrerName">Your Name</Label>
            <Input
              id="referrerName"
              placeholder="Your full name"
              value={formData.referrerName}
              onChange={(e) => handleChange("referrerName", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrerTitle">Your Title/Position</Label>
            <Input
              id="referrerTitle"
              placeholder="e.g., Professor, Senior Manager"
              value={formData.referrerTitle}
              onChange={(e) => handleChange("referrerTitle", e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referrerEmail">Your Email (Optional)</Label>
          <Input
            id="referrerEmail"
            type="email"
            placeholder="your.email@institution.com"
            value={formData.referrerEmail}
            onChange={(e) => handleChange("referrerEmail", e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Style & Support */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Style & Support</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={formData.tone}
              onValueChange={(value) => handleChange("tone", value)}
              disabled={loading}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lorType">LOR Type</Label>
            <Select
              value={formData.lorType}
              onValueChange={(value) => handleChange("lorType", value)}
              disabled={loading}
            >
              <SelectTrigger id="lorType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="college">College/University</SelectItem>
                <SelectItem value="job">Job Application</SelectItem>
                <SelectItem value="scholarship">Scholarship</SelectItem>
                <SelectItem value="graduate">Graduate School</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendationStrength">Recommendation Strength</Label>
          <Select
            value={formData.recommendationStrength}
            onValueChange={(value) => handleChange("recommendationStrength", value)}
            disabled={loading}
          >
            <SelectTrigger id="recommendationStrength">
              <SelectValue placeholder="Select strength" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strongly">Strongly Recommend</SelectItem>
              <SelectItem value="highly">Highly Recommend</SelectItem>
              <SelectItem value="recommend">Recommend</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Professional LOR...
          </>
        ) : (
          "Generate Professional LOR"
        )}
      </Button>
    </form>
  );
}
