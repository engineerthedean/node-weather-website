const request = require('request')

const geocode = (address, callback) => {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoiZGVhbmhhIiwiYSI6ImNsNThhcjdiZTF5ZG8zZG1lb3R5dDZva3EifQ.su0ZlEDQet5ApWH4_YbqtA&limit=1`
    request(url, { json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to location services', undefined)
        } else {
            const features = body.features
            if (features.length === 0) {
                callback('Unable to find coordinates for the given location', undefined)
            } else {
                const info = body.features[0]
                const center = info.center
                const location = info.place_name
                callback(undefined, { 
                    location, 
                    longitude: center[0], 
                    latitude: center[1] 
                })
            }
        }
    })
}

module.exports = geocode