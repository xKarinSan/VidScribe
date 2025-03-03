// Function to extract YouTube video ID from URL
export function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Function to fetch video metadata using YouTube API
async function fetchVideoMetadata(videoId: string): Promise<{ title: string; channelTitle: string }> {
  try {
    // Access the API key from environment variables
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    
    if (!apiKey) {
      throw new Error("YouTube API key is not configured");
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }

    const videoDetails = data.items[0].snippet;
    return {
      title: videoDetails.title,
      channelTitle: videoDetails.channelTitle
    };
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    // Return fallback data instead of throwing an error
    return {
      title: `Video ${videoId}`,
      channelTitle: 'YouTube Channel'
    };
  }
}

// Function to fetch video transcript (simulated for now)
async function fetchVideoTranscript(videoId: string): Promise<string> {
  // In a real implementation, you would use the YouTube API or a third-party service
  // to fetch the actual transcript
  
  // For now, we'll return a simulated transcript based on the video ID
  return `This is a simulated transcript for video ${videoId}. 
  In a real implementation, this would contain the actual words spoken in the video.
  The transcript would include timestamps, speaker identification, and other metadata.
  This transcript is being used to generate notes using AI.
  The quality of the notes depends on the quality of the transcript and the AI model.
  For demonstration purposes, we're using a simulated transcript.`;
}

// Function to generate notes using OpenAI API
async function generateNotesWithAI(transcript: string, metadata: { title: string; channelTitle: string }, apiKey: string): Promise<string> {
  try {
    console.log("Generating notes with OpenAI API...");
    console.log("Metadata:", metadata);
    
    // Make a real API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates structured, detailed notes from YouTube video transcripts. Format your response using markdown.'
          },
          {
            role: 'user',
            content: `Create comprehensive notes for a YouTube video titled "${metadata.title}" by ${metadata.channelTitle}. 
            Here's the transcript: ${transcript}
            
            Format the notes with the following sections:
            1. Summary (brief overview)
            2. Key Points (main ideas)
            3. Main Topics (with subsections)
            4. Actionable Insights
            5. Resources Mentioned (if any)
            
            Use markdown formatting with headers, bullet points, and numbered lists.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("OpenAI API response received");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected OpenAI API response format:", data);
      throw new Error("Unexpected response format from OpenAI API");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating notes with AI:", error);
    throw new Error(`Failed to generate notes: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Main function to generate notes from a YouTube video
export async function generateNotes(videoId: string, apiKey: string): Promise<string> {
  try {
    // 1. Fetch video metadata
    const metadata = await fetchVideoMetadata(videoId);
    console.log("Fetched metadata:", metadata);
    
    // 2. Generate transcript
    const transcript = await fetchVideoTranscript(videoId);
    
    // 3. Generate notes using the OpenAI API
    const aiGeneratedNotes = await generateNotesWithAI(transcript, metadata, apiKey);
    
    // 4. Format the final notes with video information
    return `# VidScribe Notes: ${metadata.title}\n## Channel: ${metadata.channelTitle}\n\n${aiGeneratedNotes}`;
  } catch (error) {
    console.error("Error generating notes:", error);
    throw error; // Propagate the error to be handled by the component
  }
}