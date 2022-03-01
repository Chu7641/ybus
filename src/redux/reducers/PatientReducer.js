import {
  GET_ALL_PATIENTS,
  CREATE_NEW_PATIENT,
  UPDATE_PATIENT,
  DELETE_PATIENT,
  GET_PATIENT_DETAIL
} from '../types'

const INIT_STATE = {
  list: [],
  current:null,
  paging: {
    total: 0,
    perPage: 10,
    page: 1,
  },
  patient:{}
};

function findIndex(arrID, id) {
  if (arrID.length) {
    for (let i = 0; i < arrID.length; i++) {
      if (arrID[i].id.toString() === id.toString()) return i;
    }
  }
  return -1;
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALL_PATIENTS: {
      return {
        ...state,
        list: action.payload.data.patients,
        paging: action.payload.paging,
      };
    }

    case UPDATE_PATIENT: {
      let { id } = action.payload;
      let index = findIndex(state.list, id);
      let newList = [...state.list];
      newList[index] = action.payload;
      return {
        ...state,
        list: newList,
      };
    }

    case DELETE_PATIENT: {
      let newList = state.list.filter((account) => {
        return action.payload.indexOf(account.id) < 0;
      });
      let newPaging = { ...state.paging };
      newPaging.total = state.paging.total - 1;

      return {
        ...state,
        list: newList,
        paging: newPaging,
      };
    }

    case CREATE_NEW_PATIENT: {
      state.list.unshift(action.payload);
      let newList = [...state.list];
      return {
        ...state,
        list: newList,
      };
    }

    case GET_PATIENT_DETAIL: {
      return { ...state, patient: action.payload };
    }

    default:
      return state;
  }
};
