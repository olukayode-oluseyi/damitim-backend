const { boolean } = require("@hapi/joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    last_name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    address: {
      type: String,
      min: 6,
      max: 255,
    },
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },

    confirmed: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: Number,
      required: true,
      min: 9,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
