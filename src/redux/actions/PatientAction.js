import {
  GET_ALL_PATIENTS,
  CREATE_NEW_PATIENT,
  UPDATE_PATIENT,
  GET_PATIENT_DETAIL,
  DELETE_PATIENT
} from '../types';
import api from '../../utils/api';

export const getAllPatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get("/patient", { params: data });
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createPatient = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/patient", data)
      .then((res) => {
        resolve(res.data);

      })
      .catch((error) => {

        reject(error);
      });
  });
};

export const updatePatient = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .put(`/patient/${id}`, data);
      resolve(res.data);
    } catch (error) {

      reject(error);
    }
  });
};

export const deletePatient = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .delete(`/patient/${id}`);
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getDetailPatient = (id) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api
        .get(`/patient/${id}`);
      dispatch({ type: GET_PATIENT_DETAIL, payload: res.data });
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};