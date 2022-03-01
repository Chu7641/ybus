
import api from '../utils/api';

class BillApi {
  getAll = (data) => {
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

  create = (data) => {
    return new Promise((resolve, reject) => {
      return api
        .post("/bill", data)
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
        .put(`/bill/${id}`, data)
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
        .delete(`/bill/${id}`)
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
          .get(`/bill/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const billApi = new BillApi();
export default billApi;