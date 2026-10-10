'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var model = require('../public/uiassets/js/local-tool-model');

var supplier = '29ABCDE1234F1Z5';
var recipient = '27FGHIJ5678K1Z2';

function makeInvoice(overrides) {
    return Object.assign({
        ctin: recipient,
        inum: 'INV-001',
        idt: '10/10/2026',
        pos: '27',
        rchrg: 'N',
        inv_typ: 'R',
        val: 1180,
        itms: [{
            num: 1,
            itm_det: Object.assign({ hsn_sc: '123456' }, model.calculateTaxes(1000, 18, '29', '27', 'R'))
        }]
    }, overrides || {});
}

test('calculates interstate GST as IGST with rounding', function () {
    assert.deepEqual(model.calculateTaxes(123.45, 18, '29', '27', 'R'), {
        txval: 123.45,
        rt: 18,
        iamt: 22.22,
        camt: 0,
        samt: 0,
        csamt: 0
    });
});

test('calculates intrastate GST as balanced CGST and SGST', function () {
    assert.deepEqual(model.calculateTaxes(100.01, 5, '29', '29', 'R'), {
        txval: 100.01,
        rt: 5,
        iamt: 0,
        camt: 2.5,
        samt: 2.5,
        csamt: 0
    });
});

test('builds a valid GSTR-1 shape and groups invoices by recipient', function () {
    var payload = model.buildReturn(supplier, '102026', [
        makeInvoice(),
        makeInvoice({ inum: 'INV-002' })
    ]);

    assert.equal(payload.gstin, supplier);
    assert.equal(payload.fp, '102026');
    assert.equal(payload.b2b.length, 1);
    assert.equal(payload.b2b[0].ctin, recipient);
    assert.equal(payload.b2b[0].inv.length, 2);
    assert.deepEqual(payload.b2b[0].inv[0].itms[0].itm_det, {
        hsn_sc: '123456',
        txval: 1000,
        rt: 18,
        iamt: 180,
        camt: 0,
        samt: 0,
        csamt: 0
    });
    assert.deepEqual(payload.b2cs, []);
    assert.deepEqual(payload.nil, { inv: [] });
    assert.equal(payload.b2b[0].inv[0].itms[0].itm_det.hsn_sc, '123456');
});

test('rejects malformed GSTINs, return periods and HSN values', function () {
    assert.throws(function () {
        model.buildReturn('invalid', '102026', []);
    }, /GSTIN/);
    assert.throws(function () {
        model.buildReturn(supplier, '132026', []);
    }, /MMYYYY/);
    assert.throws(function () {
        model.buildReturn(supplier, '102026', [makeInvoice({
            itms: [{ num: 1, itm_det: { hsn_sc: '123', txval: 100, rt: 5, iamt: 5, camt: 0, samt: 0, csamt: 0 } }]
        })]);
    }, /HSN/);
    assert.throws(function () {
        model.buildReturn(supplier, '102026', [makeInvoice({ idt: '31/02/2026' })]);
    }, /invoice date/i);
});
