import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import response from '../../utils/response.js';
import database from '../../libs/prisma.js';
import asyncWrapper from '../../middlewares/asyncWrapper.js';

const createAdmin = asyncWrapper(async (req, res) => {
    const { username, password, email, isSuperAdmin } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await database.admin.create({
            data: {
                username: username.toLowerCase(),
                password: hashedPassword,
                email: email.toLowerCase(),
                isSuperAdmin: !!isSuperAdmin,
            },
        });

        return response.json(
            res,
            StatusCodes.CREATED,
            true,
            'Account created Successfully',
        );
    } catch (err) {
        let error = 'something went wrong';

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (err.code === 'P2002') {
                if (err.meta.target.includes('username')) {
                    error = 'Username already exists';
                } else if (err.meta.target.includes('email')) {
                    error = 'Email already exists';
                } else if (err.meta.target.includes('phone')) {
                    error = 'Phone Number already exists';
                } else {
                    error = err.meta.target;
                }
            }
        }
        return response.json(res, StatusCodes.BAD_REQUEST, false, error);
    }
});

const loginAdmin = asyncWrapper(async (req, res, next) => {
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) {
            return response.json(
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                'Internal Server Error',
            );
        }
        if (!user) {
            return response.json(
                res,
                StatusCodes.UNAUTHORIZED,
                false,
                info.message,
            );
        }

        req.logIn(user, (err) => {
            if (err) {
                return response.json(
                    res,
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    false,
                    'Internal Server Error',
                );
            }

            // If authentication was successful, send a success response
            return response.json(res, StatusCodes.OK, true, 'Login successful');
        });
    })(req, res, next);
});

const getAdminLoginPage = asyncWrapper((req, res) => {
    res.render('auth/admin-login', {
        title: 'Admin Login',
        data: { error: null },
    });
});

const logoutAdmin = asyncWrapper(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            return response.json(
                res,
                StatusCodes.OK,
                true,
                'Logout successful',
            );
        });
    });
});

export { createAdmin, loginAdmin, getAdminLoginPage, logoutAdmin };
