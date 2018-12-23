import express from 'express';
import jwt from 'jsonwebtoken'
import md5 from '../lib/md5'
import config from '../config'

let router = express.Router();

router.post('/', (req, res) => {
    const {
        identifier,
        password
    } = req.bodyyarn 

    User.query({
        where: {
            email: identifier
        },
        orWhere: {
            username: identifier
        }
    }).fetch().then(user => {
        if (user) {
            if (md5.md5(password) === user.get('password_digest')) {
                const token = jwt.sign({
                    id: user.get("id"),
                    username: user.get('username'),
                }, config.jwtSecret)
                res.json({
                    token
                })
            } else {
                res.status(401).json({
                    errors: {
                        form: 'Invalid Credientals'
                    }
                })
            }
        } else {
            res.status(401).json({
                errors: {
                    form: 'Invalid Credientals'
                }
            })
        }
    })
})

export default router;