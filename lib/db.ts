import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { AcceleratedPrismaClient } from "./prisma.config";

declare global {
  // eslint-disable-next-line no-var
  var prisma: AcceleratedPrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

const db: PrismaClient = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;