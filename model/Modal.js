
  var mongoose = require("mongoose");
  var Schema = mongoose.Schema;

  var CakeSchema = new Schema({
      name: {       
          type: String,
          required: true
      },
      amount: {
          type: Number,
          required: true
      },
      inCart: {
          type: Boolean,
          default: false
      },
      count: {
          type: Number,
          default: 1
      },
      image: {
          type: String,
          required: true
      },
      category: {
          type: String,
          required: true
      },
      customerFav: {
          type: Boolean,
          default: false
      },
      total: {
          type: Number,
          default: 0
      }
  });

 

  module.exports = mongoose.model("Cakes",  CakeSchema);