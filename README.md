# TikTok Summarizer

A web application that extracts and displays information from TikTok videos using their oEmbed API.

## Features

- Extract video information from TikTok URLs
- Display video details including:
  - Author information
  - Video description
  - Hashtags
  - Thumbnail preview
- Clean and responsive user interface
- Real-time validation of TikTok URLs

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

3. Start the servers:

bash

Start backend (from server directory)

npm start

Start frontend (from client directory)

npm run dev


4. Open `http://localhost:5173` in your browser

## Usage

1. Paste a TikTok video URL into the input field
2. Click "Get Summary"
3. View the extracted video information

## Coming Soon

- Instagram support
- Video content summarization
- More detailed video analytics