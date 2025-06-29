const {createJWT, isTokenValid, attachCookiesToResponse} = require('./jwt');
const {createTokenUser} = require('./createTokenUser');
const checkPermissions = require('./checkPremission');


module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions,
};
