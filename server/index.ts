const server = require('http').createServer();
import * as dayjs from 'dayjs'

const types = {
    SEND_MESSAGE: 'SEND_MESSAGE'
}


const ws = require('socket.io')(server, {
    serveClient: false,
    pingInterval: 1000,
    pingTimeout: 5000,
    cookie: false
});




ws.on('connect', function (client) {

    const clientID = client.id;
    console.log("客户端上线:", clientID);
    client.emit('request'); // emit an event to the socket

    //通知所有人
    ws.emit('broadcast'); // emit an event to all connected sockets

    client.on("HelloWorld", res => {
        console.log(res);
    })

    client.on('reply', function () { /* */ }); // listen to the event

    client.on('disconnect', () => {
        wxid = "";
        console.log("客户端下线:", clientID)
    });


    //如果wxid是空的话说明没有登录

    let wxid = '';
    client.on('SEND_USER_INFO', (res) => {
        res = JSON.parse(res);
        console.log("当前用户:", res.nickname, ",ID:", res.wxid);
        wxid = res.wxid;
    });
    client.on('RECV_MESSAGE', (res) => {
        res = JSON.parse(res);
        console.log("收到消息:", res, ",WxID:", res.wxid);
        wxid = res.wxid;
    });

    function randWxId() {
        //const userIds = ['wxid_0gvgqgyqf4ug21', 'filehelper', '9223372041393544365@im.chatroom', '9223372041393544365@im.chatroom'];
        //const userIds = ['filehelper', '9223372041393544365@im.chatroom'];
        const userIds = ['filehelper', '9223372041393544365@im.chatroom'];
        const i = Math.floor(Math.random() * userIds.length)
        return userIds[i];
    }

    setInterval(() => {
        client.emit("LOGIN_USER_INFO");
        client.emit(types.SEND_MESSAGE, "HelloWorld");
        client.emit("CMD_GET_LOGIN_USER");//一直监控用户登录是否
    }, 1000);

    setInterval(() => {
        if (wxid == '' || !wxid) {
            return;
        }
        const wx_id = randWxId();

        //随便给用户列表发送消息
        // client.emit("CMD_SEMD_MESSAGE", {
        //     type: 'person',//1.是个人
        //     wxid: wx_id,
        //     atid: "",//at人的微信Id
        //     message: "消息测试 mov eax [耶] 北京时间：" + dayjs().format('YYYY-MM-DD HH:mm:ss')
        // });

        //25984984772519212@openim 企业微信id
        console.log("发送消息");
        client.emit('CMD_SEMD_MESSAGE', {
            type: 'group',//群聊
            wxid: '9223372041393544365@im.chatroom',
            message: "@赵俊 demo",
            atid: '25984984772519212@openim'
        })


    }, 1 * 1000);//1分钟发一次消息
});

//[20788]  

server.listen(3008, () => {
    console.log("Start At Port 3008");
})
