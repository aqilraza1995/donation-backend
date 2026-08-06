const { verifyToken } = require("../utils/jwt")

const authMiddleWare = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = (authHeader && authHeader.startsWith("Bearer "))
      ? authHeader.split(" ")[1]
      : req?.cookies?.token;

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decode = verifyToken(token)
    req.user = decode
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req?.user?.role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next();
  }
}

module.exports = { authMiddleWare, verifyRole }