import axios from 'axios';
import { getCookie, removeCookie } from './cookie';
import appConfig from '../config';
import { NotificationManager } from 'react-notifications';

const apiformData = axios.create({
    baseURL: `${appConfig.API_URL}`,
    timeout: 60000,
    headers: {
        'Content-Type': 'multipart/form-data',
       
    }
});

apiformData.interceptors.request.use(function (config) {
    let accessToken = getCookie('token');
    // Do something before request is sent
    if (accessToken) {
        config.headers.common['Authorization'] = "Bearer " + accessToken
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

apiformData.interceptors.response.use(
    response => response,
    error => {
        console.log(error)
        if (error && error.response && error.response.status === 401) {
            removeCookie('token')
            let message = "Phiên đã hết hạn. Vui lòng đăng nhập lại!";
            if (error.response.data.message) {
                message = error.response.data.message;
            }

            if (window.location.pathname != '/login' && window.location.pathname != '/reset-password') {
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000);
                NotificationManager.error(message);
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
);

export default apiformData;