// 4. Actualización de sendVideo/index.ts
// Este archivo contiene la función principal

import "dotenv/config";
import { Telegraf } from "telegraf";
const bot = new Telegraf(process.env.BOT_TOKEN!);
const idChat = process.env.CHAT_ID!;
import { search } from "./sc";
import { Video } from "./utils";

export const sendVideos = async function (nVideos: number, subredditName?: string) {
  console.log(`Send ${nVideos} videos${subredditName ? ` from r/${subredditName}` : ''}`);
  let videosSent = 0;

  await search(subredditName).then(async (videos: Video[]) => {
    console.log(`${videos.length} videos found`);

    for (let i = 0; i < videos.length; i++) {
      if (videosSent == nVideos) return;
      const video = videos[i];

      try {
        bot.telegram.sendVideo(idChat, video.playUrl);
        videosSent += 1;
        console.log(`videosSent ${videosSent}`);
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        console.log(error);
      }
    }
  });
};
