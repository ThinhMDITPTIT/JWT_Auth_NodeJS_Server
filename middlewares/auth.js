const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log('token: ', token);

  if (!token) return res.status(401).json({ message: 'Invalid credentials [have no token in header]' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
    // console.log(decoded);
    req.userId = decoded.id;
    // Verify token done successfully => can proceed further (ex: return data)
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Invalid credentials [wrong token]' });
  }
}

module.exports = verifyToken;