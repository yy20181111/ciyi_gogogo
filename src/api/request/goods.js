import service from '../index'

//获取商品列表数据
export function getGoodList(query, pagenum, pagesize) {
  return service({
    url: '/goods',
    method: 'get',
    params: {
      query, pagenum, pagesize
    }
  })
}