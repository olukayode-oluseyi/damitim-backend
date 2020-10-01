const mongoose = require('mongoose')
const Schema = mongoose.Schema


const OrderSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    lga: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },
    delievery_type: {
      type: String,
      required: true,
    },
    cart: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Orders', OrderSchema)