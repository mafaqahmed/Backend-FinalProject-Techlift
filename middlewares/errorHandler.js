const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const handleError = (err, req, res, next) => {
  // if(err.message === 'User already exists'){
  //     req.status(409);
  //     req.json({
  //         message: err?.message,
  //         stack: err?.stack,
  //         status: "fail"
  //     })
  // }
  // if(err.message === 'Invalid Credentials'){
  //     req.status(401);
  //     req.json({
  //         message: err?.message,
  //         stack: err?.stack,
  //         status: "fail"
  //     })
  // }
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    status: "fail",
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { handleError, notFound };
