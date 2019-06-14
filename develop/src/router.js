import VueRouter from 'vue-router'

import Home from './pages/Home.vue'
import Search from './pages/Search.vue'
import Auction from './pages/Auction.vue'
import AuctionPublish from './pages/AuctionPublish.vue'
import CustomerOrders from './pages/CustomerOrders.vue'
import SupplierOrders from './pages/SupplierOrders.vue'
import CustomerOrderDetail from './pages/CustomerOrderDetail.vue'
import SupplierOrderDetail from './pages/SupplierOrderDetail.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ForgetPassword from './pages/ForgetPassword.vue'
import AuctionList from './pages/AuctionList.vue'
import WechatRegister from './pages/WechatRegister.vue'
import Instruction from './pages/Instruction.vue'
import FavoritedGoods from './pages/FavoritedGoods'
import ShopPublish from './pages/ShopPublish.vue'
import Shop from './pages/Shop.vue'
import My from './pages/My.vue'
import MessageList from './pages/MessageList.vue'
import MessageDetail from './pages/MessageDetail.vue'
import MessageSend from './pages/MessageSend.vue'
import Profile from './pages/Profile.vue'
import SupplierGoods from './pages/SupplierGoods.vue'
import Contact from './pages/Contact.vue'
import History from './pages/History.vue'
import Question from './pages/Question.vue'
import Goods from './pages/Goods.vue'
import GoodsCategory from './pages/GoodsCategory.vue'
import Payment from './pages/Payment.vue'

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/search',
        component: Search
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
        path: '/supplier/order/detail/:goodId/:orderId',
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
    },
    {
        path: '/wechat/register',
        component: WechatRegister
    },
    {
        path: '/instruction',
        component: Instruction
    },
    {
        path: '/favorited/goods',
        component: FavoritedGoods
    },
    {
        path: '/shop/publish',
        component: ShopPublish
    },
    {
        path: '/shop/detail/:goodId',
        component: Shop
    },
    {
        path: '/my',
        component: My
    },
    {
        path: '/message/list',
        component: MessageList
    },
    {
        path: '/message/detail/:id',
        component: MessageDetail
    },
    {
        path: '/message/send/:id',
        component: MessageSend
    },
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/supplier/goods/:id',
        component: SupplierGoods
    },
    {
        path: '/contact',
        component: Contact
    },
    {
        path: '/history',
        component: History
    },
    {
        path: '/question/:id/:title',
        component: Question
    },
    {
        path: '/goods',
        component: Goods
    },
    {
        path: '/goods/category',
        component: GoodsCategory
    },
    {
        path: '/payment/:id',
        component: Payment
    }
];

const router = new VueRouter({
    mode: 'hash',
    routes: routes
})

router.afterEach((to, from) => {
})

export default router
