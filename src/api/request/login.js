import service from '../index'

// 登录
export function handlelogin (data){
  return service({
    url:'/login',
    method:'post',
    data
  })
}

//侧边栏
export function handleMenus (){
  return service({
    url:'/menus',
    method:'get',
    
  })
}