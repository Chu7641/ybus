import qs from 'qs';
import api from '../utils/api';

class SeatTemplateApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, 'params')
        const res = await api
          .get("/seatTemplate/list", {
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
          .post("/seatTemplate/create", data);
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
          .post("/seatTemplate/update", data);
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
        .post("/seatTemplate/delete", data);
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
        .post("/seatTemplate/deleteMany", data);
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
          .get(`/seatTemplate/load/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
const seatTemplateApi = new SeatTemplateApi();
export default seatTemplateApi;