//facebook的用户账户讯息
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const _schema = new Schema({
    username: String,
    avatar: String,
    profileUrl: String,
    createAt: Date,
    updateAt: Date,
});
export default mongoose.model('FbChannel', _schema, 'fb_channels');