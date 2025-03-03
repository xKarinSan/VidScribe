import { YoutubeForm } from "@/components/youtube-form";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Github } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">VidScribe</h1>
          <p className="text-muted-foreground mb-4 text-center">
            Extract key points from YouTube videos using AI and export them in various formats
          </p>
          
          <div className="flex justify-center mb-6">
            <a 
              href="https://github.com/xKarinSan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Created by xKarinSan</span>
            </a>
          </div>
          
          <Card className="p-4 mb-8 border border-border">
            <h2 className="text-lg font-medium mb-3">How to use VidScribe:</h2>
            <ol className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Step 1:</strong> Click the settings icon and add your OpenAI API key</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Step 2:</strong> Copy and paste a YouTube video link in the input field</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Step 3:</strong> Click "Generate Notes" and wait for the AI to process the video</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Step 4:</strong> Edit your notes and export them in your preferred format (.txt, .docx, or PDF)</span>
              </li>
            </ol>
          </Card>
          
          <YoutubeForm />
        </div>
      </main>
    </div>
  );
}

export default App;