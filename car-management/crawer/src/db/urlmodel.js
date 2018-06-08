// 索引model

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const indexSchema = new Schema({
    url: String
})

mongoose.model('URLModel', indexSchema)



