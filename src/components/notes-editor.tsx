import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  FileTextIcon, 
  FileIcon, 
  FileTypeIcon
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface NotesEditorProps {
  initialContent: string;
  videoId?: string;
}

export function NotesEditor({ initialContent, videoId = "notes" }: NotesEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState(videoId);
  const { toast } = useToast();

  const exportAsTxt = () => {
    const finalFilename = filename.trim() ? `${filename}.txt` : `vidscribe-notes.txt`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Notes exported",
      description: `Your notes have been exported as ${finalFilename}`,
    });
  };

  const exportAsDocx = async () => {
    try {
      const finalFilename = filename.trim() ? `${filename}.docx` : `vidscribe-notes.docx`;
      
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
      saveAs(new Blob([buffer]), finalFilename);
      
      toast({
        title: "Notes exported",
        description: `Your notes have been exported as ${finalFilename}`,
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
      const finalFilename = filename.trim() ? `${filename}.pdf` : `vidscribe-notes.pdf`;
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
      doc.save(finalFilename);
      
      toast({
        title: "Notes exported",
        description: `Your notes have been exported as ${finalFilename}`,
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
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Generated Notes</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="filename" className="mb-2 block">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 mt-2 sm:mt-6 w-full sm:w-auto">
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