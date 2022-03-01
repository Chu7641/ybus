
import api from '../../utils/api';

export const getAllSupplier = (data) => {

  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get("/supplier", { params: data });
      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};


export const createSupplier = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .post("/supplier", data);

      resolve(res.data);
    } catch (error) {
      console.log(error);


      reject(error);
    }
  });
};

export const updateSupplier = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .put(`/supplier/${id}`, data);

      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const deleteSupplier = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .delete(`/supplier/${id}`);

      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const getDetailSupplier = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get(`/supplier/${id}`);

      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};