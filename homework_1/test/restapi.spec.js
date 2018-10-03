const debug = require('debug')('test');
const assert = require('assert');
const http = require('http');
const server = require('../index');
const {StringDecoder} = require('string_decoder');

describe('Hello World HTTP functionality', () => {
    after(() => {
        process.exit();
    });

    it('It should respond with hello message for request to /hello', () => {
        http.get("http://127.0.0.1:3000/hello", (res) => {
            assert.equal(200, res.statusCode);
            res.setEncoding('utf-8');
            if(200 == res.statusCode) {
                assert.equal(res.headers['content-type'], "application/json");
                var decoder = new StringDecoder('utf-8');
                let buffer = '';
                res.on('data', (chunk) => { buffer += decoder.write(chunk); });
                res.on('end', () => {
                    buffer += decoder.end();
                    let msg = JSON.parse(buffer);
                    assert.equal(msg.msg.toLowerCase(), "hello! from the other side");
                });
            }
        });
    });

    it('It shoudl respond with error message in case of non-exist path request', () => {
        http.get("http://127.0.0.1:3000/wrong_path", (res) => {
            assert.equal(200, res.statusCode);
            res.setEncoding('utf-8');
            if(200 == res.statusCode) {
                assert.equal(res.headers['content-type'], "application/json");
                var decoder = new StringDecoder('utf-8');
                let buffer = '';
                res.on('data', (chunk) => { buffer += decoder.write(chunk); });
                res.on('end', () => {
                    buffer += decoder.end();
                    let msg = JSON.parse(buffer);
                    assert.equal(msg.msg.toLowerCase(), "something goes wrong");
                });
            }
        });
    });
});