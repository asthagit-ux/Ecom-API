const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse, createTokenUser} = require('../utils');

const getAllUsers = async (req, res) => {

    const  users = await User.find({role: 'user'}).select('-password');
    res.status(StatusCodes.OK).json({users});
}
const getSingleUser = async (req, res) => {
    const {id:userId} = req.params;
    // console.log(req.params);
    // console.log(userId);
    const  user = await User.findOne({ _id:userId }).select('-password');
    if(!user)
    {
        throw new CustomError.NotFoundError('User does not exist');
    }
    res.status(StatusCodes.OK).json({user});
}
const showCurrentUser = async (req, res) => {
    const {userId} = req.user;
    const  user = await User.findOne({ _id:userId }).select('-password');
    if(!user)
    {
        throw new CustomError.NotFoundError('you are logged in but we cant find you sorry!!!');
    }
    res.status(StatusCodes.OK).json({user});
};
const updateUser = async (req, res) => {
    const {name, email} = req.body;
    if(!name || !email)
    {
        throw new CustomError.BadRequestError('please provide all values');
    }

    const user = await User.findOneAndUpdate(
        {_id: req.user.userId}, 
        {email, name}, 
        {new: true, runValidators: true}
        );
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.OK).json({user: tokenUser});

};

const updateUserPassword = async (req, res) => {

    const {oldPassword, newPassword} = req.body;
    console.log(req.body);
    if(!oldPassword || !newPassword)
    {
        throw new CustomError.BadRequestError('Dont leave the fields blank');
    }

    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect)
    {
        throw new CustomError.UnauthorizedError('Invalid Old Password');
    }
    if(oldPassword === newPassword)
    {
        throw new CustomError.BadRequestError('new Password cannot match old Password')
    }
    user.password = newPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({msg: 'Password Updated Successfully'});

    // res.send('success');

}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};
