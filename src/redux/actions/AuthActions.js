import api from '../../utils/api';
import apiformData from '../../utils/apiformData'
import {
    LOGIN,
    LOGOUT,
    GET_AUTH_USER,
    CHANGE_PASSWORD,
    RESET_PASSWORD,
    UPDATE_AUTH_USER,
    GET_AUTH_PERMISSION,
    UPDATE_AVATAR,
    GET_BANK,
    ADD_BANK,
    DELETE_BANK,
    SET_DEFAULT_BANK
} from '../types';
import { setCookie, removeCookie, getCookie } from '../../utils/cookie';
import { NotificationManager } from 'react-notifications';

export const login = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post('/loginAdmin', data).then(res => {
            // var checkrole = res.data.data.customer.roles.filter(item => item.id === 5)
            // if (checkrole.length) {
            setCookie('token', res.data.data.token, 7);
            dispatch({ type: LOGIN, payload: res.data.data });
            resolve(true)
            // } else {
            //     NotificationManager.error('Bạn không có quyền đăng nhập');
            //     resolve(true)
            // }
        }).catch(err => {
            NotificationManager.error(err.data.msg);
            reject(err);
        })
    })
}

export const getAuthUser = () => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post('/checkTokenAdmin').then(res => {
            setCookie('token', res.data.data.token, 7);
            dispatch({ type: GET_AUTH_USER, payload: res.data.data });
            resolve(true)
        }).catch(err => {
            // NotificationManager.error("Đã có lỗi xảy ra, vui lòng thử lại!");
            reject(err);
        })
    })
}

export const updateAuthUser = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post('/client/account/updateProfile', data).then(res => {
            dispatch({ type: UPDATE_AUTH_USER, payload: res.data.data });
            console.log('res', res);
            NotificationManager.success("Cập nhật thành công!");
            resolve(true)
        }).catch(err => {
            console.log(err.response)
            // NotificationManager.error("Đã có lỗi xảy ra, vui lòng thử lại!");
            reject(err);
        })
    })
}

export const changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await api.post('/auth/password', data);

            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}

export const resetPassword = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post('/reset-password', data).then(res => {
            dispatch({ type: RESET_PASSWORD, payload: res.data.data });
            resolve(true)
        }).catch(err => {
            console.log(err);
            let message = "Đã có lỗi xảy ra, vui lòng thử lại!";
            if (err.response.data.msg) message = err.response.data.msg;
            NotificationManager.error(message);
            reject(err);
        })
    })
}

export const logout = () => dispatch => {
    return new Promise((resolve, reject) => {
        removeCookie('token');
        dispatch({ type: LOGOUT });
        resolve(true);
    })
}

export const getAuthPermission = () => dispatch => {
    return new Promise((resolve, reject) => {
        return api.get('/permission/get_all_permission_of_user').then(res => {
            dispatch({ type: GET_AUTH_PERMISSION, payload: res.data });
            resolve(true)
        }).catch(err => {
            console.log(err.response);
            reject(err);
        })
    })
}
export const updateAvatar = (data) => dispatch => {

    return new Promise((resolve, reject) => {
        apiformData
            .post('/client/account/updateAvatar', data)
            .then(res => {
                resolve(res.data);
                console.log(res.data)

            })
            .catch(error => {
                reject(error.response);
            })
    })
}

export const getBank = () => dispatch => {
    return new Promise((resolve, reject) => {
        return api.get('/client/account/myBankAccount').then(res => {
            dispatch({ type: GET_BANK, payload: res.data.data });
            resolve(true)
        }).catch(err => {
            console.log(err.response);
            reject(err);
        })
    })
}
export const addBank = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post('/client/account/addBankAccount', data).then(res => {
            dispatch({ type: ADD_BANK, payload: res.data.data });
            NotificationManager.success('Thêm thành công');
            resolve(true)
        }).catch(err => {
            console.log(err.response);
            reject(err);
        })
    })
}
export const deleteBank = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.delete(`/client/account/deleteBankAccount/${id}`).then(res => {
            dispatch({ type: DELETE_BANK, payload: res.data.data });
            NotificationManager.success('Cập nhật thành công');
            resolve(true)
        }).catch(err => {
            console.log(err.response);
            reject(err);
        })
    })
}
export const setDefaultBank = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post(`/client/account/setBankAccountDefault/${id}`).then(res => {
            dispatch({ type: SET_DEFAULT_BANK, payload: res.data.data });

            resolve(true)
        }).catch(err => {
            console.log(err.response);
            reject(err);
        })
    })
}