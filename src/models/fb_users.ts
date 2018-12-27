//facebook的用户账户讯息
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const _schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    username: String,
    avatar: String,
    uri: String,
    is_friend: Boolean,
    type: String,
    profileUrl: String,
    createAt: Date,
    updateAt: Date,
});

export default mongoose.model('FbUser', _schema, 'fb_users');