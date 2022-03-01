
import api from '../../utils/api';

export const getAllBill = (data) => {

  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get("/bill", { params: data });
      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};


export const createBill = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .post("/bill", data);

      resolve(res.data);
    } catch (error) {
      console.log(error);


      reject(error);
    }
  });
};

export const updateBill = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .put(`/bill/${id}`, data);

      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const deleteBill = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .delete(`/bill/${id}`);

      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const getDetailBill = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get(`/bill/${id}`);

      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};