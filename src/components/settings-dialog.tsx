import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load API key from localStorage when component mounts
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys typically start with 'sk-'.",
        variant: "destructive",
      });
      return;
    }

    // Save API key to localStorage
    localStorage.setItem("openai-api-key", apiKey);
    toast({
      title: "Settings saved",
      description: "Your OpenAI API key has been saved locally.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>VidScribe Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys for generating notes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Your API key is stored locally in your browser and never sent to our servers.
                You can get an API key from the{" "}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  OpenAI dashboard
                </a>.
              </p>
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}