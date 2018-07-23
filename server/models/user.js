var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd": String,
  "type": String,
  "orderList": Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice": Number,
      "productImage": String,
      "checked": String,
      "productNum": Number,
      "color": String,
      "version": String
    }
  ],
  "addressList":[
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    }
  ],
  "textList": Array
},{
  usePushEach: true
  });

module.exports = mongoose.model("user",userSchema);
