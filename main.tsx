import "jsr:@std/dotenv/load";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";
// import { upgradeWebSocket } from "hono/deno";

// import { startChatListener } from "./chat.ts";
import { Root } from "./src/components/Root.tsx";
import { bonkStore } from "./src/bonkStore.ts";

// startChatListener(bonkStore);

const app = new Hono();
app.get("/", (c) => c.html(<Root bonkState={bonkStore.state} />));
app.get("/*", serveStatic({ root: "./public" }));
app.get("/bonks", (c) => c.json(bonkStore));
// app.get(
//   "/bonksubscribe",
//   upgradeWebSocket((_c) => ({
//     onMessage(_event, ws) {
//       ws.send(JSON.stringify(bonkStore));
//     },
//   }))
// );

Deno.serve({ port: 8787 }, app.fetch);
