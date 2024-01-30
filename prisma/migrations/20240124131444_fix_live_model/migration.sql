/*
  Warnings:

  - Added the required column `movieUrl` to the `Live` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Live` ADD COLUMN `movieUrl` VARCHAR(191) NOT NULL,
    MODIFY `avaterId` VARCHAR(191) NOT NULL;
