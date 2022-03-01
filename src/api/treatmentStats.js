
import api from '../utils/api';

class TreatmentStatsApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get("/treatment/stats", { params: data });
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  create = (data) => {
    return new Promise((resolve, reject) => {
      return api
        .post("/treatment/stats", data)
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
        .put(`/treatment/stats/${id}`, data)
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
        .delete(`/treatment/stats/${id}`)
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
          .get(`/treatment/stats/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const treatmentStatsApi = new TreatmentStatsApi();
export default treatmentStatsApi;