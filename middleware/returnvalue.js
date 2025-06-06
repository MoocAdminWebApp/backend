const returnvalue = (req, res, next) => {
  res.sendCommonValue = function (httpStatus = 200, message, data = {}) {
    let status = httpStatus;
    let isSuccess = false;
    if (httpStatus >= 200 && httpStatus <= 204) {
      isSuccess = true;
    }
    if (typeof httpStatus !== "undefined") {
      res.status(httpStatus).json({
        isSuccess,
        status,
        data,
        time: new Date(),
        message: message instanceof Error ? message.message : message,
      });
    } else {
      res.json({
        isSuccess,
        status,
        data,
        time: new Date(),
        message: message instanceof Error ? message.message : message,
      });
    }
  };

  next();
};

module.exports = {
  returnvalue,
};
