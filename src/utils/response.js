const json = (res, statusCode, success, message, data = null) => res.status(statusCode).json({
        success,
        message,
        data,
    });

const response = { json };

export default response;
