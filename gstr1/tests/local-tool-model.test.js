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
            itm_det: Object.assign({ hsn_sc: '123456', qty: 2, uqc: 'NOS' }, model.calculateTaxes(1000, 18, '29', '27', 'R'))
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
        qty: 2,
        uqc: 'NOS',
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
    assert.equal(payload.hsn.hsn_b2b.length, 1);
    assert.equal(payload.hsn.hsn_b2b[0].qty, 4);
    assert.equal(payload.hsn.hsn_b2b[0].val, 2360);
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

test('exports only enabled small B2C, exempt, unregistered note, e-commerce and document sections', function () {
    var payload = model.buildReturn(supplier, '102026', {
        invoices: [makeInvoice()],
        sections: {
            b2cs: [{ pos: '27', txval: 500, rt: 5 }],
            nil: [{ sply_ty: 'INTER', kind: 'expt_amt', amount: 200 }],
            cdnur: [{
                ntty: 'C',
                nt_num: 'CN-1',
                nt_dt: '11/10/2026',
                typ: 'B2CL',
                pos: '27',
                txval: 100,
                rt: 5
            }],
            ecom: [{ category: 'b2c', pos: '29', txval: 400, rt: 5 }],
            doc: [
                { doc_typ: '1', num_from: 1, num_to: 10, total: 10, cancel: 1 },
                { doc_typ: '1', num_from: 11, num_to: 12, total: 2, cancel: 0 }
            ]
        }
    });

    assert.deepEqual(payload.b2cs, [{
        pos: '27', typ: 'OE', rt: 5, txval: 500, iamt: 25, camt: 0, samt: 0, csamt: 0
    }]);
    assert.deepEqual(payload.nil.inv, [{
        sply_ty: 'INTER', expt_amt: 200, nil_amt: 0, ngsup_amt: 0
    }]);
    assert.equal(payload.cdnur[0].ntty, 'C');
    assert.equal(payload.cdnur[0].itms[0].itm_det.iamt, 5);
    assert.equal(payload.cdnur[0].diff_percent, 1);
    assert.deepEqual(payload.ecom.b2c, [{
        pos: '29', rt: 5, txval: 400, iamt: 0, camt: 10, samt: 10, csamt: 0
    }]);
    assert.equal(payload.doc_issue.doc_det.length, 1);
    assert.equal(payload.doc_issue.doc_det[0].docs.length, 2);
    assert.equal(payload.doc_issue.doc_det[0].docs[0].net_issue, 9);
    assert.deepEqual(payload.b2cl, []);
    assert.deepEqual(payload.cdnr, []);
    assert.deepEqual(payload.ecoma.b2ba, []);
});

test('rejects invalid document ranges and disabled GSTR-1 sections', function () {
    assert.throws(function () {
        model.validateSectionEntry('doc', {
            doc_typ: '1', num_from: 1, num_to: 5, total: 4, cancel: 0
        }, supplier);
    }, /range size/);
    assert.throws(function () {
        model.validateSectionEntry('b2cl', {}, supplier);
    }, /not enabled/);
});
