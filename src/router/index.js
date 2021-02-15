import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

//重复点击问题
VueRouter.prototype.push = function push(localtion) {
  return originalPush.call(this, localtion).catch(err => err)
}

const routes = [
  {
    path: '/',  //重定向到登录页面
    redirect: '/login'

  }, 
  {
    path: '/login',
    component: () => import('../views/login/login'),
  },
  {
    path:'/home',
    component: () => import('../views/home/home'),
    children:[
      {path:'/',
    redirect:'/welcome'},
    {
      path:'/welcome',
      component:()=>import('../views/home/welcome/welcome')
    },
    {
      path:'/users',
      component:()=>import('../views/home/users/users')
    },{
      path:'/roles',
      component:()=>import('../views/home/roles/roles')
    },{
      path:'/rights',
      component:()=>import('../views/home/roles/rights')
    },{
      path:'/goods',
      component:()=>import('../views/home/goods/goods')
    },{
      path:'/params',
      component:()=>import('../views/home/goods/params')
    },{
      path:'/categories',
      component:()=>import('../views/home/goods/categories')
    },{
      path:'/orders',
      component:()=>import('../views/home/orders/orders')
    },{
      path:'/reports',
      component:()=>import('../views/home/reports/reports')
    },
    ]
  }

]

const router = new VueRouter({
  routes,

})

// 路由导航守卫控制是否为登录页,强制跳转至登录页
router.beforeEach((to,from,next)=>{
  if(to.path === '/login')  return next()
  const tokenstr = window.sessionStorage.getItem('admin-token')
  if(!tokenstr) return next('/login')
  next()
})
export default router