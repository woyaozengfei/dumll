var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var produtSchema = new Schema({
  "productId": { type: String },
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "productCatagory": String,
  "color": Array,
  "productDetailImage": Array,
  "productSecondName": String
},{
  usePushEach: true
  });

module.exports = mongoose.model('good',produtSchema);
