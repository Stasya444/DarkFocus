-- DropForeignKey
ALTER TABLE "Photographer" DROP CONSTRAINT "Photographer_userId_fkey";

-- AddForeignKey
ALTER TABLE "Photographer" ADD CONSTRAINT "Photographer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
