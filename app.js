require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const setMiddleware = require('./middleware/middleware')

// import routes
// const authRoutes = require('./routes/authRoute')
// const dashboardRoutes = require('./routes/dashboardRoute')
const setRoutes = require('./routes/routes')

// // import middleware
// const {bindUserWithRequest} = require('./middleware/authMiddleware')
// const setLocals = require('./middleware/setLocals')

// Playground routes: for testing
//const validatorRoutes = require('./playground/validator')



const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}
@cluster0.18nptvm.mongodb.net/?retryWrites=true&w=majority`

// const store = new MongoDBStore({
//     uri: MONGODB_URI,
//     collection: 'mySessions',
//     expires: 1000 * 60 * 60 * 24
// });

const app = express()

// setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')



// app.use('/auth', authRoutes)
// app.use('/dashboard', dashboardRoutes)
// //app.use('/playground', validatorRoutes) // for testing

// app.get('/', (req, res, next) => {
   
//     res.json({
//         massage:' hello world'
//     })
// })

// Using middleware from middleware Directory
setMiddleware(app)

// Using Routes from route Directory//
setRoutes(app)

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render.invers('pages/error/404',{flashMessage: {} })
    }
    console.log(chalk.red(error.message))
    console.log(error);
    res.render('pages/error/500',{flashMessage: {} })
})


const PORT = process.env.PORT || 9090
mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true
    })
    .then(() => {
        console.log(chalk.green.inverse('detabase connecte'))
        app.listen(PORT, () => {
            console.log(`suver is running on port ${PORT}`)
        })
        
    })
    .catch(e => {
        return console.log(e);
    })