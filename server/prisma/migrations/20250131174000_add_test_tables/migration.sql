-- CreateTable
CREATE TABLE "TestVideo" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "authorId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hashtags" TEXT[],
    "thumbnail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAuthor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "TestAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAnalysis" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestVideo_videoId_key" ON "TestVideo"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "TestAnalysis_videoId_key" ON "TestAnalysis"("videoId");

-- AddForeignKey
ALTER TABLE "TestVideo" ADD CONSTRAINT "TestVideo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TestAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnalysis" ADD CONSTRAINT "TestAnalysis_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "TestVideo"("videoId") ON DELETE RESTRICT ON UPDATE CASCADE;
