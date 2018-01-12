"use strict";
const app = require('connect')();
const http = require('http');
const https = require('https');
const fs = require('fs');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
// const sslOptions = {
//   key: fs.readFileSync( path.join(__dirname,'sslcert/all_ncloud_com_key.pem') ),
//   cert: fs.readFileSync( path.join(__dirname, 'sslcert/all_ncloud_com_chained_cert.pem') ),
//   passphrase: "ncloud!@#123"
// };
// swaggerRouter configuration
const options = {
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: false,
};
// const allowedOrigin = [/\.ncloud\.com/];  // 포트가 달라도 허용 /\.ncloud\.com$/]
// if ( process.env.NODE_ENV === 'local' ) {
//   allowedOrigin.push(/localhost/);
// }
// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync('./api/swagger.yaml', 'utf8'); // .replace('localhost:10010', process.env.API_HOST + ":" + process.env.API_PORT );
const serverPort = 10010; //process.env.API_PORT;
const swaggerDoc = jsyaml.safeLoad(spec);
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    if (process.env.NODE_ENV !== 'local') {
        app.use(helmet());
        app.use(compression());
    }
    app.use(cookieParser());
    app.use(cors({ origin: /\.ncloud\.com/, credentials: true }));
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());
    // Validate Swagger requests
    app.use(middleware.swaggerValidator());
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi()); /*** 권한때문에 auth 체크 앞에 위치하도록 해야함 **/
    /** 권한 확인을 위한 middleware **/
    app.use((req, res, next) => {
        next();
    });
    /** Route validated requests to appropriate controller **/
    app.use(middleware.swaggerRouter(options));
    /** For Error Handling **/
    // app.use( errorHandling );
    // if ( process.env.NODE_ENV !== 'local' ) {
    //   https.createServer(sslOptions, app).listen(serverPort, ()=>{
    //     console.log( `>>>>>>>>>>>>[ ${process.env.NODE_ENV} MODE ]<<<<<<<<<<<<<`);
    //   });
    //
    //   http.createServer(app).listen(80, function () {
    //     console.log( `>>>>>>>>>>>>[ ${process.env.NODE_ENV} MODE ]<<<<<<<<<<<<<`);
    //     console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    //     console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    //   });
    // } else {
    // Start the server
    http.createServer(app).listen(serverPort, function () {
        console.log(`>>>>>>>>>>>>[ ${process.env.NODE_ENV} MODE ]<<<<<<<<<<<<<`);
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
    // }
});
