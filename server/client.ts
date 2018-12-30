const SocketClient = require('socket.io-client');

const client = SocketClient('ws://127.0.0.1:3008', { timeout: 4000 });


client.on('connection', function () {
    console.log("Connected");
});
client.on('event', function (data) {
    console.log(data);
});
client.on('SEND_MESSAGE', res => {
    console.log(res);
})
client.on("error", res => {
    console.log("error", "error");
})
client.on('disconnect', function () {
    console.log("123123")
});

//广播消息
client.on('broadcast', res => {

})
console.log("Connection")