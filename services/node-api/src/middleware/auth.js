const crypto = require('crypto');

// Simple authentication middleware
// In production, use JWT (jsonwebtoken) and proper security

// Generate a simple token (in production, use JWT)
function generateToken(userId, username, role) {
  const tokenData = {
    userId,
    username,
    role,
    timestamp: Date.now(),
    random: crypto.randomBytes(16).toString('hex')
  };
  
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

// Parse and verify token
function parseToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const data = JSON.parse(decoded);
    
    // Check if token is not older than 24 hours
    const ageInHours = (Date.now() - data.timestamp) / (1000 * 60 * 60);
    if (ageInHours > 24) {
      return null;
    }
    
    return data;
  } catch (error) {
    return null;
  }
}

// Middleware to verify authentication
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  const userData = parseToken(token);
  
  if (!userData) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Attach user data to request
  req.user = userData;
  next();
}

// Middleware to check specific roles
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Role '${req.user.role}' does not have permission to access this resource`
      });
    }
    
    next();
  };
}

// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + process.env.PASSWORD_SALT || 'default-salt-change-me')
    .digest('hex');
}

// Verify password
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

module.exports = {
  generateToken,
  parseToken,
  authenticate,
  authorize,
  hashPassword,
  verifyPassword
};
