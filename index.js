const bodyParser = require('body-parser');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const prodcategoryRouter = require('./routes/prodcategoryRoute');
const blogcategoryRouter = require('./routes/blogcategoryRoute');
const {handleError, notFound} = require('./middlewares/errorHandler');
const env = require('dotenv').config();
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const app = express();

dbConnect();
const PORT = process.env.PORT || 4000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'))

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', prodcategoryRouter)
app.use('/api/blogcategory', blogcategoryRouter)

app.use(notFound)
app.use(handleError)
app.listen(PORT, () => {
    console.log(`Server is started at ${PORT}`)
})