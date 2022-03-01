import api from '../../utils/api';

export const signUp = (data) => {

  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .post("/user/signup", data);
      resolve(res);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const createDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .post("/doctor", data);

      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const changePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .post("/user/password", data);
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .put(`/user/${id}`, data);
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};



export const deleteDoctor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .delete(`/doctor/${id}`);

      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const getDetailDoctor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get(`/doctor/${id}`);
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};