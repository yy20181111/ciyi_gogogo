import service from '../index'

//获取商品分类参数列表
export function getCategoriesList() {
  return service({
    url: '/categories',
    method: 'get',

  })
}

//获取分类参数列表
export function getCate(id,sel) {
  return service({
    url: '/categories/' + id + '/attributes',
    method: 'get',
    params: {
    sel
    }
  })
}


