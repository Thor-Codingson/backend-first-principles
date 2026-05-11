function validate({ body, query, params } = {}) {
  return (req, res, next) => {
     if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: result.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message
          }))
        });
      }
      req.body = result.data;
    }

    if (query) {
        const result = query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json({
            error: 'Validation failed',
            issues: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
          });
        }
        req.validatedQuery = result.data;  // ← store here; req.query is read-only in newer Express
      }
  next();
  }
}

module.exports = validate