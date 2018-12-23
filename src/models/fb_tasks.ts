//facebook的用户账户讯息
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const _schema = new Schema({
    channelUrl: String,
    startAt: Date,
    finishAt: Date,
    deleted: {
        type: Boolean,
        default: false,
    },
    status: Number
});

export default mongoose.model('FbTask', _schema, 'fb_tasks');