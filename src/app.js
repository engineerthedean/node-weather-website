const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Setup handlebars engine and views location
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath)

const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Dean'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Dean'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Dean',
        message: 'This is a test message'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: 'Address must be provided'
        })
    }

    geocode(address, (geocodeError, geocodeData) => {
        if (geocodeError) {
            return res.send({
                error: geocodeError
            })
        }
    
        const { longitude, latitude, location } = geocodeData
        forecast(longitude, latitude, (forecastError, forecastData) => {
            if (forecastError) {
                return res.send({
                    error: forecastError
                })
            }

            const { description, humidity, temperature } = forecastData
            const forecastString = `It is currently ${description.toLowerCase()} outside. The temperature is ${temperature.actual} degrees, while it's perceived as ${temperature.perceived} degrees. The humidity stands at ${humidity}%.`
            res.send({
                location,
                forecast: forecastString
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Help',
        name: 'Dean',
        destination: 'Help article'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: 'Generic',
        name: 'Dean',
        destination: 'Page'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})