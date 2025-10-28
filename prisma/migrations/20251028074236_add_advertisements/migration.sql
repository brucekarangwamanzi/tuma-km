-- CreateTable
CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "siteContentId" TEXT NOT NULL DEFAULT 'site_content',
    CONSTRAINT "advertisements_siteContentId_fkey" FOREIGN KEY ("siteContentId") REFERENCES "site_content" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
