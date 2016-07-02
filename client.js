var net = require('net');

//assign [node client.js path] to variable
var input = process.argv;

var port = 80;
var host = input[2];
if (host === undefined){
  console.log('Please add a URL to request. See example: "node client.js www.google.com"');
  process.exit();
}
var method = 'HEAD';
var uriRequest = '/';

//seperate uri from host name if '/' is present
if (host.indexOf('/') !== -1){
  uriRequest = host.substring(host.indexOf('/'));
  host = host.substring(0, host.indexOf('/'));
}

if (host === 'localhost') {
  port = 8080;
}

var client = net.createConnection(port, host, function () {
  client.setEncoding('utf8');
  console.log('connected to server!');
  var res;

  var now = new Date();
  client.write(method + ' ' + uriRequest +' HTTP/1.0\r\n' +
    'DATE: ' + now.toUTCString() + '\r\n' +
    'HOST: ' + host + ' \r\n' +
    'USER-AGENT: meeeeeeee');
  client.on('data', function (data) {
    console.log('data' + Date.now());
    // Log the response from the HTTP server
    // var responseHeaders = [];
    // console.log(data.substring(0, data.indexOf('<!DOCTYPE html>')));
    res = data.split('\n');
    console.log(res);
    console.log(res[0]);
    // console.log(data);
    // process.stdout.write(data);
    client.end();
  });

});