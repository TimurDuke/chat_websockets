const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exitHook = require('async-exit-hook');
const users = require('./app/users');
const config = require('./config');
const auth = require("./middleware/auth");
const Message = require("./models/Message");
const User = require("./models/User");

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/users', users);

require('express-ws')(app);

const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    exitHook(() => {
        mongoose.disconnect();
        console.log('MongoDb disconnect');
    });
};

const activeConnections = {};

const sendAll = (msg) => {
    Object.keys(activeConnections).forEach(connId => {
        const conn = activeConnections[connId];
        conn.send(JSON.stringify(msg));
    });
}

const sendUserList = async () => {
    const activeUsers = await User.find({_id: {$in: Object.keys(activeConnections)}}, '_id username');
    sendAll({type: 'USERS', activeUsers})
}

app.ws('/chat', auth, async (ws, req) => {
    const user = req.user;

    const id = user._id.toString();
    console.log('Client connected id=', id);
    activeConnections[id] = ws;

    await sendUserList();

    const prevMsg = await Message.find({recipient: {$exists: false}})
        .limit(30)
        .sort({date: 1})

    ws.on('message', async msg => {
        try {
            const decodedMessage = JSON.parse(msg);

            switch (decodedMessage.type) {
                case 'BROADCAST':
                    const data = {
                        user: user._id,
                        message: decodedMessage.message,
                        date: new Date().toISOString()
                    };
                    const newMsg = new Message(data);
                    await newMsg.save();

                    const message = await Message.populate(data,{path:"user", select:"username"});
                    sendAll({type: 'BROADCAST', message});
                    break;

                case 'PRIVATE':
                    const recipient = decodedMessage.message.recipient;
                    const conn = activeConnections[recipient];
                    conn.send(msg);
                    break;

                case 'DELETE':
                    await Message.deleteOne({_id: decodedMessage.id});
                    sendAll({type: 'DELETE', id: decodedMessage.id});
                    break;

                default:
                    console.log('Unknown message type:', decodedMessage.type);
            }

        } catch (e) {
            console.log(e)
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        sendUserList();
        delete activeConnections[id];
    });

    console.log('Connections: ' + Object.keys(activeConnections).length);

});

run().catch(e => console.log(e));