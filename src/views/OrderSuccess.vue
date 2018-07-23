<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确 认 地 址</span> </li>
            <li class="cur"><span>确 认 订 单</span></li>
            <li class="cur"><span>支 付 订 单</span> </li>
            <li class="cur"><span>下 单 成 功</span> </li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>下单成功! <br>快递小哥正在快马加鞭送货！</h3>
            <p>
              <span>实付金额：{{orderTotal|currency('￥')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <a class="btn btn--m" @click="openOrderDialog">查看订单</a>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">继续购物</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="orderShow"
        width="50%">
        <div class="page-title-normal checkout-title">
          <h2><span>Order content</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in goodsList" v-if="item.checked=='1'">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img v-lazy="'/static/'+item.productImage" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice|currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.salePrice*item.productNum)|currency('￥')}}</div>
                </div>
              </li>
            </ul>

              <div class="price-count">
                <ul>
                  <li>
                    <span>实付金额:</span>
                    <span>{{orderTotal|currency('￥')}}</span>
                  </li>
                  <li>
                    <span>收货人:</span>
                    <span>{{userName}}</span>
                  </li>
                  <li>
                    <span>地址:</span>
                    <span>{{streetName}}</span>
                  </li>
                  <li>
                    <span>电话:</span>
                    <span>{{tel}}</span>
                  </li>
                  <li>
                    <span>邮政编码:</span>
                    <span>{{postCode}}</span>
                  </li>
                  <li>
                    <span>订单状态:</span>
                    <span>已支付</span>
                  </li>
                </ul>
              </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderShow = false">取 消</el-button>
          <el-button type="primary" @click="orderShow = false">确 定</el-button>
        </span>
      </el-dialog>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import {currency} from './../util/currency'
    import axios from 'axios'
    export default{
        data(){
            return{
                orderId:'',
                orderTotal:0,
                orderShow: false,
                goodsList: [],
                userName:'',
                streetName:'',
                tel: '',
                postCode: ''
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread
        },
        filters:{
          currency:currency
        },
        mounted(){
            var orderId = this.$route.query.orderId;
            console.log("orderId:"+orderId);
            if(!orderId){
              return;
            }
            axios.get("/users/orderDetail",{
                params:{
                  orderId:orderId
                }
            }).then((response)=>{
                let res = response.data;
                console.log(12345,res)
                if(res.status=='0'){
                    this.orderId = orderId;
                    this.orderTotal = res.result.orderTotal;
                    this.goodsList = res.result.goodsList;
                    this.userName= res.result.addressInfo.userName;
                    this.streetName= res.result.addressInfo.streetName;
                    this.tel= res.result.addressInfo.tel;
                    this.postCode= res.result.addressInfo.postCode
                }
            })
        },
        methods: {
          openOrderDialog(){
            this.orderShow = true
          }
        }
    }
</script>
<style scoped>
</style>

