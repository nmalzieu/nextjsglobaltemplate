import "server-only"; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "@/app/api/trpc/query-client";
import { trpcRouter } from "./trpcRouter";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(trpcRouter)(createTRPCContext as any);
export const { trpc, HydrateClient } = createHydrationHelpers<
  typeof trpcRouter
>(caller, getQueryClient);
