import qs from 'qs';
import api from '../utils/api';

class BusRouteApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, 'params')
        const res = await api
          .get("/route/list", {
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
          .post("/route/create", data);
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
          .post("/route/update", data);
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
        .post("/route/delete", data);
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
        .post("/route/deleteMany", data);
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
          .get(`/route/load/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const busRouteApi = new BusRouteApi();
export default busRouteApi;