const http = require('http');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
const v2Router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use('/v2', v2Router);

v2Router.route('/hello')
  .get( (req, res, next) => {
    res.send('hello');
  });

v2Router.route('/getPersonByKey/:key([^/]+/[^/]+)')
  .get( (req, res, next) => {
    console.log( req.params);
    res.send('hello2');
  });



// app.get('/hi/*', (req, res, next) => {
//
//   res.send('hello');
// });

app.get('/hi/:id*/hello/:path*', (req, res, next) => {
  console.log( req.params );
  res.send('hello1');
});


app.get('/hi/*/hello', (req, res, next) => {

  console.log( req.params );
  res.send('hello2');
});

app.listen(10010, (err: Error) => {
  console.log( err );
});

// const sslOptions = {
//   key: fs.readFileSync( path.join(__dirname,'sslcert/all_ncloud_com_key.pem') ),
//   cert: fs.readFileSync( path.join(__dirname, 'sslcert/all_ncloud_com_chained_cert.pem') ),
//   passphrase: "ncloud!@#123"
// };


// const allowedOrigin = [/\.ncloud\.com/];  // 포트가 달라도 허용 /\.ncloud\.com$/]
// if ( process.env.NODE_ENV === 'local' ) {
//   allowedOrigin.push(/localhost/);
// }

//
// if( process.env.NODE_ENV !== 'local' ) {
//   app.use( helmet() );
//   app.use( compression() );
// }
//
// app.use( cookieParser() );
// app.use( cors({ origin: /\.ncloud\.com/, credentials: true }) );
//
//
// // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
// app.use(middleware.swaggerMetadata());
//
// // Validate Swagger requests
// app.use(middleware.swaggerValidator());
//
// // Serve the Swagger documents and Swagger UI
// app.use(middleware.swaggerUi());  /*** 권한때문에 auth 체크 앞에 위치하도록 해야함 **/
//
// /** 권한 확인을 위한 middleware **/
// app.use( ( req,  res, next ) => {
//   next();
// });
//
// /** Route validated requests to appropriate controller **/
// app.use( middleware.swaggerRouter(options) );
// /** For Error Handling **/
// // app.use( errorHandling );
//
