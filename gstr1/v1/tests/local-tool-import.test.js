'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var importer = require('../public/uiassets/js/local-tool-import');
var model = require('../public/uiassets/js/local-tool-model');

var supplier = '29ABCDE1234F1Z5';

test('parses GSTN workbook headings and groups B2B invoice item rows', function () {
    var result = importer.parseRows('b2b', [
        ['Summary For B2B'],
        [],
        ['No. of Recipients', 'No. of Invoices'],
        ['GSTIN/UIN of Recipient', 'Receiver Name', 'Invoice Number', 'Invoice date',
            'Invoice Value', 'Place Of Supply', 'Reverse Charge', 'Applicable % of Tax Rate',
            'Invoice Type', 'E-Commerce GSTIN', 'Rate', 'Taxable Value', 'Cess Amount'],
        ['27FGHIJ5678K1Z2', 'Buyer', 'INV-1', '10/10/2026', 2360, '27-Maharashtra',
            'No', '', 'Regular', '', 18, 1000, 0],
        ['', '', '', '', '', '', '', '', '', '', 5, 100, 0]
    ], supplier);

    assert.equal(result.invoices.length, 1);
    assert.equal(result.invoices[0].itms.length, 2);
    assert.equal(result.invoices[0].itms[0].itm_det.hsn_sc, undefined);
    assert.equal(result.invoices[0].val, 2360);
    assert.equal(model.buildReturn(supplier, '102026', result).b2b[0].inv[0].itms.length, 2);
});

test('parses official B2CS, exempt, CDNUR and document rows', function () {
    var b2cs = importer.parseRows('b2cs', [
        ['Type', 'Place Of Supply', 'Applicable % of Tax Rate', 'Rate',
            'Taxable Value', 'Cess Amount', 'E-Commerce GSTIN'],
        ['OE', '27-Maharashtra', '', 5, 500, 0, '']
    ], supplier);
    var exempt = importer.parseRows('nil', [
        ['Description', 'Nil Rated Supplies',
            'Exempted(other than nil rated/non GST supply)', 'Non-GST Supplies'],
        ['Inter-State supplies to registered persons', 10, 20, 30]
    ], supplier);
    var cdnur = importer.parseRows('cdnur', [
        ['UR Type', 'Note Number', 'Note Date', 'Note Type', 'Place Of Supply',
            'Note Value', 'Applicable % of Tax Rate', 'Rate', 'Taxable Value', 'Cess Amount'],
        ['B2CL', 'CN-1', '11/10/2026', 'Credit Note', '27-Maharashtra', 105, '', 5, 100, 0]
    ], supplier);
    var docs = importer.parseRows('doc', [
        ['Nature of Document', 'Sr. No. From', 'Sr. No. To', 'Total Number', 'Cancelled'],
        ['Invoices for outward supply', 'A1', 'A100', 100, 2]
    ], supplier);

    assert.deepEqual(b2cs.sections.b2cs[0], { pos: '27', txval: 500, rt: 5 });
    assert.deepEqual(exempt.sections.nil, [
        { sply_ty: 'INTER', kind: 'nil_amt', amount: 10 },
        { sply_ty: 'INTER', kind: 'expt_amt', amount: 20 },
        { sply_ty: 'INTER', kind: 'ngsup_amt', amount: 30 }
    ]);
    assert.equal(cdnur.sections.cdnur[0].ntty, 'C');
    assert.equal(cdnur.sections.cdnur[0].nt_dt, '11/10/2026');
    assert.equal(docs.sections.doc[0].num_from, 'A1');
});

test('parses ECO and B2B HSN summaries and builds their return payload', function () {
    var eco = importer.parseRows('eco', [
        ['Nature of Supply', 'GSTIN of E-Commerce Operator', 'E-Commerce Operator Name',
            'Net value of supplies', 'Integrated tax', 'Central tax', 'State/UT tax', 'Cess'],
        ['Liable to collect tax u/s 52(TCS)', '27FGHIJ5678K1Z2', 'Operator', 1000, 180, 0, 0, 0]
    ], supplier);
    var hsn = importer.parseRows('hsn', [
        ['HSN', 'Description', 'UQC', 'Total Quantity', 'Total Value', 'Rate',
            'Taxable Value', 'Integrated Tax Amount', 'Central Tax Amount',
            'State/UT Tax Amount', 'Cess Amount'],
        ['123456', 'Goods', 'NOS-NUMBERS', 2, 1180, 18, 1000, 180, 0, 0, 0]
    ], supplier);
    var payload = model.buildReturn(supplier, '102026', {
        invoices: [],
        sections: eco.sections,
        hsnB2B: hsn.hsnB2B
    });

    assert.equal(payload.supeco.clttx[0].etin, '27FGHIJ5678K1Z2');
    assert.equal(payload.hsn.hsn_b2b[0].uqc, 'NOS');
    assert.equal(payload.hsn.hsn_b2b[0].txval, 1000);
});

test('merges imports without duplicating invoices, entries, or HSN summary rows', function () {
    var invoice = {
        ctin: '27FGHIJ5678K1Z2', inum: 'INV-1', idt: '10/10/2026', pos: '27',
        rchrg: 'N', inv_typ: 'R', val: 100, itms: []
    };
    var row = { pos: '27', txval: 100, rt: 5 };
    var hsn = { hsn_sc: '123456', rt: 5, uqc: 'NOS', qty: 1, txval: 100 };
    var merged = importer.merge({}, {
        invoices: [invoice, invoice],
        sections: { b2cs: [row, row] },
        hsnB2B: [hsn, hsn]
    });

    assert.equal(merged.invoices.length, 1);
    assert.equal(merged.sections.b2cs.length, 1);
    assert.equal(merged.hsnB2B.length, 1);
    assert.equal(merged.added.b2b, 1);
    assert.equal(merged.skipped.b2b, 1);
});
