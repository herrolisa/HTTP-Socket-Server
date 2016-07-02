var net = require('net');

//assign [node client.js path] to variable
var input = process.argv;

var port = 80;
var host = input[2];
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

  var now = new Date();
  client.write('GET ' + uriRequest +' HTTP/1.0\r\n\r\n' +
    'DATE: ' + now.toUTCString() + '\r\n' +
    'HOST: ' + host + ' \r\n' +
    'USER-AGENT: meeeeeeee');
  client.on('data', function (data) {
    // Log the response from the HTTP server
    console.log(data);
    client.end();
  });

});