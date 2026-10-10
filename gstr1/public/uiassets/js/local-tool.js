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
            activeReturn = saved || { id: id, gstin: gstin, fp: period, invoices: [] };
            document.getElementById('return-label').textContent =
                activeReturn.gstin + ' · ' + activeReturn.fp;
            workspace.hidden = false;
            invoiceSection.hidden = false;
            status.textContent = saved ?
                'Opened the return saved in this browser on this device.' :
                'New local return. It will be saved on this device when you add an invoice.';
            renderInvoices();
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
    }

    function persistReturn(message) {
        activeReturn.updatedAt = new Date().toISOString();
        transact('readwrite', function (store) {
            return store.put(activeReturn);
        }).then(function () {
            renderInvoices();
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
                itms: [{ num: 1, itm_det: Object.assign({ hsn_sc: document.getElementById('hsn').value.trim() }, details) }]
            };
            model.validateInvoice(invoice, supplierGstin);
            activeReturn.invoices.push(invoice);
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
            var payload = model.buildReturn(activeReturn.gstin, activeReturn.fp, activeReturn.invoices);
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
            invoiceForm.reset();
            status.textContent = 'The local return was deleted from this device.';
        }).catch(showError);
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
