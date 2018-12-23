const mongoose = require('mongoose');
import config from '../config'
mongoose.connect(config.mongo.uri);
console.debug('mongodb connect success');
export default mongoose.connection;