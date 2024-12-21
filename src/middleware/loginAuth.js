const jwt = require('jsonwebtoken');

const loginAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; 
        try {
            const decoded = jwt.verify(token,process.env.USER_TOKEN );
            
            if(req.params.id===decoded.id){
                req.id = decoded.id;
                next(); 
            }
            else{
                return res.status(403).json({status:false, message: 'Invalid or expired token' });
            } 
            
        } catch (err) { 
            return res.status(403).json({status:false, message: 'Invalid or expired token' });
        }
    } else {
        return res.status(401).json({status:false, message: 'Authorization header missing' });
    }
};

module.exports = loginAuth;
