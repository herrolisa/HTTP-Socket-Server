var net = require('net');
var fs = require('fs');

//http status lines
var status200 = 'HTTP/1.1 200 OK';
var status404 = 'HTTP/1.0 404 Not Found';

//create a new local server
var server = net.createServer(function (request) {
  request.setEncoding('utf8');
  request.on('data', function(data){
    //Convert Header Request Line & Request Headers into an array
    var httpReqArr = data.split('\n');
    //split Header Request Line into array
    var reqLineArr = httpReqArr[0].split(' ');
    //seperate Request Method
    var methodReq = reqLineArr[0];
    //seperate Request URI
    var uriRequest = reqLineArr[1];

    //change '/' to full index file name
    if (uriRequest == '/'){
      uriRequest = '/index.html';
    }
    var now = new Date();

    if (methodReq === 'GET'){
      fs.readFile('./public' + uriRequest, 'utf8', function (err, responseBody) {
        if (err) {
          request.cork();
          request.write(status404 + '\n' +
            'Date: ' + now.toUTCString() + '\n' +
            'Server: myServerrr \n\n');
          uriRequest = '/404.html';
          fs.readFile('./public' + uriRequest, 'utf8', function (err, responseBody) {
            request.write(responseBody + '\n');
            request.uncork();
            request.end();
          });
        }else{
          request.cork();
          request.write(status200 + '\n' +
            'Date: ' + now.toUTCString() + '\n' +
            'Server: myServerrr\n' +
            'Content-Length: ' + responseBody.length + '\n\n');
          request.write(responseBody);
          request.uncork();
          request.end();
        }
      });
    }
    else if (methodReq === 'HEAD'){
      //check if file exists
      fs.readFile('./public' + uriRequest, 'utf8', function (err, responseBody) {
        if (err) {
          request.write(status404 + '\n' +
            'Date: ' + now.toUTCString() + '\n' +
            'Server: myServerrr \n\n');
          request.end();
        }else{
           request.write(status200 + '\n' +
            'Date: ' + now.toUTCString() + '\n' +
            'Server: myServerrr\n' +
            'Content-Length: ' + responseBody.length + '\n\n');
          request.end();
        }
      });
    }
  });
});

server.listen(8080, function () {
  console.log('Server listening on port 8080');
});
