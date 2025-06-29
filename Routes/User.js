const express = require('express');
const router = express.Router();
const {auth,
       authorizePermission,
     }= require('../middleware/authentication');

const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
} = require('../controllers/userController');

router.get('/', auth , authorizePermission('admin'), getAllUsers);
router.get('/showMe', auth, showCurrentUser);
router.patch('/updateUser', auth, updateUser);
router.patch('/updateUserPassword', auth, updateUserPassword);
router.get('/:id', auth , authorizePermission('admin') ,getSingleUser);

module.exports = router;
