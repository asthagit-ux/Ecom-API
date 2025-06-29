const {isTokenValid} = require('../utils');
const customError = require('../errors');

const auth = async (req, res, next) => {
    const token = req.signedCookies.token;
    if(!token)
    {
        throw new customError.UnauthenticatedError('Authentication Invalid');
    }

    try {
        const payload = isTokenValid({token});
        req.user = {userId: payload.userId, role: payload.role, name: payload.name};
        // console.log(req.user); 
        next();
    } catch (error) {
        console.log(error);
        throw new customError.Unauthenticated('Authentication Invalid');
    }
     
};


const authorizePermission = (...roles) => {  
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
        {
            throw new customError.UnauthorizedError('you are not authorized to access this route');
        }
        next();
    } 
};

module.exports = {
    auth,
    authorizePermission,
};
