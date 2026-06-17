// generic shape — works regardless of validation library
function validate({ body, query, params } = {}) {
  return (req, res, next) => {
    const targets = { body, query, params };

    for (const [key, schema] of Object.entries(targets)) {
      if (!schema) continue;

      const result = schema.safeParse(req[key]); // ← the "adapter" call
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: result.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        });
      }

      // params and query may be read-only in newer Express — store separately
      if (key === 'body') req.body = result.data;
      else req[`validated${capitalize(key)}`] = result.data;
    }
    next();
  };
}

// function validate({ body, query, params } = {}) {
//   return (req, res, next) => {
//      if (body) {
//       const result = body.safeParse(req.body);
//       if (!result.success) {
//         return res.status(400).json({
//           error: 'Validation failed',
//           issues: result.error.issues.map(i => ({
//             field: i.path.join('.'),
//             message: i.message
//           }))
//         });
//       }
//       req.body = result.data;
//     }

//     if (query) {
//         const result = query.safeParse(req.query);
//         if (!result.success) {
//           return res.status(400).json({
//             error: 'Validation failed',
//             issues: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
//           });
//         }
//         req.validatedQuery = result.data;  // ← store here; req.query is read-only in newer Express
//       }
//   next();
//   }
// }

module.exports = validate