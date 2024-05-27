const json = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
    });
};

const response = { json };

export default response;
