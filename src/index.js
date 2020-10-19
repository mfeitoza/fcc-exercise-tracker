const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors');
const livereload = require('easy-livereload')
const mongoose = require('mongoose')

const { handleError } = require('./error')
const { fineHandler, users } = require('./handlers')

dotenv.config()
const app = express()

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors({optionsSuccessStatus: 200}))

app.use(bodyParser.urlencoded({extended: 'false'}))
app.use(bodyParser.json())

if (app.get('env') === 'development') {
    app.use(livereload({
        app: app
    }))
}

app.get('/api/exercise/users', users.findAll)
app.post('/api/exercise/new-user', users.create)

// error handler middleware
app.use((err, req, res, next) => {
    handleError(err, res)
})

const listener = app.listen(PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})