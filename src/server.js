import express from 'express';

export const server = express();

const PORT = 8080;

server.get('/', (req,res) => {
	res.send('Hello World!');
});

const startServer = (s = server) => {
	s.listen(PORT, () => {
		console.log(`Server running @http://localhost:${PORT}`);
	});
};

startServer();