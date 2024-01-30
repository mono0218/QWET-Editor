/*
  Warnings:

  - You are about to drop the column `avaterId` on the `Live` table. All the data in the column will be lost.
  - You are about to drop the column `lisence` on the `Live` table. All the data in the column will be lost.
  - Added the required column `avatarId` to the `Live` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Live` DROP COLUMN `avaterId`,
    DROP COLUMN `lisence`,
    ADD COLUMN `avatarId` VARCHAR(191) NOT NULL,
    ADD COLUMN `license` VARCHAR(191) NULL;
