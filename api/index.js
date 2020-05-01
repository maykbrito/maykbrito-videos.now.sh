const axios = require('axios');

const GOOGLE_KEY = process.env.GOOGLE_KEY

let cache,
    url = `https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=snippet&playlistId=PLeLKux5eT3kaXJ4p_P96I9lr7qEpnbWTY&key=${GOOGLE_KEY}`

const getVideos = pageToken =>
    axios.get(url + (pageToken ? `&pageToken=${pageToken}` : '')).then( res => res.data)

const organizeVideos = items => items.map( ({snippet}) => {
    return {
        publishedAt: snippet.publishedAt,
        title: snippet.title,
        description: snippet.description,
        thumbnails: snippet.thumbnails,
        videoId: snippet.resourceId.videoId
    }
})

module.exports = async (req, res) => {
    if (cache) res.json(cache)

    try {
        let data = await getVideos(),
            videos = organizeVideos(data.items)

        while(data.nextPageToken) {
            data = await getVideos(data.nextPageToken)
            videos = videos.concat(organizeVideos(data.items))
        }

        cache = videos

        res.json(videos)
    } catch (error) {
        res.send("ERROR")
    }
}
