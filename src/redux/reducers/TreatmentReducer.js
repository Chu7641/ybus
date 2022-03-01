import {
  GET_ALL_TREATMENTS,
  CREATE_NEW_TREATMENT,
  UPDATE_TREATMENT,
  DELETE_TREATMENT,
  GET_TREATMENT_DETAIL
} from '../types'

const INIT_STATE = {
  list: [],
  current: null,
  paging: {
    total: 0,
    perPage: 10,
    page: 1,
  },
  treatment: {}
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
    case GET_ALL_TREATMENTS: {
      return {
        ...state,
        list: action.payload.data,
        paging: {
          total: action.payload.total,
          perPage: action.payload.limit,
          page: action.payload.page,
        },

      };
    }

    case UPDATE_TREATMENT: {
      let { id } = action.payload;
      let index = findIndex(state.list, id);
      let newList = [...state.list];
      newList[index] = action.payload;
      return {
        ...state,
        list: newList,
      };
    }

    case DELETE_TREATMENT: {
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

    case CREATE_NEW_TREATMENT: {
      // let newList = [...state.list];
      // newList.unshift(action.payload);

      return {
        ...state,
        // list: newList,
      };
    }

    case GET_TREATMENT_DETAIL: {
      return { ...state, treatment: action.payload };
    }

    default:
      return state;
  }
};
