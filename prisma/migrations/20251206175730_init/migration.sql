/*
  Warnings:

  - You are about to drop the `albums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_albums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_tracks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tracks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_artistId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_albums" DROP CONSTRAINT "favorite_albums_albumId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_artists" DROP CONSTRAINT "favorite_artists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_tracks" DROP CONSTRAINT "favorite_tracks_trackId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_albumId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_artistId_fkey";

-- DropTable
DROP TABLE "albums";

-- DropTable
DROP TABLE "artists";

-- DropTable
DROP TABLE "favorite_albums";

-- DropTable
DROP TABLE "favorite_artists";

-- DropTable
DROP TABLE "favorite_tracks";

-- DropTable
DROP TABLE "tracks";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Albums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" TEXT,

    CONSTRAINT "Albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,

    CONSTRAINT "Tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist_Favorite" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "Artist_Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album_Favorite" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "Album_Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track_Favorite" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "Track_Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_Favorite_artistId_key" ON "Artist_Favorite"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_Favorite_albumId_key" ON "Album_Favorite"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_Favorite_trackId_key" ON "Track_Favorite"("trackId");

-- AddForeignKey
ALTER TABLE "Albums" ADD CONSTRAINT "Albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracks" ADD CONSTRAINT "Tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracks" ADD CONSTRAINT "Tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist_Favorite" ADD CONSTRAINT "Artist_Favorite_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album_Favorite" ADD CONSTRAINT "Album_Favorite_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track_Favorite" ADD CONSTRAINT "Track_Favorite_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
