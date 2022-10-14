const mongoose = require("mongoose");
const idValidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

MessageSchema.plugin(idValidator, {message: 'Bad ID value for {PATH}'});
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;