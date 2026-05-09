function authorize(requiredRole){
  return function(req, res, next) {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({error:'Forbidden or Insufficient permission'})
    }
    next();
  };
}

module.exports = authorize