import 'babel-polyfill';
import supertest from 'supertest';
import { app } from '../server.js';

const request = supertest(app);

describe('test server', () => {
	it('/', async done => {
		const response = await request.get('/');
		expect(response.statusCode).toEqual(200);
		done();
	});
});