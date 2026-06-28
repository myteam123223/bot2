import { Media, Post, Video, getData } from "./utils"

export const search = async function (_subredditName?: string): Promise<Video[]> {
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
  const items = data?.data?.getSubredditChildren?.items
  if (!Array.isArray(items)) {
    console.log("Sin posts en el subreddit:", JSON.stringify(data)?.slice(0, 300))
    return []
  }
  console.log(`Posts en el subreddit -> ${items.length}`)
  return items
}

function getVideos(posts: Post[]): Video[] {
  const listVids: Video[] = []
  for (const post of posts) {
    const v = getVideo(post)
    if (v.playUrl !== "") listVids.push(v)
  }
  console.log(`Vídeos válidos -> ${listVids.length}`)
  return listVids.sort(() => Math.random() - 0.5)
}

function getVideo(post: any): Video {
  const sources: Media[] = post?.mediaSources ?? []

  // Mejor MP4 disponible (mayor anchura)
  const mp4 = sources
    .filter((m) => m?.type === "MP4" || (m?.url ?? "").includes(".mp4"))
    .sort((a, b) => (b?.width ?? 0) - (a?.width ?? 0))[0]

  // Portada (primer JPEG)
  const cover = sources.find((m) => m?.type === "JPEG" || (m?.url ?? "").includes(".jpg"))

  return {
    playUrl: mp4 ? mp4.url : "",
    cover: cover ? cover.url : "",
    caption: post?.title ?? "",
  }
}
