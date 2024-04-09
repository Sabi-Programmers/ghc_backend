import { StatusCodes } from "http-status-codes";

import CustomErrorApi from "./CustomError.js";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomErrorApi) {
    return res.render("error-page", {
      title: "Error",
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  // if (Object.prototype.hasOwnProperty.call(err, 'meta')) {
  //     return response(
  //         res,
  //         StatusCodes.BAD_REQUEST,
  //         'Bad Request',
  //         null,
  //         err.meta,
  //     );
  // }

  return res.render("error-page", {
    title: "Internal Server Error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "You are seeing this page cos something went wrong",
  });
};

export default errorHandler;
