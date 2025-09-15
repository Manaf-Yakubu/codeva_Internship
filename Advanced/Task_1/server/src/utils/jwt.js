const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
    issuer: 'codeva-app',
    audience: 'codeva-users'
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    issuer: 'codeva-app',
    audience: 'codeva-users'
  });
};

// Generate token pair
const generateTokenPair = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({
    ...payload,
    tokenId: crypto.randomUUID()
  });

  return { accessToken, refreshToken };
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Extract token from request
const extractTokenFromRequest = (req) => {
  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  
  // Check cookies
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  
  return null;
};

// Set token cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  // Access token cookie (15 minutes)
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Clear token cookies
const clearTokenCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyRefreshToken,
  extractTokenFromRequest,
  setTokenCookies,
  clearTokenCookies
};
