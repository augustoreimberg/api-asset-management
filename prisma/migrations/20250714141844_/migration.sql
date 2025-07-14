/*
  Warnings:

  - Added the required column `reasonBack` to the `ProductEmployee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductEmployee" ADD COLUMN     "reasonBack" TEXT NOT NULL;
