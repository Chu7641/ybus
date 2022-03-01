import {
    LOGIN,
    GET_AUTH_USER,
    LOGOUT,
    GET_AUTH_PERMISSION,
    UPDATE_AVATAR,
    GET_BANK,
    ADD_BANK,
    DELETE_BANK,
    SET_DEFAULT_BANK,
    UPDATE_AUTH_USER
} from '../types';

const INIT_STATE = {
    authUser: null,
    userBank:[],
    permission: [],
    permission_id_arr: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_BANK:{
            return{...state ,userBank: action.payload}
        }
        case SET_DEFAULT_BANK:{
            return{...state ,userBank: action.payload}
        }
        case DELETE_BANK: {
            let newList = state.userBank.filter((item) => {
              return item.id !== action.payload;
            });
      
            return {
              ...state,
              userBank: newList,
            
            };
          }
      case UPDATE_AUTH_USER:{
        return { ...state, authUser: action.payload };
      }
        case ADD_BANK:{
            state.userBank.unshift(action.payload);
            let newList = [...state.userBank];
            return {
              ...state,
              userBank: newList,
            };
        }
        case LOGIN: {
            return { ...state, authUser: action.payload.user}
        }
        case GET_AUTH_USER: {
            return { ...state, authUser: action.payload.user };
        }
        case LOGOUT: {
            return { ...state, authUser: null };
        }
        case GET_AUTH_PERMISSION: {
            return{
                ...state,
                permission: action.payload.data,
                permission_id_arr: action.payload.permission_id_arr
            }
        }
        case UPDATE_AVATAR: {
            return {
                ...state,
                authUser: action.payload
            }
        }
        default: {
            return { ...state };
        }
    }
}