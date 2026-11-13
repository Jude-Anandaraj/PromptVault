// Runs when no route matched the request.
export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler. Express sends any error thrown in a route here.
// Every error response has the same shape: { "error": "message" }.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON.' });
  }

  const status = err.status || err.statusCode || 500;

  // Server errors are logged in full but never shown to the client.
  if (status >= 500) {
    console.error(err);
    return res.status(status).json({ error: 'Internal server error.' });
  }

  res.status(status).json({ error: err.message });
}
