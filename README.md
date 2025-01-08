# TikTok Summarizer

A web application that extracts and displays information from TikTok videos using their oEmbed API.

## Features

- Paste any TikTok video URL to analyze
- Get detailed AI analysis including:
  - Problem the tutorial solves
  - Technical requirements
  - Step-by-step breakdown
  - Potential challenges
  - Target audience
- View video metadata and hashtags
- Clean, modern interface with proper formatting
- Mobile-friendly design

## Tech Stack

- **Frontend:**
  - React
  - Vite
  - Axios for API calls

- **Backend:**
  - Node.js
  - Express
  - TikTok oEmbed API

## Setup

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
2. Click "Get Summary"
3. View the extracted video information

## Coming Soon

- Instagram support

- More detailed video analytics

## Technologies Used

- Frontend:
  - React 18
  - Vite
  - Modern CSS with inline styles
  - Responsive design

- Backend:
  - Node.js
  - Express
  - Axios for API requests

- AI Integration:
  - Deepseek API for content analysis
  - Structured response formatting
  - Markdown parsing and cleanup

## Recent Updates

- Added AI-powered video analysis
- Improved response formatting
- Enhanced UI with better readability
- Added loading states
- Fixed text selection visibility
- Cleaned up markdown formatting
- Optimized for longer responses

## Development

The application is structured as a full-stack JavaScript application:

- `/client` - React frontend
- `/server` - Express backend
- Environment variables for API key management
- Error handling and loading states