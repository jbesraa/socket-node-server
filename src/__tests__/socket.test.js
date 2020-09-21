import 'babel-polyfill';
import ioClient from 'socket.io-client';
import { httpServer as http, io as ioServer } from '../server';
import server from '../server';

let clientSocket;
let httpServer;
let httpServerAddr;

jest.setTimeout(50000);

const clientConfiguration = {
	transports: ['websocket']
	, forceNew: true
	, reconnection: false
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
		console.log('socket connected');
		done();
	});
});

afterEach((done) => {
	if (clientSocket.connected) {
		clientSocket.disconnect();
	}
	done();
});

describe('basic socket example',  () => {
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

	test('should communicate with waiting for socket.io handshakes', (done) => {
		const rec = ioClient.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, clientConfiguration);
		rec.on('connect', () => {
			console.log('reciever socket opened');
		});
		setTimeout(( ) => {
			clientSocket.emit('message', 'some messages');
			rec.on('message', (msg) => {
				expect(msg).toBe('some messages');
				if (rec.connected) {
					rec.disconnect();
				}
				done();
			});
		}, 1000);
	});
});
