import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'
import ProductManagement from '@/views/ProductManagement'
import OrderManagement from '@/views/OrderManagement'
import MyAddress from '@/views/MyAddress'
import MyOrder from '@/views/MyOrder'
import Blank from '@/views/Blank'
import ProductDetail from '@/views/productDetail'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component:GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component:Cart
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/address',
      name: 'Address',
      component:Address
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component:OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component:OrderSuccess
    },
    {
      path: '/productManagement',
      name: 'ProductManagement',
      component:ProductManagement
    },
    {
      path: '/orderManagement',
      name: 'OrderManagement',
      component:OrderManagement
    },
    {
      path: '/myAddress',
      name: 'MyAddress',
      component:MyAddress
    },
    {
      path: '/myOrder',
      name: 'MyOrder',
      component:MyOrder
    },
    {
      path: '/blank',
      name: 'blank',
      component:Blank
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: ProductDetail
    }
  ]
})
