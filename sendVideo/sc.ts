import { Media, Post, Video, getData } from "./utils"

export const search = async function (): Promise<Video[]> {
	try {
		const response = await getData()
		const posts: Post[] = getAllPostFromSubreddits(response)
		const videos: Video[] = getVideos(posts)
		return videos
	} catch (error) {
		console.log(`Error Search`, error)
		return []
	}
}

function getAllPostFromSubreddits(data: any): Post[] {
	const subreddits = data.data.discoverSubreddits.items

	console.log(
		`Subreddits get -> Name:${Object.keys(subreddits)} - Total:${
			Object.keys(subreddits).length
		} `
	)
	const allPost: Post[] = Object.values(subreddits).flatMap(
		(obj: any) => obj.children.items
	)
	console.log(`Post get -> Total:${allPost.length}`)
	return allPost
}

function getVideos(posts: Post[]) {
	let listVids: Video[] = []
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i]
		const video = getVideo(post)
		if (video.playUrl != "") {
			listVids.push(video)
		}
	}

	let rdListVids = listVids.sort((a, b) => Math.random() - 0.5)
	return rdListVids
}

function getVideo(post: Post): Video {
	let videoTitle = post.title
	let videoUrl = ""
	let videoCover = ""

	if (post.mediaSources != null) {
		for (let k = 0; k < post.mediaSources.length; k++) {
			const media: Media = post.mediaSources[k]

			if (media.url.includes(".scrolller.com/")) {
				if (media.url.includes(".mp4")) {
					videoUrl = media.url
				}

				if (media.url.includes(".jpg")) {
					videoCover = media.url
				}
			} else {
				if (media.url.includes(".mp4")) {
					let pathId = media.url.split("/").pop()
					videoUrl = `https://static.scrolller.com/proton/${pathId}`
					videoCover = `https://static.scrolller.com/proton/${pathId!.replace(
						".mp4",
						".jpg"
					)}`
					break
				}
			}
		}
	}

	let newVideo: Video = {
		playUrl: videoUrl,
		cover: videoCover,
		caption: videoTitle,
	}
	return newVideo
}

