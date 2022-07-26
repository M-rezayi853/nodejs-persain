const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  resnumber: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  payment: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('Payment', paymentSchema, 'Payment')
