var express = require('express')
var app = express()
var serv = require('http').Server(app)
var io = require('socket.io')(serv, {})

var scores = {};

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/client/index.html')
})
app.use('/client', express.static(__dirname + '/client'))
serv.listen(2000)


io.on('connection', function(socket){
    console.log('Connected ----')
    var username = socket.handshake.query.username;
    if (!scores[username]) 
        scores[username] = 0;
    io.emit('allScores', scores);
    socket.on('increase', function(){
        scores[username]++;
        socket.emit('score', scores[username]);
        io.emit('allScores', scores);
    });
});
