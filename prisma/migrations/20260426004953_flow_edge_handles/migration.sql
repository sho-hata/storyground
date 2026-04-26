-- DropIndex
DROP INDEX "FlowEdge_flowId_fromNodeId_toNodeId_key";

-- AlterTable
ALTER TABLE "FlowEdge" ADD COLUMN     "sourceHandle" TEXT,
ADD COLUMN     "targetHandle" TEXT;
