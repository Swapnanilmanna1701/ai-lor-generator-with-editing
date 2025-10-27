import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">LOR Generator</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Professional Letter of
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Recommendation Generator
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create personalized, credible letters of recommendation for college admissions,
            jobs, and scholarships using AI-powered technology.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Generating Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-muted-foreground">
              Advanced AI creates professional, personalized letters based on your specific
              requirements and tone preferences.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Editing</h3>
            <p className="text-muted-foreground">
              Edit generated letters directly in the preview window with our intuitive rich
              text editor. Save and manage all your letters.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Export to PDF & DOCX</h3>
            <p className="text-muted-foreground">
              Download your letters in professional PDF or editable DOCX format, ready to
              submit or further customize.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <Lock className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Secure & Private</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Your data is encrypted and secure. All your letters are stored safely in your
            private account, accessible only to you.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-32 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2024 LOR Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}