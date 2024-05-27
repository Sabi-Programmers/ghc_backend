import { StatusCodes } from 'http-status-codes';
import CustomError from './CustomError.js';

const errorHandler = (err, req, res, next) => {
    console.log('From Error Handler: ' + err);
    if (err instanceof CustomError) {
        return res.render('error-page', {
            title: err.title,
            statusCode: err.statusCode,
            message: err.message,
        });
    }

    return res.render('error-page', {
        title: 'Internal Server Error',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'You are seeing this page cos something went wrong',
    });
};

export default errorHandler;
