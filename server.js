var net = require('net');
var fs = require('fs');

//http status lines
var ok = 'HTTP/1.1 200 OK';
var notFound = 'HTTP/1.0 404 Not Found';

//create a new local server
var server = net.createServer(function (request) {
  request.setEncoding('utf8');
  request.on('data', function(data){
    //Convert Header Request Line & Request Headers into an array
    var httpReqArr = data.split('\n');
    //split Header Request Line into array
    var statusArr = httpReqArr[0].split(' ');
    //seperate Request Method
    var methodReq = statusArr[0];
    //seperate Request URI
    var uriRequest = statusArr[1];

    //change '/' to full index file name
    if (uriRequest == '/'){
      uriRequest = '/index.html';
    }
    var now = new Date();
    if (methodReq === 'GET'){
      //check if file exists
      fs.readFile('./public' + uriRequest, 'utf8', function (err, data) {
        if (err) {
          request.write(notFound + '\n');
          request.write('DATE: ' + now.toUTCString() + '\n');
          request.write('SERVER: myServerrr \r\n\r\n');
          uriRequest = '/404.html';
          fs.readFile('./public' + uriRequest, 'utf8', function (err, data) {
            request.write(data + '\n');
            request.end();
          });
        }
        else {
          request.write(ok + '\n');
          request.write('DATE: ' + now.toUTCString() + '\n');
          request.write('SERVER: myServerrr\n');
          request.write('Content-Length: ' + data.length + '\n\n');
          request.write(data);
          request.end();
        }
      });
    }else if (methodReq === 'HEAD'){
      console.log('Inside HEAD');
      //check if file exists
      fs.readFile('./public' + uriRequest, 'utf8', function (err, data) {
        if (err) {
          request.write(notFound + '\n');
          request.write('DATE: ' + now.toUTCString() + '\n');
          request.write('SERVER: myServerrr \n');
          request.end();
        }
        else {
          request.write(ok + '\n');
          request.write('DATE: ' + now.toUTCString() + '\n');
          request.write('SERVER: myServerrr \n');
          request.end();
        }
      });
    }
  });
});

server.listen(8080, function () {
  console.log('Server listening on port 8080');
});
