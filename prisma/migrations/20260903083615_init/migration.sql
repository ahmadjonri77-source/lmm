/*
  Warnings:

  - You are about to drop the column `categoriesId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `password_resets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registration_otps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "password_resets" DROP CONSTRAINT "password_resets_userId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "categoriesId";

-- DropTable
DROP TABLE "password_resets";

-- DropTable
DROP TABLE "registration_otps";

-- CreateTable
CREATE TABLE "AssignedCourse" (
    "userId" INTEGER NOT NULL,
    "coursesId" INTEGER NOT NULL,

    CONSTRAINT "AssignedCourse_pkey" PRIMARY KEY ("userId","coursesId")
);

-- AddForeignKey
ALTER TABLE "AssignedCourse" ADD CONSTRAINT "AssignedCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedCourse" ADD CONSTRAINT "AssignedCourse_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
