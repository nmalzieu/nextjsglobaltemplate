"use client";

import { trpc } from "@/trpc/client";
import { withTRPC } from "@/trpc/hoc";

const ClientComponent = () => {
  const { data, isLoading } = trpc.hello.useQuery({ name: "No12" });
  return (
    <div>
      <h1>ClientCompoent</h1>
      <div>{isLoading ? "Loading" : data?.message}</div>
    </div>
  );
};

export default withTRPC(ClientComponent);
