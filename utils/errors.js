const errorCode = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  serverError: 500,
};

const errorMessage = {
  badRequest: "Invalid data",
  idNotFound: "Requested resource not found",
  defaultError: "An error has occurred on the server",
  validationError: "Validation failed",
};

module.exports = { errorCode, errorMessage };
