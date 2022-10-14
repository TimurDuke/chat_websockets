const url = require("url");
const User = require("../models/User");

const auth = async (ws, req, next) => {
    const token = url.parse(req.url, true).query.token;

    if (!token) {
        ws.send(JSON.stringify({code: 401, error: 'No token present!'}));
        ws.close();
        return;
    }

    const user = await User.findOne({token});

    if (!user) {
        ws.send(JSON.stringify({code: 401, error: "Wrong token!"}));
        ws.close();
        return;
    }

    req.user = user;

    next();
};

module.exports = auth;