import service from '../index'

//删除分类
export function getTimeImg(){
  return service({
    url:'/reports/type/1',
    method:'get',

  })
}
