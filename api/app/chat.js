const Message = require("../models/Message");
const User = require("../models/User");

const activeConnections = {};

const sendAll = (msg) => {
    Object.keys(activeConnections).forEach(connId => {
        const conn = activeConnections[connId];
        conn.send(JSON.stringify(msg));
    });
};

const sendUserList = async (ws) => {
    try {
        const activeUsers = await User.find({_id: {$in: Object.keys(activeConnections)}}, '_id username');
        sendAll({type: 'USERS', activeUsers});
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({type: 'ERROR', error: 'Internal server error'}));
    }
};

const prevHandler = async (ws) => {
    try {
        await Message.find({recipient: {$exists: false}}).exec(async (err, messages) => {
            const prevMsg = await Message.find({recipient: {$exists: false}})
                .skip(messages.length > 30 ? messages.length - 30 : 0)
                .sort({date: 1})
                .populate('user', 'username role');

            sendAll({type: 'PREV_MESSAGES', messages: prevMsg});
        });
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({type: 'ERROR', error: 'Internal server error'}));
    }
};

const broadcastHandler = async (ws, user, decodedMessage) => {
    try {
        if (!decodedMessage.message || decodedMessage.message.trim().length === 0) {
            ws.send(JSON.stringify({type: 'ERROR', error: 'Message cannot be empty'}));
            return;
        }

        const data = {
            user: user._id,
            message: decodedMessage.message,
            date: new Date().toISOString()
        };
        const newMsg = new Message(data);
        await newMsg.save();
        const message = await Message.populate(newMsg, {path: "user", select: "username role"});
        sendAll({type: 'BROADCAST', message});
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({type: 'ERROR', error: 'Internal server error'}));
    }
};

const privateHandler = async (ws, user, decodedMessage) => {
    try {
        if (!decodedMessage.message || decodedMessage.message.trim().length === 0) {
            ws.send(JSON.stringify({type: 'ERROR', error: 'Message cannot be empty'}));
            return;
        }

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

            const message = await Message.populate(privateMsg, [{path: "user", select: "username"}, {
                path: "recipient",
                select: "username"
            }]);

            conn.send(JSON.stringify({type: 'PRIVATE', message}));
            ws.send(JSON.stringify({type: 'PRIVATE', message}));
        } else {
            ws.send(JSON.stringify({type: 'ERROR', error: 'Recipient not found'}));
        }
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({type: 'ERROR', error: 'Internal server error'}));
    }
};

const deleteHandler = async (ws, user, decodedMessage) => {
    try {
        if (user.role === 'moderator') {
            await Message.deleteOne({_id: decodedMessage.id});
            await prevHandler(ws);
        } else {
            ws.send(JSON.stringify({type: 'ERROR', error: 'Forbidden'}));
        }
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({type: 'ERROR', error: 'Internal server error'}));
    }
};

const chat = async (ws, req) => {
    const user = req.user;

    const id = user._id.toString();
    if (activeConnections[id]) {
        ws.send(JSON.stringify({type: 'ERROR', error: 'Connection already exist'}));
        return;
    }
    activeConnections[id] = ws;
    console.log('Client connected id=', id);

    await sendUserList(ws);

    await prevHandler(ws);

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
            ws.send(JSON.stringify({type: 'ERROR', error: 'Bad request'}));
        }
    });

    ws.on('close', async () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
        await sendUserList(ws);
    });

    console.log('Connections: ' + Object.keys(activeConnections).length);

};

module.exports = chat;