class Response {
  constructor(res) {
    this.res = res;
  }

  send(message, code = 200, data) {
    this.res.status(code).json({
      message: message,
      statusCode: code,
      data: data,
    });
  }

  error(message, code = 404, data = null) {
    this.res.status(code).json({
      message: message,
      statusCode: code,
      data: data,
    });
  }
}

module.exports = Response;
