var net = require('net');

var input = process.argv;

var port = 80;
var host = input[2];

if (host === 'localhost') {
  port = 8080;
}

var client = net.createConnection(port, host, function () {
  console.log('connected to server!');
  client.end();
});
