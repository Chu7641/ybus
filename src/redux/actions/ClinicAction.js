import {
  GET_ALL_CLINICS,
  CREATE_NEW_CLINIC,
  UPDATE_CLINIC,
  GET_CLINIC_DETAIL,
  DELETE_CLINIC
} from '../types';
import api from '../../utils/api';

export const getAllClinics = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/clinic", { params: data })
      .then((res) => {
        dispatch({ type: GET_ALL_CLINICS, payload: res.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data);
        //NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

// export const createClinic = (data) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     return api
//       .post("/clinics", data)
//       .then((res) => {
//         dispatch({ type: CREATE_NEW_CLINIC, payload: res.data.data.clinic });
//         resolve(res.data);
//       })
//       .catch((error) => {
//         console.log(error.response.data);
//         NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message: "Có lỗi xảy ra, vui lòng thử lại")
//         reject(error);
//       });
//   });
// };

// export const updatePatient = (id ,data) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     return api
//       .put(`/patients/${id}`, data)
//       .then((res) => {
//         dispatch({ type: UPDATE_PATIENT, payload: res.data.data.patient });
//         resolve(res.data);
//       })
//       .catch((error) => {
//         console.log(error.response.data);
//         NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message: "Có lỗi xảy ra, vui lòng thử lại")
//         reject(error);
//       });
//   });
// };

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

export const getDetailClinic = (id) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get(`/clinic/${id}`);
      dispatch({ type: GET_CLINIC_DETAIL, payload: res.data });
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};