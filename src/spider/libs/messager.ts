/**
 * 控制台消息类型
 */
export enum ConsoleMsgType {
    comment = 'comment',
}
/**
 * 控制台消息包装
 */
export interface ConsoleMsg {
    type: String,
    message: any
}