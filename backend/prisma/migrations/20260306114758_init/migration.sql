/*
  Warnings:

  - The primary key for the `enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `enrollments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `subject_id` on the `enrollments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `enrollments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sections` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `subject_id` on the `sections` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `video_progress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `video_progress` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `video_progress` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `video_id` on the `video_progress` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `videos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `section_id` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_enrollments" ("created_at", "id", "subject_id", "user_id") SELECT "created_at", "id", "subject_id", "user_id" FROM "enrollments";
DROP TABLE "enrollments";
ALTER TABLE "new_enrollments" RENAME TO "enrollments";
CREATE UNIQUE INDEX "enrollments_user_id_subject_id_key" ON "enrollments"("user_id", "subject_id");
CREATE TABLE "new_refresh_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "revoked_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_refresh_tokens" ("created_at", "expires_at", "id", "revoked_at", "token_hash", "user_id") SELECT "created_at", "expires_at", "id", "revoked_at", "token_hash", "user_id" FROM "refresh_tokens";
DROP TABLE "refresh_tokens";
ALTER TABLE "new_refresh_tokens" RENAME TO "refresh_tokens";
CREATE INDEX "refresh_tokens_user_id_token_hash_idx" ON "refresh_tokens"("user_id", "token_hash");
CREATE TABLE "new_sections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sections_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sections" ("created_at", "id", "order_index", "subject_id", "title", "updated_at") SELECT "created_at", "id", "order_index", "subject_id", "title", "updated_at" FROM "sections";
DROP TABLE "sections";
ALTER TABLE "new_sections" RENAME TO "sections";
CREATE UNIQUE INDEX "sections_subject_id_order_index_key" ON "sections"("subject_id", "order_index");
CREATE TABLE "new_subjects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_subjects" ("created_at", "description", "id", "is_published", "slug", "thumbnail", "title", "updated_at") SELECT "created_at", "description", "id", "is_published", "slug", "thumbnail", "title", "updated_at" FROM "subjects";
DROP TABLE "subjects";
ALTER TABLE "new_subjects" RENAME TO "subjects";
CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("created_at", "email", "id", "name", "password_hash", "role_id", "updated_at") SELECT "created_at", "email", "id", "name", "password_hash", "role_id", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE TABLE "new_video_progress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "video_id" INTEGER NOT NULL,
    "last_position_seconds" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "video_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "video_progress_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_video_progress" ("completed_at", "created_at", "id", "is_completed", "last_position_seconds", "updated_at", "user_id", "video_id") SELECT "completed_at", "created_at", "id", "is_completed", "last_position_seconds", "updated_at", "user_id", "video_id" FROM "video_progress";
DROP TABLE "video_progress";
ALTER TABLE "new_video_progress" RENAME TO "video_progress";
CREATE UNIQUE INDEX "video_progress_user_id_video_id_key" ON "video_progress"("user_id", "video_id");
CREATE TABLE "new_videos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtube_url" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "duration_seconds" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "videos_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_videos" ("created_at", "description", "duration_seconds", "id", "order_index", "section_id", "title", "updated_at", "youtube_url") SELECT "created_at", "description", "duration_seconds", "id", "order_index", "section_id", "title", "updated_at", "youtube_url" FROM "videos";
DROP TABLE "videos";
ALTER TABLE "new_videos" RENAME TO "videos";
CREATE UNIQUE INDEX "videos_section_id_order_index_key" ON "videos"("section_id", "order_index");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
