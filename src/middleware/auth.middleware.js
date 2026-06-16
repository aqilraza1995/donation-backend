const { verifyToken } = require("../utils/jwt")

const authMilldleWare = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
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

module.exports = { authMilldleWare, verifyRole }