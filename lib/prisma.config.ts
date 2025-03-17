import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type AcceleratedPrismaClient = ReturnType<typeof getPrismaClient>;

const getPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

export type { AcceleratedPrismaClient };
