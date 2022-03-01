import { NotificationManager } from 'react-notifications';
import {
   GET_CONFIG,
   SET_CONFIG
} from '../types';
import api from '../../utils/api';

export const getConfig = () => dispatch => {
    return new Promise((resolve, reject) => {
     api.get('/common/getconfig').then(res => {
        resolve(res.data)
      
        dispatch({type: GET_CONFIG, payload: res.data.data})
    }).catch(err => {
        reject(err)
        console.log(err);
    })
})
}

// export const setConfig = (data) => dispatch => {

//     return new Promise((resolve, reject) => {

//      api.put('config_file', data).then(res => {
//          resolve(res.data)

//         dispatch({type: SET_CONFIG, payload: res.data.config});
       
//         NotificationManager.success("Cập nhật thành công");
//     }).catch(err => {
//         reject(err)
//         console.log(err);
//     })
// })
// }