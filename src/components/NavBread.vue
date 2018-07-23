<template>
  <section class="bread">
    <div class="bread-wrap">
        <nav class="">
            <a href="/">
                首页 /
            </a>
            <slot></slot>
        </nav>
        <div class="menu">
            <el-menu
                :default-active="activeIndex2"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#f0f0f0"
                text-color="#999"
                active-text-color="#ffd04b">
                <el-submenu index="1" v-if="management">
                    <template slot="title" >管理中心</template>
                    <el-menu-item index="1-1" @click="openProductManagement">商品管理</el-menu-item>
                    <el-menu-item index="1-2" @click="openOrderManagement">订单管理</el-menu-item>
                    <el-menu-item index="1-3" @click="openOrderManagement">用户管理</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">个人中心</template>
                    <el-menu-item index="2-1" @click="openMyOrder">我的订单</el-menu-item>
                    <el-menu-item index="2-2" @click="openMyAddress">我的地址</el-menu-item>
                    <el-menu-item index="2-3" @click="openMyAddress">我的资料</el-menu-item>
                </el-submenu>
           </el-menu>
        </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default{
    data(){
        return{
            activeIndex: '1',
            activeIndex2: ''
        }
    },
    computed:{
          ...mapState(['nickName','cartCount','management'])
        },
    methods: {
        handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      openMyAddress(){
          this.$router.push('/myAddress')
      },
      openProductManagement(){
          this.$router.push('/productManagement')
      },
      openMyOrder() {
          this.$router.push('/myOrder')
      },
      openOrderManagement() {
          this.$router.push('/OrderManagement')
      }
    }
}
</script>
<style>
.bread{
    height: 55px;
    line-height: 55px;
    background-color: #f0f0f0;
}
.bread-wrap{
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding-top: 5px;
    padding-right: 20px;
    /* padding-bottom: 5px; */
    padding-left: 20px;
    font-size: 14px;
    color: #a1a1a1;
}
.bread-wrap a{
    position: relative;
    color: #999;
},
.bread-wrap a:after{
    position: absolute;
    top: 0px;
    content:'/';
    height:20px;
    line-height: 20px;
}
.bread-wrap span{
    color:#d1434a;
}
.bread .bread-wrap .menu{
    margin-top: -5px;
}
</style>