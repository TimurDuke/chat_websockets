export const GET_ONLINE_USERS = 'GET_ONLINE_USERS';
export const getOnlineUsers = users => ({type: GET_ONLINE_USERS, payload: users});

export const GET_PREV_MESSAGES = 'GET_PREV_MESSAGES';
export const getPrevMessages = messages => ({type: GET_PREV_MESSAGES, payload: messages});

export const sendMessage = (ws, message) => {
    ws.current.send(JSON.stringify(message));
};

export const POST_MESSAGE = 'POST_MESSAGE';
export const postMessage = message => ({type: POST_MESSAGE, payload: message});

// export const deleteMessage = (ws, message) => {
//     ws.current.send(JSON.stringify(message));
// };