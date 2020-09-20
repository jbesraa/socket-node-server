import 'babel-polyfill';
import ioClient from 'socket.io-client';
import { httpServer as http, io as ioServer } from '../server';
import server from '../server';

let clientSocket;
let httpServer;
let httpServerAddr;

const clientConfiguration = {
	'reconnection delay': 0,
	'reopen delay': 0,
	'force new connection': true,
	transports: ['websocket'],
};

beforeAll((done) => {
	httpServer = http;
	httpServerAddr = server().address();
	done();
});

afterAll((done) => {
	ioServer.close();
	httpServer.close();
	done();
});

beforeEach((done) => {
	clientSocket = ioClient.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, clientConfiguration);
	clientSocket.on('connect', () => {
		done();
	});
});

afterEach((done) => {
	if (clientSocket.connected) {
		clientSocket.disconnect();
	}
	done();
});

describe('basic socket example', () => {
	test('should communicate', (done) => {
		ioServer.emit('echo', 'Hello World');
		clientSocket.once('echo', (message) => {
			expect(message).toBe('Hello World');
			done();
		});
		ioServer.on('connection', (mySocket) => {
			expect(mySocket).toBeDefined();
		});
	});

	test('should communicate with waiting for socket.io handshakes', async (done) => {
		clientSocket.emit('message', 'some messages');
		console.log('ioServer', ioServer);
		ioServer.on('connection', (soc) => {
			console.log('soc',soc);
			done();
		} );
	});
});
