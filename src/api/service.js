
import api from '../utils/api';

class ServiceApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get("/service", { params: data });
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  getGroup = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get("/service/group");
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  create = (data) => {
    return new Promise((resolve, reject) => {
      return api
        .post("/service", data)
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
        .put(`/service/${id}`, data)
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
        .delete(`/service/${id}`)
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
          .get(`/service/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const serviceApi = new ServiceApi();
export default serviceApi;