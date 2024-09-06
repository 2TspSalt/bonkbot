import { Innertube, UniversalCache, YTNodes } from "youtubei";
import type { Channel } from "youtubei/parser";
import { parseBonk } from "./parse.ts";
import { bonkStore } from "./bonkStore.ts";

const luminId = "UCHXmyTZ3UFbhzpfVgVlrdgw";
const one_hour = 3600000;

let registered = false;

const getLiveStreams = async (channel: Channel) =>
  (await channel.getLiveStreams()).videos.map((v) => v.as(YTNodes.Video));

function rescheduleChatListener() {
  const nextTime = new Date(new Date().valueOf() + one_hour);
  console.log("No live streams found; trying again at ", nextTime);
  setTimeout(startChatListener, one_hour);
}

export async function startChatListener(reschedule: boolean): Promise<void> {
  if (registered) {
    return;
  }

  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  const lumin = await yt.getChannel(luminId);

  const streams = await getLiveStreams(lumin);
  const liveId = streams.filter((v) => v.is_live)[0]?.id;

  if (!liveId) {
    if (reschedule) {
      rescheduleChatListener();
    } else {
      console.log("No live streams found; not retrying");
    }
    return;
  }

  const info = await yt.getInfo(liveId);
  const livechat = info.getLiveChat();

  livechat.on("error", (error: Error) =>
    console.error("Live chat error:", error)
  );
  livechat.on("end", () => {
    console.info("This live stream has ended.");
    registered = false;
    if (reschedule) {
      rescheduleChatListener();
    }
  });

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
      if (bonk.type === "increment") {
        bonkStore.incrementBonk(bonk.name, bonk.count);
      }
      if (bonk.type === "set") {
        bonkStore.setBonk(bonk.name, bonk.count);
      }
    }
  });

  livechat.start();
  registered = true;
}
