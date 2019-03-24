class NotFoundError extends Error {
  constructor(message, description) {
    super(message);
    this.name = 'NotFoundError';
    this.description = description;
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message, description) {
    super(message);
    this.name = 'ConflictError';
    this.description = description;
    this.statusCode = 409;
  }
}

class DatabaseError extends Error {
  constructor(message, description) {
    super(message);
    this.name = 'DatabaseError';
    this.description = description;
    this.statusCode = 500;
  }
}

class InternalError extends Error {
  constructor(message, description) {
    super(message);
    this.name = 'InternalError';
    this.description = description;
    this.statusCode = 500;
  }
}

class ValidationError extends Error {
  constructor(message, description) {
    super(message);
    this.name = 'ValidationError';
    this.description = description;
    this.statusCode = 409;
  }
}

module.exports = {
  NotFoundError,
  ConflictError,
  DatabaseError,
  InternalError,
  ValidationError,
};