
import api from '../../utils/api';
import doctorApi from '../../api/doctor';
import {
  GET_ALL_DOCTORS,

} from '../types';

export const getAllDoctor = (data) => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await doctorApi.getAll(data);
      resolve(result);
      dispatch({ type: GET_ALL_DOCTORS, payload: result });
    } catch (error) {
      reject(error);
    }
  })
}



