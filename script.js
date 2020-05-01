const debounceEvent = (fn, wait = 1000, time) =>  (...args) =>
        clearTimeout(time, time = setTimeout(() => fn(...args), wait))

const getVideos = async () => fetch('https://maykbrito-videos.now.sh/api').then(res => res.json())

const sectionVideos = document.querySelector('#videos');
let videos = []
const videoElements = {}

const formatVideos = async () => {

    videos = await getVideos();


    videos.forEach(video =>{
        const a = document.createElement('a')
        a.setAttribute('target', '_blank')
        a.setAttribute('class', 'video')
        a.href = "https://www.youtube.com/watch?v=" + video.videoId
        a.setAttribute('id', video.videoId)

        const img = new Image()
        img.src = video.thumbnails.medium.url

        const h4 = document.createElement('h4')
        h4.innerHTML = video.title

        const description = document.createElement('p')
        description.innerText = video.description

        a.append(img)
        a.append(h4)
        a.append(description)

        videoElements[video.videoId] = a

        sectionVideos.appendChild(a)
    })


}

function handleKeyUp(event) {
    const search = event.target.value;

    if (videos) {
        const find = new RegExp(search, 'gi')
        videos.forEach(video => {
            if (video.title.match(find) || video.description.match(find)) {
                videoElements[video.videoId].classList.remove('hide')
            } else {
                videoElements[video.videoId].classList.add('hide')
            }
        })
    }
}

document.querySelector("input")
.addEventListener("keyup", debounceEvent(handleKeyUp, 500))


window.addEventListener('load', () => {
    formatVideos()
})
