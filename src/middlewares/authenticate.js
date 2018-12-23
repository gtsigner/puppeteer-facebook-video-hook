import jwt from 'jsonwebtoken'
import config from '../config'

export default (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decodeed) => {
            if (err) {
                res.status(401).json({
                    error: 'Failed to authenticate'
                })
            } else {
                // new User({
                //     id: decodeed.id,
                // }).
                // 使用这个方法查找到这个数据的所有信息
                User.query({
                    where: {
                        id: decodeed.id
                    },
                    select: ['email', 'id', 'username']
                    //使用select选择部分自己需要的信息
                }).fetch().then(user => {
                    if (!user) {
                        res.status(404).json({
                            error: 'No such user!'
                        });
                    } else {
                        req.currentUser = user;
                        next()
                    }
                })
            }
        })
    } else {
        res.status(403).json({
            error: 'No token provied!'
        })
    }
}