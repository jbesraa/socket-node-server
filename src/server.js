import express from 'express';
import socket from 'socket.io';
import http from 'http';

export const app = express();
const server = http.Server(app);
const io = socket(server);
const PORT = process.env.PORT ||  8080;

app.get('/', (req,res) => {
	res.send('Hello World!');
});

io.on('connection', (socket) => {
	console.log('user connected');
});

const startServer = (s = server, p = PORT) => {
	s.listen(PORT, (err) => {
		if(err) throw err;
		const host = 'http://localhost';
		console.log(`Server running @ ${host}:${p}`);
	});
};

startServer();

