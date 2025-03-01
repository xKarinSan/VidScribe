"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileTextIcon, 
  FileIcon, 
  FileTypeIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

interface NotesEditorProps {
  initialContent: string;
}

export function NotesEditor({ initialContent }: NotesEditorProps) {
  const [content, setContent] = useState(initialContent);
  const { toast } = useToast();

  const exportAsTxt = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youtube-notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Notes exported",
      description: "Your notes have been exported as a .txt file",
    });
  };

  const exportAsDocx = async () => {
    try {
      // Create a new document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: content.split("\n").map(line => {
              // Check if line is a heading
              if (line.startsWith("# ")) {
                return new Paragraph({
                  text: line.replace("# ", ""),
                  heading: "Heading1"
                });
              } else if (line.startsWith("## ")) {
                return new Paragraph({
                  text: line.replace("## ", ""),
                  heading: "Heading2"
                });
              } else if (line.startsWith("### ")) {
                return new Paragraph({
                  text: line.replace("### ", ""),
                  heading: "Heading3"
                });
              } else if (line.startsWith("- ")) {
                return new Paragraph({
                  text: line.replace("- ", ""),
                  bullet: {
                    level: 0
                  }
                });
              } else if (line.trim() === "") {
                return new Paragraph({});
              } else {
                return new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                    }),
                  ],
                });
              }
            }),
          },
        ],
      });

      // Generate the .docx file
      const buffer = await Packer.toBuffer(doc);
      
      // Save the file using file-saver
      saveAs(new Blob([buffer]), "youtube-notes.docx");
      
      toast({
        title: "Notes exported",
        description: "Your notes have been exported as a .docx file",
      });
    } catch (error) {
      console.error("Error exporting to DOCX:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes to DOCX format.",
        variant: "destructive",
      });
    }
  };

  const exportAsPdf = () => {
    try {
      const doc = new jsPDF();
      
      // Split content into lines and add to PDF
      const lines = content.split('\n');
      let y = 10;
      
      lines.forEach(line => {
        // Handle different heading levels with different font sizes
        if (line.startsWith('# ')) {
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text(line.replace('# ', ''), 10, y);
          y += 10;
        } else if (line.startsWith('## ')) {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(line.replace('## ', ''), 10, y);
          y += 8;
        } else if (line.startsWith('### ')) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(line.replace('### ', ''), 10, y);
          y += 7;
        } else if (line.startsWith('- ')) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text('• ' + line.replace('- ', ''), 15, y);
          y += 6;
        } else if (line.trim() !== '') {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          // Handle text wrapping for long lines
          const textLines = doc.splitTextToSize(line, 180);
          doc.text(textLines, 10, y);
          y += 6 * textLines.length;
        } else {
          // Empty line
          y += 4;
        }
        
        // Add a new page if we're near the bottom
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });
      
      // Save the PDF
      doc.save('youtube-notes.pdf');
      
      toast({
        title: "Notes exported",
        description: "Your notes have been exported as a PDF file",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes to PDF format.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Generated Notes</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportAsTxt}>
            <FileTextIcon className="h-4 w-4 mr-2" />
            Export as .txt
          </Button>
          <Button variant="outline" size="sm" onClick={exportAsDocx}>
            <FileIcon className="h-4 w-4 mr-2" />
            Export as .docx
          </Button>
          <Button variant="outline" size="sm" onClick={exportAsPdf}>
            <FileTypeIcon className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <textarea
            className="w-full h-[500px] p-4 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="w-full h-[500px] p-4 border rounded-md bg-background overflow-auto">
            {content.split("\n").map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}