import axios from "axios";
import QS from 'qs';
import {Toast} from "vant";
// import * as store from "core-js";

// axios.defaults.baseURL = 'http://hplqy.suoluomei.cn/index.php?s=/hfs/Api/'  //正式
axios.defaults.baseURL = 'http://activitytest.hpl001.cn/crm_api/app/sinceOrder/' //测试

//post请求头
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";
//设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(config => {
    Toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
    })
    config.headers.Authorization = localStorage.getItem("Authorization");
    config.headers.areaCode = localStorage.getItem("areaCode");
    config.headers.marketId = localStorage.getItem("marketId");
    return config;
});

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    // router.replace({
                    //     path: '/login',
                    //     query: {
                    //         redirect: router.currentRoute.fullPath
                    //     }
                    // });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                    Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    // store.commit('loginSuccess', null);
                    // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    // setTimeout(() => {
                    //     router.replace({
                    //         path: '/login',
                    //         query: {
                    //             redirect: router.currentRoute.fullPath
                    //         }
                    //     });
                    // }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
