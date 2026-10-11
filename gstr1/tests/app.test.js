'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var app = require('../app');

test('serves the no-auth local app from index.html and blocks server writes', async function (t) {
    var server = app.listen(0, '127.0.0.1');
    t.after(function () {
        server.close();
    });
    await new Promise(function (resolve) { server.once('listening', resolve); });

    var origin = 'http://127.0.0.1:' + server.address().port;
    var page = await fetch(origin + '/');
    var html = await page.text();
    assert.equal(page.status, 200);
    assert.match(html, /COREBIQ GSTR-1/);
    assert.match(html, /download-template/);
    assert.match(html, /import-excel-file/);
    assert.doesNotMatch(html, /firebase-auth|sign-in/i);

    var script = await fetch(origin + '/uiassets/js/local-tool-import.js');
    assert.equal(script.status, 200);
    assert.match(await script.text(), /function parseSectionRows/);

    var health = await fetch(origin + '/health');
    assert.equal(health.status, 200);
    assert.equal(await health.text(), 'OK');

    var blocked = await fetch(origin + '/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: '29ABCDE1234F1Z5', data: 'private' })
    });
    assert.equal(blocked.status, 410);
    assert.equal((await blocked.json()).error, 'server_processing_disabled');
});
