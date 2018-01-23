var request = require('request'),
    port = 8888,
    http = require('http');

var proxy = http.createServer(function(req, res) {
    var x = request(req.url);
    console.log('Proxying :', req.url);
    req.pipe(x);
    x.pipe(res);
});

proxy.listen(port, process.env.COMPUTERNAME, function() {
    console.log(process.env.COMPUTERNAME, '- PFD Proxy running on port', port);
});