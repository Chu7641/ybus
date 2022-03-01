import qs from 'qs';
import api from '../utils/api';

class BusApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, 'params')
        const res = await api
          .get("/bus/list", {
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
          .post("/bus/create", data);
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
          .post("/bus/update", data);
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
        .post("/bus/delete", data);
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
        .post("/bus/deleteMany", data);
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
          .get(`/bus/load/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const busApi = new BusApi();
export default busApi;