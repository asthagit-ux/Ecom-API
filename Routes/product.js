const express = require('express');
const router = express.Router();
const {auth,
       authorizePermission,
     }= require('../middleware/authentication');

const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');

const {getSingleProductReviews} = require('../controllers/reviewController');

router
    .route('/')
    .post([auth, authorizePermission('admin')], createProduct)
    .get(getAllProduct);


router.post('/uploadImage',[auth, authorizePermission('admin')], uploadImage );

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([auth, authorizePermission('admin')], updateProduct)
    .delete([auth, authorizePermission('admin')], deleteProduct)

router
    .route('/:id/reviews')
    .get(getSingleProductReviews);        


module.exports = router;
