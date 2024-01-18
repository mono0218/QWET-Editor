/*
  Warnings:

  - You are about to drop the column `configId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `Config` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `liveId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Config` DROP FOREIGN KEY `Config_motionId_fkey`;

-- DropForeignKey
ALTER TABLE `Config` DROP FOREIGN KEY `Config_stageId_fkey`;

-- AlterTable
ALTER TABLE `Room` DROP COLUMN `configId`,
    ADD COLUMN `liveId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Config`;

-- CreateTable
CREATE TABLE `Live` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `lisence` VARCHAR(191) NULL,
    `avaterId` INTEGER NOT NULL,
    `motionId` INTEGER NOT NULL,
    `stageId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `liveConfigUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Live` ADD CONSTRAINT `Live_motionId_fkey` FOREIGN KEY (`motionId`) REFERENCES `Motion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Live` ADD CONSTRAINT `Live_stageId_fkey` FOREIGN KEY (`stageId`) REFERENCES `Stage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Live` ADD CONSTRAINT `Live_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
