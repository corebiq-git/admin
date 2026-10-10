(function () {
    'use strict';

    var databaseName = 'corebiq-gstr1-local';
    var databaseVersion = 1;
    var database;
    var activeReturn = null;
    var model = window.CorebiqLocalModel;
    var form = document.getElementById('return-form');
    var invoiceForm = document.getElementById('invoice-form');
    var status = document.getElementById('return-status');
    var errorBox = document.getElementById('app-error');
    var workspace = document.getElementById('workspace');
    var invoiceSection = document.getElementById('invoice-section');
    var invoiceList = document.getElementById('invoice-list');
    var sectionPanel = document.getElementById('local-section-panel');
    var sectionForm = document.getElementById('local-entry-form');
    var sectionEntries = document.getElementById('section-entry-list');
    var hsnList = document.getElementById('hsn-list');
    var activeSection = 'b2b';
    var sectionConfigs = {
        b2cs: {
            title: 'B2C small supplies',
            fields: [
                { name: 'pos', label: 'Place of supply (state code)', type: 'text', inputmode: 'numeric', maxlength: 2, required: true },
                { name: 'txval', label: 'Taxable value (INR)', type: 'number', min: '0.01', step: '0.01', required: true },
                { name: 'rt', label: 'GST rate', type: 'select', options: [['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%'], ['40', '40%']], required: true }
            ],
            columns: [['pos', 'Place of supply'], ['txval', 'Taxable value'], ['rt', 'Rate']]
        },
        nil: {
            title: 'Exempted / nil-rated / non-GST supplies',
            fields: [
                { name: 'sply_ty', label: 'Supply type', type: 'select', options: [['INTRA', 'Intra-state'], ['INTER', 'Inter-state']], required: true },
                { name: 'kind', label: 'Supply category', type: 'select', options: [['expt_amt', 'Exempted'], ['nil_amt', 'Nil rated'], ['ngsup_amt', 'Non-GST']], required: true },
                { name: 'amount', label: 'Supply value (INR)', type: 'number', min: '0', step: '0.01', required: true }
            ],
            columns: [['sply_ty', 'Supply type'], ['kind', 'Category'], ['amount', 'Amount']]
        },
        cdnur: {
            title: 'Credit / debit notes for unregistered recipients',
            fields: [
                { name: 'ntty', label: 'Note type', type: 'select', options: [['C', 'Credit note'], ['D', 'Debit note']], required: true },
                { name: 'nt_num', label: 'Note number', type: 'text', maxlength: 16, required: true },
                { name: 'nt_dt', label: 'Note date', type: 'date', required: true },
                { name: 'typ', label: 'Original supply type', type: 'select', options: [['B2CL', 'B2C large'], ['EXPWP', 'Export with payment'], ['EXPWOP', 'Export without payment']], required: true },
                { name: 'pos', label: 'Place of supply (state code)', type: 'text', inputmode: 'numeric', maxlength: 2, required: true },
                { name: 'txval', label: 'Taxable note value (INR)', type: 'number', min: '0.01', step: '0.01', required: true },
                { name: 'rt', label: 'GST rate', type: 'select', options: [['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%'], ['40', '40%']], required: true }
            ],
            columns: [['ntty', 'Note'], ['nt_num', 'Number'], ['nt_dt', 'Date'], ['typ', 'Supply type'], ['txval', 'Taxable value']]
        },
        ecom: {
            title: 'E-commerce supplies',
            fields: [
                { name: 'category', label: 'Supply category', type: 'select', options: [['b2b', 'B2B'], ['b2c', 'B2C'], ['urp2b', 'URP to registered'], ['urp2c', 'URP to unregistered']], required: true },
                { name: 'pos', label: 'Place of supply (state code)', type: 'text', inputmode: 'numeric', maxlength: 2, required: true },
                { name: 'txval', label: 'Taxable value (INR)', type: 'number', min: '0.01', step: '0.01', required: true },
                { name: 'rt', label: 'GST rate', type: 'select', options: [['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%'], ['40', '40%']], required: true }
            ],
            columns: [['category', 'Supply category'], ['pos', 'Place of supply'], ['txval', 'Taxable value'], ['rt', 'Rate']]
        },
        doc: {
            title: 'Documents issued',
            fields: [
                { name: 'doc_typ', label: 'Document type', type: 'select', options: [['1', 'Invoices for outward supply'], ['2', 'Invoices for inward supply from unregistered person'], ['3', 'Revised invoices'], ['4', 'Debit notes'], ['5', 'Credit notes'], ['6', 'Receipt vouchers'], ['7', 'Payment vouchers'], ['8', 'Refund vouchers'], ['9', 'Delivery challans for job work'], ['10', 'Delivery challans for supply on approval']], required: true },
                { name: 'num_from', label: 'Serial number from', type: 'number', min: '1', step: '1', required: true },
                { name: 'num_to', label: 'Serial number to', type: 'number', min: '1', step: '1', required: true },
                { name: 'total', label: 'Total documents', type: 'number', min: '1', step: '1', required: true },
                { name: 'cancel', label: 'Cancelled documents', type: 'number', min: '0', step: '1', value: '0', required: true }
            ],
            columns: [['doc_typ', 'Document type'], ['num_from', 'From'], ['num_to', 'To'], ['total', 'Total'], ['cancel', 'Cancelled']]
        }
    };

    function showError(error) {
        errorBox.textContent = error && error.message ? error.message : String(error);
        errorBox.hidden = false;
    }

    function clearError() {
        errorBox.textContent = '';
        errorBox.hidden = true;
    }

    function openDatabase() {
        return new Promise(function (resolve, reject) {
            if (!window.indexedDB) {
                reject(new Error('This browser does not support local database storage. Use a current version of Chrome, Edge, Firefox, or Safari.'));
                return;
            }
            var request = window.indexedDB.open(databaseName, databaseVersion);
            request.onupgradeneeded = function () {
                var db = request.result;
                if (!db.objectStoreNames.contains('returns')) {
                    db.createObjectStore('returns', { keyPath: 'id' });
                }
            };
            request.onsuccess = function () {
                database = request.result;
                database.onversionchange = function () {
                    database.close();
                    database = null;
                };
                resolve(database);
            };
            request.onerror = function () {
                reject(request.error || new Error('Could not open local browser storage.'));
            };
            request.onblocked = function () {
                reject(new Error('Local storage upgrade is blocked. Close other tabs of this tool and reload.'));
            };
        });
    }

    function transact(mode, operation) {
        return new Promise(function (resolve, reject) {
            if (!database) {
                reject(new Error('Local storage is not available. Reload the page and try again.'));
                return;
            }
            var tx = database.transaction(['returns'], mode);
            var request;
            try {
                request = operation(tx.objectStore('returns'));
            } catch (error) {
                reject(error);
                return;
            }
            tx.oncomplete = function () {
                resolve(request ? request.result : undefined);
            };
            tx.onerror = function () {
                reject(tx.error || new Error('The local storage operation failed.'));
            };
            tx.onabort = function () {
                reject(tx.error || new Error('The local storage operation was cancelled.'));
            };
        });
    }

    function makeReturnId(gstin, period) {
        return gstin + '_' + period;
    }

    function setReady(ready) {
        document.querySelectorAll('button, input, select').forEach(function (element) {
            element.disabled = !ready;
        });
        document.getElementById('open-return').disabled = !ready;
    }

    function loadReturn(gstin, period) {
        var id = makeReturnId(gstin, period);
        return transact('readonly', function (store) {
            return store.get(id);
        }).then(function (saved) {
            activeReturn = saved || { id: id, gstin: gstin, fp: period, invoices: [], sections: {} };
            activeReturn.invoices = activeReturn.invoices || [];
            activeReturn.sections = activeReturn.sections || {};
            document.getElementById('return-label').textContent =
                activeReturn.gstin + ' · ' + activeReturn.fp;
            workspace.hidden = false;
            invoiceSection.hidden = false;
            status.textContent = saved ?
                'Opened the return saved in this browser on this device.' :
                'New local return. It will be saved on this device when you add an invoice.';
            renderInvoices();
            renderOtherSections();
            if (sectionConfigs[activeSection]) {
                renderSectionEntries(activeSection);
            }
            selectSection(activeSection);
        });
    }

    function renderInvoices() {
        invoiceList.textContent = '';
        activeReturn.invoices.forEach(function (invoice, index) {
            var row = document.createElement('tr');
            [
                invoice.inum,
                invoice.idt,
                invoice.ctin,
                Number(invoice.itms[0].itm_det.txval).toFixed(2),
                (Number(invoice.itms[0].itm_det.iamt) +
                    Number(invoice.itms[0].itm_det.camt) +
                    Number(invoice.itms[0].itm_det.samt)).toFixed(2)
            ].forEach(function (value) {
                var cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            var actionCell = document.createElement('td');
            var remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'remove-invoice';
            remove.textContent = 'Remove';
            remove.setAttribute('aria-label', 'Remove invoice ' + invoice.inum);
            remove.addEventListener('click', function () {
                activeReturn.invoices.splice(index, 1);
                persistReturn('Invoice removed from this device.');
            });
            actionCell.appendChild(remove);
            row.appendChild(actionCell);
            invoiceList.appendChild(row);
        });
        document.getElementById('invoice-count').textContent =
            activeReturn.invoices.length + (activeReturn.invoices.length === 1 ? ' invoice' : ' invoices');
        renderHsn();
    }

    function persistReturn(message) {
        activeReturn.updatedAt = new Date().toISOString();
        transact('readwrite', function (store) {
            return store.put(activeReturn);
        }).then(function () {
            renderInvoices();
            renderOtherSections();
            if (sectionConfigs[activeSection]) {
                renderSectionEntries(activeSection);
            }
            status.textContent = message;
            clearError();
        }).catch(showError);
    }

    function parseInvoiceDate(value) {
        var parts = value.split('-');
        if (parts.length !== 3) {
            throw new Error('Enter a valid invoice date.');
        }
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearError();
        try {
            var gstin = document.getElementById('gstin').value.trim().toUpperCase();
            var period = document.getElementById('period').value.trim();
            model.validateGstin(gstin, 'Supplier GSTIN');
            model.validatePeriod(period);
            loadReturn(gstin, period).catch(showError);
        } catch (error) {
            showError(error);
        }
    });

    invoiceForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearError();
        if (!activeReturn) {
            showError(new Error('Open or create a local return first.'));
            return;
        }
        try {
            var supplierGstin = activeReturn.gstin;
            var recipient = document.getElementById('recipient').value.trim().toUpperCase();
            var pos = document.getElementById('place-of-supply').value.trim();
            var invoiceType = document.getElementById('invoice-type').value;
            var details = model.calculateTaxes(
                document.getElementById('taxable-value').value,
                document.getElementById('tax-rate').value,
                supplierGstin.substring(0, 2),
                pos,
                invoiceType
            );
            var invoice = {
                ctin: recipient,
                inum: document.getElementById('invoice-number').value.trim(),
                idt: parseInvoiceDate(document.getElementById('invoice-date').value),
                pos: pos,
                rchrg: document.getElementById('reverse-charge').value,
                inv_typ: invoiceType,
                val: model.roundMoney(details.txval + details.iamt + details.camt + details.samt),
                itms: [{
                    num: 1,
                    itm_det: Object.assign({
                        hsn_sc: document.getElementById('hsn').value.trim(),
                        qty: Number(document.getElementById('quantity').value),
                        uqc: document.getElementById('uqc').value
                    }, details)
                }]
            };
            model.validateInvoice(invoice, supplierGstin);
            if (!activeReturn.invoices.some(function (saved) {
                return saved.ctin === invoice.ctin && saved.inum.toLowerCase() === invoice.inum.toLowerCase();
            })) {
                activeReturn.invoices.push(invoice);
            } else {
                throw new Error('An invoice with this recipient GSTIN and invoice number is already saved.');
            }
            invoiceForm.reset();
            document.getElementById('tax-rate').value = '18';
            document.getElementById('invoice-type').value = 'R';
            document.getElementById('reverse-charge').value = 'N';
            persistReturn('Invoice saved in this browser on this device.');
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById('export-json').addEventListener('click', function () {
        clearError();
        try {
            if (!activeReturn || !activeReturn.invoices.length) {
                throw new Error('Add at least one invoice before exporting.');
            }
            var hasEntries = activeReturn.invoices.length ||
                Object.keys(activeReturn.sections).some(function (section) {
                    return activeReturn.sections[section] && activeReturn.sections[section].length;
                });
            if (!hasEntries) {
                throw new Error('Add data to at least one enabled section before exporting.');
            }
            var payload = model.buildReturn(activeReturn.gstin, activeReturn.fp, activeReturn);
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = 'GSTR1_' + activeReturn.gstin + '_' + activeReturn.fp + '.json';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            status.textContent = 'GSTR-1 JSON exported by your browser. The file remains on this device unless you move it.';
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById('delete-return').addEventListener('click', function () {
        clearError();
        if (!activeReturn || !window.confirm('Permanently delete this return from this browser on this device?')) {
            return;
        }
        transact('readwrite', function (store) {
            return store.delete(activeReturn.id);
        }).then(function () {
            activeReturn = null;
            workspace.hidden = true;
            invoiceSection.hidden = true;
            document.getElementById('other-entries-section').hidden = true;
            invoiceForm.reset();
            status.textContent = 'The local return was deleted from this device.';
        }).catch(showError);
    });

    function createField(field) {
        var label = document.createElement('label');
        label.appendChild(document.createTextNode(field.label));
        var input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(function (option) {
                var item = document.createElement('option');
                item.value = option[0];
                item.textContent = option[1];
                input.appendChild(item);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            if (field.inputmode) input.inputMode = field.inputmode;
            if (field.maxlength) input.maxLength = field.maxlength;
            if (field.min !== undefined) input.min = field.min;
            if (field.step) input.step = field.step;
            if (field.value) input.value = field.value;
        }
        input.name = field.name;
        input.required = Boolean(field.required);
        label.appendChild(input);
        return label;
    }

    function selectSection(name) {
        activeSection = name;
        document.querySelectorAll('.section-tab').forEach(function (button) {
            var selected = button.getAttribute('data-section') === name;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-current', selected ? 'page' : 'false');
        });
        document.getElementById('b2b-panel').hidden = name !== 'b2b';
        sectionPanel.hidden = !sectionConfigs[name];
        document.getElementById('hsn-panel').hidden = name !== 'hsn';
        invoiceSection.hidden = name !== 'b2b';
        if (sectionConfigs[name]) {
            renderSectionForm(name);
            renderSectionEntries(name);
        } else if (name === 'hsn') {
            renderHsn();
        }
    }

    function renderSectionForm(name) {
        var config = sectionConfigs[name];
        document.getElementById('local-section-title').textContent = config.title;
        sectionForm.textContent = '';
        var fields = document.createElement('div');
        fields.className = 'form-grid';
        config.fields.forEach(function (field) {
            fields.appendChild(createField(field));
        });
        var actions = document.createElement('div');
        actions.className = 'actions';
        var save = document.createElement('button');
        save.type = 'submit';
        save.className = 'button primary';
        save.textContent = 'Save ' + config.title.toLowerCase() + ' on this device';
        actions.appendChild(save);
        sectionForm.appendChild(fields);
        sectionForm.appendChild(actions);
    }

    function displayValue(value) {
        var optionLabels = {
            C: 'Credit note', D: 'Debit note', INTRA: 'Intra-state', INTER: 'Inter-state',
            expt_amt: 'Exempted', nil_amt: 'Nil rated', ngsup_amt: 'Non-GST',
            B2CL: 'B2C large', EXPWP: 'Export with payment', EXPWOP: 'Export without payment',
            b2b: 'B2B', b2c: 'B2C', urp2b: 'URP to registered', urp2c: 'URP to unregistered'
        };
        return optionLabels[value] || value;
    }

    function renderSectionEntries(name) {
        var config = sectionConfigs[name];
        var entries = activeReturn && activeReturn.sections[name] || [];
        var head = document.getElementById('section-table-head');
        head.textContent = '';
        var headerRow = document.createElement('tr');
        config.columns.forEach(function (column) {
            var cell = document.createElement('th');
            cell.textContent = column[1];
            headerRow.appendChild(cell);
        });
        var actionHeader = document.createElement('th');
        actionHeader.textContent = '';
        headerRow.appendChild(actionHeader);
        head.appendChild(headerRow);
        sectionEntries.textContent = '';
        entries.forEach(function (entry, index) {
            var row = document.createElement('tr');
            config.columns.forEach(function (column) {
                var cell = document.createElement('td');
                cell.textContent = displayValue(entry[column[0]]);
                row.appendChild(cell);
            });
            var actionCell = document.createElement('td');
            var remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'remove-invoice';
            remove.textContent = 'Remove';
            remove.addEventListener('click', function () {
                entries.splice(index, 1);
                persistReturn('Section entry removed from this device.');
            });
            actionCell.appendChild(remove);
            row.appendChild(actionCell);
            sectionEntries.appendChild(row);
        });
        document.getElementById('section-table-wrap').hidden = !entries.length;
    }

    function renderOtherSections() {
        if (!activeReturn) return;
        var summary = document.getElementById('other-entry-summary');
        summary.textContent = '';
        var labels = { b2cs: 'B2C small', nil: 'Exempted', cdnur: 'Notes to unregistered', ecom: 'E-commerce', doc: 'Documents' };
        var hasEntries = false;
        Object.keys(labels).forEach(function (section) {
            var count = (activeReturn.sections[section] || []).length;
            if (!count) return;
            hasEntries = true;
            var card = document.createElement('div');
            card.className = 'summary-card';
            var title = document.createElement('strong');
            title.textContent = labels[section];
            var value = document.createElement('span');
            value.textContent = count + (section === 'doc' ? ' document range(s)' : ' entr' + (count === 1 ? 'y' : 'ies'));
            card.appendChild(title);
            card.appendChild(value);
            summary.appendChild(card);
        });
        document.getElementById('other-entries-section').hidden = !hasEntries;
    }

    function renderHsn() {
        hsnList.textContent = '';
        if (!activeReturn) return;
        model.summarizeHsn(activeReturn.invoices).forEach(function (entry) {
            var row = document.createElement('tr');
            [entry.hsn_sc, entry.desc || '-', entry.uqc, entry.qty, entry.txval.toFixed(2),
                entry.rt, entry.iamt.toFixed(2), entry.camt.toFixed(2),
                entry.samt.toFixed(2), entry.csamt.toFixed(2)].forEach(function (value) {
                var cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            hsnList.appendChild(row);
        });
    }

    document.getElementById('section-tabs').addEventListener('click', function (event) {
        var button = event.target.closest('[data-section]');
        if (button) selectSection(button.getAttribute('data-section'));
    });

    sectionForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearError();
        if (!activeReturn) {
            showError(new Error('Open or create a local return first.'));
            return;
        }
        try {
            var entry = {};
            sectionConfigs[activeSection].fields.forEach(function (field) {
                var value = sectionForm.elements[field.name].value.trim();
                if (field.type === 'date') {
                    value = parseInvoiceDate(value);
                } else if (field.type === 'number') {
                    value = Number(value);
                }
                entry[field.name] = value;
            });
            model.validateSectionEntry(activeSection, entry, activeReturn.gstin);
            activeReturn.sections[activeSection] = activeReturn.sections[activeSection] || [];
            activeReturn.sections[activeSection].push(entry);
            sectionForm.reset();
            persistReturn(sectionConfigs[activeSection].title + ' saved on this device.');
        } catch (error) {
            showError(error);
        }
    });

    setReady(false);
    openDatabase().then(function () {
        setReady(true);
        status.textContent = 'Local storage is ready. Return data is stored in this browser only.';
    }).catch(showError);

    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('service-worker.js').catch(showError);
    }
}());
