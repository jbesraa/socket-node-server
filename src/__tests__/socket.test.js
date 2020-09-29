import 'babel-polyfill';
import ioClient from 'socket.io-client';
import server, { httpServer as http, io as ioServer } from '../server';

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
		clientSocket.emit('room', '12');
		done();
	});
});

afterEach((done) => {
	if (clientSocket.connected) {
		clientSocket.disconnect();
	}
	done();
});

describe('socket',  () => {
	test('message from server to client', (done) => {
		ioServer.emit('echo', 'Hello World');
		clientSocket.once('echo', (message) => {
			expect(message).toBe('Hello World');
			done();
		});
		ioServer.on('connection', (mySocket) => {
			expect(mySocket).toBeDefined();
		});
	});

	test('message between two different clients', (done) => {
		const rec = ioClient.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, clientConfiguration);
		rec.on('connect', () => {
			rec.emit('room', '12');
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
