import service from '../index'

// 获取商品分类数据列表
export function handleCategories (type,pagenum,pagesize){
  return service({
    url:'/categories',
    method:'get',
   params:{type,pagenum,pagesize}
  })
}

//添加分类
export function handleAddCategories (data){
  return service({
    url:'/categories',
    method:'post',
    data
  })
}

//获取父级分类
export function handleParentCategories (type,pagenum,pagesize){
  return service({
    url:'/categories',
    method:'get',
    params:{
      type,pagenum,pagesize
    }
  })
}

//删除分类
export function delClass(id){
  return service({
    url:'/categories/'+id,
    method:'delete',
    id
  })
}

//根据id查询分类信息
export function handleClassInfo(id){
  return service({
    url:'categories/' + id,
    method:'get'
  })
}

//编辑角色
export function editClass(id,data){
  return service({
    url:'/categories/' + id,
    method:'put',
    data
  })
}