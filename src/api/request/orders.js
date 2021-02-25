import service from '../index'

// 订单管理列表数据
export function handleOrdersList ( query, pagenum, pagesize){
  return service({
    url: '/orders',
    method: 'get',
    params: {
      query, pagenum, pagesize
    }
  })
}

//折线图数据(渲染echarts)
export function handleReportType (){
  return service({
    url: '/reports/type/1',
    method: 'get',
   
  })
}
