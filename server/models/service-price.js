const mongoose = require('mongoose')
const Schema = mongoose.Schema


const priceSchema = new Schema({
 
  serviceTitle: String,
 
  singleTreatment: String,
  multiTreatments: String,

  unitPrice: [
    {
     type: Schema.Types.ObjectId,
     ref: 'Unit'
    }
  ]
})

module.exports = mongoose.model('Price', priceSchema)
