const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  };
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({ message: err.message });
};

class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

class DatabaseError extends BaseError {
  constructor(message) {
    super(message);
    this.message = 'DATABASE_ERROR';
    this.statusCode = 400;
  }
}

module.exports = {
  catchAsync,
  BaseError,
  globalErrorHandler,
  BaseError,
  DatabaseError
};
