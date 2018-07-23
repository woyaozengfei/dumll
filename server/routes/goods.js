var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var multer = require('multer');
var goods = new Goods;
var fs = require('fs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../static')
  },
  filename: function (req, file, cb) {
    var fileformat = (file.originalname).split('.');
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileformat[fileformat.length - 1]);
  }
});
var upload = multer({ storage: storage })

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/duMall');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

//查询商品列表数据
router.get("/list", function (req,res,next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let productChecked = req.param("productCatagory");
  let productName = req.param("productName");
  let reg = new RegExp(productName, 'i');
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  var priceGt = '',priceLte = '';
  let params = {};
  if(productChecked!='all'){
    // switch (productCatagory){
    //   case '0':priceGt = 0;priceLte=100;break;
    //   case '1':priceGt = 100;priceLte=500;break;
    //   case '2':priceGt = 500;priceLte=1000;break;
    //   case '3':priceGt = 1000;priceLte=5000;break;
    // }
    if (productName !== '') {
      params = {
        productCatagory: productChecked,
        productName: {$regex : reg}
      }
    } else {
      params = {
        productCatagory: productChecked
      }
    }
  } else {
    if (productName !== '') {
      params = {
        productName: {$regex : reg}
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
      if(err){
          res.json({
            status:'1',
            msg:err.message
          });
      }else{
          res.json({
              status:'0',
              msg:'',
              result:{
                  count:doc.length,
                  list:doc
              }
          });
      }
  })
});

//加入到购物车
router.post("/addCart", function (req, res, next) {
  
  let userId = req.cookies.userId,productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
        if(userDoc){
          let goodsItem = '';
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            Goods.findOne({productId:productId}, function (err1,doc) {
              if (err1) {
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if (doc) {
                  let pushData = {
                    productId: doc.productId,
                    productName: doc.productName,
                    salePrice: doc.salePrice,
                    productImage: doc.productImage,
                    productUrl: doc.productUrl,
                    productCatagory: doc.productCatagory,
                    productNum: 1,
                    checked: 1
                  }
                  userDoc.cartList.push(pushData);
                  userDoc.save(function (err2,doc2) {
                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});

// 上传图片
router.post("/picture", upload.single('file'), function (req, res, next) {
  res.json({
    status: '0',
    msg: '',
    result: req.file
  })
});

// 上传商品详情详情图片
router.post("/pictureDetail", upload.single('file'), function (req, res, next) {
  res.json({
    status: '0',
    msg: '',
    result: req.file
  })
});

// 增加商品
router.post("/addProduct", function (req, res, next) {
  let productName = req.body.reqParms.productName;
  let salePrice = req.body.reqParms.salePrice;
  let productCatagory = req.body.reqParms.productCatagory;
  let productImage = req.body.reqParms.productImage;
  let productDetailImage = req.body.reqParms.productDetailImage;
  let color = req.body.reqParms.color;
  let productSecondName = req.body.reqParms.productSecondName
  let sysDate = new Date().Format('yyyyMMddhhmmss');

  let productId = sysDate;
  let productParms = {
    productName: productName,
    salePrice: salePrice,
    productCatagory: productCatagory,
    productImage: productImage,
    productDetailImage: productDetailImage,
    productId: productId,
    color: color,
    checked: '',
    productSecondName: productSecondName
  }
  Goods.create(productParms, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      });
    }
  })
});

// 删除商品
router.post("/delProduct", function (req, res, next) {
  let productId = req.body.productId
  Goods.remove({ productId: productId }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      });
    }
  })
});

// 查询商品详情
router.post("/productDetail", function (req, res, next) {
  let productId = req.body.productId
  Goods.findOne({ productId: productId }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: doc
      });
    }
  })
});

// 编辑商品
router.post("/editProduct", function (req, res, next) {
  let productName = req.body.productName;
  let salePrice = req.body.salePrice;
  let productCatagory = req.body.productCatagory;
  let productImage = req.body.productImage;
  let productId = req.body.productId
  let productParms = {
    productName: productName,
    salePrice: salePrice,
    productCatagory: productCatagory,
    productImage: productImage,
    productId: productId
  }
  Goods.update({
    productId: productId
  }, {
      $set: {
        productName: productName,
        salePrice: salePrice,
        productCatagory: productCatagory,
        productImage: productImage
    }
  }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          result:{
            count:doc.length,
            list:doc
          }
        });
      }
  })
})
module.exports = router;
