const { supabase } = require('../config/supabase');
const apiResponse = require('../utils/apiResponse');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(apiResponse.error('Authorization token missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Error verifying Supabase token:', error);
      return res.status(401).json(apiResponse.error('Invalid or expired token', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Unexpected error verifying token:', error);
    return res.status(500).json(apiResponse.error('Internal server error', 500));
  }
};

module.exports = verifyToken;
