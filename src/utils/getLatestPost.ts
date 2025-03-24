import { getCollection } from "astro:content"

export const getLatestPost = async () => {
    const latestPost = (await getCollection("posts"))
        .filter((post) => !post.data.draft)
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .slice(0, 1)
    return latestPost
}