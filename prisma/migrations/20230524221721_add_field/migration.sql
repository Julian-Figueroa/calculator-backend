/*
  Warnings:

  - Added the required column `user_balance` to the `Operation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "user_balance" DOUBLE PRECISION NOT NULL;
