// 5. Actualización de netlify/functions/send-video.ts
// Este archivo contiene el manejador de función programada de Netlify

import { schedule } from "@netlify/functions";
import { sendVideos } from "../../sendVideo/index";
import { N_VIDEOS, SUBREDDIT } from "../../sendVideo/myConfig";

let frequency = "0 */2 * * *";

export const handler = schedule(frequency, async () => {
  console.log("Handler Init...");
  await sendVideos(N_VIDEOS, SUBREDDIT);
  console.log("Handler Finish...");
  return {
    statusCode: 200,
  };
});
