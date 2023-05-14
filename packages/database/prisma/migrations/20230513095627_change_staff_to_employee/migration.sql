-- AlterTable
ALTER TABLE "Employee" RENAME CONSTRAINT "Staff_pkey" TO "Employee_pkey";

-- RenameForeignKey
ALTER TABLE "Employee" RENAME CONSTRAINT "Staff_merchantId_fkey" TO "Employee_merchantId_fkey";

-- RenameIndex
ALTER INDEX "Staff_email_key" RENAME TO "Employee_email_key";

-- RenameIndex
ALTER INDEX "Staff_phone_key" RENAME TO "Employee_phone_key";
