import 'babel-polyfill';
import supertest from 'supertest';
import { server } from '../server.js';

const request = supertest(server);

describe('test server', () => {
	it('/', async done => {
		const response = await request.get('/');
		expect(response.statusCode).toEqual(200);
		done();
	});
});