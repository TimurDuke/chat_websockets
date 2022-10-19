import {
    ACCEPT_MESSAGE,
    ACCEPT_PRIVATE_MESSAGE,
    ERROR_MESSAGE,
    GET_ONLINE_USERS,
    GET_PREV_MESSAGES
} from "../actions/chatActions";

const initialState = {
    users: [],
    messages: [],
    error: null,
};

const chatReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_ONLINE_USERS:
            return {...state, users: action.payload};
        case GET_PREV_MESSAGES:
            return {...state, messages: action.payload};
        case ACCEPT_MESSAGE:
            return {...state, messages: [...state.messages, action.payload]};
        case ACCEPT_PRIVATE_MESSAGE:
            return {...state, messages: [...state.messages, action.payload]};
        case ERROR_MESSAGE:
            return {...state, error: action.payload};

        default:
            return state;
    }
};

export default chatReducer;
