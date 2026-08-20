import { test, expect } from '@playwright/test';

// API-level tests, independent of the UI - faster and more precise than
// asserting business logic through the browser. Uses reqres.in, a public
// mock REST API intended for this kind of practice/testing.
const API_BASE = 'https://reqres.in/api';
const API_KEY = process.env.REQRES_API_KEY ?? 'reqres-free-v1';


test.describe('User API contract tests', () => {
  test.use({ extraHTTPHeaders: { 'x-api-key': API_KEY } });
  	test('GET /users/2 returns a valid user object', async ({ request }) => {
   		 const response = await request.get(`${API_BASE}/users/2`);
   		 expect(response.status()).toBe(200);
  		  const body = await response.json();
  		  expect(body.data).toMatchObject({ id: 2 });
  		  expect(body.data).toHaveProperty('email');
  		  expect(body.data).toHaveProperty('first_name');
 	 });

 	 test('GET /users/23 returns 404 for a non-existent user', async ({ request }) => {
  		  const response = await request.get(`${API_BASE}/users/23`);
  		  expect(response.status()).toBe(404);
 	 });

	 test('POST /users creates a new user and returns 201', async ({ request }) => {
   		 const response = await request.post(`${API_BASE}/users`, {
     		 data: { name: 'Meavish Latif', job: 'Senior QA Engineer' },
   	 });
  		  expect(response.status()).toBe(201);
  		  const body = await response.json();
   		 expect(body.name).toBe('Meavish Latif');
  		  expect(body).toHaveProperty('id');
  		  expect(body).toHaveProperty('createdAt');
  	});

  	test('PUT /users/2 updates a user and returns 200', async ({ request }) => {
    		const response = await request.put(`${API_BASE}/users/2`, {
      		data: { name: 'Meavish Latif', job: 'Lead QA Engineer' },
    	});
   		 expect(response.status()).toBe(200);
   		 const body = await response.json();
   		 expect(body.job).toBe('Lead QA Engineer');
 	 });
});
