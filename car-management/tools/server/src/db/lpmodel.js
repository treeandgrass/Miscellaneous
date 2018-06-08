// 索引model

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LPSchema = new Schema({
    lpcode: String,
    time: { type: Date, default: Date.now },
    count: {type: 'number', default: 1}
})

mongoose.model('LPModel', LPSchema)



