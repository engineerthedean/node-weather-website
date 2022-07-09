const request = require('request')

const forecast = (longitude, latitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=664093363f3cf3112c86caf4a7f98618&query=${longitude},${latitude}`
    
    request(url, { json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to the weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            const current = body.current
            const actualTemp = current.temperature
            const perceivedTemp = current.feelslike
            const humidity = current.humidity
            const description = current.weather_descriptions[0]
            callback(undefined, {
                description,
                humidity,
                temperature: {
                    actual: actualTemp,
                    perceived: perceivedTemp
                }
            })
        }
    })
}

module.exports = forecast