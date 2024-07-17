import express from 'express'

const userRouter = express.Router()

userRouter.get('/:username', (req, res) => {
    res.send('USers')
})

export default userRouter
