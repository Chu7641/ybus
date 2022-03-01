import api from '../utils/api';
class DocumentApi {
    getAll = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await api
                    .get("/document", { params: data });
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
                    .post("/document", data);

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
                    .put(`/document/${id}`, data);
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
                    .delete(`/document/${id}`);
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
                    .get(`/document/${id}`);
                resolve(res.data);
            } catch (error) {
                reject(error);
            }
        });
    };

}
const documentApi = new DocumentApi();
export default documentApi;