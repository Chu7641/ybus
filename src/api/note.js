import api from '../utils/api';
class NoteApi {
    getAllNote = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await api
                    .get("/note", { params: data });
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
                    .post("/note", data);

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
                    .put(`/note/${id}`, data);
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
                    .delete(`/note/${id}`);
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
                    .get(`/note/${id}`);
                resolve(res.data);
            } catch (error) {
                reject(error);
            }
        });
    };

}
const noteApi = new NoteApi();
export default noteApi;