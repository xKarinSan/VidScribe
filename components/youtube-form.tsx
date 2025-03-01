"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { extractVideoId, generateNotes } from "@/lib/youtube-utils";
import { NotesEditor } from "@/components/notes-editor";

const formSchema = z.object({
  youtubeUrl: z.string().url("Please enter a valid URL").refine(
    (url) => extractVideoId(url) !== null,
    {
      message: "Please enter a valid YouTube URL",
    }
  ),
});

export function YoutubeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const apiKey = localStorage.getItem("openai-api-key");
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in the settings.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const videoId = extractVideoId(values.youtubeUrl);
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }
      
      const generatedNotes = await generateNotes(videoId, apiKey);
      setNotes(generatedNotes);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Paste YouTube URL here"
                        className="pl-9"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Notes"
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {notes && <NotesEditor initialContent={notes} />}
    </div>
  );
}