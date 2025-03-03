"use client";

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Settings, Github } from "lucide-react";
import { SettingsDialog } from "@/components/settings-dialog";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-semibold text-xl">
          VidScribe
        </a>
        <div className="flex items-center gap-2">
          <a 
            href="https://github.com/xKarinSan/VidScribe" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </header>
  );
}