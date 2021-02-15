import service from '../index'

//用户数据列表
export function handleUserList(query,pagenum,pagesize){
  return service({
    url:'/users',
    method:'get',
    params:{
      query,pagenum,pagesize
    }
  })
}

//添加用户
export function handleAddUser(data){
  return service({
    url:'/users',
    method:'post',
   data
  })
}

//根据id查询用户信息
export function handleUserInfo(id){
  return service({
    url:'/users/' + id,
    method:'get',
  id
  })
}

//修改用户
export function handleReUserInfo(id,data){
  return service({
    url:'/users/' + id,
    method:'put',
  id,data
  })
}

//删除用户
export function deleteUserInfo(id){
  return service({
    url:'/users/' + id,
    method:'delete',
  id
  })
}
