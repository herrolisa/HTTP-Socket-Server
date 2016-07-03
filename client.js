var net = require('net');

//assign [node client.js path] to variable
var input = process.argv;

var host = input[2];
if (host === undefined){
  console.log('Please use this format: node client.js [url] [request method] [Headers Only (Yes/No)] [PORT]\nExample: "node client.js www.google.com GET No 80"');
  process.exit();
}
var methodReq = input[3] || 'GET';
var headersOnly = input[4];
if (headersOnly !== undefined){
  headersOnly = input[4].toLowerCase();
}
var port = input[5] || 80;
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
  var now = new Date();
  client.write(methodReq + ' ' + uriRequest +' HTTP/1.1\n' +
    'Date: ' + now.toUTCString() + '\n' +
    'Host: ' + host + '\n' +
    'User-Agent: meeeeeeee' + '\n\n');
  client.on('data', function (data) {
    // Log the response from the HTTP server
    var dataArr = data.split('\n'); //convert all requested data into an array
    var statusArr = dataArr[0].split(' '); //convert status line into an array
    var headBodySplit = data.split(/(\r\n\r\n|\n\n)/);
    var headersArr = data.split('\n').slice(1, dataArr.indexOf('')); //put all response headers in seperate array
    //store response headers in hashtable
    var responseHeaders = {
      'HTTP-Version': statusArr[0],
      'Status Code': statusArr[1],
      'Reason Phrase': statusArr[2]
    };
    headersArr.forEach(function (elem) {
      var key = elem.substring(0, elem.indexOf(':') + 1);
      responseHeaders[key] = elem.substring(elem.indexOf(':') + 2);
    });
    // process.stdout.write(data);
    if (headersOnly === 'yes'){
      process.stdout.write(headBodySplit[0]);
    }else{
      process.stdout.write(data);
    }
    client.end();
  });

});