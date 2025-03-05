import "dotenv/config"
import { Telegraf } from "telegraf"
const bot = new Telegraf(process.env.BOT_TOKEN!)
const idChat = process.env.CHAT_ID!
import { search } from "./sc"
import { Video } from "./utils"

export const sendVideos = async function (nVideos: number) {
	console.log(`Send ${nVideos} videos`)
	let videosSent = 0

	await search().then(async (videos: Video[]) => {
		console.log(`${videos.length} videos found`)

		for (let i = 0; i < videos.length; i++) {
			if (videosSent == nVideos) return
			const video = videos[i]

			try {
				bot.telegram.sendVideo(idChat, video.playUrl)
				videosSent += 1
				console.log(`videosSent ${videosSent}`)
				await new Promise((resolve) => setTimeout(resolve, 800))
			} catch (error) {
				console.log(error)
			}
		}
	})
}

