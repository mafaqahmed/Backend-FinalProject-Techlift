const bodyParser = require('body-parser');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const {handleError, notFound} = require('./middlewares/errorHandler');
const env = require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

dbConnect();
const PORT = process.env.PORT || 4000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user', authRouter)

app.use(notFound)
app.use(handleError)
app.listen(PORT, () => {
    console.log(`Server is started at ${PORT}`)
})