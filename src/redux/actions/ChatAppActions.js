/**
 * Chat App Actions
 */
import {
    CHAT_WITH_SELECTED_USER,
    GET_NEW_MESSAGE_CONVERSATION_CHAT,
    REPLY_CONVERSATION_CHAT,
    GET_ALL_MESSAGES_CHAT,
    GET_ALL_CONVERSATION_CHAT,
    RELOAD_MESSAGE,
    GET_ALL_RESERVATION_CONVERSATION_CHAT
} from '../types';

import api from '../../utils/api';
import qs from "qs";
import { NotificationManager } from "react-notifications";

/**
 * Redux Action To Emit Boxed Layout
 * @param {*boolean} isBoxLayout 
 */
export const chatWithSelectedUser = (user) => dispatch => {
    dispatch({
        type: CHAT_WITH_SELECTED_USER,
        payload: user
    })

};

export const sendMessageToUser = (id, data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/sup/chat/send`, {
            conversation_id: id,
            content: data.content,
        })
            .then(res => {
                console.log(res, 'message sent')
                resolve(data);
                dispatch({
                    type: RELOAD_MESSAGE,
                    payload: res.data.data
                })
            })
            .catch(error => {
                reject(error);
                console.log(error.response);
                NotificationManager.error("Có lỗi khi gửi tin nhắn.")
            });
    });
}


export const receiveMessageCVS = (cplData) => dispatch => {
    dispatch({ type: GET_NEW_MESSAGE_CONVERSATION_CHAT, payload: cplData });
}



export const getAllConversationChat = () => dispatch => {
    console.log('action get all conersation')
    return new Promise((resolve, reject) => {
        api.get("/sup/chat/myConversations"
            //  {
            //     // params: filter,
            //     paramsSerializer: params => {
            //         return qs.stringify(params, { arrayFormat: "repeat" });
            //     }
            // }
        )
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_CONVERSATION_CHAT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error("Có lỗi xảy ra, vui lòng thử lại")
            });
    });
}

export const getAllReservationConversationChat = () => dispatch => {
    console.log('action get all reservation conersation')
    return new Promise((resolve, reject) => {
        api.get("/sup/chat/myReservationConversations"
            //  {
            //     // params: filter,
            //     paramsSerializer: params => {
            //         return qs.stringify(params, { arrayFormat: "repeat" });
            //     }
            // }
        )
            .then(res => {
                // console.log('ressss', res)
                resolve(res.data);
                dispatch({ type: GET_ALL_RESERVATION_CONVERSATION_CHAT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error("Có lỗi xảy ra, vui lòng thử lại")
            });
    });
}


export const getAllMessageChat = (conversationId, filter) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/sup/chat/messages/${conversationId}`, {
            params: { paging: { ...filter } },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        })
            .then(res => {
                resolve(res.data.data);
                dispatch({ type: GET_ALL_MESSAGES_CHAT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error("Có lỗi xảy ra, vui lòng thử lại")
            });
    });
}

export const reply = (id, data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.put(`/chats/${id}`, data)
            .then(res => {
                resolve(data);
                dispatch({ type: REPLY_CONVERSATION_CHAT, payload: data });
                dispatch({
                    type: RELOAD_MESSAGE,
                    payload: data
                })
            })
            .catch(error => {
                reject(error);
                console.log(error.response);
                NotificationManager.error("Có lỗi xảy ra, vui lòng thử lại")
            });
    });
}

export const chatWithUser = (cid, object_id) => dispatch => {
    let data = {
        cid: cid,
        object_id: object_id
    }
    if (!object_id) delete data.object_id;
    return new Promise((resolve, reject) => {
        api.post(`/sup/chat/chatWithUser`, data)
            .then(res => {
                console.log(res, 'ress chat user')
                dispatch({
                    type: CHAT_WITH_SELECTED_USER,
                    payload: res.data.data.conversation
                })
                resolve(data);
            })
            .catch(error => {
                reject(error);
                console.log(error.response);
                NotificationManager.error("Có lỗi xảy ra, vui lòng thử lại")
            });
    });
}

