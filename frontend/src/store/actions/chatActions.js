export const GET_ONLINE_USERS = 'GET_ONLINE_USERS';
export const getOnlineUsers = users => ({type: GET_ONLINE_USERS, payload: users});

export const GET_PREV_MESSAGES = 'GET_PREV_MESSAGES';
export const getPrevMessages = messages => ({type: GET_PREV_MESSAGES, payload: messages});

export const sendMessage = (ws, message) => {
    ws.current.send(JSON.stringify(message));
};

export const ACCEPT_MESSAGE = 'ACCEPT_MESSAGE';
export const acceptMessage = message => ({type: ACCEPT_MESSAGE, payload: message});

export const deleteMessage = (ws, message) => {
    ws.current.send(JSON.stringify(message));
};

export const sendPrivateMessage = (ws, message) => {
    ws.current.send(JSON.stringify(message));
};

export const ACCEPT_PRIVATE_MESSAGE = 'ACCEPT_PRIVATE_MESSAGE';
export const acceptPrivateMessage = message => ({type: ACCEPT_PRIVATE_MESSAGE, payload: message});

export const ERROR_MESSAGE = 'ERROR_MESSAGE';
export const errorMessage = error => ({type: ERROR_MESSAGE, payload: error});