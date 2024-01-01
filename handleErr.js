const CustomErr = require("./customErr.js");
const Response = require("./response.js");

exports.handleError = (err, req, res, next) => {
  const response = new Response(res);
  if (err instanceof CustomErr) {
    response.error(err.message, err.status);
    // res.status(err.status).json({
    //   message: err.name,
    //   statusCode: err.status,
    //   data: null,
    // });
  } else {
    response.error("Server Error", 500);
  }
};
