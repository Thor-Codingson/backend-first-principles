function corsMiddleware(req, res, next){
  const origin = req.headers.origin;

  const allowedOrigins = ['http://localhost:5173'];

  if (req.path === '/public') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
}

module.exports = corsMiddleware