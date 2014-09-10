// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10) 

var port = 3000;
var serverUrl = "127.0.0.1";
var http = require("http");
var path = require("path"); 
var fs = require("fs");     
var xtraPath = '';
var server = http.createServer(function(req, res) {

  var filename = req.url;
  console.log('The filename is ' + filename)
  console.log(filename.indexOf('.'))
  if(filename == null || filename == "/" || filename.indexOf('.') === -1) { 
    xtraPath = '/'+filename;
    filename = xtraPath+"/index.html" 
  }
  var localPath = path.join(__dirname, filename);
  console.log(__dirname + ' is the __dirname')
  var validExtensions = {
    ".html" : "text/html",      
    ".js": "application/javascript", 
    ".css": "text/css",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png",
    ".ico": "image/ico"
  };
  var ext = path.extname(filename);
  var mimeType = validExtensions[ext];

  if(mimeType) {
    
    fs.exists(localPath, function(exists) {

      if(exists) {
        console.log("Serving file: " + filename);
        getFile(localPath, res, mimeType);
      } 
      else {
        console.log("File not found: " + localPath);
        res.writeHead(404);
        res.end("File not found [" + filename + "]");
      }

    });

  } 
  else {
    console.log("Invalid file extension detected [" + ext + "]");
    res.writeHead(500);
    res.end("Invalid file extension detected");
  }

});


function getFile(localPath, res, mimeType) {

  fs.readFile(localPath, function(err, contents) {
    if(err) {
      console.log("ERROR: " + err);
      res.writeHead(500);
      res.end();
    } 
    else {
      res.setHeader("Content-Length", contents.length);
      res.setHeader("Content-Type", mimeType);
      res.statusCode = 200;
      res.end(contents);
    }
  });

}

console.log("Starting web server at " + serverUrl + ":" + port);
server.listen(port, serverUrl);