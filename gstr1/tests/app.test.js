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
    assert.match(html, /href="corebiq\.css"/);
    assert.match(html, /id="app-sidebar"/);
    assert.match(html, /class="bottom-nav"/);
    assert.match(html, /uiassets\/logo-favicon\.png/);
    assert.match(html, /uiassets\/app-icon\.png/);
    assert.match(html, /uiassets\/name-splash\.png/);
    assert.match(html, /src="uiassets\/name\.png"/);
    assert.match(html, /og:image" content="uiassets\/logo\.png"/);
    assert.doesNotMatch(html, /firebase-auth|sign-in/i);

    var styles = await fetch(origin + '/corebiq.css');
    assert.equal(styles.status, 200);
    assert.match(await styles.text(), /\.sidebar/);

    var brandAssets = ['logo.png', 'name.png', 'logo-favicon.png', 'app-icon.png', 'name-splash.png'];
    for (var i = 0; i < brandAssets.length; i += 1) {
        var asset = await fetch(origin + '/uiassets/' + brandAssets[i], { method: 'HEAD' });
        assert.equal(asset.status, 200, brandAssets[i] + ' should be served');
        assert.match(asset.headers.get('content-type'), /^image\/png/);
    }

    var manifest = await fetch(origin + '/manifest.webmanifest');
    assert.equal(manifest.status, 200);
    assert.equal((await manifest.json()).icons[0].src, 'uiassets/app-icon.png');

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
