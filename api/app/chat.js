const Message = require("../models/Message");
const User = require("../models/User");

const activeConnections = {};

const sendAll = (msg) => {
    Object.keys(activeConnections).forEach(connId => {
        const conn = activeConnections[connId];
        conn.send(JSON.stringify(msg));
    });
};

const sendUserList = async () => {
    const activeUsers = await User.find({_id: {$in: Object.keys(activeConnections)}}, '_id username');
    sendAll({type: 'USERS', activeUsers});
};

const broadcastHandler = async (ws, user, decodedMessage) => {
    if (decodedMessage.message) {
        const data = {
            user: user._id,
            message: decodedMessage.message,
            date: new Date().toISOString()
        };
        const newMsg = new Message(data);
        await newMsg.save();
        const message = await Message.populate(newMsg, {path: "user", select: "username"});
        sendAll({type: 'BROADCAST', message});
    } else {
        ws.send(JSON.stringify({type: 'ERROR', error: 'Message cannot be empty'}));
    }
};

const privateHandler = async (ws, user, decodedMessage) => {
    const recipient = decodedMessage.recipient;
    const conn = activeConnections[recipient];

    if (conn) {
        const privateData = {
            user: user._id,
            recipient: decodedMessage.recipient,
            message: decodedMessage.message,
            date: new Date().toISOString()
        };
        const privateMsg = new Message(privateData);
        await privateMsg.save();

        const message = await Message.populate(privateMsg, {path: "user", select: "username"});
        conn.send(JSON.stringify({type: 'PRIVATE', message}));
    } else {
        ws.send(JSON.stringify({type: 'ERROR', error: 'Recipient not found'}));
    }
};

const deleteHandler = async (ws, user, decodedMessage) => {
    if (user.role === 'moderator') {
        await Message.deleteOne({_id: decodedMessage.id});
        sendAll({type: 'DELETE', id: decodedMessage.id});
    } else {
        ws.send(JSON.stringify({type: 'ERROR', error: 'Forbidden'}));
    }
};

const chat = async (ws, req) => {
    const user = req.user;

    const id = user._id.toString();
    activeConnections[id] = ws;
    console.log('Client connected id=', id);

    await sendUserList();

    const prevMsg = await Message.find({recipient: {$exists: false}})
        .limit(30)
        .sort({date: 1})
        .populate('user', 'username');

    ws.send(JSON.stringify({type: 'PREV_MESSAGES', messages: prevMsg}));

    ws.on('message', async msg => {
        try {
            const decodedMessage = JSON.parse(msg);

            switch (decodedMessage.type) {
                case 'BROADCAST':
                    await broadcastHandler(ws, user, decodedMessage);
                    break;

                case 'PRIVATE':
                    await privateHandler(ws, user, decodedMessage);
                    break;

                case 'DELETE':
                    await deleteHandler(ws, user, decodedMessage);
                    break;

                default:
                    console.log('Unknown message type:', decodedMessage.type);
            }

        } catch (e) {
            console.log(e);
        }
    });

    ws.on('close', async () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
        await sendUserList();
    });

    console.log('Connections: ' + Object.keys(activeConnections).length);

};

module.exports = chat;