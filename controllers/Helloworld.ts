export function sayhelloUsingGET( req, res, next ) {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ res: 'hello' }));
}
