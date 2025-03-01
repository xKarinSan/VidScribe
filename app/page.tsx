import { YoutubeForm } from "@/components/youtube-form";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">YouTube Notes Generator</h1>
          <p className="text-muted-foreground mb-8 text-center">
            Extract key points from YouTube videos using AI and export them in various formats
          </p>
          <YoutubeForm />
        </div>
      </main>
    </div>
  );
}