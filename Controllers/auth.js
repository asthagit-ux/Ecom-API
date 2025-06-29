const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse, createTokenUser} = require('../utils');

const register = async (req, res) => {

    const {email, name, password } = req.body;

    const emailAlreadyExist = await User.findOne({email});
    if(emailAlreadyExist)
    {
        throw new CustomError.BadRequestError('Email Already Exist, Please enter another email');
    }

    // first user is admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin': 'user';

    const user = await User.create({name, email, password, role});
    const tokenUser = createTokenUser(user);
    // console.log(tokenUser);
    attachCookiesToResponse({res, user:tokenUser});
    res.status(StatusCodes.CREATED).json({user: tokenUser});
}

const login = async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password)
    {
        throw new CustomError.BadRequestError('please provide email and password');
    }
    const user = await User.findOne({email});
    if(!user)
    {
        throw new CustomError.UnauthenticatedError('Invalid Credentials, User not found');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) 
    {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.OK).json({user: tokenUser});
}

const logout = async (req, res) =>{
   
    res.cookie('token','logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1),
    });
    res.status(StatusCodes.OK).json({msg: 'logout successful'});
}

module.exports = {login, register, logout};
