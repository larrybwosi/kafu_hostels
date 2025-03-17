
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";
import { admin, customSession } from "better-auth/plugins";

import db from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: ["kafuhostels://"],
  plugins: [
    expo(),
    admin(),
    customSession(async ({ user, session }) => {
      const res = await db.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          gender: true,
        },
      });
      return {
        user: {
          ...user,
          gender: res?.gender,
        },
        session,
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
});