const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))
const app = express()
const port = process.env.PORT || 3000

// Define paths for Express 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setop handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath)) 

// app.com
app.get('', (req, res) => {
     res.render('index', {
         title: 'Weather App',
         name: 'Akansha Shrivas'
     })
})

// app.com/help
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: "This is some helpful text",
        title: "Help",
        name: 'Akansha Shrivas'
    })
})

// app.com/about
app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Akansha Shrivas'
    })
})

// app.com/weather
app.get('/weather', (req,res) => {
    if (!req.query.address){
        return res.send({
            error: 'You must provide address'
        })
    }
    address = req.query.address
    // res.send({
    //     forecast: "Temparature is 23 degree with 0.06% chance of rain",
    //     location: "Maharashtra",
    //     address
    // })
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
    
        // console.log('Data ', data)
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })            
            }
            res.send({
                location,
                forcast: forecastData,
                address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term '
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: 404,
        errorMessage: 'Help article not found',
        name: 'Akansha Shrivas'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: 404,
        errorMessage: 'Page not found',
        name: 'Akansha Shrivas'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})