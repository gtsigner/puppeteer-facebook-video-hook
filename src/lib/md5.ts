import * as crypto from 'crypto'

export default {
    md5_suffix: 'qR7mRHqlVO,ERflUmBrSd7Q{w}Qgom',
}

/**
 * md5
 * @param str 
 */
export function Md5(str: string): string {
    const obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
}