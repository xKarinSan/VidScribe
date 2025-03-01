// Function to extract YouTube video ID from URL
export function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Function to fetch video transcript and generate notes using OpenAI
export async function generateNotes(videoId: string, apiKey: string): Promise<string> {
  try {
    // In a real implementation, we would:
    // 1. Fetch the video transcript from YouTube using an API
    // 2. Send the transcript to OpenAI for summarization
    
    // For this demo, we'll simulate the API call with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response for demonstration purposes
    return `# Notes from YouTube Video (ID: ${videoId})

## Key Points

1. **Introduction to the Topic**
   - Brief overview of the main subject
   - Historical context and importance

2. **Main Concepts**
   - First important concept explained in detail
   - Second concept with practical examples
   - Relationship between different ideas presented

3. **Practical Applications**
   - How these concepts apply to real-world scenarios
   - Case studies mentioned in the video
   - Tools and techniques discussed

4. **Challenges and Limitations**
   - Potential obstacles when implementing these ideas
   - Common misconceptions addressed in the video
   - Areas requiring further research

5. **Conclusion**
   - Summary of the main takeaways
   - Future directions suggested by the presenter
   - Final thoughts and recommendations

## Additional Resources
- Related books mentioned: "Example Book Title" by Author Name
- Websites referenced: example.com
- Suggested follow-up videos on similar topics

## Personal Notes
(Add your own thoughts and questions here)
`;
  } catch (error) {
    console.error("Error generating notes:", error);
    throw new Error("Failed to generate notes from the YouTube video");
  }
}