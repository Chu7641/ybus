
import api from '../../utils/api';
import { NotificationManager } from "react-notifications";

export const getAllService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get("/service", { params: data });
      //dispatch({ type: GET_ALL_SERVICE, payload: res.data });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
      NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại");
      reject(error);
    }
  });
};

export const createService = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/service", data)
      .then((res) => {
        //dispatch({ type: CREATE_NEW_SERVICE, payload: res.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        //NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

export const updateService = (id, data) => {
  return new Promise((resolve, reject) => {
    return api
      .put(`/service/${id}`, data)
      .then((res) => {
        //dispatch({ type: UPDATE_SERVICE, payload: res.data.data.patient });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

export const deleteService = (id) => {
  return new Promise((resolve, reject) => {
    return api
      .delete(`/service/${id}`)
      .then((res) => {
        //NotificationManager.success('Xóa bệnh nhân thành công')
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        NotificationManager.error("Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};

export const getDetailService = (id) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/services/${id}`)
      .then((res) => {
        //dispatch({ type: GET_SERVICE_DETAIL, payload: res.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        NotificationManager.error(error.response.data && error.response.data.message ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại")
        reject(error);
      });
  });
};