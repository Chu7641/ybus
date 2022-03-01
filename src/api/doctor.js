import api from '../utils/api';
class DoctorApi {
    getAll = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await api
                    .get("/doctor", { params: data });
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
                    .post("/doctor", data);

                resolve(res.data);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    };
    update = (id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await api
                    .put(`/doctor/${id}`, data);
                resolve(res.data);
            } catch (error) {
                reject(error);
            }
        });
    };

    delete = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await api
                    .delete(`/doctor/${id}`);
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
                    .get(`/doctor/${id}`);
                resolve(res.data);
            } catch (error) {
                reject(error);
            }
        });
    };

}
const doctorApi = new DoctorApi();
export default doctorApi;