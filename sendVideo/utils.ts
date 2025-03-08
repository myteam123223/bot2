import fetch from "node-fetch";

// Interfaz para la configuración de Scrolller
export interface ScrolllerConfig {
  hostsDown: null;
  filter: string;
  limit: number;
}

const variables = {
  hostsDown: null,
  filter: "VIDEO",
  limit: 10,
};

// Consulta original para descubrir subreddits aleatorios (se mantiene para compatibilidad)
const qrDiscoverSubreddits = `
query DiscoverSubredditsQuery( $filter: MediaFilter $limit: Int $iterator: String ) { discoverSubreddits( isNsfw: true filter: $filter limit: $limit iterator: $iterator ) { iterator items { __typename id url title secondaryTitle description createdAt isNsfw subscribers isComplete itemCount videoCount pictureCount albumCount isPaid username tags banner { url width height isOptimized } isFollowing children( limit: 2 iterator: null filter: SOUND disabledHosts: null homePage: true ) { iterator items { __typename id url title subredditId subredditTitle subredditUrl redditPath isNsfw albumUrl hasAudio fullLengthSource gfycatSource redgifsSource ownerAvatar username displayName isPaid tags isFavorite mediaSources { url width height isOptimized } blurredMediaSources { url width height isOptimized } } } } } } 
`;

// Nueva consulta para un subreddit específico
const qrSpecificSubreddit = `
query SubredditQuery($url: String! $filter: MediaFilter $limit: Int $iterator: String) {
  subreddit(url: $url) {
    id
    url
    title
    secondaryTitle
    description
    createdAt
    isNsfw
    subscribers
    isComplete
    itemCount
    videoCount
    pictureCount
    albumCount
    isPaid
    children(limit: $limit iterator: $iterator filter: $filter disabledHosts: null homePage: true) {
      iterator
      items {
        __typename
        id
        url
        title
        subredditId
        subredditTitle
        subredditUrl
        redditPath
        isNsfw
        albumUrl
        hasAudio
        fullLengthSource
        gfycatSource
        redgifsSource
        ownerAvatar
        username
        displayName
        isPaid
        tags
        isFavorite
        mediaSources {
          url
          width
          height
          isOptimized
        }
        blurredMediaSources {
          url
          width
          height
          isOptimized
        }
      }
    }
  }
}
`;

export async function getData(subredditName?: string): Promise<any> {
  // Crea el cuerpo de la solicitud
  let query = qrDiscoverSubreddits;
  let rqBody;
  
  // Si se proporciona un subreddit, ajusta la consulta y las variables
  if (subredditName) {
    query = qrSpecificSubreddit;
    rqBody = { 
      query, 
      variables: {
        url: `/r/${subredditName}`,
        filter: "VIDEO",
        limit: 10,
        iterator: null
      }
    };
  } else {
    // Crea el cuerpo de la solicitud para la consulta original
    rqBody = { query, variables };
  }
  
  // Realiza la solicitud
  const response = await fetch("https://api.scrolller.com/api/v2/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rqBody),
  });
  
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
}

export interface Post {
  title: string;
  mediaSources: Media[];
}

export interface Video {
  playUrl: string;
  cover: string;
  caption: string;
}

export interface Media {
  url: string;
}
