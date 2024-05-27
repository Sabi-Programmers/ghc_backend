import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/CustomError.js';

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user && req.user.role === 'MEMBER') {
            return res.redirect('/dashboard');
        }
        if (req.user && req.user.role === 'ADMIN') {
            return res.redirect('/admin/dashboard');
        }
    }
    next();
};

const isMember = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user && req.user.role === 'MEMBER') {
            return next();
        }
        throw new CustomError(
            'You are not authorized to access this resource',
            StatusCodes.UNAUTHORIZED,
            'Unauthorized',
        );
    } else {
        return res.redirect('/auth/login');
    }
};
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user && req.user.role === 'ADMIN') {
            return next();
        }
        throw new CustomError(
            'You are not authorized to access this resource',
            StatusCodes.UNAUTHORIZED,
            'Unauthorized',
        );
    } else {
        return res.redirect('/admin/login');
    }
};

export { isAdmin, isMember, isAuthenticated };
