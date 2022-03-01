
import api from '../utils/api';

class AppointmentApi {
  getAll = (data) => {
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

  create = (data) => {
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

  update = (id, data) => {
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

  delete = (id) => {
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

  getDetail = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get(`/appointment/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const appointmentApi = new AppointmentApi();
export default appointmentApi;