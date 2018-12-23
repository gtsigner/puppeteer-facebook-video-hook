import express from 'express'
import authenticate from '../middlewares/authenticate'

let router = express.Router()


router.post('/', authenticate, (req, res) => {
    res.status(201).json({
        users: req.currentUser
    })
})

export default router;