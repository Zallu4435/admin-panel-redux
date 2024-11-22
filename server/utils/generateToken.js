const jwt = require("jsonwebtoken");

module.exports = async (user) => {
    const payload = {
        id: user._id,  
        role: user.role 
    };

    const options = {
        expiresIn: '1h' 
    };

    return jwt.sign(payload, process.env.SECRET_KEY, options);
};
