import {GET_ONLINE_USERS, GET_PREV_MESSAGES, POST_MESSAGE} from "../actions/chatActions";

const initialState = {
    users: [],
    messages: [],
    loading: false,
    error: null,
};

const chatReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_ONLINE_USERS:
            return {...state, users: action.payload};
        case GET_PREV_MESSAGES:
            return {...state, messages: action.payload};
        case POST_MESSAGE:
            return {...state, messages: [...state.messages, action.payload]};

        default:
            return state;
    }
};

export default chatReducer;
