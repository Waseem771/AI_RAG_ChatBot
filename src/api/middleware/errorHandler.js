/**
 * Express error handling middleware
 * Ensures all errors return valid JSON responses
 */
export function errorHandler(err, req, res, next) {
  console.error('Error Handler Caught:', {
    message: err.message,
    status: err.status || 500,
    stack: err.stack
  });

  // Ensure we always return JSON
  res.setHeader('Content-Type', 'application/json');

  // Default error response
  const status = err.status || 500;
  const errorResponse = {
    error: true,
    message: err.message || 'Internal server error',
    status: status,
  };

  // Specific error messages
  if (status === 400) {
    errorResponse.message = errorResponse.message || 'Bad request';
  } else if (status === 401) {
    errorResponse.message = errorResponse.message || 'Unauthorized - check your API key';
  } else if (status === 404) {
    errorResponse.message = errorResponse.message || 'Not found';
  } else if (status === 429) {
    errorResponse.message = errorResponse.message || 'Rate limited - please try again later';
  } else if (status === 500) {
    // Don't expose internal stack traces in production
    if (process.env.NODE_ENV === 'production') {
      errorResponse.message = 'Internal server error';
    } else {
      errorResponse.details = err.stack;
    }
  }

  res.status(status).json(errorResponse);
}

// Catch-all middleware for unhandled routes
export function notFoundHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({
    error: true,
    message: 'Not found',
    status: 404,
    path: req.path,
  });
}

// Catch unhandled promise rejections
export function handleAsyncErrors(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
