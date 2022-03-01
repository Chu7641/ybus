
import api from '../../utils/api';

export const getAllAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get("/appointment", { params: data });
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createAppointment = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/appointment", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateAppointment = (id, data) => {
  return new Promise((resolve, reject) => {
    return api
      .put(`/appointment/${id}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteAppointment = (id) => {
  return new Promise((resolve, reject) => {
    return api
      .delete(`/appointment/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDetailAppointment = (id) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/appointments/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};