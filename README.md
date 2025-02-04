# TikTok Summarizer

A tool that uses AI to generate summaries of TikTok videos.

## Features

### Current Features (v5.0)
- New Test Dashboard
  - Grid view of all processed videos
  - Status tracking (processing, completed, failed)
  - Paginated video listing
  - Filter videos by status
  - Quick access to summaries
- DeepSeek AI Integration
  - Enhanced summary generation
  - Improved content analysis
  - Better error handling
- Database Integration
  - Persistent storage of video data
  - Track video processing status
  - Store author information
- Complete mobile-responsive redesign
  - Responsive video grid layout
    - Desktop: Auto-fill grid (3+ cards based on width)
    - Tablet/Mobile (480px-768px): 2 cards per row
    - Mobile (<480px): 1 card per row
  - Enhanced mobile navigation
    - Integrated folder menu in navbar
    - Improved dropdown interactions
  - Optimized video card design
    - Square thumbnails for better space usage
    - Responsive typography
    - Improved processing state indicator
- All features from v0.4.2:
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
- New Dashboard interface for tracking all test summaries
- Status indicators for processing state
- Retry functionality for failed summaries
- Batch processing support

## Coming Soon (v5.1)
- Enhanced video content analysis
- Audio transcription
- Visual frame analysis
- Additional mobile optimizations
- Improved accessibility features

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

3. Set up the database:
```bash
cd server
npx prisma migrate dev
```

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
- Database: PostgreSQL with Prisma ORM
- Status Tracking: Real-time processing status updates
- Error Handling: Improved error feedback and retry mechanisms

## Database Management

### Backup and Restore
```bash
# Create a backup of the database
cd server
npx prisma db dump --file backup_$(date +%Y%m%d).sql

# To restore from a backup
npx prisma db restore --file backup_YYYYMMDD.sql
```

### Complete Backup Process
1. Backup database schema and data:
```bash
# Backup both schema and data
pg_dump -U postgres -d tiktok_summarizer > full_backup_$(date +%Y%m%d).sql

# Backup only data (useful for migrations)
pg_dump -U postgres -d tiktok_summarizer --data-only > data_backup_$(date +%Y%m%d).sql
```

2. Backup Prisma files:
```bash
# Copy these directories/files
- prisma/migrations/     # Schema version history
- prisma/schema.prisma  # Current schema
- .env                  # Save separately (contains credentials)
```

### Restoration Process
1. Restore database:
```bash
# Create fresh database if needed
createdb tiktok_summarizer

# Restore from backup
psql -U postgres -d tiktok_summarizer < full_backup_YYYYMMDD.sql
```

2. Verify Prisma state:
```bash
# Ensure Prisma is in sync
npx prisma migrate status
npx prisma generate
```

### Schema Management
```bash
# After making changes to schema.prisma
npx prisma migrate dev --name descriptive_name

# Apply migrations on production/other environments
npx prisma migrate deploy

# Reset database (caution: deletes all data)
npx prisma migrate reset
```

### Troubleshooting

#### Common Issues

1. **Migration Failed**
```bash
# Reset migration state
npx prisma migrate reset --force

# If still failing, try:
npx prisma db push --force-reset
```

2. **Database Connection Issues**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running:
```bash
pg_isready
```

3. **Prisma Client Issues**
```bash
# Regenerate Prisma Client
npx prisma generate

# Clear Prisma cache
rm -rf node_modules/.prisma
npm install
```

4. **Data Inconsistency**
```bash
# Check database state
npx prisma migrate status

# Reset if needed (caution: deletes data)
npx prisma migrate reset
```

#### Prevention Tips
- Always backup before migrations
- Test migrations in development
- Keep migration files in version control
- Document schema changes

### Version Control Notes
- Migration files in `prisma/migrations/` are tracked in Git
- This enables schema version control and rollbacks
- Database files and .env are excluded from Git
- Always test migrations in development before production

### First-Time Setup
```bash
cd server
npx prisma migrate dev     # Creates database and applies migrations
npx prisma generate       # Generates Prisma Client
```

## Usage

1. Paste a TikTok video URL into the input field
2. Choose between Normal or Test mode using the toggle
3. Click "Get Summary" or "Get Test Summary"
4. View the AI-generated analysis of the video