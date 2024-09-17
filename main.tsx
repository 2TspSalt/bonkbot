import "jsr:@std/dotenv/load";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

import { startChatListener } from "./src/chat.ts";
import { Root } from "./src/components/Root.tsx";
import { bonkStore } from "./src/stores/bonkStore.ts";

startChatListener(true);

const app = new Hono();
app.get("/", (c) => c.html(<Root bonkState={bonkStore.state} />));
app.get("/*", serveStatic({ root: "./public" }));
app.get("/bonks", (c) => c.json(bonkStore));
app.get("/startStream", async (_c) => {
  await startChatListener(false);
})

Deno.serve({ port: 8787 }, app.fetch);
