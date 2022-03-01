/**
 * Chat App Reducers
 */

// actions types
import {
    CHAT_WITH_SELECTED_USER,
    REPLY_CONVERSATION_CHAT,
    GET_ALL_MESSAGES_CHAT,
    GET_ALL_CONVERSATION_CHAT,
    GET_NEW_MESSAGE_CONVERSATION_CHAT,
    GET_ALL_RESERVATION_CONVERSATION_CHAT
} from '../types';

const INITIAL_STATE = {
    selectedUser: null,
    newMessage: null,
    allConversationChat: {
        list: [],
        // paging: {
        //     count: 0,
        //     totalpage: 1,
        //     perpage: 20,
        //     page: 1
        // }
        unread: 0
    },
    allReservationConversationChat: {
        list: [],
        // paging: {
        //     count: 0,
        //     totalpage: 1,
        //     perpage: 20,
        //     page: 1
        // }
        unread: 0
    },
    allMessagesChat: {
        list: [],
        paging: {
            count: 0,
            totalpage: 1,
            perpage: 20,
            page: 1
        }
    },
    currSetReply: null,
    currSetRead: null
};

function findItem(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        // chat with selected user
        case CHAT_WITH_SELECTED_USER:
            return { ...state, selectedUser: action.payload }

        // send message to user

        case GET_ALL_CONVERSATION_CHAT: {
            return {
                ...state,
                allConversationChat: {
                    ...state.allConversationChat,
                    list: action.payload.list,
                    // paging: {
                    //     page: action.payload.current,
                    //     perpage: action.payload.perPage,
                    //     totalpage: action.payload.pages,
                    //     count: action.payload.total
                    // }
                    unread: action.payload.unread
                }
            }
        }

        case GET_ALL_RESERVATION_CONVERSATION_CHAT: {
            return {
                ...state,
                allReservationConversationChat: {
                    ...state.allConversationChat,
                    list: action.payload.list,
                    // paging: {
                    //     page: action.payload.current,
                    //     perpage: action.payload.perPage,
                    //     totalpage: action.payload.pages,
                    //     count: action.payload.total
                    // }
                    unread: action.payload.unread
                }
            }
        }

        case GET_ALL_MESSAGES_CHAT: {
            return { ...state, allMessagesChat: action.payload }
        }

        case REPLY_CONVERSATION_CHAT: {
            return { ...state, currSetReply: action.payload, allMessagesChat: { ...state.allMessagesChat, attend: true } }
        }


        case GET_NEW_MESSAGE_CONVERSATION_CHAT: {
            let newM = action.payload;

            return {
                ...state,
                newMessage: newM
            }

        }

        default: return { ...state };
    }
}
