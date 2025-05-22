import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createTRPCContext = cache(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (opts: { req: Request } | CreateNextContextOptions) => {
    return {};
  }
);
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
