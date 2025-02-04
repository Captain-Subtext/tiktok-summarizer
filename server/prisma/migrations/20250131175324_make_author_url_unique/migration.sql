/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `TestAuthor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TestAuthor_url_key" ON "TestAuthor"("url");
