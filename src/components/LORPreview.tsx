"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Save, Loader2, Bold, Italic, List, ListOrdered, Copy, Check } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";

interface LORPreviewProps {
  content: string;
  onSave: (content: string) => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  saving?: boolean;
  exporting?: boolean;
}

export default function LORPreview({
  content,
  onSave,
  onExportPDF,
  onExportDOCX,
  saving = false,
  exporting = false,
}: LORPreviewProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Generated letter will appear here...",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "professional-letter-content focus:outline-none p-8 sm:p-12 min-h-[600px]",
      },
    },
    onUpdate: () => {
      setHasChanges(true);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setHasChanges(false);
    }
  }, [content, editor]);

  const handleSave = () => {
    if (editor) {
      onSave(editor.getHTML());
      setHasChanges(false);
    }
  };

  const handleCopy = async () => {
    if (!editor) return;
    
    try {
      // Get plain text from editor
      const text = editor.getText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Letter copied to clipboard!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <p className="text-lg">Fill out the form and click "Generate Professional LOR" to</p>
          <p className="text-lg">create your personalized letter of recommendation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            size="sm"
            variant="outline"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onExportPDF} disabled={exporting} size="sm" variant="outline">
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </>
            )}
          </Button>
          <Button onClick={onExportDOCX} disabled={exporting} size="sm" variant="outline">
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                DOCX
              </>
            )}
          </Button>
        </div>
      </div>

      {editor && (
        <div className="flex items-center gap-1 mb-2 p-2 border rounded-lg bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-muted" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-muted" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-muted" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 border rounded-lg overflow-auto bg-white shadow-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}