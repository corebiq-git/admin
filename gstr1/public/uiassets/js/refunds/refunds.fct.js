myApp.factory('rfdFileHandler', rfdFileHandler);
rfdFileHandler.$inject = ["$q", "$http", "$filter"];

function rfdFileHandler(Q, Http, Filter) {
    return {
        getStmtForms: getStmtForms,
        getStmtRsnList: getStmtRsnList,
        getStatementList: getStatementList,
        getRfdInvTypes: getRfdInvTypes,
        saveRfdPayload: saveRfdPayload,
        getRfdContentForPaged: getRfdContentForPaged,
        getRfdContentsForMeta: getRfdContentsForMeta,
        createRfdFile: createRfdFile,
        updateRfdPayload: updateRfdPayload,
        deleteRefund: deleteRefund,
        deleteRfdInvoices: deleteRfdInvoices,
        getDropdown: getDropdown
    };

    function getStmtForms() {
        var deferred = Q.defer(),
            fName = "/data/stmtforms.json";
        Http.get(fName).success(function(response) {
            deferred.resolve(response.statementList);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getStmtRsnList() {
        var deferred = Q.defer(),
            fName = "/data/stmtrsnlist.json";
        Http.get(fName).success(function(response) {
            deferred.resolve(response.reasonList);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getStatementList(iForm) {
        var deferred = Q.defer(),
            fName = "/data/statementlist.json";
        Http.get(fName).success(function(response) {
            //var rtData = response.tblname;
            //rtData.shift();
            deferred.resolve(response[iForm]);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getRfdInvTypes(iForm) {
        var deferred = Q.defer(),
            fName = "/data/rfdinvtypes.json";
        Http.get(fName).success(function(response) {
            deferred.resolve(response[iForm]);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function saveRfdPayload(iParam) {
        var deferred = Q.defer(),
            fName = "/addTblDataRfd";
        Http.post(fName, iParam).success(function(response) {
            deferred.resolve(response);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function updateRfdPayload(iParam) {
        var deferred = Q.defer(),
            fName = "/updateTblDataRfd";
        Http.post(fName, iParam).success(function(response) {
            deferred.resolve(response);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getRfdContentForPaged(d, iSectionName, pageNum, form, shareData, filter, sort_by, sort_order) {
        var deferred = Q.defer(),
            fName = "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month + ".json";
        Http.post("/listJsonDataForRfd", { file: fName, page_num: pageNum, section: iSectionName, form: form, shareData: shareData, filter: filter, sort_by: sort_by, sort_order: sort_order }).success(function(response) {
            deferred.resolve(response);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getRfdContentsForMeta(d, iSectionName) {
        var deferred = Q.defer(),
            fName = "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month
        Http.post('/fetchRfdMeta', { fName: fName, form: form }).success(function(response) {
            if (iSectionName) {
                deferred.resolve(response.counts[iSectionName]);
            } else {
                deferred.resolve(response);
            }
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function createRfdFile(reqParam, response) {
        var deferred = Q.defer(),
            //fName = "/users/createfile";
            fName = "/generateRfdFile";
        Http.post(fName, reqParam, {
            responseType: 'arraybuffer'
        }).success(function(response, status, headers, config) {
            deferred.resolve(response);
            // saveAs(new Blob([data], { type: "application/zip"}), 'GSTR.zip');    
        }).error(function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function deleteRefund(iParam) {
        var deferred = Q.defer(),
            fName = "/deleteAllRfdInvoices";
        Http.post(fName, iParam).success(function(response) {
            deferred.resolve(response);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function deleteRfdInvoices(iParam) {
        var deferred = Q.defer(),
            fName = "/deleteRfdMltplInv";
        Http.post(fName, iParam).success(function(response) {
            deferred.resolve(response);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getDropdown() {
        var deferred = Q.defer(),
            MmLs = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            dropdownLs = [],
            DD = new Date(),
            MM = DD.getMonth(),
            YYYY = DD.getFullYear();

        function formateMMasNN(iNum) {
            return (Math.floor(iNum / 10)) ? iNum : "0" + iNum;
        }

        for (var i = YYYY, iEnd = (YYYY - 2); i > iEnd; i--) {
            var YY = parseInt(i.toString().substr(2, 2));
            if (YY !== 16) {
                dropdownLs.push({
                    "year": i + "-" + (YY + 1),
                    "months": []
                });
            }

            for (var j = 0; j < 12; j++) {
                dropdownLs[dropdownLs.length - 1]['months'].push({
                    "month": MmLs[j],
                    "value": formateMMasNN(j + 1) + "" + i
                });
            }
        }
        //            var deleteLastls = dropdownLs[dropdownLs.length - 1]['months'];
        //             deleteLastls.splice(0, (MM + 1));

        var deleteFirstls = dropdownLs[0]['months'];
        deleteFirstls.splice(MM + 1);

        deferred.resolve(reformateDropDownls(dropdownLs));

        return deferred.promise;
    }

    function reformateDropDownls(sacDrls) {
        var finalSacDrlsLn = [],
            sacDrlsLn = sacDrls.length;

        for (var i = 0; i < sacDrlsLn; i++) {
            var sacMmls = sacDrls[i]['months'],
                sacMmlslen = sacMmls.length;

            if ((i + 1) < sacDrlsLn) {
                var mvls = [];

                for (var j = 0; j < sacMmlslen; j++) {
                    if (j < 3) {
                        mvls.push(sacMmls[j])
                    }
                }
                var nextYearMMls = sacDrls[i + 1]['months'];
                sacDrls[i + 1]['months'] = nextYearMMls.concat(mvls);

                sacDrls[i]['months'].splice(0, mvls.length);
            } else {
                //last element
                var extraMm = (sacMmls.length - 12)
                if (extraMm > 0) {
                    sacDrls[i]['months'].splice(0, extraMm);
                }
            }

            if (sacDrls[i]['months'].length) {
                var curMonths = sacDrls[i].months;
                if (sacDrls[i].year == "2017-18") {
                    if (sacDrlsLn == 1)
                        sacDrls[i].months = curMonths.slice(6);
                    else
                        sacDrls[i].months = curMonths.slice(3);
                }
                finalSacDrlsLn.push(sacDrls[i])
            }
        }
        return finalSacDrlsLn;
    }
}

myApp.factory('RefundsStructure', RefundsStructure);
RefundsStructure.$inject = ["$log", "$q", "shareData"];

function RefundsStructure($log, Q, shareData) {
    return {
        getNewInv: getNewInv,
        getInvKey: getInvKey,
        validateAndRemoveNullValueKey: validateAndRemoveNullValueKey,
        removeSelectKey: removeSelectKey,
        getUpdatedRfdNodeDetails: getUpdatedRfdNodeDetails,

    };


    //To get new invoice row structure
    function getNewInv(iForm) {
        var newInvRw = {};
        var dashGstin = (shareData.refunddashBoardDt.gstin).substring(0, 2);
        switch (iForm) {
            case "statement1":
                newInvRw = {
                    "inum": null,
                    "idt": null,
                    "val": null,
                    "type": null,
                    "sbnum": null,
                    "sbdt": null,
                    "sbpcode": null,
                    "egmref": null,
                    "egmrefdt": null,
                    "brcfircnum": null,
                    "brcfircdt": null
                }
                break;
            case "statement2":
                newInvRw = {
                    "inum": null,
                    "idt": null,
                    "val": null,
                    "type": null,
                    "sbnum": null,
                    "sbdt": null,
                    "sbpcode": null,
                    "egmref": null,
                    "egmrefdt": null,
                    "brcfircnum": null,
                    "brcfircdt": null
                }
                break;
            case "statement3":
                newInvRw = {
                    "inum": null,
                    "idt": null,
                    "val": null,
                    "type": null,
                    "sbnum": null,
                    "sbdt": null,
                    "sbpcode": null,
                    "egmref": null,
                    "egmrefdt": null,
                    "brcfircnum": null,
                    "brcfircdt": null
                }
                break;
        }
        return newInvRw;
    }

    function validateAndRemoveNullValueKey(iInv) {
        Object.keys(iInv).forEach(function(key) {
            var value = iInv[key];
            if (value === "" || value === null) {
                delete iInv[key];
            }
        });

        return iInv;
    }

    function removeSelectKey(iInv) {
        Object.keys(iInv).forEach(function(key) {
            if (key == "select") {
                delete iInv[key];
            }
        });

        return iInv;
    }

    //unique values to update invoice
    function getUpdatedRfdNodeDetails(iForm, iData, gstin) {
        var updatedNodeDetails = {};
        switch (iForm) {
            case "statement3":
                updatedNodeDetails = {
                    gstin: gstin,
                    inum: iData.inum,
                    old_inum: iData.old_inum ? iData.old_inum : ''
                };
                break;
        }

        return updatedNodeDetails;
    }

    //To get unique id from excel
    function getInvKey(iForm) {
        var invKey = null;
        switch (iForm) {
            case 'statement3':
                invKey = "inum"
                break;
        }
        return invKey;
    }
}