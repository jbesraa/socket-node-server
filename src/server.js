import express from 'express';
import socket from 'socket.io';
import http from 'http';

export const app = express();
export const httpServer = http.createServer();
export const io = socket(httpServer);
const PORT = process.env.PORT ||  8080;

app.get('/', (req,res) => {
	res.send('Hello World!');
});

io.on('connection', (socket) => {
	socket.on('message', (msg) => {
		console.log('message in BE', msg);
		io.sockets.emit('message', msg);
	});
});

const server = ({ s = httpServer, p = PORT } = {}) => {
	return s.listen(p, (err) => {
		if(err) throw err;
		const host = 'http://localhost';
		console.log(`Server running @ ${host}:${p}`);
	});
};

export default server;

