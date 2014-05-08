#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var handler = express();
var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
httpd.listen(port, ipaddress);
/**
 *  Define the sample application.
 */
var usernames = [];
var users = {};
handler.use(express.static(__dirname + '/public'));
//  function handler(req, res) {//handler is a requestListener Function that is executed when request event is emitted
//     fs.readFile('index.html', //read file function has 2 parameters, 1) the filename 2) callback function
//     function(err, data) {//callback funciton has 2 parameters, error and data, where "data" is the contents of the file 'index.html'
//         if (err) {
//             res.writeHead(500);
//             return res.end('Error');
//         }
//         res.writeHead(200);
//         res.end(data);
//     });
// }

io.sockets.on('connection', function(socket) {
    //console.log(socket);

    socket.on('clientMessage', function(content) {
        var message = content.trim();
        if (message.substr(0, 3) == '/s ') {
            message = message.substr(3);
            var index = message.indexOf(' ');
            if (index !== -1) {
                var name = message.substring(0, index);
                var message = message.substring(index + 1);
                if ( name in users) {
                    users[name].emit('secret', socket.nickname + ': said ' + message);
                } else
                    console.log('Error');
            } else
                console.log('Error 2');
        } else//socket.broadcast.emit('serverMessage', {msg: message, nick: socket.nickname});
        {
            socket.get('username', function(err, username) {
                socket.broadcast.emit('serverMessage2', username + ' said: ' + content);
            });
        }

        socket.emit('serverMessage2', 'You Said: ' + message);

        // socket.get('username' , function(err , username) {
        //  if(!username){
        //      username = socket.id;
        //  }
        //  socket.broadcast.emit('serverMessage' , username + ' said: ' + content);
        // });
        //http://www.crictime.com/cricket-streaming-live-1.htm

    });

    socket.on('login', function(username) {
        socket.nickname = username;
        users[socket.nickname] = socket;
        console.log(socket.nickname);
        socket.emit('serverMessage2', 'Logged in as ' + socket.nickname);

        socket.set('username', username, function(err) {
            if (err) {
                throw err;
            }
            if (!username) {
                username = socket.id;
            }

            usernames.push(username);
            showUsernames();

            function showUsernames() {

                io.sockets.emit('serverUserMessage', usernames);
            }

            //showUsernames();

            //socket.emit('serverMessage' , 'Logged in as ' + username);
            //socket.broadcast.emit('serverMessage' , username + ' is online');
            //socket.broadcast.emit('serverUserMessage' , username + ' is online');
        });
    });

    socket.on('disconnect', function() {
        socket.get('username', function(err, username) {
            socket.broadcast.emit('serverMessage3', username + ' left the conversation');
            usernames.splice(usernames.indexOf(username), 1);
            io.sockets.emit('serverUserMessage', usernames);
        });
        //socket.nickname = username;
        //console.log(socket.nickname);
        //console.log(username);
        //socket.broadcast.emit('serverMessage3' ,  username+ ' left the conversation');
        // socket.get('username' , function(err , username){
        //  socket.broadcast.emit('serverMessage3' ,  socket.nickname+ ' left the conversation');
        //  if(!username){
        //      username = socket.id;
        //  }

        //});
    });
    socket.emit('login');
});
// var SampleApp = function() {

//     //  Scope.
//     var self = this;


//     /*  ================================================================  */
//     /*  Helper functions.                                                 */
//     /*  ================================================================  */

//     /**
//      *  Set up server IP address and port # using env variables/defaults.
//      */
//     self.setupVariables = function() {
//         //  Set the environment variables we need.
//         self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
//         self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

//         if (typeof self.ipaddress === "undefined") {
//             //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
//             //  allows us to run/test the app locally.
//             console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
//             self.ipaddress = "127.0.0.1";
//         };
//     };


//     /**
//      *  Populate the cache.
//      */
//     self.populateCache = function() {
//         if (typeof self.zcache === "undefined") {
//             self.zcache = { 'index.html': '' };
//         }

//         //  Local cache for static content.
//         self.zcache['index.html'] = fs.readFileSync('./index.html');
//     };


//     /**
//      *  Retrieve entry (content) from cache.
//      *  @param {string} key  Key identifying content to retrieve from cache.
//      */
//     self.cache_get = function(key) { return self.zcache[key]; };


//     /**
//      *  terminator === the termination handler
//      *  Terminate server on receipt of the specified signal.
//      *  @param {string} sig  Signal to terminate on.
//      */
//     self.terminator = function(sig){
//         if (typeof sig === "string") {
//            console.log('%s: Received %s - terminating sample app ...',
//                        Date(Date.now()), sig);
//            process.exit(1);
//         }
//         console.log('%s: Node server stopped.', Date(Date.now()) );
//     };


//     /**
//      *  Setup termination handlers (for exit and a list of signals).
//      */
//     self.setupTerminationHandlers = function(){
//         //  Process on exit and signals.
//         process.on('exit', function() { self.terminator(); });

//         // Removed 'SIGPIPE' from the list - bugz 852598.
//         ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
//          'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
//         ].forEach(function(element, index, array) {
//             process.on(element, function() { self.terminator(element); });
//         });
//     };


//     /*  ================================================================  */
//     /*  App server functions (main app logic here).                       */
//     /*  ================================================================  */

//     /**
//      *  Create the routing table entries + handlers for the application.
//      */
//     self.createRoutes = function() {
//         self.routes = { };

//         self.routes['/asciimo'] = function(req, res) {
//             var link = "http://i.imgur.com/kmbjB.png";
//             res.send("<html><body><img src='" + link + "'></body></html>");
//         };

//         self.routes['/'] = function(req, res) {
//             res.setHeader('Content-Type', 'text/html');
//             res.send(self.cache_get('index.html') );
//         };
//     };


//     /**
//      *  Initialize the server (express) and create the routes and register
//      *  the handlers.
//      */
//     self.initializeServer = function() {
//         self.createRoutes();
//         self.app = express.createServer();

//         //  Add handlers for the app (from the routes).
//         for (var r in self.routes) {
//             self.app.get(r, self.routes[r]);
//         }
//     };


//     /**
//      *  Initializes the sample application.
//      */
//     self.initialize = function() {
//         self.setupVariables();
//         self.populateCache();
//         self.setupTerminationHandlers();

//         // Create the express server and routes.
//         self.initializeServer();
//     };


//     /**
//      *  Start the server (starts up the sample application).
//      */
//     self.start = function() {
//         //  Start the app on the specific interface (and port).
//         self.app.listen(self.port, self.ipaddress, function() {
//             console.log('%s: Node server started on %s:%d ...',
//                         Date(Date.now() ), self.ipaddress, self.port);
//         });
//     };

// };   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
// var zapp = new SampleApp();
// zapp.initialize();
// zapp.start();

