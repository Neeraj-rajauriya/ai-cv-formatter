import jwt from 'jsonwebtoken';

// export const authMiddleware = async (req, res, next) => {
//   try {
//     // Get token from header
//     const token = req.header('Authorization')?.replace('bearer ', '');

//     if (!token) {
//       return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user info to request
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('JWT Auth Error:', error.message);
//     return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
//   }
// };


export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header (support both "Bearer" and "bearer")
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Extract token (handles "Bearer <token>" or "bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Invalid token format.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Auth Error:', error.message);
    
    // More specific error messages
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }

    return res.status(401).json({ 
      success: false, 
      message,
      error: error.message 
    });
  }
};