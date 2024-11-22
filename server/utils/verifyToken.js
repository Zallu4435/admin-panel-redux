const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

  // console.log(req.headers);
  
  
  const token = req.headers['authorization']?.split(' ')[1];   

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {


    console.log(err);
    console.log(decoded);
    
    
    if (err) {      
      return res.status(401).json({ message: err?.message || 'Invalid token' });
    }

    req.userId = decoded.id;

    next(); 
  });
};

module.exports = verifyToken;
