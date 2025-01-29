# TikTok Summarizer

A tool that uses AI to generate summaries of TikTok videos.

## Features

### Current Features (v0.4.2)
- Generate AI summaries of TikTok videos based on metadata
- Support for both normal and experimental test modes
- Easy-to-use interface for pasting TikTok URLs
- Display of video metadata including:
  - Author information
  - Video description
  - Hashtags
  - Video ID
  - Thumbnail preview
- Improved error handling and feedback
- Click-to-play video embeds
- Retry functionality for failed requests
- Enhanced loading states and progress indicators
- Fixed routing and component stability

### Normal Mode
- Provides structured analysis based on video metadata
- Attempts to infer video content from available information
- Formats response with clear sections and bullet points

### Test Mode (Experimental)
- Alternative analysis approach
- More explicit about limitations
- Useful for testing new prompt strategies
- Clearly indicates when content can't be directly accessed
- Queues videos for detailed analysis

## Coming Soon (v0.5.0)
- Test dashboard for monitoring analysis progress
- Queue status visualization
- Detailed analysis tracking
- Enhanced video content analysis
- Audio transcription
- Visual frame analysis

## Installation & Setup

1. Clone the repository:

bash
git clone https://github.com/Captain-Subtext/tiktok-summarizer.git
cd tiktok-summarizer


2. Install dependencies:

bash:tiktok-summarizer/README.md

Install frontend dependencies

cd client

npm install

Install backend dependencies

cd ../server

npm install


### 3. Environment Setup (Important!)

1. In the `server` directory, copy the environment template:
bash:tiktok-summarizer/README.md
cp .env.example .env

2. Edit the `.env` file and add your Deepseek API key:
env
DEEPSEEK_API_KEY=your_api_key_here

**Note:** Never commit the `.env` file to version control. It's already in `.gitignore` for security.

4. Start the application

bash

Start backend (from server directory)

npm start

In a new terminal, start the client (from client directory)

cd client

npm run dev

4. Open `http://localhost:5173` in your browser

## Usage

1. Paste a TikTok video URL into the input field
2. Choose between Normal or Test mode using the toggle
3. Click "Get Summary" or "Get Test Summary"
4. View the AI-generated analysis of the video

## Technical Details
- Frontend: React with TypeScript
- Backend: Node.js/Express
- AI: DeepSeek API for content analysis
- TikTok: oEmbed API for metadata extraction