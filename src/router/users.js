import express from 'express'
import isEmpty from 'lodash/isEmpty'
import validator from 'validator'
import md5 from '../lib/md5'
// bcrypt
// bcrypt需要使用python模块

let router = express.Router();

const commonValidateInput = (data) => {
    let errors = {};
    if (validator.isEmpty(data.username)) {
        errors.username = 'the field is require';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'the field is require';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'email is invalid!';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'the field is require';
    }
    if (validator.isEmpty(data.passwordConfirmation)) {
        errors.passwordConfirmation = 'the field is require';
    }
    if (!validator.equals(data.passwordConfirmation, data.password)) {
        errors.passwordConfirmation = 'password must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateInput = (data, otherValidataions) => {
    let {
        errors
    } = otherValidataions(data)

    // 使用另外一种方法来处理
    return User.query({
        where: {
            email: data.email
        },
        orWhere: {
            username: data.username
        }
    }).fetch().then(user => {
        //该方法查询数据库的结果如果查询到的话就说明存在，则进行判断是具体用户名还是密码
        if (user) {
            if (user.get('username') == data.username) {
                errors.username = 'There is user whth such username!';
            }
            if (user.get('email') == data.email) {
                errors.email = 'There is user whth such email!';
            }
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    })
}
router.get('/:identifier', (req, res) => {    
    User.query({
        select: ["username", "email"],
        //选择那些项目
        where: {
            email: req.params.identifier
            //查询mail等于req.params.identifier
        },
        orWhere: {
            username: req.params.identifier
            //或者查询username等于req.params.identifier
        }
    }).fetch().then(user => {
        // 返回结果
        res.json({
            user
        })
    })
})
router.post('/', (req, res) => {

    validateInput(req.body, commonValidateInput).then(({
        errors,
        isValid
    }) => {
        if (isValid) {
            const {
                username,
                password,
                email
            } = req.body;

            User.forge({
                username,
                ['password_digest']: md5.md5(password),
                email
            }, {
                hasTimestamps: true
            }).save().then(user => res.json({
                success: true
            })).catch(err => res.status(500).json({
                errors: err
            }));
        } else {
            res.status(400).json(errors);
        }
    });
})
export default router;