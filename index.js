var express = require('express');
var app = express();
var pack = require('./route/pack');

app.use('/pack', pack);

app.get('/', function (req, res) {
    res.send('Hello World!');
});
var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
