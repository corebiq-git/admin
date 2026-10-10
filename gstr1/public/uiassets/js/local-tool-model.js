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

    function calculateTaxes(taxableValue, rate, supplierState, placeOfSupply, forceInterstate) {
        var taxable = Number(taxableValue);
        var taxRate = Number(rate);
        if (!Number.isFinite(taxable) || taxable <= 0 ||
                !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
            throw new Error('Enter a positive taxable value and a valid tax rate.');
        }

        var tax = roundMoney(taxable * taxRate / 100);
        var interstate = forceInterstate === true || forceInterstate === 'CBW' ||
            supplierState !== placeOfSupply;
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

    function validateDate(value, label) {
        var parts = String(value || '').split('/');
        var date = parts.length === 3 ?
            new Date(Date.UTC(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))) :
            null;
        if (!date || !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/.test(value) ||
                date.getUTCDate() !== Number(parts[0]) ||
                date.getUTCMonth() + 1 !== Number(parts[1])) {
            throw new Error(label + ' must be a valid date.');
        }
    }

    function validateHsn(value) {
        if (!/^[0-9]{4,8}$/.test(value || '')) {
            throw new Error('HSN / SAC must contain 4 to 8 digits.');
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
        if (!invoice.inum || invoice.inum.length > 16) {
            throw new Error('Enter an invoice number of at most 16 characters.');
        }
        validateDate(invoice.idt, 'Invoice date');
        if (!invoice.itms || !invoice.itms.length) {
            throw new Error('An invoice must have at least one item.');
        }
        invoice.itms.forEach(function (item) {
            validateHsn(item.itm_det && item.itm_det.hsn_sc);
        });
    }

    function validateSectionEntry(section, entry, gstin) {
        if (section === 'b2cs' || section === 'ecom') {
            if (!/^[0-9]{2}$/.test(entry.pos)) {
                throw new Error('Place of supply must be a two-digit state code.');
            }
            if (section === 'ecom' && !['b2b', 'b2c', 'urp2b', 'urp2c'].includes(entry.category)) {
                throw new Error('Select an enabled e-commerce supply category.');
            }
            return;
        }
        if (section === 'nil') {
            if (!['INTRA', 'INTER'].includes(entry.sply_ty) ||
                    !['nil_amt', 'expt_amt', 'ngsup_amt'].includes(entry.kind) ||
                    !Number.isFinite(Number(entry.amount)) || Number(entry.amount) < 0) {
                throw new Error('Choose a valid exempt supply type and enter a non-negative amount.');
            }
            return;
        }
        if (section === 'cdnur') {
            if (!['C', 'D'].includes(entry.ntty)) {
                throw new Error('Select credit note or debit note.');
            }
            if (!entry.nt_num || entry.nt_num.length > 16) {
                throw new Error('Enter a note number of at most 16 characters.');
            }
            validateDate(entry.nt_dt, 'Note date');
            if (!['B2CL', 'EXPWP', 'EXPWOP'].includes(entry.typ)) {
                throw new Error('Select a valid unregistered-recipient note type.');
            }
            if (!/^[0-9]{2}$/.test(entry.pos)) {
                throw new Error('Place of supply must be a two-digit state code.');
            }
            return;
        }
        if (section === 'doc') {
            var from = Number(entry.num_from);
            var to = Number(entry.num_to);
            var total = Number(entry.total);
            var cancelled = Number(entry.cancel);
            if (!entry.doc_typ || !Number.isInteger(from) ||
                    !Number.isInteger(to) || from < 1 || to < from ||
                    !Number.isInteger(total) || total < 1 ||
                    !Number.isInteger(cancelled) || cancelled < 0 || cancelled > total ||
                    to - from + 1 !== total) {
                throw new Error('Enter a document type, serial range, total, and valid cancelled count. The range size must equal total documents.');
            }
            return;
        }
        throw new Error('This GSTR-1 section is not enabled.');
    }

    function entryTaxes(entry, gstin, interstate) {
        return calculateTaxes(entry.txval, entry.rt, gstin.substring(0, 2), entry.pos, interstate);
    }

    function summarizeHsn(invoices) {
        var groups = {};
        invoices.forEach(function (invoice) {
            invoice.itms.forEach(function (item) {
                var detail = item.itm_det;
                var key = [detail.hsn_sc, detail.rt, detail.uqc || 'OTH'].join('|');
                if (!groups[key]) {
                    groups[key] = {
                        num: Object.keys(groups).length + 1,
                        hsn_sc: detail.hsn_sc,
                        desc: detail.desc || '',
                        uqc: detail.uqc || 'OTH',
                        qty: 0,
                        val: 0,
                        txval: 0,
                        rt: Number(detail.rt),
                        iamt: 0,
                        camt: 0,
                        samt: 0,
                        csamt: 0
                    };
                }
                var summary = groups[key];
                summary.qty = roundMoney(summary.qty + Number(detail.qty || 0));
                summary.val = roundMoney(summary.val + Number(detail.txval || 0) +
                    Number(detail.iamt || 0) + Number(detail.camt || 0) +
                    Number(detail.samt || 0) + Number(detail.csamt || 0));
                summary.txval = roundMoney(summary.txval + Number(detail.txval || 0));
                summary.iamt = roundMoney(summary.iamt + Number(detail.iamt || 0));
                summary.camt = roundMoney(summary.camt + Number(detail.camt || 0));
                summary.samt = roundMoney(summary.samt + Number(detail.samt || 0));
                summary.csamt = roundMoney(summary.csamt + Number(detail.csamt || 0));
            });
        });
        return Object.keys(groups).sort().map(function (key, index) {
            groups[key].num = index + 1;
            return groups[key];
        });
    }

    function emptyReturn(gstin, period) {
        return {
            gstin: gstin,
            fp: period,
            version: 'GST3.2.4',
            hash: 'hash',
            b2b: [],
            b2ba: [],
            b2cl: [],
            b2cla: [],
            b2cs: [],
            b2csa: [],
            nil: { inv: [] },
            exp: [],
            expa: [],
            cdnr: [],
            cdnra: [],
            cdnur: [],
            cdnura: [],
            at: [],
            ata: [],
            atadj: [],
            atadja: [],
            doc_issue: { doc_det: [] },
            hsn: { hsn_b2b: [], hsn_b2c: [] },
            supeco: { clttx: [], paytx: [] },
            supecoa: { clttxa: [], paytxa: [] },
            ecom: { b2b: [], b2c: [], urp2b: [], urp2c: [] },
            ecoma: { b2ba: [], b2ca: [], urp2ba: [], urp2ca: [] }
        };
    }

    function buildReturn(gstin, period, data) {
        validateGstin(gstin, 'Supplier GSTIN');
        validatePeriod(period);
        var legacyInvoices = Array.isArray(data) ? data : null;
        var invoices = legacyInvoices || data.invoices || [];
        var sections = legacyInvoices ? {} : data.sections || {};
        var payload = emptyReturn(gstin, period);
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
        payload.b2b = Object.keys(byRecipient).sort().map(function (key) {
            return byRecipient[key];
        });

        (sections.b2cs || []).forEach(function (entry) {
            validateSectionEntry('b2cs', entry, gstin);
            var taxes = entryTaxes(entry, gstin, false);
            var existing = payload.b2cs.find(function (row) {
                return row.pos === entry.pos && row.rt === taxes.rt && row.typ === 'OE';
            });
            if (!existing) {
                existing = { pos: entry.pos, typ: 'OE', rt: taxes.rt, txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 };
                payload.b2cs.push(existing);
            }
            ['txval', 'iamt', 'camt', 'samt', 'csamt'].forEach(function (key) {
                existing[key] = roundMoney(existing[key] + taxes[key]);
            });
        });

        (sections.nil || []).forEach(function (entry) {
            validateSectionEntry('nil', entry, gstin);
            var row = payload.nil.inv.find(function (item) {
                return item.sply_ty === entry.sply_ty;
            });
            if (!row) {
                row = { sply_ty: entry.sply_ty, expt_amt: 0, nil_amt: 0, ngsup_amt: 0 };
                payload.nil.inv.push(row);
            }
            row[entry.kind] = roundMoney(row[entry.kind] + Number(entry.amount));
        });

        (sections.cdnur || []).forEach(function (entry, index) {
            validateSectionEntry('cdnur', entry, gstin);
            var taxes = entryTaxes(entry, gstin, entry.typ !== 'B2CL');
            var noteTaxes = {
                txval: taxes.txval,
                rt: taxes.rt,
                iamt: entry.typ === 'EXPWOP' ? 0 : taxes.iamt || taxes.camt + taxes.samt,
                csamt: 0
            };
            payload.cdnur.push({
                ntty: entry.ntty,
                nt_num: entry.nt_num,
                nt_dt: entry.nt_dt,
                val: roundMoney(noteTaxes.txval + noteTaxes.iamt + noteTaxes.csamt),
                typ: entry.typ,
                pos: entry.pos,
                diff_percent: 1,
                diffval: true,
                itms: [{ num: index + 1, itm_det: noteTaxes }]
            });
        });

        (sections.ecom || []).forEach(function (entry) {
            validateSectionEntry('ecom', entry, gstin);
            var taxes = entryTaxes(entry, gstin, false);
            var group = payload.ecom[entry.category];
            var existing = group.find(function (row) {
                return row.pos === entry.pos && row.rt === taxes.rt;
            });
            if (!existing) {
                existing = { pos: entry.pos, rt: taxes.rt, txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 };
                group.push(existing);
            }
            ['txval', 'iamt', 'camt', 'samt', 'csamt'].forEach(function (key) {
                existing[key] = roundMoney(existing[key] + taxes[key]);
            });
        });

        (sections.doc || []).forEach(function (entry) {
            validateSectionEntry('doc', entry, gstin);
            var documentType = payload.doc_issue.doc_det.find(function (document) {
                return document.doc_typ === entry.doc_typ;
            });
            if (!documentType) {
                documentType = {
                    doc_num: indexOfDocumentType(payload.doc_issue.doc_det, entry.doc_typ) + 1,
                    doc_typ: entry.doc_typ,
                    docs: []
                };
                payload.doc_issue.doc_det.push(documentType);
            }
            documentType.docs.push({
                num_from: String(entry.num_from),
                num_to: String(entry.num_to),
                total: Number(entry.total),
                cancel: Number(entry.cancel),
                net_issue: Number(entry.total) - Number(entry.cancel)
            });
        });

        payload.hsn.hsn_b2b = summarizeHsn(invoices);
        return payload;
    }

    function indexOfDocumentType(documents, type) {
        return documents.filter(function (document) {
            return document.doc_typ === type;
        }).length;
    }

    return {
        calculateTaxes: calculateTaxes,
        validateGstin: validateGstin,
        validatePeriod: validatePeriod,
        validateInvoice: validateInvoice,
        validateSectionEntry: validateSectionEntry,
        summarizeHsn: summarizeHsn,
        buildReturn: buildReturn,
        roundMoney: roundMoney
    };
}));
