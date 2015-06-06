var winstond = require('winstond');

var http = require("http");
var express = require("express");
var winstonWS = require("winston-websocket");
var winston = require("winston");
var path = require("path");

//configure express
var app = express()
  .use(express.static("."));

//create http server
var httpServer = http.createServer(app);

var server = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9003
});

winston.levels = server.levels = {
  trace: 0,
    input: 1,
    verbose: 2,
    debug: 3,
    logs: 4,
    group: 4,
    groupEnd: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
};

winston.colors = server.colors = {
  trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    debug: 'blue',
    logs: 'grey',
    group: 'grey',
    groupEnd: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
};

winston.config.addColors(winston.colors);
//server.config.addColors(winston.colors);

server.level = 'trace';
winston.level = 'trace';

server.add(winstond.transports.File, {
  filename: __dirname + '/foo.log',
  level: 'trace',
});

server.add(winstond.transports.Console, {
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false,
  level: 'trace',
});

//register websocet transport
server.add(winstonWS.WSTransport, {
  wsoptions: {
    server: httpServer,
    path: '/logs'
  },
  level: 'trace',
});


//Connect the transport to both loggers
winston.add(server.transports.wstransport, null, true);


server.listen();
console.log("server is listening on port 9003");

app.route('/*')
  .get(function (req, res) {
    console.log('redirect to index.html', req.params[0]);
    res.sendFile(path.resolve('./log-view.html'));
  });

httpServer.listen(3000);
console.log("httpServer is listening on port 3000");


