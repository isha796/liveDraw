const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client'));

function onConnection(socket){
	console.log('new connection: ' + socket.id);

	socket.on('drawing',onDrawingEvent);

	function onDrawingEvent(data){
		socket.broadcast.emit('drawing',data);
		//io.sockets.emit('drawing',data);
	}
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
