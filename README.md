# VidScribe

![VidScribe Logo](https://i.imgur.com/XYZ123.png)

VidScribe is an AI-powered tool that extracts key points from YouTube videos, allowing users to quickly get summaries without watching long videos. Perfect for researchers, students, and busy professionals who need to extract information efficiently.

## Features

- **YouTube Video Processing**: Extract content from any YouTube video using just the URL
- **AI-Powered Summarization**: Generate comprehensive, structured notes using OpenAI's GPT models
- **Multiple Export Formats**: Save your notes as TXT, DOCX, or PDF files
- **Custom Editing**: Edit generated notes before exporting
- **Dark/Light Mode**: Choose your preferred theme

## Technologies Used

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: OpenAI API (GPT-3.5 Turbo)
- **YouTube Data**: YouTube Data API v3
- **Document Generation**: 
  - DOCX: docx.js
  - PDF: jsPDF
- **Form Handling**: React Hook Form, Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js 16.8 or later
- YouTube API key
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xKarinSan/VidScribe.git
   cd VidScribe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Click the settings icon and add your OpenAI API key
2. Copy and paste a YouTube video link in the input field
3. Click "Generate Notes" and wait for the AI to process the video
4. Edit your notes and export them in your preferred format (.txt, .docx, or PDF)

## Deployment

This project is configured for static exports with Next.js:

```bash
npm run build
```

The output will be in the `out` directory, which can be deployed to any static hosting service.

## License

MIT

## Author

[xKarinSan](https://github.com/xKarinSan)