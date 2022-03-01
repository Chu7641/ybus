
import api from '../utils/api';

class UserApi {
  getAll = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api
          .get("/user", { params: data });
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  create = (data) => {
    return new Promise((resolve, reject) => {
      return api
        .post("/user", data)
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
        .put(`/user/${id}`, data)
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
        .delete(`/user/${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };


  resetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.post('/user/resetpassword', data);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    })
  }

  getDetail = (id) => {
    return new Promise((resolve, reject) => {
      return api
        .get(`/users/${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
const userApi = new UserApi();
export default userApi;