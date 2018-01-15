import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as httpProxy from 'http-proxy';
import * as fs from 'fs';
import * as https from 'https';

const ssl = {
  key: fs.readFileSync('/root/certs/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/root/certs/cert.pem', 'utf8')
};

const options = {
  ssl,
  target: 'https://localhost:5000',
  secure: true // Depends on your needs, could be false.
};

const proxy = httpProxy.createProxyServer(options); // See (†)
const app = express();
const v2Router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', (req, res, next)=>{
  next();
});

app.use('/v2', v2Router);

v2Router.route('/')
  .get((req, res, next) => {
    /**
     * API Version Check
     * GET /v2/
     */
    // 200
    // 401
    // 404
    proxy.web(req, res);
  });

v2Router.route('/*/manifests/:reference')
  .all( (req, res, next) => {
    /**
     * PULLING AN IMAGE MANIFEST
     * GET /v2/<name>/manifests/<reference>
     */

    const { ['0']: name, reference } = req.params;

    console.log( name, reference );

    proxy.web(req, res, options);
  });

v2Router.route('/*/blob/uploads/:uuid')
  .all( (req, res, next) => {
    /**
     * PUSHING A LAYER
     * POST /v2/<name>/blobs/uploads/
     */

    const { ['0']: name, uuid } = req.params;

    console.log( name, uuid );

    proxy.web(req, res, options);
  });

v2Router.route('/*/blob/:digest')
  .all( (req, res, next) => {
    /**
     * PULLING A LAYER : GET /v2/<name>/blobs/<digest>
     * Existing Layers : HEAD /v2/<name>/blobs/<digest>
     *
     */

    const { ['0']: name, digest } = req.params;
    console.log( name, digest );
    console.log( req.params );
    proxy.web(req, res, options);
  });

v2Router.route('/_catalog')
  .all( (req, res, next) => {
    /**
     * Listing Repositories : GET /v2/_catalog
     *
     */

    const { ['0']: name, digest } = req.params;
    console.log( name, digest );
    console.log( req.params );
    proxy.web(req, res, options);
  });

v2Router.route('/*/tags/list')
  .all( (req, res, next) => {
    /**
     * Listing Repositories : GET /v2/_catalog
     *
     */

    const { ['0']: name, digest } = req.params;
    console.log( name, digest );
    console.log( req.params );
    proxy.web(req, res, options);
  });


app.use((req, res, next) => {
  // 404
  res.statusCode = 500;
  res.send('dfdfd');
});

app.use((err, req, res, next) => {
  console.log( err );
  res.statusCode = 500;
  res.send(err.message);
});

// app.listen(10010, function () {
//   console.log(`This server is running on the port ${this.address().port}`);
// });

https.createServer(ssl, app).listen(10010, function(){
  console.log("Https server listening on port " + 10010);
});
