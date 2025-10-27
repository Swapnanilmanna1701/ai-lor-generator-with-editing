import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

// Convert HTML to plain text for PDF/DOCX
export function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

// Export as PDF
export async function exportToPDF(content: string, filename: string = "letter_of_recommendation.pdf") {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Convert HTML to plain text
    const plainText = htmlToPlainText(content);

    // Set font
    pdf.setFont("helvetica");
    pdf.setFontSize(12);

    // Add text with proper margins and wrapping
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 7;

    // Split text into lines
    const lines = pdf.splitTextToSize(plainText, maxWidth);
    
    let y = margin;
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export PDF");
  }
}

// Export as DOCX
export async function exportToDOCX(content: string, filename: string = "letter_of_recommendation.docx") {
  try {
    // Convert HTML to plain text
    const plainText = htmlToPlainText(content);

    // Split into paragraphs
    const paragraphs = plainText.split("\n\n").filter((p) => p.trim());

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs.map(
            (para) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: para,
                    font: "Times New Roman",
                    size: 24, // 12pt
                  }),
                ],
                spacing: {
                  after: 200,
                  line: 360,
                },
                alignment: AlignmentType.LEFT,
              })
          ),
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("DOCX export error:", error);
    throw new Error("Failed to export DOCX");
  }
}
