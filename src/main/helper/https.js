import axios from 'axios'
import qs from 'querystring'
import JsonResult from './jsonResult'
// 拦截器
axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

//添加响应拦截器
axios.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.resolve(error.response)
})

//返回数据
function checkResponseData(response) {
    if (response && (response.status == 200 || response.status == 304)) {
        return response.data
    }
    return JsonResult.error(response.statusText.toString())
}

export default {
    get(url, param) {
        let data = {};
        return axios({
            method: 'get',
            url,
            params: data,
            timeout: 10000
        }).then(
            response => {
                console.log('response', response)
                return checkResponseData(response)
            }
        ).catch(err => {
            return err
        })
    }
}