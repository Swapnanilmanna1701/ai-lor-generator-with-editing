"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Plus, Trash2, Download, LogOut } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { exportToPDF, exportToDOCX } from "@/lib/export-utils";

interface Letter {
  id: number;
  applicantName: string;
  targetProgram: string;
  targetInstitution: string;
  lorType: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [exportingId, setExportingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchLetters();
    }
  }, [session]);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/letters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch letters");
      }

      const data = await response.json();
      setLetters(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load letters");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/letters?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete letter");
      }

      setLetters(letters.filter((letter) => letter.id !== id));
      toast.success("Letter deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete letter");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportPDF = async (letter: Letter) => {
    setExportingId(letter.id);
    try {
      const filename = `${letter.applicantName.replace(/\s+/g, "_")}_LOR.pdf`;
      await exportToPDF(letter.content, filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExportingId(null);
    }
  };

  const handleExportDOCX = async (letter: Letter) => {
    setExportingId(letter.id);
    try {
      const filename = `${letter.applicantName.replace(/\s+/g, "_")}_LOR.docx`;
      await exportToDOCX(letter.content, filename);
      toast.success("DOCX exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export DOCX");
    } finally {
      setExportingId(null);
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    localStorage.removeItem("bearer_token");
    refetch();
    router.push("/");
  };

  if (isPending || loading) {
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
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">LOR Generator</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{session.user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Letters</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your generated letters of recommendation
            </p>
          </div>
          <Link href="/generator">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create New Letter
            </Button>
          </Link>
        </div>

        {letters.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">No letters yet</h3>
              <p className="text-muted-foreground">
                Create your first letter of recommendation to get started
              </p>
              <Link href="/generator">
                <Button size="lg" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Letter
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map((letter) => (
              <Card key={letter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{letter.applicantName}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {letter.targetProgram} at {letter.targetInstitution}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {letter.lorType.charAt(0).toUpperCase() + letter.lorType.slice(1)}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(letter)}
                      disabled={exportingId === letter.id}
                      className="flex-1"
                    >
                      {exportingId === letter.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportDOCX(letter)}
                      disabled={exportingId === letter.id}
                      className="flex-1"
                    >
                      {exportingId === letter.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          DOCX
                        </>
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === letter.id}
                        >
                          {deletingId === letter.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            letter for {letter.applicantName}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(letter.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
