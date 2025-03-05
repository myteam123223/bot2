import { schedule } from "@netlify/functions"
import { sendVideos } from "../../sendVideo/index"
import { N_VIDEOS } from "../../sendVideo/myConfig"

let frequency = "0 */2 * * *"

export const handler = schedule(frequency, async () => {
	console.log("Handler Init...")
	await sendVideos(N_VIDEOS)
	console.log("Handler Finish...")
	return {
		statusCode: 200,
	}
})
