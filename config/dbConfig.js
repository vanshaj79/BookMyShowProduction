const mongoose = require('mongoose')
// mongoose is an Object data modelling library

const mongoURL = process.env.mongo_url

mongoose.connect(mongoURL)

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('DB Connected')
})

