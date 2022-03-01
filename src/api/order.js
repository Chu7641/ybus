import qs from 'qs';
import api from '../utils/api';

class OrderApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, 'params')
        const res = await api
          .get("/order/list", {
            params: { ...data },
            paramsSerializer: params => {
              return qs.stringify(params, { encodeValuesOnly: true });
            }
          })
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
          .post("/order/create", data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  update = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post("/order/update", data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  delete = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
        .post("/order/delete", data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
  deleteMany = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
        .post("/order/deleteMany", data);
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
          .get(`/order/load/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const orderApi = new OrderApi();
export default orderApi;