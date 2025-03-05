import fetch from "node-fetch"
const variables = {
	hostsDown: null,
	filter: "VIDEO",
	limit: 10,
}

const qrDiscoverSubreddits = `
query DiscoverSubredditsQuery( $filter: MediaFilter $limit: Int $iterator: String ) { discoverSubreddits( isNsfw: true filter: $filter limit: $limit iterator: $iterator ) { iterator items { __typename id url title secondaryTitle description createdAt isNsfw subscribers isComplete itemCount videoCount pictureCount albumCount isPaid username tags banner { url width height isOptimized } isFollowing children( limit: 2 iterator: null filter: SOUND disabledHosts: null homePage: true ) { iterator items { __typename id url title subredditId subredditTitle subredditUrl redditPath isNsfw albumUrl hasAudio fullLengthSource gfycatSource redgifsSource ownerAvatar username displayName isPaid tags isFavorite mediaSources { url width height isOptimized } blurredMediaSources { url width height isOptimized } } } } } } 
`

export async function getData(): Promise<any> {
	let rqBody = { query: qrDiscoverSubreddits, variables: variables }
	const response = await fetch("https://api.scrolller.com/api/v2/graphql", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(rqBody),
	})
	console.log(response)
	const data = await response.json()
	console.log(data)
	return data
}

export interface Post {
	title: string
	mediaSources: []
}

export interface Video {
	playUrl: string
	cover: string
	caption: string
}

export interface Media {
	url: string
}
