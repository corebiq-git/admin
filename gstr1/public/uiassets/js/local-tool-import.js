(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./local-tool-model'));
    } else {
        root.CorebiqLocalImport = factory(root.CorebiqLocalModel);
    }
}(typeof self !== 'undefined' ? self : this, function (model) {
    'use strict';

    var sheets = [
        {
            section: 'b2b',
            names: ['b2b,sez,de', 'b2b'],
            title: 'B2B, SEZ, DE Invoices - 4A, 4B, 6B, 6C',
            headers: ['GSTIN/UIN of Recipient', 'Receiver Name', 'Invoice Number', 'Invoice date',
                'Invoice Value', 'Place Of Supply', 'Reverse Charge', 'Applicable % of Tax Rate',
                'Invoice Type', 'E-Commerce GSTIN', 'Rate', 'Taxable Value', 'Cess Amount']
        },
        {
            section: 'b2cs',
            names: ['b2cs'],
            title: 'B2C(Small) Details - 7',
            headers: ['Type', 'Place Of Supply', 'Applicable % of Tax Rate', 'Rate',
                'Taxable Value', 'Cess Amount', 'E-Commerce GSTIN']
        },
        {
            section: 'ecom',
            names: ['ecom'],
            title: 'E-commerce supplies',
            headers: ['Category', 'Place Of Supply', 'Taxable Value', 'Rate']
        },
        {
            section: 'nil',
            names: ['exemp'],
            title: 'Nil rated, exempted and non GST outward supplies (8)',
            headers: ['Description', 'Nil Rated Supplies',
                'Exempted(other than nil rated/non GST supply)', 'Non-GST Supplies']
        },
        {
            section: 'cdnur',
            names: ['cdnur'],
            title: 'Credit/Debit Notes(Unregistered) - 9B',
            headers: ['UR Type', 'Note Number', 'Note Date', 'Note Type', 'Place Of Supply',
                'Note Value', 'Applicable % of Tax Rate', 'Rate', 'Taxable Value', 'Cess Amount']
        },
        {
            section: 'eco',
            names: ['eco'],
            title: 'Supplies through e-commerce operator - 14',
            headers: ['Nature of Supply', 'GSTIN of E-Commerce Operator', 'E-Commerce Operator Name',
                'Net value of supplies', 'Integrated tax', 'Central tax', 'State/UT tax', 'Cess']
        },
        {
            section: 'doc',
            names: ['docs', 'doc_issue'],
            title: 'Documents issued during the tax period - 13',
            headers: ['Nature of Document', 'Sr. No. From', 'Sr. No. To', 'Total Number', 'Cancelled']
        },
        {
            section: 'hsn',
            names: ['hsn(b2b)', 'hsn_b2b'],
            title: 'HSN summary - B2B',
            headers: ['HSN', 'Description', 'UQC', 'Total Quantity', 'Total Value', 'Rate',
                'Taxable Value', 'Integrated Tax Amount', 'Central Tax Amount',
                'State/UT Tax Amount', 'Cess Amount']
        }
    ];

    function normalizeHeader(value) {
        return String(value || '').replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function findHeaderRow(section, matrix) {
        var definition = getDefinition(section);
        var required = section === 'b2b' ?
            ['GSTIN/UIN of Recipient', 'Invoice Number'] :
            section === 'b2cs' ? ['Place Of Supply', 'Rate', 'Taxable Value'] :
            section === 'ecom' ? ['Category', 'Place Of Supply', 'Taxable Value', 'Rate'] :
            section === 'nil' ? ['Description', 'Nil Rated Supplies'] :
            section === 'cdnur' ? ['Note Number', 'Note Date', 'Note Type'] :
            section === 'eco' ? ['Nature of Supply', 'GSTIN of E-Commerce Operator'] :
            section === 'doc' ? ['Nature of Document', 'Sr. No. From'] :
            ['HSN', 'Total Quantity', 'Taxable Value'];
        var expected = required.map(normalizeHeader);
        for (var rowIndex = 0; rowIndex < Math.min(matrix.length, 20); rowIndex += 1) {
            var values = matrix[rowIndex].map(normalizeHeader);
            if (expected.every(function (header) { return values.indexOf(header) !== -1; })) {
                return { definition: definition, rowIndex: rowIndex, headers: matrix[rowIndex] };
            }
        }
        throw new Error('Could not find the official column headings for the ' +
            definition.title + ' section. Use the supplied template and include its header row.');
    }

    function getDefinition(section) {
        var definition = sheets.find(function (item) { return item.section === section; });
        if (!definition) throw new Error('This section is not available for spreadsheet import.');
        return definition;
    }

    function asNumber(value, label, optional) {
        if (value === '' || value === null || value === undefined) {
            if (optional) return 0;
            throw new Error(label + ' is required.');
        }
        var parsed = typeof value === 'number' ? value :
            Number(String(value).replace(/[, $]/g, '').trim());
        if (!Number.isFinite(parsed)) throw new Error(label + ' must be a number.');
        return parsed;
    }

    function applicableRateFactor(value) {
        if (value === '' || value === null || value === undefined) return 1;
        var percent = asNumber(value, 'Applicable % of Tax Rate');
        if (percent <= 0 || percent > 100) {
            throw new Error('Applicable % of Tax Rate must be greater than 0 and no more than 100.');
        }
        return percent / 100;
    }

    function dateValue(value) {
        if (value instanceof Date && Number.isFinite(value.getTime())) {
            return [value.getUTCDate(), value.getUTCMonth() + 1, value.getUTCFullYear()]
                .map(function (part, index) { return index < 2 ? String(part).padStart(2, '0') : part; })
                .join('/');
        }
        if (typeof value === 'number' && value > 0) {
            var date = new Date(Date.UTC(1899, 11, 30) + Math.floor(value) * 86400000);
            return dateValue(date);
        }
        var text = String(value || '').trim();
        var iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (iso) return [iso[3], iso[2], iso[1]].map(function (part, index) {
            return index < 2 ? String(part).padStart(2, '0') : part;
        }).join('/');
        var dmy = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
        if (dmy) return [dmy[1], dmy[2], dmy[3]].map(function (part, index) {
            return index < 2 ? String(part).padStart(2, '0') : part;
        }).join('/');
        return text;
    }

    function stateCode(value) {
        var match = String(value || '').trim().match(/^(\d{2})/);
        return match ? match[1] : String(value || '').trim();
    }

    function columnMap(headers) {
        var map = {};
        headers.forEach(function (header, index) {
            map[normalizeHeader(header)] = index;
        });
        return map;
    }

    function get(row, map, names) {
        for (var index = 0; index < names.length; index += 1) {
            var column = map[normalizeHeader(names[index])];
            if (column !== undefined) return row[column];
        }
        return '';
    }

    function nonEmpty(row) {
        return row.some(function (cell) { return String(cell === null || cell === undefined ? '' : cell).trim() !== ''; });
    }

    function mapDocumentType(value) {
        var text = String(value || '').trim().toLowerCase();
        var types = [
            [/^invoices for outward supply$/, '1'],
            [/^invoices for inward supply from unregistered person$/, '2'],
            [/^revised invoices?$/, '3'],
            [/^debit notes?$/, '4'],
            [/^credit notes?$/, '5'],
            [/^receipt vouchers?$/, '6'],
            [/^payment vouchers?$/, '7'],
            [/^refund vouchers?$/, '8'],
            [/^delivery challan for job work$/, '9'],
            [/^delivery challan for supply on approval$/, '10']
        ];
        var found = types.find(function (item) { return item[0].test(text); });
        return found ? found[1] : String(value || '').trim();
    }

    function parseSectionRows(section, matrix, gstin) {
        var found = findHeaderRow(section, matrix);
        var definition = found.definition;
        var map = columnMap(found.headers);
        var dataRows = matrix.slice(found.rowIndex + 1).filter(nonEmpty);
        if (section === 'b2b') return { invoices: parseB2B(dataRows, map, gstin) };

        var entries = dataRows.map(function (row, index) {
            var result;
            if (section === 'b2cs') {
                var b2csFactor = applicableRateFactor(get(row, map, ['Applicable % of Tax Rate']));
                result = {
                    pos: stateCode(get(row, map, ['Place Of Supply'])),
                    txval: asNumber(get(row, map, ['Taxable Value']), 'Taxable Value'),
                    rt: asNumber(get(row, map, ['Rate']), 'Rate'),
                    diff_percent: b2csFactor,
                    csamt: asNumber(get(row, map, ['Cess Amount']), 'Cess Amount', true)
                };
            } else if (section === 'ecom') {
                result = {
                    category: String(get(row, map, ['Category'])).trim().toLowerCase(),
                    pos: stateCode(get(row, map, ['Place Of Supply'])),
                    txval: asNumber(get(row, map, ['Taxable Value']), 'Taxable Value'),
                    rt: asNumber(get(row, map, ['Rate']), 'Rate')
                };
            } else if (section === 'nil') {
                result = parseExemptRow(row, map);
            } else if (section === 'cdnur') {
                var noteType = String(get(row, map, ['Note Type'])).trim().toLowerCase();
                var noteFactor = applicableRateFactor(get(row, map, ['Applicable % of Tax Rate']));
                result = {
                    ntty: /debit/.test(noteType) || noteType === 'd' ? 'D' : 'C',
                    nt_num: String(get(row, map, ['Note Number'])).trim(),
                    nt_dt: dateValue(get(row, map, ['Note Date'])),
                    typ: String(get(row, map, ['UR Type'])).trim().toUpperCase(),
                    pos: stateCode(get(row, map, ['Place Of Supply'])),
                    txval: asNumber(get(row, map, ['Taxable Value']), 'Taxable Value'),
                    rt: asNumber(get(row, map, ['Rate']), 'Rate'),
                    diff_percent: noteFactor,
                    csamt: asNumber(get(row, map, ['Cess Amount']), 'Cess Amount', true)
                };
            } else if (section === 'eco') {
                var nature = String(get(row, map, ['Nature of Supply'])).trim();
                result = {
                    nat_supp: /52/.test(nature) ? 'clttx' : /9\(5\)/.test(nature) ? 'paytx' : '',
                    etin: String(get(row, map, ['GSTIN of E-Commerce Operator'])).trim().toUpperCase(),
                    cname: String(get(row, map, ['E-Commerce Operator Name'])).trim(),
                    suppval: asNumber(get(row, map, ['Net value of supplies']), 'Net value of supplies'),
                    igst: asNumber(get(row, map, ['Integrated tax']), 'Integrated tax', true),
                    cgst: asNumber(get(row, map, ['Central tax']), 'Central tax', true),
                    sgst: asNumber(get(row, map, ['State/UT tax']), 'State/UT tax', true),
                    cess: asNumber(get(row, map, ['Cess']), 'Cess', true)
                };
            } else if (section === 'doc') {
                result = {
                    doc_typ: mapDocumentType(get(row, map, ['Nature of Document'])),
                    num_from: String(get(row, map, ['Sr. No. From'])).trim(),
                    num_to: String(get(row, map, ['Sr. No. To'])).trim(),
                    total: asNumber(get(row, map, ['Total Number']), 'Total Number'),
                    cancel: asNumber(get(row, map, ['Cancelled']), 'Cancelled', true)
                };
            } else {
                var uqc = String(get(row, map, ['UQC'])).trim().split('-')[0].trim();
                result = {
                    num: index + 1,
                    hsn_sc: String(get(row, map, ['HSN'])).trim(),
                    desc: String(get(row, map, ['Description'])).trim(),
                    uqc: uqc || 'OTH',
                    qty: asNumber(get(row, map, ['Total Quantity']), 'Total Quantity'),
                    val: asNumber(get(row, map, ['Total Value']), 'Total Value'),
                    rt: asNumber(get(row, map, ['Rate']), 'Rate'),
                    txval: asNumber(get(row, map, ['Taxable Value']), 'Taxable Value'),
                    iamt: asNumber(get(row, map, ['Integrated Tax Amount']), 'Integrated Tax Amount', true),
                    camt: asNumber(get(row, map, ['Central Tax Amount']), 'Central Tax Amount', true),
                    samt: asNumber(get(row, map, ['State/UT Tax Amount']), 'State/UT Tax Amount', true),
                    csamt: asNumber(get(row, map, ['Cess Amount']), 'Cess Amount', true)
                };
            }
            try {
                if (section === 'nil') {
                    result.forEach(function (entry) {
                        model.validateSectionEntry(section, entry, gstin);
                    });
                } else if (section !== 'hsn') {
                    model.validateSectionEntry(section, result, gstin);
                } else {
                    model.validateHsn(result.hsn_sc);
                }
            } catch (error) {
                throw new Error(definition.title + ', row ' + (found.rowIndex + index + 2) + ': ' + error.message);
            }
            return result;
        });
        if (section === 'hsn') return { hsnB2B: entries };
        if (section === 'nil') {
            return { sections: { nil: entries.reduce(function (all, row) {
                return all.concat(row);
            }, []) } };
        }
        return { sections: { [section]: entries } };
    }

    function parseB2B(rows, map, gstin) {
        var grouped = {};
        var previous = {};
        rows.forEach(function (row, index) {
            ['GSTIN/UIN of Recipient', 'Invoice Number', 'Invoice date', 'Invoice Value',
                'Place Of Supply', 'Reverse Charge', 'Invoice Type', 'Applicable % of Tax Rate',
                'E-Commerce GSTIN'].forEach(function (header) {
                var currentValue = get(row, map, [header]);
                if (String(currentValue || '').trim() !== '') previous[normalizeHeader(header)] = currentValue;
            });
            var recipient = String(previous.gstinuinofrecipient || '').trim().toUpperCase();
            var number = String(previous.invoicenumber || '').trim();
            var key = recipient + '|' + number.toLowerCase();
            var rate = asNumber(get(row, map, ['Rate']), 'Rate');
            var taxable = asNumber(get(row, map, ['Taxable Value']), 'Taxable Value');
            var pos = stateCode(previous.placeofsupply);
            var rateFactor = applicableRateFactor(previous.applicableoftaxrate);
            var invoiceType = String(previous.invoicetype || 'Regular').trim().toUpperCase();
            var typeMap = {
                REGULAR: 'R', DE: 'DE', DEEMPEXP: 'DE', DEEMPEDEXPORTS: 'DE',
                DEEMPEXPORSUPPLYTOSEZ: 'DE',
                SEZWP: 'SEWP', SEZSUPPLIESWITHPAYMENT: 'SEWP',
                SEWOP: 'SEWOP', SEZSUPPLIESWITHOUTPAYMENT: 'SEWOP',
                CBW: 'CBW', INTRASTATESUPPLIESATTRACTINGIGST: 'CBW'
            };
            var detail = model.calculateTaxes(taxable, rate * rateFactor, gstin.substring(0, 2), pos,
                typeMap[invoiceType] || 'R');
            detail.rt = rate;
            if (rateFactor !== 1) detail.diff_percent = rateFactor;
            detail.csamt = asNumber(get(row, map, ['Cess Amount']), 'Cess Amount', true);
            if (!grouped[key]) {
                grouped[key] = {
                    ctin: recipient,
                    inum: number,
                    idt: dateValue(previous.invoicedate),
                    pos: pos,
                    rchrg: /^y|yes$/i.test(String(previous.reversecharge)) ? 'Y' : 'N',
                    inv_typ: typeMap[invoiceType] || 'R',
                    val: asNumber(previous.invoicevalue, 'Invoice Value', true),
                    etin: String(previous.ecommercegstin || '').trim().toUpperCase(),
                    itms: []
                };
            }
            var itemDetail = Object.assign({ qty: 0, uqc: 'OTH' }, detail);
            var ecomGstin = String(previous.ecommercegstin || '').trim().toUpperCase();
            if (ecomGstin) grouped[key].etin = ecomGstin;
            grouped[key].itms.push({
                num: grouped[key].itms.length + 1,
                itm_det: itemDetail
            });
            try {
                model.validateInvoice(grouped[key], gstin);
            } catch (error) {
                throw new Error('B2B, row ' + (index + 2) + ': ' + error.message);
            }
        });
        return Object.keys(grouped).map(function (key) {
            var invoice = grouped[key];
            var computedValue = invoice.itms.reduce(function (total, item) {
                var detail = item.itm_det;
                return total + detail.txval + detail.iamt + detail.camt + detail.samt + detail.csamt;
            }, 0);
            invoice.val = invoice.val || model.roundMoney(computedValue);
            return invoice;
        });
    }

    function parseExemptRow(row, map) {
        var description = String(get(row, map, ['Description'])).toLowerCase();
        var supplyType = /inter-state/.test(description) ? 'INTER' : 'INTRA';
        var entries = [];
        [
            ['nil_amt', 'Nil Rated Supplies'],
            ['expt_amt', 'Exempted(other than nil rated/non GST supply)'],
            ['ngsup_amt', 'Non-GST Supplies']
        ].forEach(function (field) {
            var amount = asNumber(get(row, map, [field[1]]), field[1], true);
            if (amount) entries.push({ sply_ty: supplyType, kind: field[0], amount: amount });
        });
        return entries;
    }

    function parseRows(section, matrix, gstin) {
        var parsed = parseSectionRows(section, matrix, gstin);
        return parsed;
    }

    function merge(target, incoming) {
        var result = {
            invoices: [],
            sections: {},
            hsnB2B: [],
            added: {},
            skipped: {}
        };
        target = target || {};
        incoming = incoming || {};
        result.invoices = JSON.parse(JSON.stringify(target.invoices || []));
        result.hsnB2B = JSON.parse(JSON.stringify(target.hsnB2B || []));
        result.sections = Object.assign({}, target.sections || {});
        Object.keys(result.sections).forEach(function (key) {
            result.sections[key] = (result.sections[key] || []).slice();
        });
        mergeInvoices(result, incoming.invoices || []);
        Object.keys(incoming.sections || {}).forEach(function (section) {
            result.sections[section] = result.sections[section] || [];
            mergeRows(result, section, result.sections[section], incoming.sections[section], stableKey);
        });
        mergeRows(result, 'hsn', result.hsnB2B, incoming.hsnB2B || [], stableKey);
        return result;
    }

    function mergeInvoices(result, additions) {
        var byNumber = {};
        result.invoices.forEach(function (invoice) {
            byNumber[invoice.ctin + '|' + String(invoice.inum).toLowerCase()] = invoice;
        });
        var added = 0;
        var skipped = 0;
        additions.forEach(function (invoice) {
            var key = invoice.ctin + '|' + String(invoice.inum).toLowerCase();
            var existing = byNumber[key];
            if (!existing) {
                byNumber[key] = invoice;
                result.invoices.push(invoice);
                added += 1;
                return;
            }
            var metadataFields = ['ctin', 'inum', 'idt', 'pos', 'rchrg', 'inv_typ', 'val', 'etin'];
            var metadataMatches = metadataFields.every(function (field) {
                return (existing[field] || '') === (invoice[field] || '');
            });
            if (!metadataMatches) {
                throw new Error('Invoice ' + invoice.inum + ' for GSTIN ' + invoice.ctin +
                    ' already exists with different details. Resolve the conflict before importing.');
            }
            if (!(invoice.itms || []).length) {
                skipped += 1;
                return;
            }
            var existingItems = new Set((existing.itms || []).map(stableKey));
            var newItems = (invoice.itms || []).filter(function (item) {
                var itemKey = stableKey(item);
                if (existingItems.has(itemKey)) {
                    skipped += 1;
                    return false;
                }
                existingItems.add(itemKey);
                added += 1;
                return true;
            });
            existing.itms = (existing.itms || []).concat(newItems);
        });
        result.added.b2b = added;
        result.skipped.b2b = skipped;
    }

    function mergeRows(result, key, existing, additions, keyFn) {
        var seen = new Set(existing.map(keyFn));
        var added = 0;
        var skipped = 0;
        additions.forEach(function (row) {
            var key = keyFn(row);
            if (seen.has(key)) {
                skipped += 1;
                return;
            }
            seen.add(key);
            existing.push(row);
            added += 1;
        });
        result.added[key] = (result.added[key] || 0) + added;
        result.skipped[key] = (result.skipped[key] || 0) + skipped;
    }

    function stableKey(value) {
        if (Array.isArray(value)) return '[' + value.map(stableKey).join(',') + ']';
        if (value && typeof value === 'object') {
            return '{' + Object.keys(value).sort().map(function (key) {
                return JSON.stringify(key) + ':' + stableKey(value[key]);
            }).join(',') + '}';
        }
        return JSON.stringify(value);
    }

    return {
        sheets: sheets,
        parseRows: parseRows,
        merge: merge,
        stableKey: stableKey
    };
}));
