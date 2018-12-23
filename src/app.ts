import express from "express";
import users from './router/users'
import auth from './router/auth'
import events from './router/events'
import bodyParser from 'body-parser'

let app = express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else next();
});
app.use(bodyParser.json());


app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/events', events)
app.get('/', (req, res) => {
    res.send('hello 111');
})

app.listen(8080, () => console.log('Runing on locahost:8080'));