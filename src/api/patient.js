import api from '../utils/api';

class PatientApi {
  getAll = (data) => {
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

  create = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post("/patient", data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  update = (id, data) => {
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

  delete = (id) => {
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

  getDetail = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get(`/patient/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const patientApi = new PatientApi();
export default patientApi;