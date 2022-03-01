import {
  GET_ALL_CLINICS,
  CREATE_NEW_CLINIC,
  UPDATE_CLINIC,
  DELETE_CLINIC,
  GET_CLINIC_DETAIL
} from '../types'

const INIT_STATE = {
  list: [],
  current: null,
  paging: {
    total: 0,
    perPage: 10,
    page: 1,
  },
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
    case GET_ALL_CLINICS: {
      return {
        ...state,
        list: action.payload.data.clinics,
        paging: action.payload.paging,
      };
    }

    case UPDATE_CLINIC: {
      let { id } = action.payload;
      let index = findIndex(state.list, id);
      let newList = [...state.list];
      newList[index] = action.payload;
      return {
        ...state,
        list: newList,
      };
    }

    case DELETE_CLINIC: {
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

    case CREATE_NEW_CLINIC: {
      state.list.unshift(action.payload);
      let newList = [...state.list];
      return {
        ...state,
        list: newList,
      };
    }
    case GET_CLINIC_DETAIL: {
      return { ...state, clinic: action.payload };
    }

    default:
      return state;
  }
};
