import axios from 'axios';
import { getCookie, removeCookie } from './cookie';
import appConfig from '../config';
import { message } from 'antd';
import { NotificationManager } from 'react-notifications';

const api = axios.create({
    baseURL: `${appConfig.API_URL}`,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
});

api.interceptors.request.use(function (config) {
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

api.interceptors.response.use(
    response => response,
    error => {
        console.log(error)
        if (error && error.response && error.response.status === 401) {
            removeCookie('token')
            let message = "Phiên đã hết hạn. Vui lòng đăng nhập lại!";
            if (error.response.data.message) {
                message = error.response.data.message;
            }

            if (window.location.pathname != '/login' && window.location.pathname != '/reset-password' && window.location.pathname('signup')) {
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000);
                NotificationManager.error(message);
                window.location.href = '/login'
            }
        }
        if (error && error.response && error.response.status === 500) {

            message.error('Internal server error');

        }

        return Promise.reject(error.response);
    }
);

export default api;