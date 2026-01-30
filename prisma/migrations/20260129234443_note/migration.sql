-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('RESEARCH', 'MEETING', 'FEEDBACK', 'TASK', 'BRAINSTORM', 'REFERENCE');

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "NoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ideaId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_ideaId_idx" ON "Note"("ideaId");

-- CreateIndex
CREATE INDEX "Note_type_idx" ON "Note"("type");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
