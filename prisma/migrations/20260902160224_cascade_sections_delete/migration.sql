-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_mentorId_fkey";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
