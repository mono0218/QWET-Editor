/*
  Warnings:

  - The primary key for the `Live` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Live` table. All the data in the column will be lost.
  - You are about to drop the column `liveConfigUrl` on the `Live` table. All the data in the column will be lost.
  - You are about to drop the column `motionId` on the `Live` table. All the data in the column will be lost.
  - You are about to drop the column `stageId` on the `Live` table. All the data in the column will be lost.
  - The primary key for the `Motion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Motion` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Motion` table. All the data in the column will be lost.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Room` table. All the data in the column will be lost.
  - The primary key for the `Stage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Stage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Live` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Motion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Stage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileUrl` to the `Live` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Live` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motionUUID` to the `Live` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stageUUID` to the `Live` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Live` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Motion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Motion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Motion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Stage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Live` DROP FOREIGN KEY `Live_motionId_fkey`;

-- DropForeignKey
ALTER TABLE `Live` DROP FOREIGN KEY `Live_stageId_fkey`;

-- AlterTable
ALTER TABLE `Live` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `liveConfigUrl`,
    DROP COLUMN `motionId`,
    DROP COLUMN `stageId`,
    ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `motionUUID` VARCHAR(191) NOT NULL,
    ADD COLUMN `stageUUID` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Motion` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `url`,
    ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Room` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Stage` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `url`,
    ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Live_uuid_key` ON `Live`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Motion_uuid_key` ON `Motion`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Room_uuid_key` ON `Room`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Stage_uuid_key` ON `Stage`(`uuid`);

-- AddForeignKey
ALTER TABLE `Live` ADD CONSTRAINT `Live_motionUUID_fkey` FOREIGN KEY (`motionUUID`) REFERENCES `Motion`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Live` ADD CONSTRAINT `Live_stageUUID_fkey` FOREIGN KEY (`stageUUID`) REFERENCES `Stage`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
