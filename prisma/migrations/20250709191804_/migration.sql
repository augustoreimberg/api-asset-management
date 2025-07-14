/*
  Warnings:

  - The values [CARREGADOR,TECLADO,FONE] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `creteadAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `creteadAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Product` table. All the data in the column will be lost.
  - Added the required column `name` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('NOTEBOOK', 'CHARGER', 'MONITOR', 'MOUSE', 'KEYBOARD', 'HEADPHONE');
ALTER TABLE "Product" ALTER COLUMN "productType" TYPE "ProductType_new" USING ("productType"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "creteadAt",
DROP COLUMN "nome",
DROP COLUMN "updated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "creteadAt",
DROP COLUMN "updated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
