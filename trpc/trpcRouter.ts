import { baseProcedure, createTRPCRouter } from "./init";
import { z } from "zod";

export const trpcRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ input }) => {
      return { message: `Hello ${input.name}` };
    }),
});

// export type definition of API
export type AppRouter = typeof trpcRouter;
