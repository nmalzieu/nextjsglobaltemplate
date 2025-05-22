import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { trpcRouter } from "@/trpc/trpcRouter";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: trpcRouter,
    createContext: () => createTRPCContext({ req }),
  });

export { handler as GET, handler as POST };
