const request = require('supertest')
const {app} = require('../server')

describe('Server Configuration', () => {
  // Test if the server is properly configured
  test('Server should be defined', () => {
    expect(app).toBeDefined();
  });

  test('Routes should be defined', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to the Stream-Lined API');
  });

});


describe('CORS Configuration', () => {
  test('Allows requests from whitelisted origins', async () => {
    
    app.get('/test-cors', (req, res) => {
      res.send('CORS test successful');
    });
    const origin1Response = await request(app)
      .get('/test-cors')
      .set('Origin', 'http://localhost:3000');

    const origin2Response = await request(app)
      .get('/test-cors')
      .set('Origin', 'https://stream-lined.netlify.app');

    // Assert that the responses contain appropriate CORS headers
    expect(origin1Response.status).toBe(200);
    expect(origin1Response.headers['access-control-allow-origin']).toBe('http://localhost:3000');

    expect(origin2Response.status).toBe(200);
    expect(origin2Response.headers['access-control-allow-origin']).toBe('https://stream-lined.netlify.app');
  });

  test('It should deny requests from non-whitelisted origins', async () => {
    const response = await request(app)
      .get('/test-cors')
      .set('Origin', 'https://example.com')

    expect(response.headers['access-control-allow-origin']).toBeUndefined
  });
});


describe('testing express.json() middleware', () => {
  test('Should parse JSON request body', async () => {
    app.post('/test', (req, res) => {
      res.json({ requestBody: req.body });
    })
    const requestBody = { message: 'Test message' }
    const response = await request(app)
      .post('/test')
      .send(requestBody)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ requestBody });
  })
})

