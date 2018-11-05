import VueRouter from 'vue-router'

import Home from './pages/Home.vue'
import Search from './pages/Search.vue'
import CategoryFirst from './pages/CategoryFirst.vue'
import CategorySecond from './pages/CategorySecond.vue'
import Auction from './pages/Auction.vue'
import AuctionPublish from './pages/AuctionPublish.vue'
import CustomerOrders from './pages/CustomerOrders.vue'
import SupplierOrders from './pages/SupplierOrders.vue'
import CustomerOrderDetail from './pages/CustomerOrderDetail.vue'
import SupplierOrderDetail from './pages/SupplierOrderDetail.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ForgetPassword from './pages/ForgetPassword.vue'
import SearchResult from './pages/SearchResult.vue'
import AuctionList from './pages/AuctionList.vue'

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/search',
        component: Search
    },
    {
        path: '/search/result',
        component: SearchResult
    },
    {
        path: '/category/first/:flag',
        component: CategoryFirst
    },
    {
        path: '/category/second/:flag/:id',
        component: CategorySecond
    },
    {
        path: '/auction/detail/:goodId',
        component: Auction
    },
    {
        path: '/auction/publish',
        component: AuctionPublish
    },
    {
        path: '/auction/list/:id',
        component: AuctionList
    },
    {
        path: '/customer/orders',
        component: CustomerOrders
    },
    {
        path: '/supplier/orders',
        component: SupplierOrders
    },
    {
        path: '/customer/order/detail/:id',
        component: CustomerOrderDetail
    },
    {
        path: '/supplier/order/detail/:goodId',
        component: SupplierOrderDetail
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/forgetpassword',
        component: ForgetPassword
    }
];

const router = new VueRouter({
    mode: 'hash',
    routes: routes
})

export default router
