const jwt = require('jsonwebtoken');
const customError = require('../errors');

const createJWT = ({payload}) => {

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
    return token;
};

const isTokenValid = ({token}) => {
    const payload =  jwt.verify(token, process.env.JWT_SECRET);
    return payload;
};

const attachCookiesToResponse = ({res, user}) => {                                                                                      

    const token = createJWT({payload: user});
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
};

module.exports = { 
     createJWT,
     isTokenValid,
     attachCookiesToResponse,
    };
