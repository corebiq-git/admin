(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CorebiqLocalModel = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function roundMoney(value) {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }

    function calculateTaxes(taxableValue, rate, supplierState, placeOfSupply, invoiceType) {
        var taxable = Number(taxableValue);
        var taxRate = Number(rate);
        if (!Number.isFinite(taxable) || taxable <= 0 ||
                !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
            throw new Error('Enter a positive taxable value and a valid tax rate.');
        }

        var tax = roundMoney(taxable * taxRate / 100);
        var interstate = supplierState !== placeOfSupply || invoiceType === 'CBW';
        return {
            txval: roundMoney(taxable),
            rt: taxRate,
            iamt: interstate ? tax : 0,
            camt: interstate ? 0 : roundMoney(tax / 2),
            samt: interstate ? 0 : roundMoney(tax - roundMoney(tax / 2)),
            csamt: 0
        };
    }

    function validateGstin(value, label) {
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value)) {
            throw new Error(label + ' must be a valid 15-character GSTIN format.');
        }
    }

    function validatePeriod(value) {
        if (!/^(0[1-9]|1[0-2])[0-9]{4}$/.test(value)) {
            throw new Error('Return period must be a valid MMYYYY value, for example 042026.');
        }
    }

    function validateInvoice(invoice, supplierGstin) {
        validateGstin(supplierGstin, 'Supplier GSTIN');
        validateGstin(invoice.ctin, 'Recipient GSTIN');
        if (invoice.ctin === supplierGstin) {
            throw new Error('Supplier and recipient GSTINs must be different.');
        }
        if (!/^[0-9]{2}$/.test(invoice.pos)) {
            throw new Error('Place of supply must be a two-digit state code.');
        }
        if (!/^[0-9]{4,8}$/.test(invoice.itms && invoice.itms[0] &&
                invoice.itms[0].itm_det && invoice.itms[0].itm_det.hsn_sc)) {
            throw new Error('HSN / SAC must contain 4 to 8 digits.');
        }
        if (!invoice.inum || invoice.inum.length > 16) {
            throw new Error('Enter an invoice number of at most 16 characters.');
        }
        var dateParts = invoice.idt.split('/');
        var invoiceDate = dateParts.length === 3 ?
            new Date(Date.UTC(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]))) :
            null;
        if (!invoiceDate || !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/.test(invoice.idt) ||
                invoiceDate.getUTCDate() !== Number(dateParts[0]) ||
                invoiceDate.getUTCMonth() + 1 !== Number(dateParts[1])) {
            throw new Error('Enter a valid invoice date.');
        }
        if (!invoice.itms || !invoice.itms.length) {
            throw new Error('An invoice must have at least one item.');
        }
    }

    function buildReturn(gstin, period, invoices) {
        validateGstin(gstin, 'Supplier GSTIN');
        validatePeriod(period);

        var byRecipient = {};
        invoices.forEach(function (invoice) {
            validateInvoice(invoice, gstin);
            if (!byRecipient[invoice.ctin]) {
                byRecipient[invoice.ctin] = { ctin: invoice.ctin, inv: [] };
            }
            byRecipient[invoice.ctin].inv.push({
                inum: invoice.inum,
                idt: invoice.idt,
                val: roundMoney(invoice.val),
                pos: invoice.pos,
                rchrg: invoice.rchrg,
                inv_typ: invoice.inv_typ,
                itms: invoice.itms
            });
        });

        return {
            gstin: gstin,
            fp: period,
            version: 'GST3.2.4',
            hash: 'hash',
            b2b: Object.keys(byRecipient).sort().map(function (key) {
                return byRecipient[key];
            }),
            b2ba: [],
            b2cl: [],
            b2cla: [],
            b2cs: [],
            b2csa: [],
            nil: { inv: [] },
            exp: [],
            expa: [],
            hsn: { data: [] },
            cdnr: [],
            cdnra: [],
            cdnur: [],
            cdnura: [],
            at: [],
            ata: [],
            atadj: [],
            atadja: [],
            doc_issue: { doc_det: [] },
            supeco: { clttx: [], paytx: [] },
            supecoa: { clttxa: [], paytxa: [] },
            ecom: { b2b: [], b2c: [], urp2b: [], urp2c: [] },
            ecoma: { b2ba: [], b2ca: [], urp2ba: [], urp2ca: [] }
        };
    }

    return {
        calculateTaxes: calculateTaxes,
        validateGstin: validateGstin,
        validatePeriod: validatePeriod,
        validateInvoice: validateInvoice,
        buildReturn: buildReturn,
        roundMoney: roundMoney
    };
}));
