var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send('Word Mapper says: Hello World!');
});

app.listen(80, function () {
  console.log('Word Mapper listening on port 80!');
});
