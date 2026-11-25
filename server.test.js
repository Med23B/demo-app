const test = require('node:test');
const assert = require('node:assert');
const app = require('./server');

test('GET / returns 200 and a version', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(body.version);
  server.close();
});