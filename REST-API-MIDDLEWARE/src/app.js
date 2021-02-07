/****
 *@Description : The main function which contain all the middleware, routing configurations and error
 *@author Renjith .
 *@license Apache 2.0 
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, ".." ,'.env') });
const swaggerUi    = require("swagger-ui-express");
var someObject     = require('./swaggerimport')
const cors         = require('cors');
const createError  = require('http-errors');
const express      = require('express');
const clientRouter = require('./routes/client');
const morgan       = require('morgan') ;
const rateLimit    = require("express-rate-limit");
 

let options = {
    explorer: true,
    customSiteTitle: "IBS lookup and duration -Chaincode API",
    customCss: `
  .topbar-wrapper img {content:url(https://www.ibsplc.com/); width:50px; height:auto;}
  .swagger-ui .topbar { background-color: #c80680; background: -webkit-linear-gradient(left, #c80680 0%, #731472 41%); background: -moz-linear-gradient(left, #c80680 0%, #731472 41%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$left', endColorstr='$right',GradientType=0 ); background: linear-gradient(to right, #c80680 0%, #731472 41%); border-bottom: 20px solid #5dc6d1;background: -moz-linear-gradient(left, #c80680 0%, #731472 41%); }`,
  };
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
   
app.use(limiter);
app.use(cors());
app.use(morgan('tiny'));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(someObject.swaggerDocs(), options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1/api/lookupandduration', clientRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json( { "message": err.message ,  stack : err.stack});
});


module.exports = app;