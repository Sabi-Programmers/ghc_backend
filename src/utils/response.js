const json = (res, statusCode, success, message) => {
  return res.status(statusCode).json({
    success,
    message,
  });
};

const response = { json };

export default response;
