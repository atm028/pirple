const debug = require('debug')('http');
const http = require('http');
const url = require('url');
const config = require('./lib/config');
const {StringDecoder} = require('string_decoder'); 
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


debug("Create HTTP Server");
const httpServer = http.createServer((req, res) => {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObject = parsedUrl.query;
    var decoder = new StringDecoder('utf-8');
    var method = req.method.toLowerCase();
    var headers = req.headers;
    var buffer = '';

    req.on('data', (data) => { buffer += decoder.write(data); });
    
    req.on('end', () => {
        buffer += decoder.end();
        debug("reg: ", trimmedPath, buffer);

        let handler = typeof(router[trimmedPath]) !== 'undefined' 
                        ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };
        console.log(data);
        handler(data, (code, payload) => {
            code = typeof(code) !== 'number' ? code : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            let payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(code);
            debug("res: ", payloadString);
            res.end(payloadString);
        });
    });
});

debug("Start listening on port ", config.httpPort);
httpServer.listen(config.httpPort, () => {
    debug("Server started listening on port: ", config.httpPort);
    console.log("Server started listening on port: ", config.httpPort);
});

router = {
    "hello": handlers.hello,
    "users": handlers.users,
    "tokens": handlers.tokens
};