import { Innertube, UniversalCache, YTNodes } from "youtubei";
import type { Channel } from "youtubei/parser"
import { parseBonk } from "./parse.ts";

const luminId = "UCHXmyTZ3UFbhzpfVgVlrdgw";

const getLiveStreams = async (channel: Channel) =>
  (await channel.getLiveStreams()).videos.map((v) => v.as(YTNodes.Video));

export async function startChatListener(
  bonkStore: Record<string, number>
): Promise<void> {
  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  const lumin = await yt.getChannel(luminId);

  const streams = await getLiveStreams(lumin);
  const liveId = streams.filter((v) => v.is_live)[0]?.id;

  if (!liveId) {
    throw new Error("No live streams");
  }

  const info = await yt.getInfo(liveId);
  const livechat = info.getLiveChat();

  livechat.on("error", (error: Error) =>
    console.error("Live chat error:", error)
  );
  livechat.on("end", () => console.info("This live stream has ended."));

  livechat.on("chat-update", (action) => {
    if (!action.is(YTNodes.AddChatItemAction)) return;
    const item = action.as(YTNodes.AddChatItemAction).item;
    if (item?.type !== "LiveChatTextMessage") return;
    const msg = item.as(YTNodes.LiveChatTextMessage);

    const hours = new Date(
      item.hasKey("timestamp") ? item.timestamp : Date.now()
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.debug(
      `${msg.author?.is_moderator ? "[MOD]" : ""}`,
      `${hours} - ${msg.author?.name.toString()}: ${msg.message.toString()}\n`
    );

    if (!msg.author?.is_moderator) return;
    const text = msg.message.toString();
    const bonk = parseBonk(text);
    if (bonk) {
      if (!bonkStore[bonk.name]) {
        bonkStore[bonk.name] = bonk.count;
      } else {
        bonkStore[bonk.name] = bonkStore[bonk.name] + bonk.count;
      }
    }
  });

  livechat.start();
}
