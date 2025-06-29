const express = require('express');
const router = express.Router();

const {auth, authorizePermission} = require('../middleware/authentication');

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
} = require('../controllers/orderController');

router
    .route('/')
    .get(auth, authorizePermission('admin'),getAllOrders)
    .post(auth, createOrder);

router
    .route('/showAllMyOrders')
    .get(auth, getCurrentUserOrders);

router
    .route('/:id')
    .get(auth, getSingleOrder)
    .patch(auth, updateOrder);

module.exports = router;
