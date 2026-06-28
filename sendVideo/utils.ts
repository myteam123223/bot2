import fetch from "node-fetch"

const SCROLLLER_ENDPOINT = "https://api.scrolller.com/admin"

// Query actual de Scrolller (la misma que usa su web)
const qrDiscover = `
 query DiscoverFilteredSubredditsQuery( $filter: GalleryFilter $sortBy: GallerySortBy $limit: Int! $childLimit: Int! $iterator: String $includeFilters: [Int!] $excludeFilters: [Int!] $isNsfw: Boolean! ) { discoverFilteredSubreddits( data: { isNsfw: $isNsfw filter: $filter limit: $limit childLimit: $childLimit iterator: $iterator includeFilters: $includeFilters excludeFilters: $excludeFilters sortBy: $sortBy } ) { iterator items { __typename id url title isNsfw children { iterator items { __typename id url title redditPath isNsfw hasAudio duration mediaSources { url width height isOptimized type } } } } } } 
`

export async function getData(_subredditName?: string): Promise<any> {
  const variables = {
    filter: "VIDEO",      // solo vídeos
    sortBy: "RANDOM",
    limit: 20,            // nº de subreddits que descubre
    childLimit: 5,        // nº de posts por subreddit
    iterator: null,
    includeFilters: [],
    excludeFilters: [],
    isNsfw: true,         // <-- contenido adulto
  }

  const response = await fetch(SCROLLLER_ENDPOINT, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      // Headers de navegador para no comernos un bloqueo de Cloudflare desde Netlify
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Origin: "https://scrolller.com",
      Referer: "https://scrolller.com/",
    },
    body: JSON.stringify({ query: qrDiscover, variables }),
  })

  if (!response.ok) {
    console.log(`Scrolller -> ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  if ((data as any)?.errors) console.log("GraphQL errors:", JSON.stringify((data as any).errors))
  return data
}

export interface Media {
  url: string
  width: number
  height: number
  isOptimized: boolean
  type: string // "MP4" | "JPEG" | "WEBP"...
}

export interface Post {
  title: string
  mediaSources: Media[]
}

export interface Video {
  playUrl: string
  cover: string
  caption: string
}
