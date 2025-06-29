const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const  createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.OK).json({product});
    res.send('product created')
};
const  getAllProduct = async (req, res) => {
    const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};
const  getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate('reviews');

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const  updateProduct = async (req, res) => {
    const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const  deleteProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });
  
    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
  
    await product.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};
const  uploadImage = async (req, res) => {
    if(!req.files)
    {
      throw new CustomError.BadRequestError('Upload a image');
    }
    const productImage = req.files.image;
    if(!productImage)
    {
      throw new CustomError.BadRequestError('Bola Na Please upload a image file');
    }

    const maxSixe = 1024* 1024;
    if(productImage.size > maxSixe)
    {
      throw new CustomError.BadRequestError('image size should be less the 1MB');
    }
    const imagePath = path.join(__dirname, '../public/uploads' + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`});
};


module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};

