const crypto = require('crypto');

module.exports = {
    md5_suffix : 'qR7mRHqlVO,ERflUmBrSd7Q{w}Qgom',
    md5: (str) => {
        const obj = crypto.createHash('md5');
        obj.update(str);
        return obj.digest('hex');
    }
}