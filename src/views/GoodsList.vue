<template>
    <div>
      <nav-header ref="header"></nav-header>
      <nav-bread :propManagement = "management">
        <span>商品列表</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">

            <div class="query">
              <el-form :inline="true"  class="demo-form-inline">
               <el-form-item>
                 <el-input v-model="querydata" placeholder="请输入"></el-input>
               </el-form-item>
               <el-form-item>
                 <el-button icon="el-icon-search" @click="onSubmit"></el-button>
               </el-form-item>
              </el-form>
            </div>

            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>商品类别:</dt>
                <dd><a href="javascript:void(0)" @click="setProductCatagory('all')" v-bind:class="{'cur':productChecked=='all'}">All</a></dd>
                <dd v-for="(item,index) in productCatagory">
                  <a href="javascript:void(0)" @click="setProductCatagory(index)" v-bind:class="{'cur':productChecked==index}">{{item}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodsList">
                    <div class="pic">
                      <a><img @click="openProductDetail(item)" v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice | currency('￥')}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
      </modal>
      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import axios from 'axios'
    export default{
        data(){
          return {
            goodsList:[],
            sortFlag:true,
            page:1,
            pageSize:8,
            busy:true,
            loading:false,
            mdShow:false,
            mdShowCart:false,
            productCatagory:['手机 配件','耳机 音箱','笔记本','智能 生活'],
            productChecked:'all',
            filterBy:false,
            overLayFlag:false,
            querydata:'',
            management: ''
          }
        },
        mounted(){
            this.getGoodsList();
            // this.management = this.$refs.header.data.management
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        methods:{
            getGoodsList(flag){
              var param = {
                  page:this.page,
                  pageSize:this.pageSize,
                  sort:this.sortFlag?1:-1,
                  productCatagory:this.productChecked,
                  productName: this.querydata
              };
              this.loading = true;
              axios.get("/goods/list",{
                params:param
              }).then((response)=>{
                var res = response.data;
                this.loading = false;
                if(res.status=="0"){
                  if(flag){
                      this.goodsList = this.goodsList.concat(res.result.list);

                      if(res.result.count==0){
                          this.busy = true;
                      }else{
                          this.busy = false;
                      }
                  }else{
                      this.goodsList = res.result.list;
                      this.busy = false;
                  }
                }else{
                  this.goodsList = [];
                }
              });
            },
            onSubmit(){
              this.page=1
              this.getGoodsList()
            },
            sortGoods(){
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
            },
            setProductCatagory(index){
              this.productChecked = index;
              this.page = 1;
              this.getGoodsList();
            },
            loadMore(){
                this.busy = true;
                setTimeout(() => {
                  this.page++;
                  this.getGoodsList(true);
                }, 500);
            },
            addCart(productId){
                axios.post("/goods/addCart",{
                  productId:productId
                }).then((res)=>{
                    var res = res.data;
                    if(res.status==0){
                        this.mdShowCart = true;
                        this.$store.commit("updateCartCount",1);
                    }else{
                        this.mdShow = true;
                    }
                });
            },
            closeModal(){
              this.mdShow = false;
              this.mdShowCart = false;
            },
            showFilterPop(){
              this.filterBy=true;
              this.overLayFlag=true;
            },
            closePop(){
              this.filterBy=false;
              this.overLayFlag=false;
              this.mdShowCart = false;
            },
            // 打开详情页
            openProductDetail(item){
              this.$router.push({ path:'/productDetail', query: {productId: item.productId, productName: item.productName}})
            }
        }
    }
</script>
<style scoped>
  .query{
    float: left;
    margin-top: 9px;
    margin-left: -10px;
  }
</style>

