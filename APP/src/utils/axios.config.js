import axios from 'axios'

// 请求拦截，发出请求时携带token
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config;
}, function (error) {
    
    return Promise.reject(error);
});


// 响应拦截
axios.interceptors.response.use(function (response) {
    const {authorization} = response.headers
    authorization && localStorage.setItem("token",authorization)
    return response;
}, function (error) {
    const {status} = error.response
    if(status===401){
        window.location.href = "/login"
    }
    return Promise.reject(error);
});