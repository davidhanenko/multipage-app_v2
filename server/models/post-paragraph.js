const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postParagraphSchema = new Schema({
  paragraph: String
})

module.exports = mongoose.model('PostParagraph', postParagraphSchema)
