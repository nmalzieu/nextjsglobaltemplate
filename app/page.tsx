import ClientComponent from "@/components/ClientComponent";
import { trpc } from "@/trpc/server";

export default async function Home() {
  const greeting = await trpc.hello({ name: "No12" });

  return (
    <div>
      <h1>Server side: {greeting.message}</h1>
      <ClientComponent />
    </div>
  );
}
