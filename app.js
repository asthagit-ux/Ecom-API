// basic config
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


// import database connection
const connectDB = require('./db/connect');

// swagger ui 
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocs = YAML.load('./swagger.yaml');

// extra packages 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');  

// import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');


// import error handler middlewares 
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



//middlewares 
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());
// routing
app.get('/', (req, res) =>{
    res.send('<h1>Ecommerece API</h1> <h1> Click on the<a href = "/api-docs"> Documentation <a> to test the endpoints</h1> ');
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);


// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async (req , res) => {
    try{
        // console.log(process.env.MONGO_URI);
        await connectDB(process.env.MONGO_URI);

        app.listen(port, ()=> {
            console.log(`Server listening on the port ${port}....`);
        });

    }
    catch(error){
        console.log(error);
    }
}

start();
console.log('E-Commerce API');
