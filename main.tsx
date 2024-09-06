import "jsr:@std/dotenv/load";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

import { startChatListener } from "./src/chat.ts";
import { Root } from "./src/components/Root.tsx";
import { bonkStore } from "./src/bonkStore.ts";

startChatListener();

const app = new Hono();
app.get("/", (c) => c.html(<Root bonkState={bonkStore.state} />));
app.get("/*", serveStatic({ root: "./public" }));
app.get("/bonks", (c) => c.json(bonkStore));

Deno.serve({ port: 8787 }, app.fetch);
