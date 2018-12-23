import * as dayjs from 'dayjs'
import consola from 'consola'

export enum ConsoleTypes {
    error = 'error',
    debug = 'debug',
    log = 'log'
}

export async function bindConsole(page, callback) {
    page.on('console', msg => {
        if (msg._type === ConsoleTypes.error) {
            console.log(msg._text);
        }
        //Debug 调试信息
        if (msg._type == ConsoleTypes.debug) {
            try {
                let result = msg._text.match(/zk-dage-666(.*)/)[1]
                result = JSON.parse(result);
                result.timestamp = dayjs(result.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
                callback(result);
            } catch (e) {
                console.error(e.message);
            }
        }
    });
}
