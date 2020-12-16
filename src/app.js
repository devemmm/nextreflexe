require('./database/reflDb')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const hbs = require('hbs')
const userRouters = require('./routers/userRouter')
const publicRouters = require('./routers/publicRoutes')
const adminRouters = require('./routers/adminRoutes')

const port = process.env.PORT || 3000

const app = express()

// Define Path for Expore Configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const publicDirectoryPathFiles = path.join(__dirname, '../src/public')
const viewsPath = path.join(__dirname, '../templete/views')
const partialPath = path.join(__dirname, '../templete/partials')

// Set Up handbars Engine and views Location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirectoryPath))
app.use(express.static(publicDirectoryPathFiles))

// Set and configure Partial in hbs
hbs.registerPartials(partialPath)

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('secret'))
app.use(session({ cookie: { maxAge: 3600 } }))

// flash message middleware
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

// Router Middleware

app.use(userRouters)
app.use(publicRouters)
app.use(adminRouters)

app.listen(port, () => console.log(`Server is running on port ${port}`))