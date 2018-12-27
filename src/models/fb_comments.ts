//facebook的用户账户讯息
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const _schema = new Schema({
    channel: {
        type: String,
        required: true
    },
    hashId: {
        type: String,
        //unique: true,
        required: true,
        default: '',
    },
    videoId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        default: ''
    },
    avatar: String,
    profileUrl: String,
    sortUrl: String,
    content: {
        type: String,
        default: '',
    },
    createAt: Date,
    updateAt: Date,
});

export default mongoose.model('FbComments', _schema, 'fb_comments');