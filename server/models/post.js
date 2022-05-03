const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  postTitle: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  postImage: {
    url: String,
    id: String
  },

  mainPostParagraph: String,

  postParagraph: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PostParagraph'
    }
  ]
})

module.exports = mongoose.model('Post', postSchema)
