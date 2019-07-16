import request from '@/utils/request'

// 查询tbox列表
export function getTboxInfoList(data) {
  return request({
    url: '/basic/queryEvTbox',
    method: 'post',
    data
  })
}
// 查询车牌信息管理表
export function getLicenceInfoList(data) {
  return request({
    url: '/licence/page',
    method: 'post',
    data
  })
}
// 查询单位信息管理表
export function getEmployeInfoList(data) {
  return request({
    url: '/employe/page',
    method: 'post',
    data
  })
}
//查询所有的运营单位ID和名称
export function getAllCompanyNameAndId(data) {
  return request({
    url: '/employe/allCompanyNameAndId',
    method: 'get',
    params:data
  })
}
// 查询车型信息管理表
export function getCarModuleInfoList(data) {
  return request({
    url: '/parameter/page',
    method: 'post',
    data
  })
}
// 查询车辆信息分页查询
export function getCarInfoList(data) {
  return request({
    url: '/vehicle/page',
    method: 'post',
    data
  })
}
// 国标查询列表
export function getMovecarList(data) {
  return request({
    url: '/movethecar/queryPage',
    method: 'post',
    data
  })
}
// 新增终端
export function addEvTbox(data) {
  return request({
    url: '/basic/addEvTbox',
    method: 'post',
    data
  })
}
// 删除终端
export function deleteEvTbox(data) {
return request({
  url: '/basic/deleteEvTbox',
  method: 'get',
  params:data
})
}
// 修改终端
export function editEvTbox(data) {
  return request({
    url: '/basic/updateEvTbox',
    method: 'post',
    data
  })
}
// 上传终端管理表
export function uploadEvTbox(data) {
  return request({
    url: '/basic/excelDataImport',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}
// 新增车牌信息
export function addLicence(data) {
  return request({
    url: '/licence/insert',
    method: 'post',
    data
  })
}
// 编辑车牌信息
export function editLicence(data) {
  return request({
    url: '/licence/update',
    method: 'post',
    data
  })
}
// 删除车牌信息
export function deleteLicence(data) {
  return request({
    url: '/licence/delete',
    method: 'get',
    params:data,
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
// 上传车牌信息
export function uploadLicence(data) {
  return request({
    url: '/licence/importByExcel',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}

// 新增单位信息
export function addEmploye(data) {
  return request({
    url: '/employe/insert',
    method: 'post',
    data
  })
}
// 编辑单位信息
export function editEmploye(data) {
  return request({
    url: '/employe/update',
    method: 'post',
    data
  })
}
// 删除车牌信息
export function deleteEmploye(data) {
  return request({
    url: '/employe/delete',
    method: 'post',
    data,
    params:data,
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
// 上传车牌信息
export function uploadEmploye(data) {
  return request({
    url: '/employe/importInsert',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}
// 新增车型
export function addCarModule(data) {
  return request({
    url: '/parameter/insert',
    method: 'post',
    data
  })
}
// 编辑车型
export function editCarModule(data) {
  return request({
    url: '/parameter/update',
    method: 'post',
    data
  })
}
// 删除车型
export function deleteCarModule(data) {
  return request({
    url: '/parameter/delete',
    method: 'post',
    data,
    params:data,
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
// 上传车型
export function uploadCarModule(data) {
  return request({
    url: '/parameter/importByExcel',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}
// 新增车辆信息
export function addCarInfo(data) {
  return request({
    url: '/vehicle/insert',
    method: 'post',
    data
  })
}
// 编辑车辆信息
export function editCarInfo(data) {
  return request({
    url: '/vehicle/update',
    method: 'post',
    data
  })
}
// 删除车辆信息
export function deleteCarInfo(data) {
  return request({
    url: '/vehicle/delete',
    method: 'get',
    params: data
  })
}
// 上传车辆信息
export function uploadCarInfo(data) {
  return request({
    url: '/vehicle/improtInsert',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}
// 上传车辆信息
export function uploadFlow(data) {
  return request({
    url: '/chinamobile/getVehicleAccountGPRS',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}
// 上传国标
export function uploadMoveCar(data) {
  return request({
    url: '/movethecar/importQuery',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}

// 查询合格证
export function getCertificateList(data) {
  return request({
    url: '/certificate/queryPage',
    method: 'post',
    data
  })
}
// 新增合格证
export function addCertificate(data) {
  return request({
    url: '/certificate/insert',
    method: 'post',
    data
  })
}
// 编辑车辆合格证信息
export function editCertificate(data) {
  return request({
    url: '/certificate/update',
    method: 'post',
    data
  })
}
// 删除车辆合格证信息
export function deleteCertificate(data) {
  return request({
    url: '/certificate/delete',
    method: 'post',
    data,
    params:data,
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
// 上传车辆合格证信息
export function uploadCertificate(data) {
  return request({
    url: '/certificate/importInsert',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}

// 查询省份
export function getProvince(data) {
  return request({
    url: '/province/queryProvince',
    method: 'post',
    data
  })
}
// 新增省份
export function addProvince(data) {
  return request({
    url: '/province/saveProvince',
    method: 'post',
    data
  })
}
// 编辑省份
export function updateProvince(data) {
  return request({
    url: '/province/updateProvince',
    method: 'post',
    data
  })
}
// 删除省份
export function deleteProvince(data) {
  return request({
    url: '/province/deleteProvince',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data,
    params:data
  })
}

/*
*静态字段信息管理
*/
//分页查静态字段信息
export function queryBasicSeries(data) {
  return request({
    url: '/basicseries/queryBasicSeries',
    method: 'post',
    data
  })
}
//更新静态信息字段
export function updateBasicSeries(data) {
  return request({
    url: '/basicseries/updateBasicSeries',
    method: 'post',
    data
  })
}
//新增静态信息字段
export function addBasicSeries(data) {
  return request({
    url: '/basicseries/addBasicSeries',
    method: 'post',
    data
  })
}
//删除静态信息字段
export function deleteBasicSeries(data) {
  return request({
    url: 'basicseries/deleteBasicSeries',
    method: 'get',
    params: data
  })
}

/*
*导出模板管理
*/
//分页查询导出模板信息
export function queryExportTemplate(data) {
  return request({
    url: '/template/queryExportTemplate',
    method: 'post',
    data
  })
}
//更新导出模板信息
export function updateExportTemplate(data) {
  return request({
    url: '/template/updateExportTemplate',
    method: 'post',
    data
  })
}
//新增导出模板信息
export function addExportTemplate(data) {
  return request({
    url: '/template/addExportTemplate',
    method: 'post',
    data
  })
}
//删除导出模板
export function deleteExportTemplate(data) {
  return request({
    url: '/template/deleteExportTemplate',
    method: 'get',
    params: data
  })
}
//查询模板中包含的字段
export function getTemplateSeries(data) {
  return request({
    url: '/basicseries/getTemplateSeries',
    method: 'get',
    params: data
  })
}
//查询所有的字段
export function getAllTemplateSeries(data) {
  return request({
    url: '/basicseries/getAllTemplateSeries',
    method: 'get',
    params: data
  })
}
//导出模板
export function exportTemplateSeriesData(data) {
  return request({
    url: '/basicseries/exportTemplateSeriesData',
    method: 'post',
    data
  })
}



