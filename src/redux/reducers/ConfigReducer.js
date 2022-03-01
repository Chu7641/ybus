import {
    GET_CONFIG,
    SET_CONFIG
} from '../types';

/**
 * initial state
 */
const INIT_STATE = {};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CONFIG: {
            return {
                ...action.payload
            }
        }
        default: return { ...state };
    }
}
