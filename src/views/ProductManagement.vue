<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>商品管理</span>
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
               <el-form-item>
                 <el-button type="primary" plain @click="onAddProduct">新增<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
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
                      <a href="#" @click="openProductDetail(item)"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice | currency('￥')}}<a class="el-icon-edit el-edit" @click="onEditProduct(item)"></a></div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="delProduct(item.productId)">下架商品</a>
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
      <modal v-bind:mdShow="mdShowConfirm" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>你确定下架商品吗？</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="delProductConfirm">确定</a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="closeModal">取消</a>
        </div>
      </modal>

      <el-dialog title="新增商品" :visible.sync="mdShowAdd" center width="25%">
        <el-form :model="addForm">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="addForm.productName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品副标题" :label-width="formLabelWidth">
            <el-input v-model="addForm.productSecondName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="addForm.salePrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品类别" :label-width="formLabelWidth" >
             <el-select v-model="addForm.productCatagory" placeholder="请选择" filterable>
                <el-option
                  v-for="item in productCatagorySelectData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="颜色" :label-width="formLabelWidth">
             <el-select 
               v-model="addForm.color" 
               placeholder=""
               filterable
               multiple
               allow-create
               default-first-option
               >
                <el-option
                  v-for="item in productColor"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="简介图片" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              action="/goods/picture"
              :on-success = "handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="详情图片" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              action="/goods/pictureDetail"
              :on-success = "handleSuccessDetail"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileListDetail"
              list-type="picture-card">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" >
          <a class="btn btn--m" href="javascript:;" @click="addProduct"> 确 定 </a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="closeModal"> 取 消 </a>
        </div>
      </el-dialog>

      <el-dialog title="编辑商品" :visible.sync="mdShowEdit" center width="20%">
        <el-form :model="addForm">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="editForm.productName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="editForm.salePrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品类别" :label-width="formLabelWidth">
             <el-select v-model="editForm.productCatagory" placeholder="请选择" >
                <el-option
                  v-for="item in productCatagorySelectData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="颜色" :label-width="formLabelWidth">
             <el-select 
               v-model="editForm.color" 
               placeholder="请选择"
               multiple
               filterable
               allow-create
               >
                <el-option
                  v-for="item in productColor"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              action="/goods/picture"
              :on-success = "handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" >
          <a class="btn btn--m" href="javascript:;" @click="editProduct"> 确 定 </a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="closeModal"> 取 消 </a>
        </div>
      </el-dialog>
      
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
            mdShowConfirm:false,
            productCatagory:['手机 配件','耳机 音箱','笔记本','智能 生活'],
            productChecked:'all',
            filterBy:false,
            overLayFlag:false,
            querydata:'',
            selectValue: '',
            mdShowAdd: false,
            mdShowAddDetail: false,
            mdShowEdit:false,
            formLabelWidth: '100px',
            productId: '',
            addForm:{
              productName:'',
              salePrice: 1,
              productCatagory:'',
              productImage: '',
              productDetailImage:[],
              color:[],
              productSecondName:''
            },
            editForm:{
              productId: '',
              productName:'',
              salePrice: 1,
              productCatagory:'',
              productImage: '',
              color:[]
            },
            productCatagorySelectData: 
              [{
                value: '0',
                label: '手机 配件'
              }, {
                value: '1',
                label: '耳机 音箱'
              }, {
                value: '2',
                label: '笔记本'
              }, {
                value: '3',
                label: '智能 生活'
              }],
              productColor:['亮黑色', '宝石蓝','樱粉金', '香槟金'],
              fileList: [],
              fileListDetail: []
          }
        },
        created () {
          this.selectValue = '01'
        },
        mounted(){
            this.getGoodsList();
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
            // 增加商品按钮
            onAddProduct(){
              this.mdShowAdd = true
            },
            // 发起增加商品
            addProduct(){
              axios.post("/goods/addProduct",{
                  reqParms:this.addForm
                }).then((res)=>{
                    var res = res.data;
                    if(res.status==0){
                      this.page=1
                      this.getGoodsList()
                      this.closeModal()
                    }
                });
            },
            // 编辑商品按钮
            onEditProduct(item){
              this.mdShowEdit = true
              this.editForm.productId = item.productId
              this.editForm.productName = item.productName
              this.editForm.salePrice = item.salePrice
              this.editForm.productCatagory = item.productCatagory
              this.editForm.productImage = item.productImage
            },
             // 发起编辑商品
             editProduct(){
               var editParms = this.editForm
               axios.post("/goods/editProduct",editParms).then((res)=>{
                    var res = res.data;
                    if(res.status==0){
                      this.page=1
                      this.getGoodsList()
                      this.closeModal()
                    }
                });
             },
            // 上传
            handleRemove(file, fileList) {
              console.log(123,fileList);
            },
            handlePreview(file) {
              console.log(file);
           },
           handleSuccess(response, file, fileList){
              this.addForm.productImage = response.result.filename
            },
            handleSuccessDetail(response, file, fileList){
              this.addForm.productDetailImage.push(response.result.filename)
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
            // 下架商品
            delProduct(productId){
              this.productId = productId
              this.mdShowConfirm = true
            },
            delProductConfirm(){
                axios.post("/goods/delProduct",{
                  productId:this.productId
                }).then((res)=>{
                    var res = res.data;
                    if(res.status==0){
                      this.page = 1;
                      this.closeModal();
                      this.getGoodsList()
                    }else{
                        this.mdShow = true;
                    }
                });
            },
            closeModal(){
              this.mdShow = false;
              this.mdShowConfirm = false;
              this.mdShowAdd = false;
              this.mdShowEdit = false
            },
            showFilterPop(){
              this.filterBy=true;
              this.overLayFlag=true;
            },
            closePop(){
              this.filterBy=false;
              this.overLayFlag=false;
              this.mdShowConfirm = false;
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
  .el-edit{
    margin-left: 80px;
  }
</style>