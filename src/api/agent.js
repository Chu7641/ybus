import qs from 'qs';
import api from '../utils/api';

class AgentApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, 'params')
        const res = await api
          .get("/agent/list", {
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
          .post("/agent/create", data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  sendSMS = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post("/agent/sendSMS", data);
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
          .post("/agent/update", data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
  updatePaymentMethod =(id,data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post(`/agent/update/payment_method/${id}`, data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
  updateAgentApps =(id,data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post(`/agent/update/agent_app/${id}`, data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
  updateAccAgent =(id,data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .post(`/agent/update/setAccount/${id}`, data);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  deletePayment = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
        .post("/agent/payment_method/delete",data );
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

  deleteMany = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
        .post("/agent/deleteMany", data);
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

  checkAppListing = (agent_id, alias, listing) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get(`/agent/checkAppListing`, {params : {
            agent_id : agent_id,
            app_alias: alias,
            listing: listing
          }});
        resolve(res.data.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
const agentApi = new AgentApi();
export default agentApi;