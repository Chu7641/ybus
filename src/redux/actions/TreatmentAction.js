import {
  GET_ALL_TREATMENTS,
  CREATE_NEW_TREATMENT,
  UPDATE_TREATMENT,
  GET_TREATMENT_DETAIL,
  DELETE_TREATMENT
} from '../types';
import api from '../../utils/api';
import { NotificationManager } from "react-notifications";

export const getAllTreatment = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/treatment", { params: data })
      .then((res) => {

        resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
        //console.log(error.response.data);
        //NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

export const createTreatment = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/treatment", data)
      .then((res) => {
        console.log(res.data);

        resolve(res.data);

      })
      .catch((error) => {
        console.log(error);
        //NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

export const updateTreatment = (id, data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .put(`/treatment/${id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_TREATMENT, payload: res.data });
        resolve(res.data);
      })
      .catch((error) => {
        //console.log(error.response.data);
        //NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

// export const deletePatients = (id) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     return api
//       .delete(`/patients/${id}`)
//       .then((res) => {
//         dispatch({ type: DELETE_PATIENT, payload: [id] });
//         NotificationManager.success('Xóa bệnh nhân thành công')
//         resolve(res.data);
//       })
//       .catch((error) => {
//         console.log(error.response);
//         NotificationManager.error( "Có lỗi xảy ra, vui lòng thử lại")
//         reject(error);
//       });
//   });
// };

export const getDetailTreatment = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/treatment/${id}`)
      .then((res) => {
        dispatch({ type: GET_TREATMENT_DETAIL, payload: res.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};