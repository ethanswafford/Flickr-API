// To run this assignment, right click on index.html in the Visual Studio file explorer to the left
// and select "Open with Live Server"

// Your Code Here.

//apiKey = 0fa88275ab8da9dc47c295195a405ca9
//secret = 37abd4fa43b2a6ef

class FlickrImageGallery {
    constructor(location) {
        this.term = 'location'
        this.location = location
        this.container = document.getElementById('imageContainer')
        this.page = 1
        this.perPage = 6
        this.currentPhotoIndex = 0
        this.photos = []
        this.isLoading = false

        document.getElementById('next').addEventListener('click', this.loadNextImage.bind(this))
    }

    beginImageGallery() {
        setInterval(this.loadNextImage.bind(this), 2000)
    }

    loadNextImage() {
        if (this.isLoading) {
            return;
        }

        this.currentPhotoIndex += 1

        if (this.currentPhotoIndex < this.photos.length) {
            let imageObject = this.photos[this.currentPhotoIndex]
            this.renderImageObject(imageObject)
        } else {
            this.page += 1
            this.currentPhotoIndex = 0
            this.fetchImageFromFlickr()
        }
    }

    renderImageObject(imageObj) {
        let imageUrl = this.constructImageURL(imageObj);
        let img = document.createElement('img')
        img.src = imageUrl
        this.container.innerHTML = ''
        this.container.append(img)
    }

    loadFlickrResponse(parsedResponse) {
        this.setLoading(false)
        console.log(parsedResponse)
        this.photos = parsedResponse.photos.photo
        if (this.photos.length > 0) {
            let firstImageObject = this.photos[this.currentPhotoIndex]
            this.renderImageObject(firstImageObject)
        } else {
            this.container.innerHTML = 'End of Gallery'
        }
    }

    setLoading(isLoading) {
        let loadingSpan = document.getElementById('loading')
        if (isLoading) {
            this.isLoading = true
            loadingSpan.innerHTML = 'image is loading...'
        } else {
            this.isLoading = false
            loadingSpan.innerHTML = ''
        }

    }

    fetchImageFromFlickr() {
        let url = this.generateApiUrl();
        let fetchPromise = fetch(url)
        this.setLoading(true)
        fetchPromise
            .then(response => response.json())
            .then(parsedResponse => this.loadFlickrResponse(parsedResponse))
    }

    generateApiUrl() {
        return 'https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/' +
            '?api_key=0fa88275ab8da9dc47c295195a405ca9' +
            '&format=json' +
            '&nojsoncallback=1' +
            '&method=flickr.photos.search' +
            '&safe_search=1' +
            '&per_page=' + this.perPage +
            '&page=' + this.page +
            '&text=' + this.term +
            '&lat=' + this.location.latitude +
            '&lon=' + this.location.longitude;
    }

    constructImageURL(imageObj) {
        return "https://farm" + imageObj.farm +
            ".staticflickr.com/" + imageObj.server +
            "/" + imageObj.id + "_" + imageObj.secret + ".jpg";
    }
}

function getGeolocationAllow(data) {
    let location = data.coords;
    let gallery = new FlickrImageGallery(location)
    gallery.fetchImageFromFlickr()
}

function getGeolocationFail() {
    const fallbackLocation = { latitude: 48.8575, longitude: 2.2982 } // Paris
    let gallery = new myFlickrGallery(fallbackLocation)
    gallery.fetchImageFromFlickr()
}

navigator.geolocation.getCurrentPosition(getGeolocationAllow, getGeolocationFail)
console.log("hello friend")