/*
  Warnings:

  - You are about to drop the column `liveId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `userLimit` on the `Room` table. All the data in the column will be lost.
  - Added the required column `avatarUrl` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motionUUID` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieUrl` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stageUUID` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Room` DROP COLUMN `liveId`,
    DROP COLUMN `userLimit`,
    ADD COLUMN `avatarUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `motionUUID` VARCHAR(191) NOT NULL,
    ADD COLUMN `movieUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `stageUUID` VARCHAR(191) NOT NULL;
