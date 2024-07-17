import express from 'express'
import {
    createAdmin,
    loginAdmin,
    getAdminLoginPage,
    logoutAdmin,
} from '../../controllers/admin/auth.js'
import {
    validateAuth,
    validateLoginAuth,
} from '../../validators/authValidators.js'
import { isAuthenticated } from '../../middlewares/auth.js'

const authRouter = express.Router()

authRouter.get('/login', isAuthenticated, getAdminLoginPage)

authRouter.post(
    '/login',
    isAuthenticated,
    validateLoginAuth,
    validateAuth,
    loginAdmin
)

authRouter.post('/create-admin', isAuthenticated, createAdmin)

authRouter.post('/logout', logoutAdmin)

export default authRouter
