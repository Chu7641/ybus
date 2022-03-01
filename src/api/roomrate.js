import qs from 'qs';
import api from '../utils/api';

class RoomrateApi {
  getRoomrateByRouteid = (data,id) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, 'params')
        const res = await api
          .post(`route/${id}/roomrate/list`, {
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
  getData = (data,id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post(`route/${id}/roomrate/list`, data);
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
          .post("/route/roomrate/create", data);
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
          .post("/route/roomrate/update", data);
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
        .post("/agent/delete", data);
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
          .get(`/agent/load/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const roomrateApi = new RoomrateApi();
export default roomrateApi;