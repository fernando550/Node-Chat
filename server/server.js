var path        = require('path'),
    express     = require('express'),
    app         = express(),
    http        = require('http'),
    newmsg = require('./utils/message');
    
var publicPath  = path.join(__dirname, '../public');
var port        = process.env.PORT || 3000;
var server      = http.createServer(app);
var io          = require('socket.io').listen(server);

app.use(express.static(publicPath));

io.on('connection', function(socket){
    console.log('New User Connected');
    
    socket.emit('newMessage', newmsg.generate('Admin', 'Welcome to Chat APP'));
    
    socket.broadcast.emit('newMessage', newmsg.generate('Admin', 'New user joined'));
    
    socket.on('createMessage', function(newMessage, callback){
        io.emit('newMessage', newmsg.generate(newMessage.from, newMessage.text));
        callback();
    });
    
    socket.on('createGeoLoc', function(coords){
        io.emit('newGeoLocation', newmsg.geolocation('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });
});

server.listen(port, process.env.IP, function() {
    console.log('Server is up... 1.0.0');
});