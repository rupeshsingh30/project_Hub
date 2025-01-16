const mongoose = require('mongoose')

async function connectToMongoDb(url){
    const mongoConnect =  mongoose.connect(url)
    return mongoConnect
}

module.exports = {connectToMongoDb}