<template>
    <div>
      <nav-header ref="header"></nav-header>
      <nav-bread :propManagement = "management">
        <span>{{productName}}</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav productTitle">
            <img class="picture" v-bind:src="'static/'+titlePicture" alt="">
            <span class="productName">{{productName}} </span>
            <span class="productsecondName"> {{productSecondName}}</span>
            <el-row>
              <el-button v-for="item in productclour" class="clourbotton">{{item}}</el-button>
            </el-row>
            <div class="btn-area bottonaddcar">
                <a href="javascript:;" class="btn btn--m" @click="addCart()">加入购物车</a>
            </div>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dd><a href="javascript:void(0)"  v-bind:class="{'cur':productChecked=='all'}">商品介绍</a></dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <img v-for="item in pictureDetail"  v-bind:src="'static/'+item" class="bigpictice" alt="">
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
          <span>加入购物车成功!</span>
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
            productChecked:'all',
            filterBy:false,
            overLayFlag:false,
            querydata:'',
            management: '',
            productName:'',
            productId: '',
            productclour:[],
            bigPicture:[],
            productSecondName:'',
            pictureDetail: [],
            titlePicture: ''
          }
        },
        created () {
          this.productName = this.$route.query.productName;
          this.productId = this.$route.query.productId
          axios.post("/goods/productDetail",{
            productId:this.productId
          }).then((res)=>{
              var res = res.data;
              this.productclour = res.result.color;
              this.productSecondName = res.result.productSecondName;
              this.pictureDetail = res.result.productDetailImage;
              this.titlePicture = res.result.productImage
          });
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        methods:{
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
            addCart(){
                axios.post("/goods/addCart",{
                  productId: this.productId
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
  .productName,
  .productsecondName
  {
    font: 700 16px Arial,"microsoft yahei";
    color: #666;
    display: block;
    margin-right: 20px;
  }
  .productName{
    margin-top: 30px;
  }
  .productsecondName{
    margin-top: 10px;
  }
  .productTitle{
     height: 300px;
  }
  .clourbotton{
    margin-top: 20px;
  }
  .picture{
    margin-top: 30px;
    display: block;
    float: left;
    margin-left: 400px;
  }
  .bottonaddcar{
    margin-bottom: 80px;
  }
  .bigpictice{
    margin-top: 20px;
    max-width: 100%;
    max-height:100%;
  }
</style>