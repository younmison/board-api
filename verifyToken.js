const Response = require("./response");
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const response = new Response(res);
  if (req.path.indexOf("/user/") === 0) {
    return next();
  }
  const userToken = req.headers.authorization;
  jwt.verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
    if (decoded) {
      return next();
    }
    if (err.message == "jwt expired") {
      return response.error(err.message, 410, null);
    }
  });
};
