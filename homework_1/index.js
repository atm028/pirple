const debug = require('debug')('http');
const http = require('http');
const url = require('url');
const config = require('./config');
const {StringDecoder} = require('string_decoder'); 


debug("Create HTTP Server");
const httpServer = http.createServer((req, res) => {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.path;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', (data) => { buffer += decoder.write(data); });
    
    req.on('end', () => {
        buffer += decoder.end();
        debug("reg: ", trimmedPath, buffer);

        let handler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        debug("handler: ", handler);

        handler(buffer, (code, payload) => {
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
});

var handlers = {};

handlers.hello = function(data, callback) {
    callback(200, {"msg": "Hello! From the other side"});
}

handlers.notFound = function(data, callback) {
    callback(404, {"msg": "Something goes wrong"});
}

router = {
    "hello": handlers.hello
};