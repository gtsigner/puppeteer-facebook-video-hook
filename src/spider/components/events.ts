import * as dayjs from 'dayjs'
const consola = require('consola')

export enum ConsoleTypes {
    error = 'error',
    debug = 'debug',
    log = 'log',
    info = 'info'
}

export async function bindConsole(page, callback) {
    page.on('console', msg => {
        if (msg._type === ConsoleTypes.error) {
            //如果出现错误，我们应该考虑是不是应该重新加载一下页面
            consola.error(msg._text)
            page.reload();
        }
        if (msg._type === ConsoleTypes.info) {
            consola.warn("信息输出：" + msg._text);
        }
        //Debug 调试信息
        if (msg._type == ConsoleTypes.debug) {
            try {
                let result = msg._text.match(/zk-dage-666(.*)/)[1]
                result = JSON.parse(result);
                //result.timestamp = dayjs(result.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
                //console.log(result);
                //callback(result.data);
            } catch (e) {
                consola.error('Console：', e);
            }
        }
    });
}

export async function bindEvents(page) {

}
