import service from '../index'

//获取权限列表
export function getRightsList(){
  return service({
    url:'/rights/list',
    method:'get',
  })
}


//获取角色列表
export function getRolesList(roleName,roleDesc){
  return service({
    url:'/roles',
    method:'get',
    params:{
      roleName,roleDesc
     }
  })
}

//添加角色
export function addRoles(data){
  return service({
    url:'/roles',
    method:'post',
    data
  })
}

//删除角色
export function delRoles(id){
  return service({
    url:'/roles/'+id,
    method:'delete',
    id
  })
}

//根据id查询用户信息
export function handleRolesInfo(id){
  return service({
    url:'/roles/' + id,
    method:'get',
  id
  })
}
//编辑角色
export function editRoles(id,data){
  return service({
    url:'/roles/' + id,
    method:'put',
    data
  })
}

//角色列表
export function getAlltRoles(){
  return service({
    url:'/roles',
    method:'get', 
  })
}

// 删除角色指定权限
export function deleteRolesRight(roleId,rightId){
  return service({
    url:'/roles/' +roleId + '/rights/'  + rightId,
    method:'delete'
  })
}

//获取权限列表
export function getRightsTree(){
  return service({
    url:'/rights/tree',
    method:'get',
  })
}


//分配权限
export function setRight(id,data){
  return service({
    url:'/roles/' + id + '/rights/' ,
    method:'post',
    data
  })
}

