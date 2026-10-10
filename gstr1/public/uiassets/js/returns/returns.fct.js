


(function () {
    /*'use strict';*/

    var cnvt2Nm = function (s) {
        if (!s)
            return 0;
        if (s == '')
            return 0;
        s = parseFloat(s);
        s = s.toFixed(2);
        s = parseFloat(s);
        return s;
    }

    var monthsList = {
        "january": "01",
        "february": "02",
        "march": "03",
        "april": "04",
        "may": "05",
        "june": "06",
        "july": "07",
        "august": "08",
        "september": "09",
        "october": "10",
        "november": "11",
        "december": "12"
    }


    function getDate(retprd) {
        var a = '01/' + retprd.substring(0, 2) + '/' + retprd.substring(2);
        return a;
    };

    function isValidRtnPeriod(iYearsList, curntYear, curntMonth) {
        var isValidPeriod = false, monthValue = null;

        angular.forEach(iYearsList, function (obj, i) {
            if (obj.year === curntYear) {
                angular.forEach(obj.months, function (monObj, i) {
                    if (monObj.month.toLowerCase() === curntMonth.toLowerCase()) {
                        monthValue = monObj.value;
                        isValidPeriod = true;
                    }
                });

            }
        })
        return {
            isValidPeriod: isValidPeriod,
            monthValue: monthValue
        }
    }

    function getYearFromTheMonth(iYearsList, omonValue) {
        var curntYear;
        for (var i = 0; i < iYearsList.length; i++) {
            var yearObj = iYearsList[i];
            for (var j = 0; j < yearObj.months.length; j++) {
                var monObj = yearObj.months[j];
                if (monObj.value === omonValue) {
                    curntYear = yearObj;
                    break;
                }
            }
        }
        return curntYear;

    }


    // var years=[]


    var monthPattern = /^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)$/,
        yearPattern = /^(2017-18|2018-19|2019-20|2020-21|2021-22|2022-23|2023-24|2024-25|2025-26|2026-27)$/;

    var OfflineFactory = angular.module('OfflineFactory', ['ng']);

    //All File and API operations
    OfflineFactory.factory('g1FileHandler', g1FileHandler);
    g1FileHandler.$inject = ["$q", "$http", "R1Util", "shareData","$filter"];

    function g1FileHandler(Q, Http, R1Util, shareData, Filter) {
        return {
            createFile: createFile,
            createErrorFile: createErrorFile,
            createZip: createZip,
            getStateList: getStateList,
            getReasonList: getReasonList,
            getRateList: getRateList,
            getInvTypes: getInvTypes,
            getInvTypesForB2b: getInvTypesForB2b,
            getDropdown: getDropdown,
            getGstForms: getGstForms,
            getSectionList: getSectionList,
            getContentsForMeta: getContentsForMeta, //ADDITION BY V START-END 
            getContentsForPaged: getContentsForPaged,//ADDITION BY V START-END 
            getContentsFor: getContentsFor,
            getErrContentsFor: getErrContentsFor,
            savePayload: savePayload,
            savePayloadFile: savePayloadFile,  //ADDITION BY V START-END 
            getSummaryOfInvoices: getSummaryOfInvoices,
            deleteInvoices: deleteInvoices,
            updatePayload: updatePayload,
            updateData: updateData,
            updateErrorPayload: updateErrorPayload,
            updateAcceptPayload: updateAcceptPayload,
            uploadErrFile: uploadErrFile,
            extractErrFile: extractErrFile,
            uploadReturnFile: uploadReturnFile,
            mstrUploadFile: mstrUploadFile,
            returnFile: returnFile,
            extractReturnFile: extractReturnFile,
            saveMultiplePayload: saveMultiplePayload,
            deleteReturn: deleteReturn,
            getUploadSectionList: getUploadSectionList,
            getErrorSectionList: getErrorSectionList,
            getUploadContentsFor: getUploadContentsFor,
            getErrorContentsFor: getErrorContentsFor,
            checkExistence: checkExistence,
            checkErrorExistence: checkErrorExistence,
            deleteErrorPayload: deleteErrorPayload,
            setDeletePayload: setDeletePayload,
            uploadDeleteAll: uploadDeleteAll,
            uploadPayloadSetUpdateFlag: uploadPayloadSetUpdateFlag,
            versionCheck: versionCheck,
            deleteSectionData: deleteSectionData,
            createExcel: createExcel,
            getDownloadContentsFor: getDownloadContentsFor,
            checkDuplicateInvoice: checkDuplicateInvoice,
            saveProductMstr: saveProductMstr,
            addSupNmToJson: addSupNmToJson,
            getMasterData: getMasterData,
            markForDeletefunc: markForDeletefunc
        };

        function createExcel(reqParam, response) {

            var deferred = Q.defer(),
                //fName = "/users/createfile";
                fName = "/exportJsonToExcel";
            Http.post(fName, reqParam, {
                responseType: 'blob'
            }).success(function (response, status, headers, config) {
                deferred.resolve(response);
                // saveAs(new Blob([data], { type: "application/zip"}), 'GSTR.zip');    
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }


        function versionCheck() {
            // prod URL = https://tutorial.gst.gov.in/public/gst_versions.json
            // SIT URL = https://sitr1tutorials.gstsystem.co.in/public/gst_versions.json


            var deferred = Q.defer(),
                fName = "https://tutorial.gst.gov.in/public/gst_versions.json"; // UPDATE CHECK - URL, this url should be the url of the json file having the most recent version.
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
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

            for (var i = YYYY; i >= 2018; i--) {
                var YY = parseInt(i.toString().substr(2, 2));
                if (YY !== 16) {
                    dropdownLs.push({
                        "year": i + "-" + (YY + 1),
                        "months": []
                    });
                    for (var j = 0; j < 12; j++) {
                        dropdownLs[dropdownLs.length - 1]['months'].push({
                            "month": MmLs[j],
                            "value": formateMMasNN(j + 1) + "" + i
                        });
                    }
                }


            }

            // var deleteLastls = dropdownLs[dropdownLs.length - 1]['months'];
            // deleteLastls.splice(0,(MM + 1));

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
                    var curMonths = sacDrls[i].months, numberToSlice;
                    if (sacDrls[i].year == "2017-18") {
                        for (var j = 0; j < curMonths.length; j++) {
                            if (curMonths[j].value == "072017") {
                                numberToSlice = j;
                            }
                        }
                        sacDrls[i].months = curMonths.slice(numberToSlice);
                    }

                    finalSacDrlsLn.push(sacDrls[i])
                }
            }

            return finalSacDrlsLn;
        }

        function getGstForms(isQtp) {
            var deferred = Q.defer(),
                fName = "/data/gstr.json";
            Http.get(fName).success(function (response) {
                if (!isQtp)
                    deferred.resolve(response.gstr);
                else
                    deferred.resolve(response.gstriff);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getStateList() {
            var deferred = Q.defer(),
                fName = "/data/state.json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getReasonList() {
            var deferred = Q.defer(),
                fName = "/data/rsn.json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getInvTypes() {
            var deferred = Q.defer(),
                fName = "/data/invtypes.json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getInvTypesForB2b() {
            var deferred = Q.defer(),
                fName = "/data/invtypesforb2b.json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getRateList() {
            var deferred = Q.defer(),
                fName = "/data/rate.json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function deleteInvoices(iParam) {
            var deferred = Q.defer(),
                fName = "/deleteMltplInv";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function checkDuplicateInvoice(iParam, fSent) {
            var fName;
            if (fSent == "Import") {
                fName = iParam.returnFileName;
            }
            else if (fSent == "Error") {
                fName = iParam.errFileName;
            } else {
                fName = "userData/" + iParam.gstin + "/" + iParam.form + "/" + iParam.fy + "/" + iParam.month + "/" + iParam.form + "_" + iParam.gstin + "_" + iParam.fy + "_" + iParam.month + ".json";
            }
            //            if (!fl)
            // fl = 'INIT';
            iParam.fName = fName;

            var deferred = Q.defer(),
                fName = "/itemExists";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // Product Master 
        function saveProductMstr(gstin, savemstr, recType,append) {
            var deferred = Q.defer(),
                iParam = {
                    "savemstr": savemstr,
                    "gstin": gstin,
                    "recType": recType,
                    "append": append ? true :false
                }
            fName = "/saveMstrforprod";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

        function addSupNmToJson(d, ctin) {
            var deferred = Q.defer(),
                iParam = {
                    "fName": "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month + ".json",
                    "ctin": ctin,

                }

            Http.post("/addSupNmToJson", iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

        function markForDeletefunc(gstin,savemstr, recType) {
            var deferred = Q.defer(),
                iParam = {
                    "savemstr": savemstr,
                    "gstin": gstin,
                    "recType": recType
                }
            fName = "/markforDelete";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

        function getMasterData(gstin) {
            var deferred = Q.defer(),
                iParam = {
                    "gstin": gstin
                }
            fName = "/getMasterData";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }


        function deleteReturn(iParam) {
            var deferred = Q.defer(),
                fName = "/deleteallinvoices";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function deleteSectionData(iParam) {
            var deferred = Q.defer(),
                fName = "/clearSectionData";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function createFile(reqParam, response) {

            var deferred = Q.defer(),
                //fName = "/users/createfile";
                fName = "/generateFile";
            Http.post(fName, reqParam, {
                /*responseType: 'arraybuffer'*/
            }).success(function (response, status, headers, config) {
                //response.mimeType = config.headers['Content-Type'];             
                deferred.resolve(response);
                // saveAs(new Blob([data], { type: "application/zip"}), 'GSTR.zip');    
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function createErrorFile(reqParam, response) {

            var deferred = Q.defer(),
                //fName = "/users/createfile";
                fName = "/generateErrorFile";
            Http.post(fName, reqParam, {
                //                responseType: 'arraybuffer'
            }).success(function (response, status, headers, config) {
                deferred.resolve(response);
                // saveAs(new Blob([data], { type: "application/zip"}), 'GSTR.zip');    
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function createZip(reqParam, response) {

            var deferred = Q.defer(),
                //fName = "/users/createfile";
                fName = "/generateZip";
            Http.post(fName, reqParam, {
                responseType: 'arraybuffer'
            }).success(function (response, status, headers, config) {
                deferred.resolve(response);
                // saveAs(new Blob([data], { type: "application/zip"}), 'GSTR.zip');    
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getDate(retprd) {
            var a = '01/' + retprd.substring(0, 2) + '/' + retprd.substring(2);
            return a;
        };
        function getSectionList(iForm) {
            shareData.R1_NEW_ECO_STRT_PRD = "012024";
            shareData.R1_NEW_ECOA_STRT_PRD = "022024";
            //B2B and B2C in hsn
            shareData.HSN_BIFURCATION_START_DATE = "052025";
            shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
            var deferred = Q.defer(),
                fName = "/data/tablename.json";
            Http.get(fName).success(function (response) {
                //var rtData = response.tblname;
                //rtData.shift();
              if (response && (iForm == 'GSTR1')) {
                    var hsnTables = [];
                    // validating HSN period
                    if (!shareData.showHSNTabs) {
                        hsnTables = [{
                            "cd": "hsn",
                            "url": "/pages/returns/gstr1/hsn/summaryHome.html",
                            "nm": "HSN-wise Summary of Outward Supplies - 12"
                        }];
                    } else {
                        hsnTables = [{
                            "cd": "hsn(b2b)",
                            "url": "/pages/returns/gstr1/hsn/newSummary.html",
                            "nm": "HSN-wise summary of outward supplies (B2B) - 12"
                        },
                        {
                            "cd": "hsn(b2c)",
                            "url": "/pages/returns/gstr1/hsn/b2c.html",
                            "nm": "HSN-wise summary of outward supplies (B2C) -  12"
                        }
                        ];
                    }
                    angular.forEach(hsnTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1') && !shareData.isTPQ && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [{
                        "cd": "supeco",
                        "url": "/pages/returns/gstr1/supeco/summary.html",
                        "nm": "Supplies made through ECO - 14"
                    },
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomb2c",
                        "url": "/pages/returns/gstr1/ecom/b2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2C"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    },
                    {
                        "cd": "ecomurp2c",
                        "url": "/pages/returns/gstr1/ecom/c2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2C" 
                    }
                    ];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1') && !shareData.isTPQ && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [
                    {
                        "cd": "supecoa",
                        "url": "/pages/returns/gstr1/supecoa/summary.html",
                        "nm": "Amended Supplies made through ECO - 14A"
                    },
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomab2c",
                        "url": "/pages/returns/gstr1/ecoma/b2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2C"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    },
                    {
                        "cd": "ecomaurp2c",
                        "url": "/pages/returns/gstr1/ecoma/urp2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2C"
                    }];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1IFF' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) != 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    }
                    ];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                // if(response && (iForm == 'GSTR1' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) == 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                //     var newECOTables = [{
                //         "cd": "supeco",
                //         "url": "/pages/returns/gstr1/supeco/summary.html",
                //         "nm": "Supplies made through ECO - 14"
                //     },
                //     {
                //         "cd": "ecomb2b",
                //         "url": "/pages/returns/gstr1/ecom/summary.html",
                //         "nm": "Supplies U/s 9(5) - 15 - B2B"
                //     },
                //     {
                //         "cd": "ecomurp2b",
                //         "url": "/pages/returns/gstr1/ecom/c2bsummary.html",
                //         "nm": "Supplies U/s 9(5) - 15 - URP2B"
                //     }];
                //     angular.forEach(newECOTables, function (item, i) {
                //         response[iForm].push(item);
                //     });
                // }
                if(response && (iForm == 'GSTR1IFF' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) != 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    }
                    ];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) == 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [{
                        "cd": "supeco",
                        "url": "/pages/returns/gstr1/supeco/summary.html",
                        "nm": "Supplies made through ECO - 14"
                    },
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomb2c",
                        "url": "/pages/returns/gstr1/ecom/b2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2C"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    },
                    {
                        "cd": "ecomurp2c",
                        "url": "/pages/returns/gstr1/ecom/c2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2C" 
                    },
                    {
                        "cd": "supecoa",
                        "url": "/pages/returns/gstr1/supecoa/summary.html",
                        "nm": "Amended Supplies made through ECO - 14A"
                    },
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomab2c",
                        "url": "/pages/returns/gstr1/ecoma/b2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2C"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    },
                    {
                        "cd": "ecomaurp2c",
                        "url": "/pages/returns/gstr1/ecoma/urp2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2C"
                    }];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                deferred.resolve(response[iForm]);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getUploadSectionList(iForm) {
            shareData.R1_NEW_ECO_STRT_PRD = "012024";
            shareData.R1_NEW_ECOA_STRT_PRD = "022024";
            //B2B and B2C in hsn
            shareData.HSN_BIFURCATION_START_DATE = "052025";
            shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
            var deferred = Q.defer(),
                fName = "/data/uploadtablename.json";
            Http.get(fName).success(function (response) {
                //var rtData = response.tblname;
                //rtData.shift();
          if (response && (iForm == 'GSTR1')) {
                    var hsnTables = [];
                    // validating HSN period
                    if (!shareData.showHSNTabs) {
                        hsnTables = [{
                            "cd": "hsn",
                            "url": "/pages/returns/upload/gstr1/hsn/summary.html",
                            "nm": "HSN-wise Summary of Outward Supplies - 12"
                        }];
                    } else {
                        hsnTables = [{
                            "cd": "hsn(b2b)",
                            "url": "/pages/returns/upload/gstr1/hsn/newSummary.html",
                            "nm": "HSN-wise summary of outward supplies (B2B) - 12"
                        },
                        {
                            "cd": "hsn(b2c)",
                            "url": "/pages/returns/upload/gstr1/hsn/b2c.html",
                            "nm": "HSN-wise summary of outward supplies (B2C) -  12"
                        }
                        ];
                    }
                    angular.forEach(hsnTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1') && !shareData.isTPQ && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [{
                        "cd": "supeco",
                        "url": "/pages/returns/upload/gstr1/supeco/summary.html",
                        "nm": "Supplies made through ECO - 14"
                    },
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/upload/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomb2c",
                        "url": "/pages/returns/upload/gstr1/ecom/b2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2C"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/upload/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    },
                    {
                        "cd": "ecomurp2c",
                        "url": "/pages/returns/upload/gstr1/ecom/c2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2C" 
                    }
                    ];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1') && !shareData.isTPQ && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [
                    {
                        "cd": "supecoa",
                        "url": "/pages/returns/upload/gstr1/supecoa/summary.html",
                        "nm": "Amended Supplies made through ECO - 14A"
                    },
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/upload/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomab2c",
                        "url": "/pages/returns/upload/gstr1/ecoma/b2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2C"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/upload/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    },
                    {
                        "cd": "ecomaurp2c",
                        "url": "/pages/returns/upload/gstr1/ecoma/urp2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2C"
                    }];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1IFF' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) != 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/upload/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/upload/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    }
                    ];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1IFF' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) != 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/upload/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/upload/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    }
                    ];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1' && shareData.isTPQ && (shareData.dashBoardDt.fp.substring(0,2)%3) == 0) && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [{
                        "cd": "supeco",
                        "url": "/pages/returns/upload/gstr1/supeco/summary.html",
                        "nm": "Supplies made through ECO - 14"
                    },
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/upload/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomb2c",
                        "url": "/pages/returns/upload/gstr1/ecom/b2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2C"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/upload/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    },
                    {
                        "cd": "ecomurp2c",
                        "url": "/pages/returns/upload/gstr1/ecom/c2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2C" 
                    },
                    {
                        "cd": "supecoa",
                        "url": "/pages/returns/upload/gstr1/supecoa/summary.html",
                        "nm": "Amended Supplies made through ECO - 14A"
                    },
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/upload/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomab2c",
                        "url": "/pages/returns/upload/gstr1/ecoma/b2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2C"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/upload/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    },
                    {
                        "cd": "ecomaurp2c",
                        "url": "/pages/returns/upload/gstr1/ecoma/urp2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2C"
                    }];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                deferred.resolve(response[iForm]);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getErrorSectionList(iForm) {
          //B2B and B2C in hsn
            shareData.HSN_BIFURCATION_START_DATE = "052025";
            shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
            var deferred = Q.defer(),
                fName = "/data/errortablename.json";
            Http.get(fName).success(function (response) {
                //var rtData = response.tblname;
                //rtData.shift();
            if (response && (iForm == 'GSTR1')) {
                    var hsnTables = [];
                    // validating HSN period
                    if (!shareData.showHSNTabs) {
                        hsnTables = [{
                            "cd": "hsn",
                            "url": "/pages/returns/error/gstr1/hsn/summary.html",
                            "nm": "HSN-wise Summary of Outward Supplies - 12"
                        }];
                    } else {
                        hsnTables = [{
                            "cd": "hsn(b2b)",
                            "url": "/pages/returns/error/gstr1/hsn/newSummary.html",
                            "nm": "HSN-wise summary of outward supplies (B2B) - 12"
                        },
                        {
                            "cd": "hsn(b2c)",
                            "url": "/pages/returns/error/gstr1/hsn/b2c.html",
                            "nm": "HSN-wise summary of outward supplies (B2C) -  12"
                        }
                        ];
                    }
                    angular.forEach(hsnTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                if(response && (iForm == 'GSTR1' || iForm == 'GSTR1IFF') && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                    var newECOTables = [{
                        "cd": "supeco",
                        "url": "/pages/returns/error/gstr1/supeco/summary.html",
                        "nm": "Supplies made through ECO - 14"
                    },
                    {
                        "cd": "supecoa",
                        "url": "/pages/returns/error/gstr1/supecoa/summary.html",
                        "nm": "Amended Supplies made through ECO - 14A"
                    },
                    {
                        "cd": "ecomb2b",
                        "url": "/pages/returns/error/gstr1/ecom/summary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2B"
                    },
                    {
                        "cd": "ecomb2c",
                        "url": "/pages/returns/error/gstr1/ecom/b2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - B2C"
                    },
                    {
                        "cd": "ecomurp2b",
                        "url": "/pages/returns/error/gstr1/ecom/c2bsummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2B"
                    },
                    {
                        "cd": "ecomurp2c",
                        "url": "/pages/returns/error/gstr1/ecom/c2csummary.html",
                        "nm": "Supplies U/s 9(5) - 15 - URP2C" 
                    },
                    {
                        "cd": "ecomab2b",
                        "url": "/pages/returns/error/gstr1/ecoma/b2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2B"
                    },
                    {
                        "cd": "ecomab2c",
                        "url": "/pages/returns/error/gstr1/ecoma/b2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - B2C"
                    },
                    {
                        "cd": "ecomaurp2b",
                        "url": "/pages/returns/error/gstr1/ecoma/urp2basummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2B"
                    },
                    {
                        "cd": "ecomaurp2c",
                        "url": "/pages/returns/error/gstr1/ecoma/urp2casummary.html",
                        "nm": "Amended Supplies U/s 9(5) - 15A - URP2C"
                    }];
                    angular.forEach(newECOTables, function (item, i) {
                        response[iForm].push(item);
                    });
                }
                deferred.resolve(response[iForm]);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // CHANGES BY V HERE START
        function getContentsForMeta(d, iSectionName, fSent) {
            var deferred = Q.defer();
            if (fSent) {
                var fName = d.returnFileName;
            } else {
                var fName = "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month;
            }
            var form = d.form;
            Http.post('/fetchMeta', { fName: fName, form: form, isTPQ: shareData.isTPQ }).success(function (response) {
                if (iSectionName) {
                    deferred.resolve(response.counts[iSectionName]);
                } else {
                    deferred.resolve(response);
                }
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getContentsForPaged(d, iSectionName, pageNum, form, shareData, filter, sort_by, sort_order, fl, fSent) {
            var deferred = Q.defer();

            if (fSent) {
                var fName = d.returnFileName;
            } else {
                fName = "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month + ".json";
            }


            if (!fl)
                fl = 'INIT'; // FIRST FLOW normal functionality
            Http.post("/listJsonData", { file: fName, page_num: pageNum, section: iSectionName, form: form, shareData: shareData, filter: filter, sort_by: sort_by, sort_order: sort_order, fl: fl }).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // CHANGES BY V HERE END

        function getContentsFor(d, iSectionName) {
            var deferred = Q.defer(),
                fName = "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month + ".json";
            Http.get(fName).success(function (response) {
                if (iSectionName) {
                    deferred.resolve(response[iSectionName]);
                } else {
                    deferred.resolve(response);
                }
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getDownloadContentsFor(fName) {
            var deferred = Q.defer();
            // fName = "userData/" + d.gstin + "/" + d.form + "/" + d.fy + "/" + d.month + "/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month + ".json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getUploadContentsFor(d, iSectionName) {
            var deferred = Q.defer(),
                fileName = d.returnFileName;
            // fName = "upload/" + d.returnFileName +".json"; 

            Http.post('/fetchJsonFile', { file_name: fileName }, { cache: false }).success(function (response) {
                if (response.txpd) {
                    response.atadj = response.txpd;
                    response.txpd = [];
                    delete response.txpd;
                }
                if (response.txpda) {
                    response.atadja = response.txpda;
                    response.txpda = [];
                    delete response.txpda;
                }

                if (response.cdn) {
                    response.cdnr = response.cdn;
                    response.cdn = [];
                    delete response.cdn;
                }
                if (iSectionName) {
                    if (!response[iSectionName])
                        response[iSectionName] = [];
                    if (iSectionName == 'nil' && d.form == 'GSTR2')
                        iSectionName = 'nil_supplies';
                    deferred.resolve(response[iSectionName]);
                } else {
                    deferred.resolve(response);
                }
            }).error(function (error) {
                error = "Please Select Correct Details Of The File";
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getErrorContentsFor(d, iSectionName) {
            var fileName = d.errFileName;
            var deferred = Q.defer(),
                fName = fileName;
            shareData.HSN_BIFURCATION_START_DATE = "052025";
            shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
           
            Http.get(fName).success(function (response) {
                var iResp = response['error_report'];

              
                if(shareData.showHSNTabs){
                iResp.hsn_b2c = [];
                iResp.hsn_b2b = [];
                angular.forEach(iResp.hsn, function (hsnItem, i) {
            
                    if (hsnItem.hsn_b2c) {
                        iResp.hsn_b2c.push(iResp.hsn[i]);
                    }
                });
                angular.forEach(iResp.hsn, function (hsnItem, i) {
                    if (hsnItem.hsn_b2b) {
                        iResp.hsn_b2b.push(iResp.hsn[i]);
                    }
                });
                
             
            }
        
                if(iResp.clttx || iResp.paytx){
                    iResp.supeco = {};
                }
                if(iResp.clttxa || iResp.paytxa){
                    iResp.supecoa = {};
                }
                if (iResp.txpd) {
                    iResp.atadj = iResp.txpd;
                    iResp.txpd = [];
                    delete iResp.txpd;
                }
                if (iResp.txpda) {
                    iResp.atadja = iResp.txpda;
                    iResp.txpda = [];
                    delete iResp.txpda;
                }
                if (iResp.cdn) {
                    iResp.cdnr = iResp.cdn;
                    iResp.cdn = [];
                    delete iResp.cdn;
                }
                if (iResp.hsnsum && d.form == 'GSTR1') {
                    iResp.hsn = iResp.hsnsum;
                    iResp.hsnsum = [];
                    delete iResp.hsnsum;
                }
                if (iResp.clttx && d.form == 'GSTR1') {
                    iResp.supeco.clttx = iResp.clttx;
                    iResp.clttx = [];
                    delete iResp.clttx;
                }
                if (iResp.paytx && d.form == 'GSTR1') {
                    iResp.supeco.paytx = iResp.paytx;
                    iResp.paytx = [];
                    delete iResp.paytx;
                }
                if (iResp.clttxa && d.form == 'GSTR1') {
                    iResp.supecoa.clttxa = iResp.clttxa;
                    iResp.clttxa = [];
                    delete iResp.clttxa;
                }
                if (iResp.paytxa && d.form == 'GSTR1') {
                    iResp.supecoa.paytxa = iResp.paytxa;
                    iResp.paytxa = [];
                    delete iResp.paytxa;
                }
                if (iResp.ecom_b2b && d.form == 'GSTR1') {
                    iResp.ecomb2b = iResp.ecom_b2b;
                    iResp.ecom_b2b = [];
                    delete iResp.ecom_b2b;
                }
                if (iResp.ecom_b2c && d.form == 'GSTR1') {
                    iResp.ecomb2c = iResp.ecom_b2c;
                    iResp.ecom_b2c = [];
                    delete iResp.ecom_b2c;
                }
                if (iResp.ecom_urp2b && d.form == 'GSTR1') {
                    iResp.ecomurp2b = iResp.ecom_urp2b;
                    iResp.ecom_urp2b = [];
                    delete iResp.ecom_urp2b;
                }
                if (iResp.ecom_urp2c && d.form == 'GSTR1') {
                    iResp.ecomurp2c = iResp.ecom_urp2c;
                    iResp.ecom_urp2c = [];
                    delete iResp.ecom_urp2c;
                }
                if (iResp.ecom_b2ba && d.form == 'GSTR1') {
                    iResp.ecomab2b = iResp.ecom_b2ba;
                    iResp.ecom_b2ba = [];
                    delete iResp.ecom_b2ba;
                }
                if (iResp.ecom_b2ca && d.form == 'GSTR1') {
                    iResp.ecomab2c = iResp.ecom_b2ca;
                    iResp.ecom_b2ca = [];
                    delete iResp.ecom_b2ca;
                }
                if (iResp.ecom_urp2ba && d.form == 'GSTR1') {
                    iResp.ecomaurp2b = iResp.ecom_urp2ba;
                    iResp.ecom_urp2ba = [];
                    delete iResp.ecom_urp2ba;
                }
                if (iResp.ecom_urp2ca && d.form == 'GSTR1') {
                    iResp.ecomaurp2c = iResp.ecom_urp2ca;
                    iResp.ecom_urp2ca = [];
                    delete iResp.ecom_urp2ca;
                }
                if(iSectionName == 'hsn(b2b)'){
                    iSectionName = "hsn_b2b"
                }
                if(iSectionName == 'hsn(b2c)'){
                    iSectionName = "hsn_b2c"
                }

                if (iSectionName) {
                    deferred.resolve(iResp[iSectionName]);
                } else {
                    deferred.resolve(response);
                }
            }).error(function (error) {
                error = "Please Select Correct Details Of The File";
                deferred.reject(error);
            });
            return deferred.promise;
        }


        function checkExistence(d) {
            var deferred = Q.defer(),
                fName = "upload/" + d.returnFileName + ".json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                error = "Please Select Correct Details Of The File";
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function checkErrorExistence(d) {
            var deferred = Q.defer(),
                fName = "error/" + d.gstin + "_" + d.form + "_" + d.fy + "_" + d.month + "_" + 'error' + "/" + d.gstin + "_" + d.form + "_" + d.fy + "_" + d.month + "_" + 'error' + ".json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                error = "Please Select Correct Details Of The File";
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getErrContentsFor(d, iSectionName) {
            var deferred = Q.defer(),
                fName = "upload/Error/" + d.form + "_" + d.gstin + "_" + d.fy + "_" + d.month + ".json";
            Http.get(fName).success(function (response) {
                deferred.resolve(response[iSectionName]);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function savePayload(iParam) {
            var deferred = Q.defer(),
                fName = "/addtbldata";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        //ADDITION BY V START 
        function savePayloadFile(file, data) {
            var deferred = Q.defer(),
                fName = "/addtblfile";
            var fd = new FormData();
            fd.append('file', file);
          
            fd.append('shareData', JSON.stringify(data));
            Http.post(fName, fd, {
                transformRequest: angular.identity,
                timeout: 1000000,
                headers: { 'Content-Type': undefined }
            })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;

        }
        //ADDITION BY V END 

        function updatePayload(iParam) {
            var deferred = Q.defer(),
                fName = "/updatetbldata";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        // Addition by Akarsh Starts
        function updateData(iParam) {
            var deferred = Q.defer(),
                fName = "/updateData";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        // Addition by Akarsh END
        function uploadPayloadSetUpdateFlag(iParam) {
            var deferred = Q.defer(),
                fName = "/updateImport";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function updateErrorPayload(iParam) {
            var deferred = Q.defer(),
                fName = "/updateerrdata";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function deleteErrorPayload(iParam) {
            var deferred = Q.defer(),
                fName = "/deleteErrData";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function setDeletePayload(iParam) {
            var deferred = Q.defer(),
                fName = "/setDeleteFlag";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function uploadDeleteAll(iParam) {
            var deferred = Q.defer(),
                fName = "/setFlagAll";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function updateAcceptPayload(iParam) {
            var deferred = Q.defer(),
                fName = "/updateaccepteddata";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }


        function getSummaryOfInvoices(iParam) {
            var deferred = Q.defer(),
                fName = "/summary";
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);

            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function uploadErrFile(fd) {
            var deferred = Q.defer();

            Http.post("/upload", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                extractErrFile(response, deferred)
                    .then(function (res) {
                        deferred.resolve(res);
                    }).catch(function (er) {
                        deferred.reject(er);
                    });
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function extractErrFile(fname) {
            var deferred = Q.defer();
            var fName = "/unzipError?fname=" + fname;
            Http.get(fName).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function uploadReturnFile(fd) {
            var deferred = Q.defer();
            console.log("fd", fd)
            Http.post("/upload", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                extractReturnFile(response, deferred).then(function (res) {
                    deferred.resolve(res);
                }).catch(function (er) {
                    deferred.reject(er);
                });
                //deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function extractReturnFile(files, deferred) {

            //            var fName = "/unzipFile?fname=" + fname;

            var iParam = { "fname": files }
            var fName = "/unzipFile";
            console.log("fna:", fName, iParam)
            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        //Upload My master 

        function mstrUploadFile(fd) {
            var deferred = Q.defer();
            console.log("fd", fd)
            Http.post("/upload", fd, {

                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                console.log("response", response)
                returnFile(response, deferred).then(function (res) {
                    deferred.resolve(res);
                }).catch(function (er) {
                    deferred.reject(er);
                });
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function returnFile(files, deferred) {
            var iParam = { "fname": files }
            var fName = "/importFile";
            console.log("fna:", fName, iParam)
            Http.post(fName, iParam).success(function (response) {
                console.log("response:", response)
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }



        function saveMultiplePayload(iParam) {
            var deferred = Q.defer(),
                fName;
            if (iParam.type == 'Error')
                fName = "/addmltplerrdata";
            else
                fName = "/addmltpldata";

            Http.post(fName, iParam).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
    //Common Utility
    OfflineFactory.factory('R1Util', R1Util);
    R1Util.$inject = ["$compile", "utilFunctions", "shareData", '$timeout'];

    function R1Util($compile, utilFunctions, shareData, timeout) {
        return {
            initMainCntr: initMainCntr,
            onRtChange: onRtChange,
            onRtChangeTB15:onRtChangeTB15,
            createAlert: createAlert,
            getSupplyType: getSupplyType,
            setSuplyTyp: setSuplyTyp,
            isCurrentPeriodBeforeAATOCheck: isCurrentPeriodBeforeAATOCheck
        };

        function initMainCntr($scope) {

            if ($scope.trans) {
                $scope.suplyList = [{
                    name: $scope.trans.TITLE_INTRA_STATE
                }, {
                    name: $scope.trans.TITLE_INTER_STATE
                }];

                /*$scope.gsList = [{
                    "value": "",
                    "name": $scope.trans.HLP_SELCT
                }, {
                    "value": "G",
                    "name": $scope.trans.LBL_GOODS
                }, {
                    "value": "S",
                    "name": $scope.trans.LBL_SERV
                }];*/


                $scope.upLoadList = [{
                    value: "S",
                    name: $scope.trans.LBL_Supplier
                }, {
                    value: "R",
                    name: $scope.trans.LBL_Receiver
                }];

                $scope.typeList = [{
                    "value": "",
                    "name": $scope.trans.HLP_SELCT
                }, /*{
                    "value": "E",
                    "name": "E-COMMERCE"
                },*/ {
                    "value": "OE",
                    "name": "Other Than E-COMMERCE"
                }];

                /*  $scope.rsnList = [{
                       "value": "01",
                      name: "Sales Return"
                  }, {
                       "value": "02",
                      name: "Post sale discount"
                  }, {
                       "value": "03",
                      name: "Deficiency in service"
                  }, {
                       "value": "04",
                      name: "Correction in invoice"
                  }, {
                      "value": "06",
                      name: "Change in POS"
                  }, {
                       "value": "07",
                      name: "Finalization of Provisional assessment"
                  }, {
                       "value": "08",
                      name: "Others"
                  }];*/

                $scope.noteList = [{
                    "value": "C",
                    "name": "C"
                }, {
                    "value": "D",
                    "name": "D"
                }, {
                    "value": "R",
                    "name": "R"
                }];
                $scope.noteList1 = [{
                    "value": "C",
                    "name": "C"
                }, {
                    "value": "D",
                    "name": "D"
                }];
                $scope.URList = [{
                    "value": "B2CL",
                    "name": "B2CL"
                }, {
                    "value": "EXPWP",
                    "name": "EXPWP"
                }, {
                    "value": "EXPWOP",
                    "name": "EXPWOP"
                }];
                $scope.InvoiceTypeList = [{
                    "value": "B2BUR",
                    "name": "B2BUR"
                }, {
                    "value": "IMPS",
                    "name": "IMPS"
                }];

                $scope.users = [{
                    name: 'WOPAY',
                    id: 'WOPAY'
                }, {
                    name: 'WPAY',
                    id: 'WPAY'
                }];

                $scope.differentialPercent = [{
                    "value": 0.65,
                    "name": "65.00"
                }];

                $scope.UQCList = [
                    {
                        "value": "BAG",
                        "name": "BAG-BAGS"
                    }, {
                        "value": "BAL",
                        "name": "BAL-BALE"
                    }, {
                        "value": "BDL",
                        "name": "BDL-BUNDLES"
                    }, {
                        "value": "BKL",
                        "name": "BKL-BUCKLES"
                    }, {
                        "value": "BOU",
                        "name": "BOU-BILLION OF UNITS"
                    }, {
                        "value": "BOX",
                        "name": "BOX-BOX"
                    }, {
                        "value": "BTL",
                        "name": "BTL-BOTTLES"
                    }, {
                        "value": "BUN",
                        "name": "BUN-BUNCHES"
                    }, {
                        "value": "CAN",
                        "name": "CAN-CANS"
                    }, {
                        "value": "CBM",
                        "name": "CBM-CUBIC METERS"
                    }, {
                        "value": "CCM",
                        "name": "CCM-CUBIC CENTIMETERS"
                    }, {
                        "value": "CMS",
                        "name": "CMS-CENTIMETERS"
                    }, {
                        "value": "CTN",
                        "name": "CTN-CARTONS"
                    }, {
                        "value": "DOZ",
                        "name": "DOZ-DOZENS"
                    }, {
                        "value": "DRM",
                        "name": "DRM-DRUMS"
                    }, {
                        "value": "GGK",
                        "name": "GGK-GREAT GROSS"
                    }, {
                        "value": "GMS",
                        "name": "GMS-GRAMMES"
                    },
                    {
                        "value": "GRS",
                        "name": "GRS-GROSS"
                    }, {
                        "value": "GYD",
                        "name": "GYD-GROSS YARDS"
                    }, {
                        "value": "KGS",
                        "name": "KGS-KILOGRAMS"
                    }, {
                        "value": "KLR",
                        "name": "KLR-KILOLITRE"
                    }, {
                        "value": "KME",
                        "name": "KME-KILOMETRE"
                    }, {
                        "value": "LTR",
                        "name": "LTR-LITRES"
                    }, {
                        "value": "MLT",
                        "name": "MLT-MILILITRE"
                    }, {
                        "value": "MTR",
                        "name": "MTR-METERS"
                    }, {
                        "value": "MTS",
                        "name": "MTS-METRIC TON"
                    },
                    {
                        "value": "NOS",
                        "name": "NOS-NUMBERS"
                    },

                    {
                        "value": "PAC",
                        "name": "PAC-PACKS"
                    },
                    {
                        "value": "PCS",
                        "name": "PCS-PIECES"
                    },
                    {
                        "value": "PRS",
                        "name": "PRS-PAIRS"
                    },
                    {
                        "value": "QTL",
                        "name": "QTL-QUINTAL"
                    },
                    {
                        "value": "ROL",
                        "name": "ROL-ROLLS"
                    },

                    {
                        "value": "SET",
                        "name": "SET-SETS"
                    },
                    {
                        "value": "SQF",
                        "name": "SQF-SQUARE FEET"
                    },
                    {
                        "value": "SQM",
                        "name": "SQM-SQUARE METERS"
                    },
                    {
                        "value": "SQY",
                        "name": "SQY-SQUARE YARDS"
                    },
                    {
                        "value": "TBS",
                        "name": "TBS-TABLETS"
                    },

                    {
                        "value": "TGM",
                        "name": "TGM-TEN GROSS"
                    },
                    {
                        "value": "THD",
                        "name": "THD-THOUSANDS"
                    },

                    {
                        "value": "TON",
                        "name": "TON-TONNES"
                    },
                    {
                        "value": "TUB",
                        "name": "TUB-TUBES"
                    },
                    {
                        "value": "UGS",
                        "name": "UGS-US GALLONS"
                    },
                    {
                        "value": "UNT",
                        "name": "UNT-UNITS"
                    },
                    {
                        "value": "YDS",
                        "name": "YDS-YARDS"
                    },
                    {
                        "value": "OTH",
                        "name": "OTH-OTHERS"
                    },
                    {
                        "value": "NA",
                        "name": "NA"
                    }
                ];



                $scope.types = [{
                    name: "B2B",
                    id: "B2B"
                }, {
                    name: "B2C",
                    id: "B2C"
                }];

                $scope.regTypeList = [{
                    "value": "",
                    "name": $scope.trans.HLP_SELCT
                }, {
                    "value": "REGD",
                    "name": "REGISTERED"
                }, {
                    "value": "UNREGD",
                    "name": "UNREGISTERED"
                }];

                $scope.elgBltyList = [{
                    "value": "",
                    "name": $scope.trans.HLP_SELCT
                }, {
                    "value": "ip",
                    "name": "Inputs"
                }, {
                    "value": "ips",
                    "name": "Input Services"
                }, {
                    "value": "cg",
                    "name": "Capital Goods"
                }, {
                    "value": "none",
                    "name": "None"
                }];

                $scope.itcSuplyList = [{
                    name: "ITC Availed –inter state Purchases",
                    value: "IERP"
                }, {
                    name: "ITC Availed –intra state Purchases",
                    value: "IRAP"
                }, {
                    name: "ITC Availed - Import",
                    value: "IMP"
                }, {
                    name: "No ITC Availed",
                    value: "NI"
                }];


            } else {
                $scope.suplyList = [{
                    name: "Intra-State"
                }, {
                    name: "Inter-State"
                }];

                /*$scope.gsList = [{
                    "value": "",
                    "name": "Select"
                }, {
                    "value": "G",
                    "name": "Goods"
                }, {
                    "value": "S",
                    "name": "Services"
                }];*/

                $scope.upLoadList = [{
                    value: "S",
                    name: "Supplier"
                }, {
                    value: "R",
                    name: "Receiver"
                }];

                $scope.typeList = [{
                    "value": "",
                    "name": "Select"
                }, /*{
                    "value": "E",
                    "name": "E-COMMERCE"
                },*/ {
                    "value": "OE",
                    "name": "Other Than E-commerce"
                }];

                /* $scope.rsnList = [{
                      "value": "01",
                     name: "Sales Return"
                 }, {
                      "value": "02",
                     name: "Post sale discount"
                 }, {
                      "value": "03",
                     name: "Deficiency in service"
                 }, {
                      "value": "04",
                     name: "Correction in invoice"
                 }, {
                     "value": "06",
                     name: "Change in POS"
                 }, {
                      "value": "07",
                     name: "Finalization of Provisional assessment"
                 }, {
                      "value": "08",
                     name: "Others"
                 }];*/

                $scope.noteList = [{
                    "value": "C",
                    "name": "C"
                }, {
                    "value": "D",
                    "name": "D"
                }, {
                    "value": "R",
                    "name": "R"
                }];

                $scope.noteList1 = [{
                    "value": "C",
                    "name": "C"
                }, {
                    "value": "D",
                    "name": "D"
                }];

                $scope.URList = [{
                    "value": "B2CL",
                    "name": "B2CL"
                }, {
                    "value": "EXPWP",
                    "name": "EXPWP"
                }, {
                    "value": "EXPWOP",
                    "name": "EXPWOP"
                }];
                $scope.InvoiceTypeList = [{
                    "value": "B2BUR",
                    "name": "B2BUR"
                }, {
                    "value": "IMPS",
                    "name": "IMPS"
                }];
                $scope.users = [{
                    name: 'WOPAY',
                    id: 'WOPAY'
                }, {
                    name: 'WPAY',
                    id: 'WPAY'
                }];
                $scope.differentialPercent = [{
                    "value": 0.65,
                    "name": "65.00"
                }];
                $scope.UQCList = [
                    {
                        "value": "BAG",
                        "name": "BAG-BAGS"
                    }, {
                        "value": "BAL",
                        "name": "BAL-BALE"
                    }, {
                        "value": "BDL",
                        "name": "BDL-BUNDLES"
                    }, {
                        "value": "BKL",
                        "name": "BKL-BUCKLES"
                    }, {
                        "value": "BOU",
                        "name": "BOU-BILLION OF UNITS"
                    }, {
                        "value": "BOX",
                        "name": "BOX-BOX"
                    }, {
                        "value": "BTL",
                        "name": "BTL-BOTTLES"
                    }, {
                        "value": "BUN",
                        "name": "BUN-BUNCHES"
                    }, {
                        "value": "CAN",
                        "name": "CAN-CANS"
                    }, {
                        "value": "CBM",
                        "name": "CBM-CUBIC METERS"
                    }, {
                        "value": "CCM",
                        "name": "CCM-CUBIC CENTIMETERS"
                    }, {
                        "value": "CMS",
                        "name": "CMS-CENTIMETERS"
                    }, {
                        "value": "CTN",
                        "name": "CTN-CARTONS"
                    }, {
                        "value": "DOZ",
                        "name": "DOZ-DOZENS"
                    }, {
                        "value": "DRM",
                        "name": "DRM-DRUMS"
                    }, {
                        "value": "GGK",
                        "name": "GGK-GREAT GROSS"
                    }, {
                        "value": "GMS",
                        "name": "GMS-GRAMMES"
                    },
                    {
                        "value": "GRS",
                        "name": "GRS-GROSS"
                    }, {
                        "value": "GYD",
                        "name": "GYD-GROSS YARDS"
                    }, {
                        "value": "KGS",
                        "name": "KGS-KILOGRAMS"
                    }, {
                        "value": "KLR",
                        "name": "KLR-KILOLITRE"
                    }, {
                        "value": "KME",
                        "name": "KME-KILOMETRE"
                    }, {
                        "value": "LTR",
                        "name": "LTR-LITRES"
                    }, {
                        "value": "MLT",
                        "name": "MLT-MILILITRE"
                    }, {
                        "value": "MTR",
                        "name": "MTR-METERS"
                    }, {
                        "value": "MTS",
                        "name": "MTS-METRIC TON"
                    },
                    {
                        "value": "NOS",
                        "name": "NOS-NUMBERS"
                    },

                    {
                        "value": "PAC",
                        "name": "PAC-PACKS"
                    },
                    {
                        "value": "PCS",
                        "name": "PCS-PIECES"
                    },
                    {
                        "value": "PRS",
                        "name": "PRS-PAIRS"
                    },
                    {
                        "value": "QTL",
                        "name": "QTL-QUINTAL"
                    },
                    {
                        "value": "ROL",
                        "name": "ROL-ROLLS"
                    },

                    {
                        "value": "SET",
                        "name": "SET-SETS"
                    },
                    {
                        "value": "SQF",
                        "name": "SQF-SQUARE FEET"
                    },
                    {
                        "value": "SQM",
                        "name": "SQM-SQUARE METERS"
                    },
                    {
                        "value": "SQY",
                        "name": "SQY-SQUARE YARDS"
                    },
                    {
                        "value": "TBS",
                        "name": "TBS-TABLETS"
                    },

                    {
                        "value": "TGM",
                        "name": "TGM-TEN GROSS"
                    },
                    {
                        "value": "THD",
                        "name": "THD-THOUSANDS"
                    },

                    {
                        "value": "TON",
                        "name": "TON-TONNES"
                    },
                    {
                        "value": "TUB",
                        "name": "TUB-TUBES"
                    },
                    {
                        "value": "UGS",
                        "name": "UGS-US GALLONS"
                    },
                    {
                        "value": "UNT",
                        "name": "UNT-UNITS"
                    },
                    {
                        "value": "YDS",
                        "name": "YDS-YARDS"
                    },
                    {
                        "value": "OTH",
                        "name": "OTH-OTHERS"
                    },
                    {
                        "value": "NA",
                        "name": "NA"
                    }
                ];

                $scope.types = [{
                    name: "B2B",
                    id: "B2B"
                }, {
                    name: "B2C",
                    id: "B2C"
                }];

                $scope.elgBltyList = [{
                    "value": "",
                    "name": "Select"
                }, {
                    "value": "ip",
                    "name": "Inputs"
                }, {
                    "value": "ips",
                    "name": "Input Services"
                }, {
                    "value": "cg",
                    "name": "Capital Goods"
                }, {
                    "value": "none",
                    "name": "None"
                }];

                $scope.itcSuplyList = [{
                    name: "ITC Availed –inter state Purchases",
                    value: "IERP"
                }, {
                    name: "ITC Availed –intra state Purchases",
                    value: "IRAP"
                }, {
                    name: "ITC Availed - Import",
                    value: "IMP"
                }, {
                    name: "No ITC Availed",
                    value: "NI"
                }];

            }
        }

        function onRtChangeTB15(d, e) {
 
            var val = d.txval;
        
            // if (!val || val == 0) {
            //     val = 0;
            //     d.txval = 0;
            // }
            if(!d.txval){
                d.iamt = null;
                d.camt = null;
                d.samt = null;
                d.csamt = null;
            }
            if(val){
            switch (e) {
                case 1:
                    d.camt = (d.rt != null) ? parseFloat(((d.rt * val) / 100).toFixed(2)) : d.camt;
                    break;
                case 2:
                    d.samt = (d.rt != null) ? parseFloat(((d.rt * val) / 100).toFixed(2)) : d.samt;
                    break;
                case 3:
                    d.iamt = (d.rt != null) ? parseFloat((((d.rt * val) / 100)).toFixed(2)) : d.iamt;
                    break;
                case 4:
                    d.samt = (d.rt != null) ? parseFloat((d.rt * val * 0.005).toFixed(2)) : d.samt;
                    d.camt = (d.rt != null) ? parseFloat((d.rt * val * 0.005).toFixed(2)) : d.camt;
                    break;
                default:
                    onRtChange(d, 1);
                    onRtChange(d, 2);
                    onRtChange(d, 3);
                    onRtChange(d, 4);
                    break;
            }
        }
        }

        function onRtChange(d, e) {

            //check for differntial percentage
            var diff_percent_val;

            if (shareData.dashBoardDt.tbl_cd === 'b2cs' || shareData.dashBoardDt.tbl_cd === 'ecomb2c' || shareData.dashBoardDt.tbl_cd === 'ecomurp2c') {
                if (d.diff_percent) {
                    if (d.diff_percent !== null && typeof d.diff_percent.value != 'undefined' && typeof d.diff_percent.value !== 'undefined') {
                        diff_percent_val = d.diff_percent.value;
                    } else {
                        diff_percent_val = d.diff_percent;
                    }
                }
            }
            else {
                var dF = shareData.itmInv.diff_percent;
                if (dF !== null && typeof dF !== 'undefined' && typeof dF.value !== 'undefined') {
                    diff_percent_val = dF.value;
                } else {
                    diff_percent_val = dF;
                }
            }

            if (diff_percent_val == null || diff_percent_val == '' || diff_percent_val == 0 || diff_percent_val == undefined) {
                diff_percent_val = 1;
            }


            if (shareData.dashBoardDt.tbl_cd === 'at' || shareData.dashBoardDt.tbl_cd === 'ata' || shareData.dashBoardDt.tbl_cd === 'ata' || ((shareData.dashBoardDt.tbl_cd === 'atadj' || shareData.dashBoardDt.tbl_cd === 'atadja') && shareData.dashBoardDt.form == "GSTR1")) {
                var val = d.ad_amt;
            }
            else if (shareData.dashBoardDt.tbl_cd === 'txi' || (shareData.dashBoardDt.tbl_cd === 'atadj' && shareData.dashBoardDt.form == "GSTR2")) {
                var val = d.adamt;
            }
            else {
                var val = d.txval;
            }

            if (!val || val == 0) {
                val = 0;
                d.txval = 0;
            }
            switch (e) {
                case 1:
                    d.camt = (d.rt != null) ? parseFloat(((d.rt * val) / 100).toFixed(2)) : d.camt;
                    break;
                case 2:
                    d.samt = (d.rt != null) ? parseFloat(((d.rt * val) / 100).toFixed(2)) : d.samt;
                    break;
                case 3:
                    if ((shareData.dashBoardDt.tbl_cd === 'cdnur' || shareData.dashBoardDt.tbl_cd === 'cdnura') && shareData.itmInv.typ == 'EXPWOP')
                        d.iamt = 0;
                    else
                        d.iamt = (d.rt != null) ? parseFloat((((d.rt * val) / 100) * diff_percent_val).toFixed(2)) : d.iamt;
                    break;
                case 4:
                    d.samt = (d.rt != null) ? parseFloat((d.rt * val * 0.005 * diff_percent_val).toFixed(2)) : d.samt;
                    d.camt = (d.rt != null) ? parseFloat((d.rt * val * 0.005 * diff_percent_val).toFixed(2)) : d.camt;
                    break;
                default:
                    onRtChange(d, 1);
                    onRtChange(d, 2);
                    onRtChange(d, 3);
                    onRtChange(d, 4);
                    break;
            }
        }

        function getSupplyType(suplyList, ctin, pos, sup_ty, isSEZ) {
            var rtObj = null,
                gstin = (shareData.dashBoardDt.gstin).slice(0, 2);

            if (shareData.dashBoardDt.form == "GSTR1" || shareData.dashBoardDt.form == "GSTR1A") {
                if (pos) {


                    if (isSEZ || sup_ty == 'CBW') {

                        rtObj = suplyList[1];
                    }
                    else {

                        if (gstin === pos) {
                            rtObj = suplyList[0];
                        } else {
                            rtObj = suplyList[1];
                        }
                    }
                } else if (ctin) {
                    var ctinPos = (ctin).slice(0, 2);
                    if (isSEZ) {
                        rtObj = suplyList[1];
                    }
                    else {
                        if (gstin === ctinPos) {
                            rtObj = suplyList[0];
                        } else {
                            rtObj = suplyList[1];
                        }
                    }
                }
                // FIX DEFECT: 5957 AND 5954
                if (!isSEZ && (sup_ty == 'SEWP' || sup_ty == 'SEWOP' || sup_ty == 'CBW')) {
                    rtObj = suplyList[1];
                }
            } else {
                if (ctin && pos) {
                    var ctinPos = ctin.slice(0, 2);
                    if (ctinPos == pos) {
                        rtObj = suplyList[0];
                    } else {
                        rtObj = suplyList[1];
                    }
                } else if (sup_ty) {
                    if (sup_ty === "IRAP") {
                        rtObj = suplyList[0];
                    } else {
                        rtObj = suplyList[1];
                    }
                } else if (shareData.dashBoardDt.gstin) {
                    var gstin = shareData.dashBoardDt.gstin.slice(0, 2);
                    if (pos) {
                        if (gstin === pos) {
                            rtObj = suplyList[0];
                        } else {
                            rtObj = suplyList[1];
                        }
                    } else if (ctin) {
                        var ctinPos = (ctin).slice(0, 2);
                        if (gstin === ctinPos) {
                            rtObj = suplyList[0];
                        } else {
                            rtObj = suplyList[1];
                        }
                    }
                }
            }

            return rtObj;
        }

        function setSuplyTyp(suplyList, iInv, isSEZ) {
            var supGstin = shareData.dashBoardDt.gstin,
                form = shareData.dashBoardDt.form,
                tableCode = shareData.dashBoardDt.tbl_cd;
            if (supGstin && form == "GSTR1") {
                if (iInv.pos) {
                    var ctin = supGstin.slice(0, 2),
                        pos = iInv.pos;
                    if (isSEZ) {
                        if (tableCode === 'b2cs' || tableCode === 'b2csa' || tableCode === 'at' || tableCode === 'atadj' || tableCode === 'ata' || tableCode === 'atadja' || tableCode == 'ecomb2c' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c') {
                            iInv.sply_ty = "INTER";
                        }
                        else {
                            iInv.sp_typ = suplyList[1];
                        }
                    }
                    else {
                        if (ctin === pos) {

                            if (tableCode === 'b2cs' || tableCode === 'b2csa' || tableCode === 'at' || tableCode === 'atadj' || tableCode === 'ata' || tableCode === 'atadja' || tableCode == 'ecomb2c' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c') {
                                iInv.sply_ty = "INTRA";
                            }
                            else {
                                iInv.sp_typ = suplyList[0];
                                if ((tableCode == "b2b" || tableCode == "b2ba" || tableCode == "cdnr" || tableCode == "cdnra" || tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE'))) {
                                    iInv.sp_typ = suplyList[1]
                                }
                            }
                        }
                        else {

                            if (tableCode === 'b2cs' || tableCode === 'b2csa' || tableCode === 'at' || tableCode === 'atadj' || tableCode === 'ata' || tableCode === 'atadja' || tableCode == 'ecomb2c' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c') {
                                iInv.sply_ty = "INTER";
                            }
                            else {
                                iInv.sp_typ = suplyList[1];
                                if ((tableCode == "b2b" || tableCode == "b2ba" || tableCode == "cdnr" || tableCode == "cdnra" || tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE'))) {
                                    iInv.sp_typ = suplyList[1]
                                }
                            }
                        }
                    }
                } else if (iInv.state_cd) {
                    var ctin = supGstin.slice(0, 2),
                        state_cd = iInv.state_cd;

                    if (ctin === state_cd) {
                        iInv.sp_typ = suplyList[0]
                    } else {
                        iInv.sp_typ = suplyList[1]
                    }

                } else if (iInv.ctin) {
                    var ctin = iInv.ctin.slice(0, 2),
                        gstn = (supGstin).slice(0, 2);
                    if (isSEZ) {
                        iInv.sp_typ = suplyList[1];
                    } else {

                        if (ctin === gstn) {
                            iInv.sp_typ = suplyList[0];
                        } else {
                            iInv.sp_typ = suplyList[1];
                        }
                        if ((tableCode == "b2b" || tableCode == "b2ba" || tableCode == "cdnr" || tableCode == "cdnra") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE'))) {
                            iInv.sp_typ = suplyList[1];
                        }
                    }
                } else if (iInv.cpty) {
                    var ctin = iInv.cpty.slice(0, 2),
                        gstn = (supGstin).slice(0, 2);

                    if (ctin === gstn) {
                        iInv.sp_typ = suplyList[0]
                    } else {
                        iInv.sp_typ = suplyList[1]
                    }
                }
            }
            else {
                if (iInv.ctin && iInv.pos) {
                    var ctin = iInv.ctin.slice(0, 2),
                        pos = iInv.pos;

                    if (ctin === pos) {
                        if (tableCode == "b2b" && iInv.inv_typ != 'R') {
                            iInv.sp_typ = suplyList[1];
                        }
                        else
                            iInv.sp_typ = suplyList[0];
                    } else {
                        iInv.sp_typ = suplyList[1];
                    }
                } else if (iInv.cpty && iInv.state_cd) {
                    var ctin = iInv.cpty.slice(0, 2),
                        state_cd = iInv.state_cd;

                    if (ctin === state_cd) {
                        iInv.sp_typ = suplyList[0];
                    } else {
                        iInv.sp_typ = suplyList[1];
                    }
                } else if (supGstin) {
                    if (iInv.pos) {
                        var ctin = supGstin.slice(0, 2),
                            pos = iInv.pos;

                        if (ctin === pos) {
                            if (shareData.dashBoardDt.tbl_cd === 'txi' || shareData.dashBoardDt.tbl_cd === 'atadj') {
                                iInv.sply_ty = "INTRA";
                            }
                            else {
                                iInv.sp_typ = suplyList[0];
                            }
                        }
                        else {

                            if (shareData.dashBoardDt.tbl_cd === 'txi' || shareData.dashBoardDt.tbl_cd === 'atadj') {
                                iInv.sply_ty = "INTER";
                            }
                            else {
                                iInv.sp_typ = suplyList[1];
                            }
                        }
                    } else if (iInv.ctin) {
                        var ctin = iInv.ctin.slice(0, 2),
                            gstn = (supGstin).slice(0, 2);

                        if (ctin === gstn) {
                            iInv.sp_typ = suplyList[0]
                        } else {
                            iInv.sp_typ = suplyList[1]
                        }
                    } else if (iInv.stin) {
                        var ctin = iInv.stin.slice(0, 2),
                            gstn = (supGstin).slice(0, 2);

                        if (ctin === gstn) {
                            iInv.sp_typ = suplyList[0]
                        } else {
                            iInv.sp_typ = suplyList[1]
                        }
                    } else if (iInv.sup_ty) {
                        if (iInv.sup_ty === "IRAP") {
                            iInv.sp_typ = suplyList[0]
                        } else {
                            iInv.sp_typ = suplyList[1]
                        }
                    }
                }
            }
        }

        function createAlert($scope, iTy, iMsg, iConfirmFn) {


            $("#confirmDlg").remove();

            switch (iTy) {
                case 'Success':
                    var conf = utilFunctions.createDialogue({
                        "type": "Success",
                        "title": "Success",
                        "message": iMsg
                    });
                    $('body').append($compile(conf)($scope));
                    $("#successDlg").modal('show');
                    timeout(function () {
                        $("#successDlg").modal('hide');
                    }, 3000); //success alert message timeout
                    break;
                case 'Error':
                    var conf = utilFunctions.createDialogue({
                        "type": "Error",
                        "title": "Error",
                        "cancel_btn_title": "OK",

                        "message": iMsg
                    });
                    $('body').append($compile(conf)($scope));
                    $("#errorDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'ErrorCallback':
                    $scope.iConfirmFn = function () {
                        $("#errorCllbackDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "ErrorCallback",
                        "title": "Error",
                        "ok_btn_title": "OK",
                        "callback": "iConfirmFn()",
                        "message": iMsg
                    });
                    $('body').append($compile(conf)($scope));
                    $("#errorCllbackDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'Warning':
                    $scope.iConfirmFn = function () {
                        $("#confirmDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Warning",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "YES",
                        "cancel_btn_title": "NO"
                    });
                    $('body').append($compile(conf)($scope));
                    $("#confirmDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'WarningOk':
                    $scope.iConfirmFn = function () {
                        $("#confirmDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Warning",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "OK",
                        "cancel_btn_title": null
                    });
                    $('body').append($compile(conf)($scope));
                    $("#confirmDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'info':
                    $scope.iConfirmFn = function () {
                        $("#infoDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Info",
                        "title": "",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "OK",
                        "cancel_btn_title": null
                    });
                    $('body').append($compile(conf)($scope));
                    $("#infoDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'warn':
                    $scope.iConfirmFn = function () {
                        $("#warDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Warn",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "PROCEED",
                        "cancel_btn_title": "CANCEL"
                    });
                    $('body').append($compile(conf)($scope));
                    $("#warDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'warndelete':
                    $scope.iConfirmFn = function () {
                        $("#warDelteDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "WarnDelete",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "PROCEED",
                        "cancel_btn_title": "CANCEL"
                    });
                    $('body').append($compile(conf)($scope));
                    $("#warDelteDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'infocancel':
                    $scope.iConfirmFn = function () {
                        $("#infoDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Info",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "CANCEL",
                        "cancel_btn_title": null
                    });
                    $('body').append($compile(conf)($scope));
                    $("#infoDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'warnOk':
                    $scope.iConfirmFn = function () {
                        $("#warDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Warn",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "OK",
                        "cancel_btn_title": null
                    });
                    $('body').append($compile(conf)($scope));
                    $("#warDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;
                case 'warnconf':
                    $scope.iConfirmFn = function () {
                        $("#warDlg").modal('hide');
                        iConfirmFn();
                    };
                    var conf = utilFunctions.createDialogue({
                        "type": "Warn",
                        "title": "Warning",
                        "message": iMsg,
                        "callback": "iConfirmFn()",
                        "ok_btn_title": "Yes",
                        "cancel_btn_title": "No"
                    });
                    $('body').append($compile(conf)($scope));
                    $("#warDlg").modal({
                        show: true,
                        backdrop: 'static'

                    });
                    break;

            }
        }

        function isCurrentPeriodBeforeAATOCheck(start_period, current_period) {
            var pattern = /((0[1-9])|10|11|12)([2][0-9][0-9][0-9])/;
            if (!pattern.test(current_period) || !pattern.test(start_period)) {
                return false;
            }
            var start_period_month = parseInt(start_period.slice(0, 2));
            var start_period_year = parseInt(start_period.slice(2, 6));
            var current_period_month = parseInt(current_period.slice(0, 2));
            var current_period_year = parseInt(current_period.slice(2, 6));
            if (current_period_year > start_period_year) {
                return false;
            } else if (current_period_year < start_period_year) {
                return true;
            } else {
                return current_period_month < start_period_month;
            }
        }
    }

    //Function Flows
    OfflineFactory.factory('R1InvHandler', R1InvHandler);
    R1InvHandler.$inject = ["$log", "$q", "R1Util", "shareData", "g1FileHandler", "$filter", "$timeout", "validations", "$http"];

    function R1InvHandler($log, Q, R1Util, shareData, g1FileHandler, Filter, timeout, validations, Http) {
        return {
            add: add,
            convertNumToStr: convertNumToStr,
            update: update,
            delete: deleteInv,
            onPaste: onPaste,
            emptyItemAdd: emptyItemAdd,
            emptyItemUpdate: emptyItemUpdate,
            preparePayloadFromExcel: preparePayloadFromExcel,
            validatePattern: validatePattern,
            upMultipleSections: upMultipleSections,
            uploadPayloadAdd: uploadPayloadAdd,
            uploadDelete: uploadDelete,
            uploadAccept: uploadAccept,
            uploadReject: uploadReject,
            uploadPending: uploadPending,
            emptyItemUploadAdd: emptyItemUploadAdd,
            uploadPayloadUpdate: uploadPayloadUpdate,
            emptyItemUploadPayloadUpdate: emptyItemUploadPayloadUpdate,
            updateAccptdRjctdInvoices: updateAccptdRjctdInvoices,
            updateErrorPayload: updateErrorPayload,
            errorDelete: errorDelete,
            emptyItemUpdateErrorPayload: emptyItemUpdateErrorPayload,
            uploadSetDeleteOrDelete: uploadSetDeleteOrDelete,
            uploadUpdateFlag: uploadUpdateFlag,
            emptyItemUploadUpdateFlag: emptyItemUploadUpdateFlag
            // emptyItemUpdateAccptdRjctdInvoices:emptyItemUpdateAccptdRjctdInvoices
        };
        var monthsExp = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/;

        function isEligibleForITC(pos, elig) {
            var rec_state = shareData.dashBoardDt.gstin.slice(0, 2);
            var sup_state = pos.slice(0, 2);

            if (sup_state != rec_state && elig != 'Ineligible') {
                return false;
            }

            else {
                return true;
            }

        }
        function isValidSuplyType(inv_type, sup_type) {
            if (inv_type == 'IMPS' && sup_type == 'Intra State')
                return false;
            else
                return true;
        }
        function isImportFromSez(ctin, imp) {

            if (imp == 'Received from SEZ') {
                if (ctin == '')
                    return false;
                return true;
            }
            if (ctin != '')
                return false;
            return true;


        }

        function emptyItemAdd($scope, iModelData, iModelFormatr) {
            return add($scope, iModelData, iModelFormatr, true);
        }

        function emptyItemUploadAdd($scope, iModelData, iModelFormatr) {
            return uploadPayloadAdd($scope, iModelData, iModelFormatr, true);
        }

        function emptyItemUpdate($scope, iModelData, iUpdateDetails, iModelFormatr) {
            return update($scope, iModelData, iUpdateDetails, iModelFormatr, true);
        }

        function emptyItemUploadPayloadUpdate($scope, iModelData, iUpdateDetails, iModelFormatr, isSupplier) {
            return uploadPayloadUpdate($scope, iModelData, iUpdateDetails, iModelFormatr, isSupplier, true);
        }

        function emptyItemUpdateErrorPayload($scope, iModelData, iUpdateDetails, iModelFormatr) {
            return updateErrorPayload($scope, iModelData, iUpdateDetails, iModelFormatr, true);
        }
        function emptyItemUploadUpdateFlag($scope, iModelData, iUpdateDetails, iModelFormatr) {
            return uploadUpdateFlag($scope, iModelData, iUpdateDetails, iModelFormatr, true);
        }


        function update($scope, iModelData, iUpdateDetails, iModelFormatr, iSkipItm) {
            var deferred = Q.defer();
            if (iSkipItm || (iModelData.itms && iModelData.itms.length) || (iModelData.doc && iModelData.doc.length)) {
                var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;
                var reqParam = shareData.dashBoardDt;
                reqParam.tbl_data = [fdata];
                reqParam.invdltArray = [iUpdateDetails];

                g1FileHandler.updatePayload(reqParam)
                    .then(function (response) {
                        $scope.createAlert("Success", response);
                        if ($scope.initSumryList)
                            $scope.initSumryList();
                        else
                            $scope.page("/gstr/summary");

                        deferred.resolve(response);

                    }, function (error) {
                        $log.debug("R1InvHandler -> update fail :: ", error);


                        $scope.createAlert("Error", "Invoice Updation Failed, Reason: " + error);
                        setTimeout(function () {
                            if ($scope.initSumryList)
                                $scope.initSumryList();
                        }, 1000)
                        deferred.reject(error);
                    });
            } else {
                $scope.createAlert("ErrorCallback", "Document cannot be saved without any items. Please add at least one item to update the document.", function () {

                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            }
            return deferred.promise;
        }

        function uploadUpdateFlag($scope, iModelData, iUpdateDetails, iModelFormatr, iSkipItm) {
            var deferred = Q.defer();
            if (iSkipItm || (iModelData.itms && iModelData.itms.length) || (iModelData.doc && iModelData.doc.length)) {
                var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;

                var reqParam = shareData.dashBoardDt;
                reqParam.tbl_data = [fdata];

                reqParam.invdltArray = [iUpdateDetails];

                g1FileHandler.uploadPayloadSetUpdateFlag(reqParam)
                    .then(function (response) {
                        $log.debug("R1InvHandler -> update succ :: ", response);
                        $scope.createAlert("Success", response);

                        if ($scope.initSumryList)
                            $scope.initSumryList();
                        else
                            $scope.page("/gstr/upload/summary");
                        deferred.resolve(response);

                    }, function (error) {
                        $log.debug("R1InvHandler -> update fail :: ", error);

                        $scope.createAlert("Error", "Invoice Updation Failed");
                    });
            } else {
                $scope.createAlert("ErrorCallback", "Document cannot be saved without any items. Please add at least one item to update the document.", function () {
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            }
            return deferred.promise;
        }

        function updateErrorPayload($scope, iModelData, iUpdateDetails, iModelFormatr, iSkipItm, old_val) {
            var deferred = Q.defer();
            if (iSkipItm || (iModelData.itms && iModelData.itms.length) || (iModelData.doc && iModelData.doc.length) || iModelData) {
                var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;

                var reqParam = shareData.dashBoardDt;
                reqParam.tbl_data = [fdata];
                reqParam.old_val = old_val;

                reqParam.invdltArray = [iUpdateDetails];

                g1FileHandler.updateErrorPayload(reqParam)
                    .then(function (response) {
                        $log.debug("R1InvHandler -> update succ :: ", response);
                        $scope.createAlert("Success", response);
                        if ($scope.initSumryList)
                            $scope.initSumryList();
                        else {
                            $scope.page("/gstr/error/summary");
                        }

                        deferred.resolve(response);

                    }, function (error) {
                        $log.debug("R1InvHandler -> update fail :: ", error);

                        $scope.createAlert("Error", "Invoice Updation Failed");
                    });
            } else {
                $scope.createAlert("ErrorCallback", "Document cannot be saved without any items. Please add at least one item to update the document.", function () {
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            }
            return deferred.promise;
        }

        function uploadPayloadUpdate($scope, iModelData, iUpdateDetails, iModelFormatr, isSupplier, iSkipItm) {
            var deferred = Q.defer();
            if (iSkipItm || (iModelData.itms && iModelData.itms.length) || (iModelData.doc && iModelData.doc.length)) {
                var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;

                var reqParam = shareData.dashBoardDt;
                reqParam.tbl_data = [fdata];

                reqParam.invdltArray = [iUpdateDetails];

                reqParam.type = "Import";

                if (isSupplier && (reqParam.tbl_cd == 'b2b' || reqParam.tbl_cd == 'cdnr')) {
                    g1FileHandler.updateAcceptPayload(reqParam)
                        .then(function (response) {
                            $log.debug("R1InvHandler -> update succ :: ", response);

                            $scope.createAlert("Success", response);

                            if ($scope.initSumryList)
                                $scope.initSumryList();
                            else
                                $scope.page("/gstr/upload/summary");
                            deferred.resolve(response);

                        }, function (error) {
                            $log.debug("R1InvHandler -> update fail :: ", error);

                            $scope.createAlert("Error", "Invoice Failed");
                        });
                } else {
                    g1FileHandler.updatePayload(reqParam)
                        .then(function (response) {
                            $log.debug("R1InvHandler -> update succ :: ", response);

                            $scope.createAlert("Success", response);
                            $scope.page("/gstr/upload/summary");
                            deferred.resolve(response);

                        }, function (error) {
                            $log.debug("R1InvHandler -> update fail :: ", error);

                            $scope.createAlert("Error", "Invoice Failed");
                        });
                }
            } else {
                $scope.createAlert("ErrorCallback", "Document cannot be saved without any items. Please add at least one item to update the document.", function () {
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            }
            return deferred.promise;
        }



        function uploadPayloadAdd($scope, iModelData, iModelFormatr, iSkipItm) {
            var deferred = Q.defer();

            if (iSkipItm || (iModelData.itms && iModelData.itms.length) || (iModelData.doc && iModelData.doc.length)) {
                var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;

                var reqParam = shareData.dashBoardDt;
                if (reqParam.tbl_cd == 'itc_rvsl' || (reqParam.tbl_cd == 'nil') && shareData.dashBoardDt.form == "GSTR1") {
                    reqParam.tbl_data = fdata;
                } else {
                    reqParam.tbl_data = [fdata];
                }
                reqParam.type = "Import";

                //reqParam.invdltArray = [iUpdateDetails];
                g1FileHandler.savePayload(reqParam)
                    .then(function (response) {
                        $log.debug("R1InvHandler -> update succ :: ", response);
                        if (Array.isArray(response) && response.length) {
                            if(response[0] == "supeco" || response[0] == "supecoa"){
                                $scope.createAlert("Error", "Duplicate Details!");
                            }else{
                                $scope.createAlert("Error", "Duplicate Invoice!");
                            }
                        } else {
                            $scope.createAlert("Success", response);
                        }
                        deferred.resolve(response);

                        $scope.page("/gstr/upload/summary");
                        if ($scope.initSumryList)
                            $scope.initSumryList();
                    }, function (error) {
                        $log.debug("R1InvHandler -> update fail :: ", error);

                        $scope.createAlert("Error", "Invoice Failed");
                    });
            } else {
                $scope.createAlert("Error", "Document cannot be saved without any items. Please add at least one item to update the document.");
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }
            return deferred.promise;
        }

        function updateAccptdRjctdInvoices($scope, iModelData, iUpdateDetails, iModelFormatr, iFlag, iSkipItm) {
            var deferred = Q.defer();
            var modelData = [];

            angular.forEach(iModelData, function (inv, i) {
                delete inv.select;
                inv = (iModelFormatr) ? iModelFormatr(inv) : inv;

                modelData.push(inv);
            })
            if (iSkipItm || iModelData) {
                //  var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;

                var reqParam = shareData.dashBoardDt;
                reqParam.tbl_data = modelData;

                reqParam.invdltArray = iUpdateDetails;

                reqParam.type = "Import";

                g1FileHandler.updateAcceptPayload(reqParam)
                    .then(function (response) {
                        $log.debug("R1InvHandler -> update succ :: ", response);
                        if (iFlag == "A") {
                            $scope.createAlert("Success", "Selected Invoices Accepted");

                        } else {
                            if (response == "You cannot modify the invoice if you are rejecting the invoice") {
                                $scope.createAlert("Error", response);
                            } else {
                                if (iFlag == 'R')
                                    $scope.createAlert("Success", "Selected Invoices Rejected");
                                else if (iFlag == 'P')
                                    $scope.createAlert("Success", "Selected Invoices marked as Pending");
                            }

                        }
                        if ($scope.initSumryList) {
                            $scope.initSumryList();
                        }


                        //                        $scope.sectionListSelected.url = "pages/returns/upload/" + shareData.dashBoardDt.form + "/" + $scope.sectionListSelected.cd + "/uploadedbycounterpartysummary.html";
                        deferred.resolve(response);

                    }, function (error) {
                        $log.debug("R1InvHandler -> update fail :: ", error);

                        $scope.createAlert("Error", "Invoice Failed");
                    });
            } else {
                $scope.createAlert("WarningOk", "Document cannot be saved without any items. Please add at least one item to update the document.", function () { });
            }
            return deferred.promise;
        }


        function add($scope, iModelData, iModelFormatr, iSkipItm) {
            var deferred = Q.defer();
            if (iSkipItm || (iModelData.itms && iModelData.itms.length) || (iModelData.doc && iModelData.doc.length)) {
                var fdata = (iModelFormatr) ? iModelFormatr(iModelData) : iModelData;
                var reqParam = shareData.dashBoardDt;
                if (reqParam.tbl_cd == 'itc_rvsl' || (reqParam.tbl_cd == 'nil') && shareData.dashBoardDt.form == "GSTR1") {
                    reqParam.tbl_data = fdata;
                } else {
                    reqParam.tbl_data = [fdata];
                }

                g1FileHandler.savePayload(reqParam)
                    .then(function (response) {

                        $log.debug("R1InvHandler -> update succ :: ", response);
                        if (Array.isArray(response) && response.length) {
                            if(response[0] == "supeco" || response[0] == "supecoa"){
                                $scope.createAlert("Error", "Duplicate Details!");
                            }else{
                                $scope.createAlert("Error", "Duplicate Invoice!");
                            }
                            if ($scope.initSumryList) {
                                $scope.initSumryList();
                            }
                            else
                                $scope.page("/gstr/summary");
                        } else {
                            $scope.createAlert("Success", response);
                            if ($scope.initSumryList) {
                                $scope.initSumryList();
                            }
                            else
                                $scope.page("/gstr/summary");
                            // deferred.resolve('Duplicate Invoice!');
                        }

                        deferred.resolve(response);

                    }, function (error) {
                        if ($scope.initSumryList) {
                            $scope.initSumryList();
                        }
                        else
                            $scope.page("/gstr/summary");
                        deferred.reject('Duplicate Invoice!');
                        $log.debug("R1InvHandler -> update fail :: ", error);

                        $scope.createAlert("Error", "Invoice Failed");
                    });
            } else {
                $scope.page("/gstr/summary");
                $scope.createAlert("Error", "Document cannot be saved without any items. Please add at least one item to save the document.");
            }
            return deferred.promise;
        }

        function deleteInv($scope, iModelData, iDeleteAry) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;
            reqParam.invdltArray = iDeleteAry;
            g1FileHandler.deleteInvoices(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> deleteInvoices succ :: ", response);
                    $scope.createAlert("Success", response);
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                    deferred.resolve(iModelData);

                }, function (error) {
                    $log.debug("R1InvHandler -> deleteInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Deletion Failed");
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            return deferred.promise;
        }

        function uploadDelete($scope, iModelData, iDeleteAry) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;
            reqParam.invdltArray = iDeleteAry;
            reqParam.type = "Import";
            g1FileHandler.deleteInvoices(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> deleteInvoices succ :: ", response);
                    $scope.createAlert("Success", response);

                    deferred.resolve(iModelData);

                }, function (error) {
                    $log.debug("R1InvHandler -> deleteInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Deletion Failed");
                });
            return deferred.promise;
        }

        function uploadAccept($scope, iModeldata, iAcceptArray) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;
            reqParam.tbl_data = iAcceptArray;
            reqParam.type = "Import";
            reqParam.actionType = 'A';
            g1FileHandler.updateData(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> acceptInvoices succ :: ", response);
                    $scope.createAlert("Success", response);
                    angular.forEach(iAcceptArray, function (inv) {
                        inv.flag = 'A';
                    });
                    deferred.resolve(iAcceptArray);
                }, function (error) {
                    $log.debug("R1InvHandler -> acceptInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Acceptance Failed");
                });
            return deferred.promise;
        }

        function uploadReject($scope, iModeldata, iAcceptArray) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;
            reqParam.tbl_data = iAcceptArray;
            reqParam.type = "Import";
            reqParam.actionType = 'R';

            g1FileHandler.updateData(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> acceptInvoices succ :: ", response);
                    $scope.createAlert("Success", response);
                    angular.forEach(iAcceptArray, function (inv) {
                        inv.flag = 'R';
                    })
                    deferred.resolve(iAcceptArray);
                }, function (error) {
                    $log.debug("R1InvHandler -> acceptInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Rejection Failed");
                });
            return deferred.promise;
        }

        function uploadPending($scope, iModeldata, iAcceptArray) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;
            reqParam.tbl_data = iAcceptArray;
            reqParam.type = "Import";
            reqParam.actionType = 'P';
            g1FileHandler.updateData(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> acceptInvoices succ :: ", response);
                    $scope.createAlert("Success", response);
                    angular.forEach(iAcceptArray, function (inv) {
                        inv.flag = 'P';
                    })
                    deferred.resolve(iAcceptArray);
                }, function (error) {
                    $log.debug("R1InvHandler -> acceptInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice to be kept Pending Failed");
                });
            return deferred.promise;
        }

        function uploadSetDeleteOrDelete($scope, iModelData, iDeleteAry) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;

            reqParam.invdltArray = iDeleteAry;
            //reqParam.type = "Import";
            g1FileHandler.setDeletePayload(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> deleteInvoices succ :: ", response);
                    $scope.createAlert("Success", response);

                    deferred.resolve(iModelData);
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                    else {
                        if ($scope.sectionListSelected) {
                            if ($scope.sectionListSelected.cd == 'b2b' || $scope.sectionListSelected.cd == 'cdnr' || $scope.sectionListSelected.cd == 'b2ba' || $scope.sectionListSelected.cd == 'cdnra') {
                                $scope.sectionListSelected.url = "pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/uploadedbytaxpayersummary.html";
                            }
                            else if($scope.sectionListSelected.cd == 'ecomb2b' || $scope.sectionListSelected.cd == 'ecomb2c' || $scope.sectionListSelected.cd == 'ecomurp2b' || $scope.sectionListSelected.cd == 'ecomurp2c'){
                                if($scope.sectionListSelected.cd == 'ecomb2b')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecom" + "/summary.html";
                                if($scope.sectionListSelected.cd == 'ecomb2c')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecom" + "/b2csummary.html";
                                if($scope.sectionListSelected.cd == 'ecomurp2b')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecom" + "/c2bsummary.html";
                                if($scope.sectionListSelected.cd == 'ecomurp2c')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecom" + "/c2csummary.html";
                            
                            }else if($scope.sectionListSelected.cd == 'ecomab2b' || $scope.sectionListSelected.cd == 'ecomab2c' || $scope.sectionListSelected.cd == 'ecomaurp2b' || $scope.sectionListSelected.cd == 'ecomaurp2c'){
                                if($scope.sectionListSelected.cd == 'ecomab2b')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecoma" + "/b2basummary.html";
                                if($scope.sectionListSelected.cd == 'ecomab2c')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecoma" + "/b2casummary.html";
                                if($scope.sectionListSelected.cd == 'ecomaurp2b')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecoma" + "/urp2basummary.html";
                                if($scope.sectionListSelected.cd == 'ecomaurp2c')
                                $scope.sectionListSelected.url = "/pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + "ecoma" + "/urp2casummary.html";
                            }
                           else if($scope.sectionListSelected.cd == "hsn(b2b)"){
                                $scope.sectionListSelected.cd = "hsn";
                                $scope.sectionListSelected.url = "pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/newSummary.html";
                            }
                            else if($scope.sectionListSelected.cd == "hsn(b2c)"){
                                $scope.sectionListSelected.cd = "hsn";
                                $scope.sectionListSelected.url = "pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/b2c.html"; 
                            }
                            else {
                                if ($scope.sectionListSelected.cd == "hsnsum") {
                                    $scope.sectionListSelected.cd = "hsn";
                                }
                                if ($scope.sectionListSelected.cd == "doc_issue") {
                                    $scope.sectionListSelected.cd = "doc";
                                }
                                $scope.sectionListSelected.url = "pages/returns/upload/" + reqParam.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/summary.html";

                            }
                        }
                        else {
                            $scope.page("/gstr/upload/summary");
                        }
                    }
                }, function (error) {
                    $log.debug("R1InvHandler -> deleteInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Deletion Failed");
                    if ($scope.initSumryList)
                        $scope.initSumryList();
                    else
                        $scope.page("/gstr/upload/summary");
                });
            return deferred.promise;
        }

        function errorDelete($scope, iModelData, iDeleteAry) {
            var deferred = Q.defer();
            var reqParam = shareData.dashBoardDt;
            reqParam.invdltArray = iDeleteAry;
            g1FileHandler.deleteErrorPayload(reqParam)
                .then(function (response) {
                    $log.debug("R1InvHandler -> deleteInvoices succ :: ", response);
                    $scope.createAlert("Success", response);
                    deferred.resolve(iModelData);

                }, function (error) {
                    $log.debug("R1InvHandler -> deleteInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Deletion Failed");
                });
            return deferred.promise;
        }


        function onPasteErrorHandler($scope, response, iErrInvList, iMatchedErrList, iPatternErrList, iTaxRtErrList, iShipDtErrList, iActionErrList, URTypPosErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList, iErrorStatusList, isHeaderMissingList, ierrb2clInvList) {
            if ((Array.isArray(response) && response.length) || (Array.isArray(iErrInvList) && iErrInvList.length) || (Array.isArray(iMatchedErrList) && iMatchedErrList.length)
                || (Array.isArray(iPatternErrList) && iPatternErrList.length) || (Array.isArray(iTaxRtErrList) && iTaxRtErrList.length) || (Array.isArray(iShipDtErrList) && iShipDtErrList.length)
                || (Array.isArray(iActionErrList) && iActionErrList.length) || (Array.isArray(iErrorStatusList) && iErrorStatusList.length) || (Array.isArray(isHeaderMissingList) && isHeaderMissingList.length)
                || (Array.isArray(URTypPosErrList) && URTypPosErrList.length) || (Array.isArray(UrTypDiffErrList) && UrTypDiffErrList.length) || (Array.isArray(PosSupStCdErrList) && PosSupStCdErrList.length)
                || (Array.isArray(NoteSplyTpeErrList) && NoteSplyTpeErrList.length) || (Array.isArray(ierrb2clInvList) && ierrb2clInvList.length)) {

                if(shareData.dashBoardDt.form == 'GSTR1'){
                var b2bErrList = [iErrInvList, iMatchedErrList, iPatternErrList, iTaxRtErrList, iShipDtErrList, iActionErrList, URTypPosErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList, iErrorStatusList, isHeaderMissingList];
                angular.forEach(b2bErrList, function (obj, i) {
                    angular.forEach(obj, function(i,key) {
                        if (i.cd == 'b2b') {
                            i.cd = 'b2b,sez,de';                 
                        }
                    });
                })
            }
                //From NODE: for repeated invoices
                var spltSec = null,
                    // invStr = "<div class=\"overflowScrol\">";
                    invStr = "";
                if ((Array.isArray(response) && response.length)) {
                    for(var i=0;i<response.length;i++){
                        if(response[i] == "supeco"){
                            response[i] = "eco"
                        }
                        if(response[i] == "supecoa"){
                            response[i] = "ecoa"
                        }
                    }
                    if (response[0].hasOwnProperty('gstin')) {
                        invStr += "<span>" + response[0].gstin + "</span>, ";
                    }
                    else {
                        for (var ind = 0, indLen = response.length; ind < indLen; ind++) {
                            var splitList = response[ind].split(":");
                            if ((spltSec !== splitList[0]) && splitList[1]) {
                                invStr += "<br><span class=\"heading\">" + splitList[0].toUpperCase() + "</span>: ";
                            }
                            if (splitList[1]) {
                                invStr += "<span>" + splitList[1] + "</span>, ";
                            } else {
                                invStr += "<span>" + splitList[0] + "</span>, ";
                            }
                            spltSec = splitList[0];
                            // invStr += "<span>" + response[ind] + "</span>, ";
                        }
                    }

                }
                invStr = invStr.replace(/,\s*$/, "");
                // invStr += "</div>";
                invStr += "";

                //Client end validated for invalid inputs like dates and months
                // var invErrStr = "<div class=\"overflowScrol\">";
                var invErrStr = " ";
                var section = null;
                for (var errorIndex = 0; errorIndex < iErrInvList.length; errorIndex++) {
                    if (section !== iErrInvList[errorIndex].cd) {
                        invErrStr += "<br><span class=\"heading\">" + iErrInvList[errorIndex].cd.toUpperCase() + "</span>: ";
                    }
                    invErrStr += "<span>" + iErrInvList[errorIndex].dt + "</span>, ";
                    section = iErrInvList[errorIndex].cd;
                }
                invErrStr = invErrStr.replace(/,\s*$/, "");
                // invErrStr += "</div>";
                invErrStr += " ";

                //Client end validated for invalid inputs in order to add multiple items
                // var invMatchErrStr = "<div class=\"overflowScrol\">";
                var invMatchErrStr = " ";
                var section = null;
                for (var errorIndex = 0; errorIndex < iMatchedErrList.length; errorIndex++) {
                    if (section !== iMatchedErrList[errorIndex].cd) {
                        invMatchErrStr += "<br><span class=\"heading\">" + iMatchedErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                    }
                    invMatchErrStr += "<span>" + iMatchedErrList[errorIndex].dt + "</span>, ";
                    section = iMatchedErrList[errorIndex].cd;
                }
                invMatchErrStr = invMatchErrStr.replace(/,\s*$/, "");
                //invMatchErrStr += "</div>";
                invMatchErrStr += " ";


                //Client end validated for mandatory fields and pattern validations
                var invPatternErrStr = " ";
                //var invPatternErrStr = "<div class=\"overflowScrol\">";
                var section = null;

                for (var errorIndex = 0; errorIndex < iPatternErrList.length; errorIndex++) {
                    if(iPatternErrList[errorIndex].cd == "supeco"){
                        iPatternErrList[errorIndex].cd = "eco"
                    }
                    if(iPatternErrList[errorIndex].cd == "supecoa"){
                        iPatternErrList[errorIndex].cd = "ecoa"
                    }
                    if (section !== iPatternErrList[errorIndex].cd) {
                        invPatternErrStr += "<br><span class=\"heading\">" + iPatternErrList[errorIndex].cd.toUpperCase() + " - Row" + "</span>: ";
                    }
                    invPatternErrStr += "<span>" + iPatternErrList[errorIndex].dt + "</span>, ";
                    section = iPatternErrList[errorIndex].cd;
                }
                invPatternErrStr = invPatternErrStr.replace(/,\s*$/, "");
                invPatternErrStr += "</div>";
                invPatternErrStr += " ";
                var errB2CLInvErrListStr = " ";
                var section = null;
                if (typeof ierrb2clInvList === 'undefined' || typeof ierrb2clInvList.length === 'undefined')
                    ierrb2clInvList = [];
                for (var errorIndex = 0; errorIndex < ierrb2clInvList.length; errorIndex++) {
                    if (section !== ierrb2clInvList[errorIndex].cd) {
                        errB2CLInvErrListStr += "<br><span class=\"heading\">" + ierrb2clInvList[errorIndex].cd.toUpperCase() + " - Row" +  "</span>: ";
                    }
                    errB2CLInvErrListStr += "<span>" + ierrb2clInvList[errorIndex].dt + "</span>, ";
                    section = ierrb2clInvList[errorIndex].cd;
                }
                errB2CLInvErrListStr = errB2CLInvErrListStr.replace(/,\s*$/, "");
                errB2CLInvErrListStr += " ";
              
                //For incorrect UR type in POS CDNUR/RA
                var invPosUrTypeErrStr = " ";

                var section = null;

                for (var errorIndex = 0; errorIndex < URTypPosErrList.length; errorIndex++) {
                    if (section !== URTypPosErrList[errorIndex].cd) {
                        invPosUrTypeErrStr += "<br><span class=\"heading\">" + URTypPosErrList[errorIndex].cd.toUpperCase() + " - Row" + "</span>: ";
                    }
                    invPosUrTypeErrStr += "<span>" + URTypPosErrList[errorIndex].dt + "</span>, ";
                    section = URTypPosErrList[errorIndex].cd;
                }
                invPosUrTypeErrStr = invPosUrTypeErrStr.replace(/,\s*$/, "");
                invPosUrTypeErrStr += "</div>";
                invPosUrTypeErrStr += " ";

                //For incorrect UR type in Diff % CDNUR/RA
                var invDiffUrTypeErrStr = " ";

                var section = null;

                for (var errorIndex = 0; errorIndex < UrTypDiffErrList.length; errorIndex++) {
                    if (section !== UrTypDiffErrList[errorIndex].cd) {
                        invDiffUrTypeErrStr += "<br><span class=\"heading\">" + UrTypDiffErrList[errorIndex].cd.toUpperCase() + " - Row" + "</span>: ";
                    }
                    invDiffUrTypeErrStr += "<span>" + UrTypDiffErrList[errorIndex].dt + "</span>, ";
                    section = UrTypDiffErrList[errorIndex].cd;
                }
                invDiffUrTypeErrStr = invDiffUrTypeErrStr.replace(/,\s*$/, "");
                invDiffUrTypeErrStr += "</div>";
                invDiffUrTypeErrStr += " ";
                //For incorrect UR type in Diff % CDNUR/RA
                var invPosStCdErrStr = " ";

                var section = null;

                for (var errorIndex = 0; errorIndex < PosSupStCdErrList.length; errorIndex++) {
                    if (section !== PosSupStCdErrList[errorIndex].cd) {
                        invPosStCdErrStr += "<br><span class=\"heading\">" + PosSupStCdErrList[errorIndex].cd.toUpperCase() + " - Row" + "</span>: ";
                    }
                    invPosStCdErrStr += "<span>" + PosSupStCdErrList[errorIndex].dt + "</span>, ";
                    section = PosSupStCdErrList[errorIndex].cd;
                }
                invPosStCdErrStr = invPosStCdErrStr.replace(/,\s*$/, "");
                invPosStCdErrStr += "</div>";
                invPosStCdErrStr += " ";
                //For incorrect Note Supply Type
                var invNtSplyTypeErrStr = " ";

                var section = null;

                for (var errorIndex = 0; errorIndex < NoteSplyTpeErrList.length; errorIndex++) {
                    if (section !== NoteSplyTpeErrList[errorIndex].cd) {
                        invNtSplyTypeErrStr += "<br><span class=\"heading\">" + NoteSplyTpeErrList[errorIndex].cd.toUpperCase() + " - Row" + "</span>: ";
                    }
                    invNtSplyTypeErrStr += "<span>" + NoteSplyTpeErrList[errorIndex].dt + "</span>, ";
                    section = NoteSplyTpeErrList[errorIndex].cd;
                }
                invNtSplyTypeErrStr = invNtSplyTypeErrStr.replace(/,\s*$/, "");
                invNtSplyTypeErrStr += "</div>";
                invNtSplyTypeErrStr += " ";
                //In case of b2b,b2cl,cdnur invalid intra-state row
                // var invTxRtErrStr = "<div class=\"overflowScrol\">";
                var invTxRtErrStr = " ";
                var section = null,
                    isExpSection = false;
                for (var errorIndex = 0; errorIndex < iTaxRtErrList.length; errorIndex++) {
                    if (section !== iTaxRtErrList[errorIndex].cd) {
                        invTxRtErrStr += "<br><span class=\"heading\">" + iTaxRtErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                    }
                    invTxRtErrStr += "<span>" + iTaxRtErrList[errorIndex].dt + "</span>, ";
                    section = iTaxRtErrList[errorIndex].cd;
                }
                invTxRtErrStr = invTxRtErrStr.replace(/,\s*$/, "");
                // invTxRtErrStr += "</div>";
                invTxRtErrStr += "";

                //Preparing dateError Messages
                var invshipDtErrStr = " ", //shipping date validation against invoice date(exp)
                    invNoteDtErrStr = " ", //note date validate against invoice date(cdnr,cdnur)
                    invAmendNoteDtErrStr = " ",//note dates validation against invoice date(cdnra,cdnura)
                    // invAmendInvDtErrStr = " ",//revised invoice dates aginst original invoice dates(cdnra,cdnura)
                    invAmendShipDtErrStr = " ";//revised invoice dates aginst original invoice dates and shipping date validation(expa)
                var section = null;
                if (typeof iShipDtErrList === 'undefined' || typeof iShipDtErrList.length === 'undefined')
                    iShipDtErrList = [];
                for (var errorIndex = 0; errorIndex < iShipDtErrList.length; errorIndex++) {
                    if (section !== iShipDtErrList[errorIndex].cd) {
                        // if (iShipDtErrList[errorIndex].cd == "b2ba" || iShipDtErrList[errorIndex].cd == "b2cla")
                        //     invAmendInvDtErrStr += "<br><span class=\"heading\">" + iShipDtErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                        if (iShipDtErrList[errorIndex].cd == "exp")
                            invshipDtErrStr += "<br><span class=\"heading\">" + iShipDtErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                        else if (iShipDtErrList[errorIndex].cd == "expa")
                            invAmendShipDtErrStr += "<br><span class=\"heading\">" + iShipDtErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                        else if (iShipDtErrList[errorIndex].cd == "cdnr" || iShipDtErrList[errorIndex].cd == "cdnur")
                            invNoteDtErrStr += "<br><span class=\"heading\">" + iShipDtErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                        else if (iShipDtErrList[errorIndex].cd == "cdnra" || iShipDtErrList[errorIndex].cd == "cdnura")
                            invAmendNoteDtErrStr += "<br><span class=\"heading\">" + iShipDtErrList[errorIndex].cd.toUpperCase() + "</span>: ";

                    }
                    section = iShipDtErrList[errorIndex].cd;
                    // if (section == 'b2ba' || section == 'b2cla')
                    //     invAmendInvDtErrStr += "<span>" + iShipDtErrList[errorIndex].dt + "</span>, ";
                    if (section == 'exp')
                        invshipDtErrStr += "<span>" + iShipDtErrList[errorIndex].dt + "</span>,";
                    if (section == 'expa')
                        invAmendShipDtErrStr += "<span>" + iShipDtErrList[errorIndex].dt + "</span>,";
                    if (section == 'cdnr' || section == 'cdnur')
                        invNoteDtErrStr += "<span>" + iShipDtErrList[errorIndex].dt + "</span>, ";
                    if (section == 'cdnra' || section == 'cdnura')
                        invAmendNoteDtErrStr += "<span>" + iShipDtErrList[errorIndex].dt + "</span>, ";

                }
                invshipDtErrStr = invshipDtErrStr.replace(/,\s*$/, "");
                invshipDtErrStr += "";

                invAmendShipDtErrStr = invAmendShipDtErrStr.replace(/,\s*$/, "");
                invAmendShipDtErrStr += "";

                invNoteDtErrStr = invNoteDtErrStr.replace(/,\s*$/, "");
                invNoteDtErrStr += "";

                invAmendNoteDtErrStr = invAmendNoteDtErrStr.replace(/,\s*$/, "");
                invAmendNoteDtErrStr += "";

                // invAmendInvDtErrStr = invAmendInvDtErrStr.replace(/,\s*$/, "");
                // invAmendInvDtErrStr += "";
                //Invalid IGST n SGST n CGST
                // var invTxRtErrStr = "<div class=\"overflowScrol\">";
                var invActionErrStr = " ";
                var section = null;
                var secLst = [];
                if (typeof iActionErrList === 'undefined' || typeof iActionErrList.length === 'undefined')
                    iActionErrList = [];
                for (var errorIndex = 0; errorIndex < iActionErrList.length; errorIndex++) {
                    if (section !== iActionErrList[errorIndex].cd) {
                        secLst = [];
                        invActionErrStr += "<br><span class=\"heading\">" + iActionErrList[errorIndex].cd.toUpperCase() + "</span>: ";
                    }

                    if (secLst.indexOf(iActionErrList[errorIndex].dt[0]) < 0) {

                        secLst.push(iActionErrList[errorIndex].dt[0])
                        invActionErrStr += "<span>" + iActionErrList[errorIndex].dt + "</span>, ";
                    }
                    section = iActionErrList[errorIndex].cd;
                }
                invActionErrStr = invActionErrStr.replace(/,\s*$/, "");
                // invTxRtErrStr += "</div>";
                invActionErrStr += "";


                var invErrStatusStr = " ";
                var section = null;
                var secLst = [];
                if (typeof iErrorStatusList === 'undefined' || typeof iErrorStatusList.length === 'undefined')
                    iErrorStatusList = [];
                for (var errorIndex = 0; errorIndex < iErrorStatusList.length; errorIndex++) {
                    if (section !== iErrorStatusList[errorIndex].cd) {
                        secLst = [];
                        invErrStatusStr += "<br><span class=\"heading\">" + iErrorStatusList[errorIndex].cd.toUpperCase() + "</span>: ";
                    }

                    if (secLst.indexOf(iErrorStatusList[errorIndex].dt[0]) < 0) {

                        secLst.push(iErrorStatusList[errorIndex].dt[0])
                        invErrStatusStr += "<span>" + iErrorStatusList[errorIndex].dt + "</span>, ";
                    }
                    section = iErrorStatusList[errorIndex].cd;
                }
                invErrStatusStr = invErrStatusStr.replace(/,\s*$/, "");
                // invTxRtErrStr += "</div>";
                invErrStatusStr += "";

                var headerMissStr = " ";

                var secLst = [];
                if (typeof isHeaderMissingList === 'undefined' || typeof isHeaderMissingList.length === 'undefined')
                    isHeaderMissingList = [];
                for (var errorIndex = 0; errorIndex < isHeaderMissingList.length; errorIndex++) {

                    headerMissStr += "<br><span class=\"heading\">" + isHeaderMissingList[errorIndex].cd.toUpperCase() + "</span>";
                }

                headerMissStr = headerMissStr.replace(/,\s*$/, "");
                headerMissStr += "";
                //Prepare error messages
                var warningMsg = "<div class=\"overflowScrol\">"
                if ((Array.isArray(response) && response.length)) {
                    if (response[0].hasOwnProperty('gstin')) {
                        warningMsg += "<b>Supplier and Receiver GSTIN/ETIN cannot be the same. Please rectify the same in the following cases and resubmit for processing:</b><br />" + invStr + '<hr />';
                    }
                    else {
                        warningMsg += "<b>All unique invoices have been imported.<hr />Incase of duplicate invoices, the existing invoice is updated with the duplicate invoice. The list of updated duplicate invoices is as mentioned below:</b><br />" + invStr + '<hr />';
                    }

                }
                if (iErrInvList.length) {
                    warningMsg += "<br><b>Following documents contain invalid inputs. Do enter correct invoice/note date. Invoice/Note date needs to be earlier than today and from the same financial year.</b><br />" + invErrStr + '<hr />';
                }
                if (iMatchedErrList.length) {
                    warningMsg += "<br><b>Done! Documents with same document level details have been added. Do enter same document level information before adding multiple items. Following documents contain invalid inputs in order to add multiple items.</b><br />" + invMatchErrStr + '<hr />';
                }
                if (iPatternErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid inputs:</span><b>Possible Reasons:</b><ul><li>Invalid date format provided for the inputs</li><li>Did not provided the values for required fields</li><li>Given 0 value for invoice number.</li><li>Given 0 value for gross advance received(Gross Advance Received can be saved as 0 only in tool).</li><li>Given 0 value for taxable value(Taxable value can be saved as 0 only in tool).</li><li>Given negative value for invoice/note value or taxable value or tax amounts.</li><li>The HSN code mentioned is not present in GST HSN master.</li></ul>Please Check For Mandatory Fields,Validations,DateFormats(dd-mmm-yyyy) And invoice/note number <br /><br />" + invPatternErrStr + '<hr />';
                }
                if (URTypPosErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid inputs. POS is not applicable for UR type selected <br /><br />" + invPosUrTypeErrStr + '<hr />';
                }
                if (UrTypDiffErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid inputs. Applicable % of tax rate is not applicable for UR type selected <br /><br />" + invDiffUrTypeErrStr + '<hr />';
                }
                if (PosSupStCdErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid inputs. POS cannot be same as Supplier State Code. <br /><br />" + invPosStCdErrStr + '<hr />';
                }
                if (NoteSplyTpeErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid inputs. Please select valid invoice type or note supply type.<br /><br />" + invNtSplyTypeErrStr + '<hr />';
                }
                //  <br><b>Following Invoices contain Invalid Inputs.Please Check For Mandatory Fields,Validations,DateFormats(dd-mmm-yyyy) </b><br />
                if (iActionErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid action:</span><b>Possible Reasons:</b><ul><li>Invalid action provided for records already saved in portal</li><li>Different actions for multiple items in same invoice.</li></ul>Please ensure that status and action fields have valid data.<br /><br />" + invActionErrStr + '<hr />';
                }
                if (iErrorStatusList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following documents contain invalid inputs:</span><b>Possible Reasons:</b><ul><li>Different error status for multiple items in same document.</li><li>Did not corrected the error</li><li>Added new documents</li></ul>Please ensure that error status has changed for corrected documents<br/><br/>" + invErrStatusStr + '<hr />';
                }
                if (iTaxRtErrList.length) {
                    warningMsg += "<br><br /><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following Invoices contain invalid inputs: It Can not be Intra-State Invoice. </span><b>Possible Reasons:</b><ul><li>Pos provided same as GSTIN state code.</li><li>Supply type selected as Intra State.</li></ul>Please ensure that entered invoice is Inter-State invoice.<br /><br />" + invTxRtErrStr + '<hr />';

                    //<li><b>Nil:</b>Prvoided Details Should be Inter-State Supplies for SEZ Taxpayer</li> warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. It Can not be Intra-State Invoice. Please Check for POS </b><br />" + invTxRtErrStr + '<hr />';

                }
                if(ierrb2clInvList.length){
                   warningMsg += "<br><b>Error: Invoice value should be more than INR 250000 upto July 2024 return period.</b>"+errB2CLInvErrListStr+'<hr />';      
                }
                if (isHeaderMissingList.length) {
                    warningMsg += "<span class=\"msgbxh\">Column Headers Missing/Mismatch or Data Invalid.</span><br /><br /><b>Section(s) : </b>" + headerMissStr + "<br /><br /><b>Possible Reasons:</b><ul><li>Please check the spreadsheet.Either mandatory columns are missing or few rows have invalid data.</li></ul><br /><hr />"
                }
                if (iShipDtErrList.length) {
                    var isB2BA = true, isCDNR = true, isCDNRA = true; //for the first time taking as true once msg prepared making it as false in order to avoid the same msg display multiple times in UI
                    for (var errorIndex = 0; errorIndex < iShipDtErrList.length; errorIndex++) {
                        if (section !== iShipDtErrList[errorIndex].cd) {
                            // if (iShipDtErrList[errorIndex].cd == 'b2ba' || iShipDtErrList[errorIndex].cd == 'b2cla') {
                            //     if (isB2BA)
                            //         warningMsg += "<br><b>Following Invoices Contain Invalid dates. Revised Invoice Date can not be prior to Original Invoice date. Please Check for invoice dates</b><br/>" + invAmendInvDtErrStr + '<hr />';
                            //     isB2BA = false;
                            // }else
                            if (iShipDtErrList[errorIndex].cd == 'cdnra' || iShipDtErrList[errorIndex].cd == 'cdnura') {
                                if (isCDNRA)
                                    warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. Original and Revised Note/Refund voucher Date can not be prior to invoice date.Please Check for invoice/note dates</b><br />" + invAmendNoteDtErrStr + '<hr />';
                                // warningMsg += "<br><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following Invoices contain invalid dates:</span><b>Possible Reasons:</b><ul><li>Revised Note/Refund voucher Date can not be prior to Original Note/Refund voucher Date</li><li>Original and Revised Note/Refund voucher Date can not be prior to invoice date</li></ul>Please Check for invoice/note dates<br/>" + invAmendNoteDtErrStr + '<hr />';

                                // warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. Revised Note/Refund voucher Date can not be prior to Original Note/Refund voucher Date. Please Check for Note/Refund voucher dates</b><br/>" + invNoteDtErrStr + '<hr />';
                                isCDNRA = false;


                            }
                            else if (iShipDtErrList[errorIndex].cd == 'cdnr' || iShipDtErrList[errorIndex].cd == 'cdnur') {
                                if (isCDNR)
                                    warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. Note/Refund voucher Date can not be prior to invoice date </b><br/>" + invNoteDtErrStr + '<hr />';
                                isCDNR = false;
                            }
                            else if (iShipDtErrList[errorIndex].cd == 'exp') {
                                warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. Shipping Date can not be prior to invoice date </b><br />" + invshipDtErrStr + '<hr />';
                            }
                            else if (iShipDtErrList[errorIndex].cd == 'expa') {
                                warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. Shipping Date can not be prior to Original/Revised invoice Date.Please Check for invoice/shipping dates.</b><br />" + invAmendShipDtErrStr + '<hr />';
                                // warningMsg += "<br><span class=\"msgbxh\" style=\" text-align: left;border: 0; \">Following Invoices contain invalid dates:</span><b>Possible Reasons:</b><ul><li>Shipping Date can not be prior to Original/Revised invoice Date</li><li> Revised Invoice Date can not be prior to Original Invoice date</li>Please Check for invoice/shipping dates</ul>" + invAmendShipDtErrStr + '<hr />';
                            }
                        }
                        section = iShipDtErrList[errorIndex].cd;
                    }
                    // if (isExpSection) { warningMsg += "<br><b>Following invoices contain invalid inputs.Please Check for Rates And Amount Columns. It should be filled according to Export Type</b><br>" + invTxRtErrStr; }
                    // warningMsg += "<br><b>Following Invoices Contain Invalid Inputs. Shipping Date can not be prior to invoice date </b><br />" + invshipDtErrStr + '<hr />';

                }

                warningMsg += '</div>';


                $scope.createAlert("WarningOk", warningMsg, function () { });
                //$scope, iTy, iMsg, iConfirmFn
            } else {
                $scope.createAlert("Success", response);
            }
        }

        function onPaste($scope, iJSON, iSecId, iErrInvList, iMatchErrList, iPatternErrList, iTxRtErrList, iShipDtErrList, iActionErrList, iFlag, URTypPosErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList) {
            var deferred = Q.defer(),
                stdata = JSON.parse(JSON.stringify(iJSON)); //angular.copy(iJSON); adding as per review comment
            if (stdata.length > 0 || iErrInvList.length > 0 || iMatchErrList.length > 0 || iPatternErrList.length > 0 || iTxRtErrList.length > 0 || iShipDtErrList.length > 0 || URTypPosErrList.length > 0 || UrTypDiffErrList.length > 0 || PosSupStCdErrList.length > 0 || NoteSplyTpeErrList.length > 0) {

                if (stdata.length > 0) {
                    var reqParam = JSON.parse(JSON.stringify(shareData.dashBoardDt)); //angular.copy(shareData.dashBoardDt); adding as per review comment
                    if (iSecId) {
                        reqParam.tbl_cd = iSecId;
                    }
                    if (iFlag == "Y") {
                        reqParam.type = "Import";
                    }
                    reqParam.tbl_data = JSON.parse(JSON.stringify(stdata)); //angular.copy(stdata);
                    $().blockPage(true);
                    g1FileHandler.savePayload(reqParam)
                        .then(function (response) {
                            $().blockPage(false);
                            $log.debug("R1InvHandler -> onPaste succ :: ", response);
                            onPasteErrorHandler($scope, response, iErrInvList, iMatchErrList, iPatternErrList, iTxRtErrList, iShipDtErrList, iActionErrList, URTypPosErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList);
                            deferred.resolve(response);
                        }, function (error) {
                            $().blockPage(false);
                            $log.debug("R1InvHandler -> onPaste fail :: ", error);
                            $scope.createAlert("Error", "Invoices Import Failed: Server Failure");
                            $('.delayMSg').remove();
                        });
                }
                else if (!stdata.length) {
                    if(iSecId == 'b2b'){
                        iSecId = 'b2b, sez, de';
                    }
                    // all rows are invlaid
                    // ya wrong section added.
                    // nothing inserted.
                    //onPasteErrorHandler($scope, null, iErrInvList, iMatchErrList, iPatternErrList, iTxRtErrList);
                    $scope.createAlert("Error", "<span class=\"msgbxh\">Data Invalid.</span><br /><br /><b>Section : </b>" + iSecId.toUpperCase() + "<br /><br /><b>Possible Reasons:</b><ul><li>Please check the spreadsheet.Either all rows have invalid data or the  wrong section file is copied/uploaded</li></ul><br /><b>Note:</b> Please upload the data of the selected section only. If using COPY EXCEL button, please ensure that you copy headers along with the data.");
                }

            } else {
                $scope.createAlert("Error", "Please upload data of the selected section only. If using COPY EXCEL button, please ensure that you copy headers along with the data.");
            }
            return deferred.promise;
        }

        function upMultipleSections($scope, iJSON, iErrInvList, iMatchErrList, iPatternErrList,iTxRtErrList,iShipDtErrList, iActionErrList, iErrorStatusList, isHeaderMissingList, iFlag, URTypPosErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList,errB2CLInvErrList) {
            var deferred = Q.defer(),
                stdata = angular.copy(iJSON);

            if (stdata.length || iJSON.cache_key !== undefined) {

                var reqParam = angular.copy(shareData.dashBoardDt);
                if (reqParam.tbl_cd) {
                    delete reqParam.tbl_cd;
                }
                if (iFlag == "Y") {
                    reqParam.type = "Import";
                }
                if (iFlag == "E") {
                    reqParam.type = "Error";
                }
                reqParam.tbl_data = angular.copy(stdata);
                $().blockPage(true);
                g1FileHandler.saveMultiplePayload(reqParam)
                    .then(function (response) {
                        $().blockPage(false);
                        $log.debug("R1InvHandler -> upMultipleSections succ :: ", response);
                        onPasteErrorHandler($scope, response, iErrInvList, iMatchErrList, iPatternErrList, iTxRtErrList, iShipDtErrList, iActionErrList, URTypPosErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList, iErrorStatusList, isHeaderMissingList, errB2CLInvErrList);
                        if (iFlag == 'E') {
                            if ($scope.sectionListSelected.cd) {
                                $scope.sectionListSelected.url = "pages/returns/error/" + reqParam.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/summary.html";
                            }
                        }
                        deferred.resolve(response);
                    }, function (error) {
                        $().blockPage(false);
                        $log.debug("R1InvHandler -> upMultipleSections fail :: ", error);
                        $scope.createAlert("Error", "Invoices Import Failed: Server Failure");
                        $('.delayMSg').remove();
                    });

            } else {
                $scope.createAlert("Error", "Please upload the correct excel with atleast single section data");
            }
            return deferred.promise;
        }

       //to chk whtr date is in dd-mmm-yy/yyyy format or not
        function isValidDateFormat(userDateString) {
            if (typeof (userDateString) === "number") {
                var numericDate = userDateString;
                var date = moment('1899-12-30').add(numericDate, 'days');
                var dateFormat1 = "DD-MMM-YYYY",
                    dateFormat2 = "DD-MMM-YY",
                    dateFormat3 = "D-MMM-YYYY",
                    dateFormat4 = "D-MMM-YY",
        
                    isValidFormat = null;
                var myMoment1 = moment(date, dateFormat1, true),
                    myMoment2 = moment(date, dateFormat2, true),
                    myMoment3 = moment(date, dateFormat3, true),
                    myMoment4 = moment(date, dateFormat4, true);
                if (myMoment1.isValid() || myMoment2.isValid() || myMoment3.isValid() || myMoment4.isValid()) {
                    isValidFormat = true;
        
                } else {
                    isValidFormat = false;
        
                }
            } else {
            var dateFormat1 = "DD-MMM-YYYY",
                dateFormat2 = "DD-MMM-YY",
                dateFormat3 = "D-MMM-YYYY",
                dateFormat4 = "D-MMM-YY",

                isValidFormat = null;

            var myMoment1 = moment(userDateString, dateFormat1, true),
                myMoment2 = moment(userDateString, dateFormat2, true),
                myMoment3 = moment(userDateString, dateFormat3, true),
                myMoment4 = moment(userDateString, dateFormat4, true);
            if (myMoment1.isValid() || myMoment2.isValid() || myMoment3.isValid() || myMoment4.isValid()) {
                isValidFormat = true;

            } else {
                isValidFormat = false;

            }
            return isValidFormat;
        }
    }

        //validation of Date for future n previous dates
        function validateDate(iDate, iMonthsList, allowFutture) {
            if (!allowFutture)
                allowFutture = false;
            var dateFormat = "DD/MM/YYYY";


            var rtDt = null,
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat),
                firstMonth = iMonthsList[0],
                //temp1 = "01" + firstMonth.value.slice(0, 2) + firstMonth.value.slice(2),
                temp1 = "01072017",
                firstDate = moment(temp1, dateFormat),
                firstDate1 = firstDate.format(dateFormat),
                isNotFutureDate = (moment(iDate, dateFormat).isAfter(moment(lastDate1, dateFormat))) ? false : true,
                isNotPrevDate = (moment(iDate, dateFormat).isBefore(moment(firstDate1, dateFormat))) ? false : true;

            return ((allowFutture || isNotFutureDate) && isNotPrevDate);
        }

        //to validate month in case of b2csa(should be exist monnths from dashboard)
        function validateMonth(oMon) {
            var isValidMon = false,
                existMonths = shareData.curFyMonths;
            angular.forEach(existMonths, function (month, i) {
                if (month.value == oMon) {
                    isValidMon = true;
                }
            })
            return isValidMon;

        }

        //converting string values to numbers
        function convertStrToNum(oData, iKey) {
            var stData = angular.copy(oData)
            angular.forEach(stData, function (inv, i) {
                var keys = Object.keys(inv);
                angular.forEach(keys, function (key, i) {
                    if (key.indexOf(iKey) != -1) {
                        var type = typeof (inv[key]);
                        if (inv[key] && typeof (inv[key]) != "number") {
                            inv[key] = parseFloat(inv[key].replace(',', ''));
                        }
                    }
                })
            })
            return stData;
        }

        //converting numbers to strings
        function convertNumToStr(oData, iKey) {
            var stData = angular.copy(oData)
            angular.forEach(stData, function (inv, i) {
                var keys = Object.keys(inv);
                angular.forEach(keys, function (key, i) {
                    if (key.indexOf(iKey) != -1) {
                        var type = typeof (inv[key]);
                        if (inv[key] && typeof (inv[key]) != "string") {
                            inv[key] = inv[key].toString();
                        }
                    }
                })
            })
            return stData;
        }

        function validateItm(iForm, iSecID, iExInv, existingInv) {
            var isValidItm = false;
            if (iForm === "GSTR1") {
                switch (iSecID) {
                    case 'b2b':
                        angular.forEach(existingInv.itms, function (itm, i) {
                            if (iExInv['Rate'] !== itm.itm_det['rt']) {
                                isValidItm = true;
                            }
                            else {
                                isValidItm = false;
                            }
                        });
                }
            }
            return isValidItm;
        }

        //To check all values at invoice level inorder to add multi items from excel
        function validateInvoice(iForm, iSecID, iExInv, existingInv, iYearsList, transLan) {
            var isFieldsMatch = false;
            if (iExInv['Place Of Supply']) {
                iExInv['Place Of Supply'] = (iExInv['Place Of Supply']).substring(0, 2);
            }
            if (iExInv['Recipient State Code']) {
                iExInv['Recipient State Code'] = (iExInv['Recipient State Code'] < 10) ? "0" + iExInv['Recipient State Code'] : "" + iExInv['Recipient State Code'];
            }
            if (iExInv['Original State Code']) {
                iExInv['Original State Code'] = (iExInv['Original State Code'] < 10) ? "0" + iExInv['Original State Code'] : "" + iExInv['Original State Code'];
            }
           

            if (iForm === "GSTR1") {
                switch (iSecID) {
                    case 'b2b':
                        isFieldsMatch = (
                            iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                            iExInv['Receiver Name'] == existingInv['cname'] &&
                            (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice date'] == existingInv['idt'] &&
                            iExInv['Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            iExInv['Reverse Charge'] == existingInv['rchrg'] &&
                            iExInv['E-Commerce GSTIN'] == existingInv['etin']

                        );
                        break;
                    case 'b2ba':
                        isFieldsMatch = (
                            iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                            iExInv['Receiver Name'] == existingInv['cname'] &&
                            (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                            iExInv['Original Invoice date'] == existingInv['oidt'] &&
                            (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Revised Invoice date'] == existingInv['idt'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            iExInv['Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Reverse Charge'] == existingInv['rchrg']);

                        break;
                    case 'b2cl':
                        isFieldsMatch = (
                            (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice date'] == existingInv['idt'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            iExInv['Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos']);
                        break;
                    case 'b2cla':
                        isFieldsMatch = (
                            (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                            iExInv['Original Invoice date'] == existingInv['oidt'] &&
                            (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Revised Invoice date'] == existingInv['idt'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            iExInv['Invoice Value'] == existingInv['val'] &&
                            iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos']
                        );
                        break;
                    case 'at':
                        isFieldsMatch = (
                            iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent']);

                        break;
                    case 'ata':
                        var year = iExInv['Financial Year'],
                            month = iExInv['Original Month'],
                            curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                        isFieldsMatch = (
                            iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            curntOMon == existingInv['omon']);
                        break;
                    case 'exp':
                        isFieldsMatch = (
                            iExInv['Export Type'] == existingInv['exp_typ'] &&
                            parseInt(iExInv['Shipping Bill Number']) == existingInv['sbnum'] &&
                            iExInv['Port Code'] == existingInv['sbpcode'] &&
                            iExInv['Shipping Bill Date'] == existingInv['sbdt'] &&
                            (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice date'] == existingInv['idt'] &&
                            iExInv['Invoice Value'] == existingInv['val']);
                        break;
                    case 'expa':
                        isFieldsMatch = (
                            iExInv['Export Type'] == existingInv['exp_typ'] &&
                            iExInv['Shipping Bill Number'] == existingInv['sbnum'] &&
                            iExInv['Port Code'] == existingInv['sbpcode'] &&
                            iExInv['Shipping Bill Date'] == existingInv['sbdt'] &&
                            (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                            iExInv['Original Invoice date'] == existingInv['oidt'] &&
                            (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Revised Invoice date'] == existingInv['idt'] &&
                            iExInv['Invoice Value'] == existingInv['val']);
                        break;
                    case 'cdnr':
                        isFieldsMatch = (
                            iExInv[transLan.LBL_GSTIN_UIN_RECIPIENT] == existingInv['ctin'] &&
                            iExInv[transLan.LBL_RECEIVER_NAME] == existingInv['cname'] &&
                            iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                            iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                            iExInv[transLan.LBL_NOTE_TYP] == existingInv['ntty'] &&
                            iExInv[transLan.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                            iExInv[transLan.LBL_POS_Excel] == existingInv['pos'] &&
                            iExInv[transLan.LBL_RECHRG] == existingInv['rchrg'] &&
                            iExInv[transLan.LBL_NOTE_VAL_Excel] == existingInv['val']);
                        break;
                    case 'cdnur':
                        isFieldsMatch = (
                            iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                            iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                            iExInv[transLan.LBL_NOTE_TYP] == existingInv['ntty'] &&
                            iExInv[transLan.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                            iExInv[transLan.LBL_POS_Excel] == existingInv['pos'] &&
                            iExInv[transLan.LBL_UR_TYPE] == existingInv['typ'] &&
                            iExInv[transLan.LBL_NOTE_VAL_Excel] == existingInv['val']);

                        break;
                    case 'cdnra':
                        isFieldsMatch = (
                            iExInv[transLan.LBL_GSTIN_UIN_RECIPIENT] == existingInv['ctin'] &&
                            iExInv[transLan.LBL_RECEIVER_NAME] == existingInv['cname'] &&
                            iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO] == existingInv['ont_num'] &&
                            iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] == existingInv['ont_dt'] &&
                            iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                            iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                            iExInv[transLan.LBL_NOTE_TYP] == existingInv['ntty'] &&
                            iExInv[transLan.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                            iExInv[transLan.LBL_POS_Excel] == existingInv['pos'] &&
                            iExInv[transLan.LBL_RECHRG] == existingInv['rchrg'] &&
                            iExInv[transLan.LBL_NOTE_VAL_Excel] == existingInv['val']);

                        break;
                    case 'cdnura':
                        isFieldsMatch = (
                            iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO] == existingInv['ont_num'] &&
                            iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] == existingInv['ont_dt'] &&
                            iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                            iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                            iExInv[transLan.LBL_NOTE_TYP] == existingInv['ntty'] &&
                            iExInv[transLan.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                            iExInv[transLan.LBL_POS_Excel] == existingInv['pos'] &&
                            iExInv[transLan.LBL_UR_TYPE] == existingInv['typ'] &&
                            iExInv[transLan.LBL_NOTE_VAL_Excel] == existingInv['val']);

                        break;
                    case 'b2cs':
                        isFieldsMatch = (
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            iExInv['Type'] == existingInv['typ']);

                        break;
                    case 'b2csa':
                        if (!iExInv['E-Commerce GSTIN'])
                            iExInv['E-Commerce GSTIN'] = "";
                        var year = iExInv['Financial Year'],
                            month = iExInv['Original Month'],
                            curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                        isFieldsMatch = (
                            iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            iExInv['E-Commerce GSTIN'] == existingInv['etin'] &&
                            curntOMon == existingInv['omon'] &&
                            iExInv['Type'] == existingInv['typ']);
                        break;
                    case 'atadj':
                        isFieldsMatch = (
                            iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent']);
                        break;
                    case 'atadja':
                        var year = iExInv['Financial Year'],
                            month = iExInv['Original Month'],
                            curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                        isFieldsMatch = (
                            iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                            curntOMon == existingInv['omon']);
                        break;
                    case 'hsn':
                        isFieldsMatch = (
                            iExInv['HSN'] == existingInv['hsn_sc'] &&
                            iExInv['Description'] == existingInv['desc']
                        );
                        break;
                    case 'hsn(b2b)':
                        var HSN_BIFURCATION_START_DATE = "052025";
                        var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                        if(showHSNTabs){
                        isFieldsMatch = (
                            iExInv['HSN'] == existingInv['hsn_sc'] &&
                            iExInv['Description as per HSN Code'] == existingInv['desc']
                        );
                        }
                        break;
                    case 'hsn(b2c)':
                        var HSN_BIFURCATION_START_DATE = "052025";
                        var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                        if(showHSNTabs){
                        isFieldsMatch = (
                            iExInv['HSN'] == existingInv['hsn_sc'] &&
                            iExInv['Description as per HSN Code'] == existingInv['desc']
                        );
                        }
                        break;
                    case 'nil':
                        isFieldsMatch = (
                            iExInv['Description'] == existingInv['sply_ty'] &&
                            iExInv['Nil Rated Supplies'] == existingInv['nil_amt'] &&
                            iExInv['Exempted(other than Nil rated/non-GST supply)'] == existingInv['expt_amt'] &&
                            iExInv['Non-GST Supplies'] == existingInv['ngsup_amt']
                        );
                        break;
                    case 'doc_issue':
                        isFieldsMatch = (
                            iExInv['Nature of Document'] == existingInv['doc_typ']
                        );
                        break;
                    case 'supeco':
                        isFieldsMatch = (
                            iExInv['GSTIN of E-Commerce Operator'] == existingInv['etin']) ;
                        break;
                    case 'supecoa':
                        isFieldsMatch = (
                            iExInv['Revised GSTIN of E-Commerce Operator'] == existingInv['etin'] &&
                            iExInv['Original GSTIN of E-Commerce Operator'] == existingInv['oetin']) ;
                        break;
                        
                    case 'ecomb2b':
                        isFieldsMatch = (
                            iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                            //iExInv['Supplier Name'] == existingInv['supplierName'] &&
                            iExInv['Recipient GSTIN/UIN'] == existingInv['rtin'] &&
                            //iExInv['Recipient Name'] == existingInv['receipientName'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Document Date'] == existingInv['idt'] &&
                            iExInv['Document Number'] == existingInv['inum'] &&
                            //iExInv['Document type'] == existingInv['inv_typ'] &&
                            iExInv['Value of supplies made'] == existingInv['val'] 
                        );
                        break;
                    case 'ecomab2b':
                        isFieldsMatch = (
                            iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                            // iExInv['Supplier Name'] == existingInv['supplierName'] &&
                            iExInv['Recipient GSTIN/UIN'] == existingInv['rtin'] &&
                            // iExInv['Recipient Name'] == existingInv['receipientName'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Original Document Date'] == existingInv['oidt'] &&
                            iExInv['Original Document Number'] == existingInv['oinum'] &&
                            iExInv['Revised Document Date'] == existingInv['idt'] &&
                            iExInv['Revised Document Number'] == existingInv['inum'] &&
                            //iExInv['Document type'] == existingInv['inv_typ'] &&
                            iExInv['Value of supplies made'] == existingInv['val'] 
                        );

                        break;
                    case 'ecomb2c':
                        isFieldsMatch = (
                            iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
						    iExInv['Supplier Name'] == existingInv['cname'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Taxable Value'] == existingInv['txval'] &&
                            iExInv['Cess Amount'] == existingInv['csamt']
                        );
                        break;
                    case 'ecomab2c':
                        var year = iExInv['Financial Year'],
                        month = iExInv['Original Month'],
                        curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                        isFieldsMatch = (
                            iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            curntOMon == existingInv['omon']
                        );
                        break;    
                    case 'ecomurp2b':
                        isFieldsMatch = (
                            iExInv['Recipient GSTIN/UIN'] == existingInv['rtin'] &&
                            //iExInv['Recipient Name'] == existingInv['receipientName'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Document Date'] == existingInv['idt'] &&
                            iExInv['Document Number'] == existingInv['inum'] &&
                            //iExInv['Document type'] == existingInv['inv_typ'] &&
                            iExInv['Value of supplies made'] == existingInv['val'] 
                        );
                        break;
                    case 'ecomaurp2b':
                        isFieldsMatch = (
                            iExInv['Recipient GSTIN/UIN'] == existingInv['rtin'] &&
                            //iExInv['Recipient Name'] == existingInv['receipientName'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Original Document Date'] == existingInv['oidt'] &&
                            iExInv['Original Document Number'] == existingInv['oinum'] &&
                            iExInv['Revised Document Date'] == existingInv['idt'] &&
                            iExInv['Revised Document Number'] == existingInv['inum'] &&
                            //iExInv['Document type'] == existingInv['inv_typ'] &&
                            iExInv['Value of supplies made'] == existingInv['val'] 
                        );
                        break;
                    case 'ecomurp2c':
                        isFieldsMatch = (
                            iExInv['Place Of Supply'] == existingInv['pos'] 
                            //iExInv['Taxable Value'] == existingInv['txval'] &&
                            //iExInv['Cess Amount'] == existingInv['csamt']
                        );
                        break;
                    case 'ecomaurp2c':
                        var year = iExInv['Financial Year'],
                        month = iExInv['Original Month'],
                        curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                        isFieldsMatch = (
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            curntOMon == existingInv['omon']
                        );
                        break;
                }
            } else if (iForm === "GSTR2") {
                switch (iSecID) {
                    case 'b2b': // GSTR2
                        isFieldsMatch = (iExInv['GSTIN of Supplier'] == existingInv['ctin'] &&
                            iExInv['Supplier Name'] == existingInv['cname'] &&
                            (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice date'] == existingInv['idt'] &&
                            iExInv['Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Reverse Charge'] == existingInv['rchrg']);

                        break;
                    case 'b2bur': // GSTR2
                        isFieldsMatch = (
                            (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice date'] == existingInv['idt'] &&
                            iExInv['Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos']
                        );

                        break;
                    case 'b2ba': // GSTR2
                        isFieldsMatch = (iExInv['Supplier GSTIN'] == existingInv['ctin'] &&
                            iExInv['Original Invoice Number'] == existingInv['oinum'] &&
                            iExInv['Original Invoice date'] == existingInv['oidt'] &&
                            (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Revised Invoice date'] == existingInv['idt'] &&
                            iExInv['Total Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Reverse Charge'] == existingInv['rchrg']);

                        break;
                    case 'b2bura': // GSTR2
                        isFieldsMatch = (iExInv['Supplier Name'] == existingInv['cname'] &&
                            iExInv['Original Invoice Number'] == existingInv['oinum'] &&
                            iExInv['Original Invoice date'] == existingInv['oidt'] &&
                            (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Revised Invoice date'] == existingInv['idt'] &&
                            iExInv['Total Invoice Value'] == existingInv['val'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Reverse Charge'] == existingInv['rchrg']);
                        break;
                    case 'cdnr': // GSTR2
                        isFieldsMatch = (iExInv['GSTIN of Supplier'] == existingInv['ctin'] &&
                            iExInv['Note/Refund Voucher Number'] == existingInv['nt_num'] &&
                            iExInv['Note/Refund Voucher date'] == existingInv['nt_dt'] &&
                            iExInv['Document Type'] == existingInv['ntty'] &&
                            iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                            (iExInv['Invoice/Advance Payment Voucher Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice/Advance Payment Voucher date'] == existingInv['idt'] &&
                            iExInv['Pre GST'] == existingInv['p_gst'] &&
                            iExInv['Supply Type'] == existingInv['sp_typ'] &&
                            iExInv['Note/Refund Voucher Value'] == existingInv['val']
                        );
                        break;
                    case 'cdnur': // GSTR2
                        isFieldsMatch = (
                            iExInv['Note/Voucher Number'] == existingInv['nt_num'] &&
                            iExInv['Note/Voucher date'] == existingInv['nt_dt'] &&
                            iExInv['Document Type'] == existingInv['ntty'] &&
                            iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                            (iExInv['Invoice/Advance Payment Voucher number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice/Advance Payment Voucher date'] == existingInv['idt'] &&
                            iExInv['Pre GST'] == existingInv['p_gst'] &&
                            iExInv['Supply Type'] == existingInv['sp_typ'] &&
                            iExInv['Invoice Type'] == existingInv['inv_typ'] &&
                            iExInv['Note/Voucher Value'] == existingInv['val']);
                        break;
                    case 'cdnra': // GSTR2
                        isFieldsMatch = (iExInv['Supplier GSTIN'] == existingInv['ctin'] &&
                            iExInv['Original Debit Note Number'] == existingInv['ont_num'] &&
                            iExInv['Original Debit Note date'] == existingInv['ont_dt'] &&
                            iExInv['Revised Debit Note Number'] == existingInv['nt_num'] &&
                            iExInv['Revised Debit Note date'] == existingInv['nt_dt'] &&
                            iExInv['Note Type'] == existingInv['ntty'] &&
                            iExInv['Reason For Issuing Note'] == existingInv['rsn'] &&
                            (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            iExInv['Invoice date'] == existingInv['idt'] &&
                            iExInv['Total Invoice Value'] == existingInv['val']);

                        break;
                    case 'imp_g': // GSTR2
                        isFieldsMatch = (iExInv['Bill Of Entry Number'] == existingInv['boe_num'] &&
                            iExInv['Bill Of Entry Date'] == existingInv['boe_dt'] &&
                            iExInv['Port Code'] == existingInv['port_code'] &&
                            iExInv['Bill Of Entry Value'] == existingInv['boe_val']);
                        break;
                    case 'imp_ga': // GSTR2
                        isFieldsMatch = (iExInv['Original Bill Of Entry Number'] == existingInv['oboe_num'] &&
                            iExInv['Original Bill Of Entry date'] == existingInv['oboe_dt'] &&
                            iExInv['Revised Bill Of Entry Number'] == existingInv['boe_num'] &&
                            iExInv['Revised Bill Of Entry date'] == existingInv['boe_dt'] &&
                            iExInv['Port Code'] == existingInv['port_code'] &&
                            iExInv['Total Invoice Value'] == existingInv['boe_val']);
                        break;
                    case 'imp_s': // GSTR2
                        var dateStr = "";
                        if (iExInv.hasOwnProperty('Invoice date'))
                            dateStr = iExInv['Invoice date'];
                        else
                            dateStr = iExInv['Invoice Date'];
                        isFieldsMatch = (
                            (iExInv['Invoice Number of Reg Recipient']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                            dateStr == existingInv['idt'] &&
                            iExInv['Place Of Supply'] == existingInv['pos'] &&
                            iExInv['Invoice Value'] == existingInv['ival']);
                        break;
                    case 'imp_sa': // GSTR2
                        isFieldsMatch = (
                            (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oi_num']).toLowerCase() &&
                            iExInv['Original Invoice date'] == existingInv['oi_dt'] &&
                            (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['i_num']).toLowerCase() &&
                            iExInv['Revised Invoice date'] == existingInv['i_dt'] &&
                            iExInv['Total Invoice Value'] == existingInv['i_val']);
                        break;
                    case 'txi': // GSTR2
                        isFieldsMatch = (iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Supply Type'] == existingInv['sply_ty']);

                        break;
                    case 'atxi': // GSTR2
                        isFieldsMatch = (iExInv['Recipient State Code'] == existingInv['state_cd'] &&
                            iExInv['Revised Supplier GSTIN'] == existingInv['cpty'] &&
                            iExInv['Original Supplier GSTIN'] == existingInv['ocpty'] &&
                            iExInv['Original Document Number'] == existingInv['odnum'] &&
                            iExInv['Type'] == existingInv['reg_type'] &&
                            iExInv['Original Document date'] == existingInv['otdt'] &&
                            iExInv['Revised Document Number'] == existingInv['dnum'] &&
                            iExInv['Revised Document date'] == existingInv['dt']);
                        break;
                    case 'hsn': // GSTR2
                        isFieldsMatch = (
                            iExInv['HSN'] == existingInv['hsn_sc'] &&
                            iExInv['Description'] == existingInv['desc']
                        );
                        break;
                    case 'itc_rvsl': // GSTR2
                        isFieldsMatch = true;
                        break;
                    case 'atadj': // GSTR2
                        isFieldsMatch = (iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                            iExInv['Supply Type'] == existingInv['sply_ty']);
                        break;
                    case 'nil': // GSTR2
                        isFieldsMatch = (
                            iExInv['Description'] == existingInv['sply_ty'] &&
                            iExInv['Nil Rated Supplies'] == existingInv['nil_amt'] &&
                            iExInv['Exempted (other than nil rated/non GST supply )'] == existingInv['expt_amt'] &&
                            iExInv['Non-GST supplies'] == existingInv['ngsup_amt']
                        );
                        break;
                }
            }

            return (isFieldsMatch);
        }

        //validate revised date with org date (should be greater)
        function validateLessShipOrInvDate(sbdtOrOdt, idtOrRevdt) {
            var dateFormat = "DD/MM/YYYY";
            var isValidShibBlDt = (moment(sbdtOrOdt, dateFormat).isBefore(moment(idtOrRevdt, dateFormat))) ? false : true;
            return isValidShibBlDt;

        }

        function validateLessThanInvDate(iExInv, iSecID, iForm) {
            var isValidSbdt;
            isValidSbdt = true;
            return isValidSbdt;
        }

      //To change date format dd-mmm-yy/yyyy to dd/mm/yy
        function getDateTime(datetoformat) {
            if (typeof (datetoformat) === "number") {

                var date = moment('1899-12-30').add(datetoformat, 'days');
                date = date.format('DD-MM-YYYY');
                datetoformat = date.split("-");
                var day = datetoformat[0];
                var month = datetoformat[1];
                var year = datetoformat[2];
                var mon;
                if (day && day.length < 2) {
                    day = "0" + day;
                }
                if (month == null || month == "") {
                    mon = "12"
                } else {
                    mon = month
                }
                if (year && year.length == 2) {
                    return day + "-" + mon + "-" + "20" + year;
                } else {
                    return day + "-" + mon + "-" + year;
                }
            }
            else {
                datetoformat = datetoformat.split("-");
                var day = datetoformat[0];
                var month = datetoformat[1];
                var year = datetoformat[2];
                var mon;
                if (day && day.length < 2) {
                    day = "0" + day;
                }
                switch (month) {
                    case "Jan":
                    case "jan":
                        mon = "01";
                        break;
                    case "Feb":
                    case "feb":
                        mon = "02";
                        break;
                    case "Mar":
                    case "mar":
                        mon = "03";
                        break;
                    case "Apr":
                    case "apr":
                        mon = "04";
                        break;
                    case "May":
                    case "may":
                        mon = "05";
                        break;
                    case "Jun":
                    case "jun":
                        mon = "06";
                        break;
                    case "Jul":
                    case "jul":
                        mon = "07";
                        break;
                    case "Aug":
                    case "aug":
                        mon = "08";
                        break;
                    case "Sep":
                    case 'sep':
                        mon = "09";
                        break;
                    case "Oct":
                    case "oct":
                        mon = "10";
                        break;
                    case "Nov":
                    case "nov":
                        mon = "11";
                        break;
                    default:
                        mon = "12";
                }
                // if (year && year.length == 2) {
                //     return day + "/" + mon + "/" + "20" + year;
                // } else {
                //     return day + "/" + mon + "/" + year;
                // }
                if (year && year.length == 2) {
                    return day + "-" + mon + "-" + "20" + year;
                } else {
                    return day + "-" + mon + "-" + year;
                }
            }
        }

        //validation of dates from excel
        function validateExcelDates(iExInv, iSecID, iForm, iMonthsList, iYearsList, transLan) {
            var isValidDt = false,
                isValidData = false;

            if (iForm === "GSTR1") {
                switch (iSecID) {
                    case 'b2b':
                        iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                        isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                        break;
                    case 'b2ba':
                        iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                        iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                        isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList));
                        break;
                    case 'b2cl':
                        iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                        isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                        break;
                    case 'b2cla':
                        iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                        iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                        isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList));
                        break;
                    case 'exp':
                        iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                        if (iExInv['Shipping Bill Date'])
                            iExInv['Shipping Bill Date'] = getDateTime(iExInv['Shipping Bill Date']);
                        isValidDt = (validateDate(iExInv['Invoice date'], iMonthsList) && validateDate(iExInv['Shipping Bill Date'], iMonthsList, true));
                        break;
                    case 'expa':
                        iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                        iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                        if (iExInv['Shipping Bill Date'])
                            iExInv['Shipping Bill Date'] = getDateTime(iExInv['Shipping Bill Date']);
                        isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList) && validateDate(iExInv['Shipping Bill Date'], iMonthsList, true));
                        break;
                    case 'cdnr':
                        iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE]);

                        isValidDt = validateDate(iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE], iMonthsList);
                        break;
                    case 'cdnra':
                        iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]);
                        iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE])
                        isValidDt = (validateDate(iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], iMonthsList) && validateDate(iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], iMonthsList));
                        break;
                    case 'cdnura':
                        iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]);
                        iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]);

                        isValidDt = (validateDate(iExInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], iMonthsList) && validateDate(iExInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], iMonthsList));

                        break;
                    case 'cdnur':
                        iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE]);

                        isValidDt = validateDate(iExInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE], iMonthsList);
                        break;
                    case 'b2cs':
                    case 'at':
                    case 'atadj':
                        isValidDt = true
                        break;
                    case 'b2csa':
                    case 'ata':
                    case 'atadja':
                        var curntYear = iExInv['Financial Year'],
                            curntMonth = iExInv['Original Month'];
                        isValidDt = isValidRtnPeriod(iYearsList, curntYear, curntMonth).isValidPeriod;
                        break;
                   
                    case 'hsn(b2b)':
                    case 'hsn(b2c)':
                        var HSN_BIFURCATION_START_DATE = "052025";
                        var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                        if (showHSNTabs) {
                            isValidDt = true;
                        }
                        break;
                    case 'hsn':
                    case 'nil':
                    case 'doc_issue':
                        isValidDt = true;
                        break;
                    case 'supeco': 
                    case 'ecomb2c':  
                    case 'ecomab2c':  
                    case 'ecomurp2c':
                    case 'ecomaurp2c':
                        isValidDt = true;
                        break;
                    case 'ecomb2b':
                    case 'ecomurp2b':
                        iExInv['Document Date'] = getDateTime(iExInv['Document Date']);
                        isValidDt = validateDate(iExInv['Document Date'], iMonthsList);
                        break;
                    case 'ecomab2b':
                    case 'ecomaurp2b':
                        iExInv['Revised Document Date'] = getDateTime(iExInv['Revised Document Date']);
                        iExInv['Original Document Date'] = getDateTime(iExInv['Original Document Date']);
                        isValidDt = (validateDate(iExInv['Revised Document Date'], iMonthsList)
                        && validateDate(iExInv['Original Document Date'], iMonthsList));
                        break;
                    case 'supecoa':
                        var curntYear = iExInv['Financial Year'],
                            curntMonth = iExInv['Original Month/Quarter'];
                        isValidDt = isValidRtnPeriod(iYearsList, curntYear, curntMonth).isValidPeriod;
                        break;

                }
            } else if (iForm === "GSTR2") {
                switch (iSecID) {
                    case 'b2b':
                        iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                        isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                        break;
                    case 'b2bur':
                        iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                        isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                        break;
                    case 'b2ba':
                    case 'b2bura':
                        iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                        iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                        isValidDt = validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList);
                        break;

                    case 'cdnr':
                        iExInv['Invoice/Advance Payment Voucher date'] = getDateTime(iExInv['Invoice/Advance Payment Voucher date']);
                        iExInv['Note/Refund Voucher date'] = getDateTime(iExInv['Note/Refund Voucher date']);
                        if (iExInv['Pre GST'] == 'Y') {

                            isValidDt = (!validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList)) && (validateDate(iExInv['Note/Refund Voucher date'], iMonthsList));
                        } else {
                            isValidDt = validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList) && validateDate(iExInv['Note/Refund Voucher date'], iMonthsList);
                        }
                        break;
                    case 'cdnur':
                        iExInv['Invoice/Advance Payment Voucher date'] = getDateTime(iExInv['Invoice/Advance Payment Voucher date']);
                        iExInv['Note/Voucher date'] = getDateTime(iExInv['Note/Voucher date']);
                        if (iExInv['Pre GST'] == 'Y') {

                            isValidDt = (!validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList)) && (validateDate(iExInv['Note/Voucher date'], iMonthsList));
                        } else {
                            isValidDt = validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList) && validateDate(iExInv['Note/Voucher date'], iMonthsList);
                        }
                        break;
                    case 'cdnra':
                        iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                        iExInv['Revised Debit Note date'] = getDateTime(iExInv['Revised Debit Note date']);
                        iExInv['Original Debit Note date'] = getDateTime(iExInv['Original Debit Note date']);
                        isValidDt = validateDate(iExInv['Invoice date'], iMonthsList) && validateDate(iExInv['Original Debit Note date'], iMonthsList) && validateDate(iExInv['Revised Debit Note date'], iMonthsList);
                        break;
                    case 'imp_g':
                        iExInv['Bill Of Entry Date'] = getDateTime(iExInv['Bill Of Entry Date']);

                        isValidDt = validateDate(iExInv['Bill Of Entry Date'], iMonthsList);
                        break;
                    case 'imp_ga':
                        iExInv['Original Bill Of Entry date'] = getDateTime(iExInv['Original Bill Of Entry date']);
                        iExInv['Revised Bill Of Entry date'] = getDateTime(iExInv['Revised Bill Of Entry date']);

                        isValidDt = validateDate(iExInv['Original Bill Of Entry date'], iMonthsList) && validateDate(iExInv['Revised Bill Of Entry date'], iMonthsList);
                        break;
                    case 'imp_s':
                        if (iExInv.hasOwnProperty('Invoice date')) {
                            iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                            isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                        } else {
                            iExInv['Invoice Date'] = getDateTime(iExInv['Invoice Date']);
                            isValidDt = validateDate(iExInv['Invoice Date'], iMonthsList);
                        }
                        break;
                    case 'imp_sa':
                        iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                        iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                        isValidDt = validateDate(iExInv['Revised Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList);
                        break;
                    case 'txi':
                        iExInv['Document date'] = true;
                        isValidDt = true
                        break;
                    case 'atxi':
                        iExInv['Original Document date'] = getDateTime(iExInv['Original Document date']);
                        iExInv['Revised Document date'] = getDateTime(iExInv['Revised Document date']);

                        isValidDt = validateDate(iExInv['Original Document date'], iMonthsList) && validateDate(iExInv['Revised Document date'], iMonthsList);
                        break;
                    case 'atadj':
                        isValidDt = true
                    case 'itc_rvsl':
                    case 'hsnsum':
                    case 'nil':
                        isValidDt = true;
                        break;
                }
            }

            return (isValidDt);
        }

        //validate of excel data whtr correct section importing or not
        function validateExcelData(iExInv, iSecID, iForm, transLan) {
            var isValidDt = false,
                isValidData = false;
            if (iForm === "GSTR1") {
                switch (iSecID) {
                    case 'b2b':
                        isValidData = (
                            iExInv.hasOwnProperty('GSTIN/UIN of Recipient') &&
                            iExInv.hasOwnProperty('Invoice Number') &&
                            iExInv.hasOwnProperty('Invoice date') &&
                            iExInv.hasOwnProperty('Invoice Type') &&
                            iExInv.hasOwnProperty('Invoice Value') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Reverse Charge')
                        );
                        break;
                    case 'b2ba':
                        isValidData = (
                            iExInv.hasOwnProperty('Revised Invoice Number') &&
                            iExInv.hasOwnProperty('Revised Invoice date') &&
                            iExInv.hasOwnProperty('GSTIN/UIN of Recipient') &&
                            iExInv.hasOwnProperty('Original Invoice Number') &&
                            iExInv.hasOwnProperty('Original Invoice date') &&
                            iExInv.hasOwnProperty('Invoice Type') &&
                            iExInv.hasOwnProperty('Invoice Value') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Reverse Charge')
                        );
                        break;
                    case 'b2cl':
                        isValidData = (
                            iExInv.hasOwnProperty('Invoice Number') &&
                            iExInv.hasOwnProperty('Invoice date') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Invoice Value') &&
                            iExInv.hasOwnProperty('Place Of Supply')
                        );
                        break;
                    case 'b2cla':
                        isValidData = (
                            iExInv.hasOwnProperty('Original Invoice Number') &&
                            iExInv.hasOwnProperty('Original Invoice date') &&
                            iExInv.hasOwnProperty('Revised Invoice Number') &&
                            iExInv.hasOwnProperty('Revised Invoice date') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Invoice Value') &&
                            iExInv.hasOwnProperty('Original Place Of Supply')
                        );
                        break;
                    case 'at':
                        isValidData = (
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty("Gross Advance Received") &&
                            iExInv.hasOwnProperty("Cess Amount"));
                        break;
                    case 'ata':
                        isValidData = (
                            iExInv.hasOwnProperty('Financial Year') &&
                            iExInv.hasOwnProperty('Original Month') &&
                            iExInv.hasOwnProperty('Original Place Of Supply') &&
                            iExInv.hasOwnProperty("Gross Advance Received") ||
                            iExInv.hasOwnProperty("Cess Amount"));
                        break;
                        break;
                    case 'exp':
                        isValidData = (
                            iExInv.hasOwnProperty('Export Type') ||
                            iExInv.hasOwnProperty('Shipping Bill Number') ||
                            iExInv.hasOwnProperty('Shipping Bill Date') ||
                            iExInv.hasOwnProperty('Port Code') &&
                            iExInv.hasOwnProperty('Invoice Number') &&
                            iExInv.hasOwnProperty('Invoice date') &&
                            iExInv.hasOwnProperty('Invoice Value'));
                        break;

                    case 'expa':
                        isValidData = (
                            iExInv.hasOwnProperty('Export Type') ||
                            iExInv.hasOwnProperty('Shipping Bill Number') ||
                            iExInv.hasOwnProperty('Shipping Bill Date') ||
                            iExInv.hasOwnProperty('Port Code') &&
                            iExInv.hasOwnProperty('Revised Invoice Number') &&
                            iExInv.hasOwnProperty('Revised Invoice date') &&
                            iExInv.hasOwnProperty('Original Invoice Number') &&
                            iExInv.hasOwnProperty('Original Invoice date') &&
                            iExInv.hasOwnProperty('Invoice Value'));
                        break;
                    case 'cdnr':
                        isValidData = (
                            iExInv.hasOwnProperty(transLan.LBL_GSTIN_UIN_RECIPIENT) &&
                            iExInv.hasOwnProperty(transLan.LBL_DEBIT_CREDIT_NOTE_NO) &&
                            iExInv.hasOwnProperty(transLan.LBL_DEBIT_CREDIT_NOTE_DATE) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_TYP) &&
                            iExInv.hasOwnProperty(transLan.LBL_POS_Excel) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_VAL_Excel) &&
                            iExInv.hasOwnProperty(transLan.LBL_NT_SPLY_TY) &&
                            iExInv.hasOwnProperty(transLan.LBL_Taxable_Value));
                        break;
                    case 'cdnur':
                        //changes for delinking start
                        isValidData = (
                            iExInv.hasOwnProperty(transLan.LBL_DEBIT_CREDIT_NOTE_NO) &&
                            iExInv.hasOwnProperty(transLan.LBL_DEBIT_CREDIT_NOTE_DATE) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_TYP) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_VAL_Excel) &&
                            (iExInv[transLan.LBL_NOTE_VAL_Excel] || iExInv[transLan.LBL_NOTE_VAL_Excel] == 0) &&
                            iExInv.hasOwnProperty(transLan.LBL_POS_Excel) &&
                            iExInv.hasOwnProperty(transLan.LBL_UR_TYPE) &&
                            iExInv.hasOwnProperty(transLan.LBL_Taxable_Value));
                        //changes for delinking end
                        break;
                    case 'cdnra':
                        isValidData = (
                            iExInv.hasOwnProperty(transLan.LBL_GSTIN_UIN_RECIPIENT) &&
                            iExInv.hasOwnProperty(transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO) &&
                            iExInv.hasOwnProperty(transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE) &&
                            iExInv.hasOwnProperty(transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO) &&
                            iExInv.hasOwnProperty(transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_TYP) &&
                            iExInv.hasOwnProperty(transLan.LBL_POS_Excel) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_VAL_Excel) &&
                            iExInv.hasOwnProperty(transLan.LBL_NT_SPLY_TY) &&
                            iExInv.hasOwnProperty(transLan.LBL_Taxable_Value));
                        break;
                    case 'cdnura':
                        isValidData = (
                            iExInv.hasOwnProperty(transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO) &&
                            iExInv.hasOwnProperty(transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE) &&
                            iExInv.hasOwnProperty(transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO) &&
                            iExInv.hasOwnProperty(transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_TYP) &&
                            iExInv.hasOwnProperty(transLan.LBL_NOTE_VAL_Excel) &&
                            (iExInv[transLan.LBL_NOTE_VAL_Excel] || iExInv[transLan.LBL_NOTE_VAL_Excel] == 0) &&
                            iExInv.hasOwnProperty(transLan.LBL_UR_TYPE) &&
                            iExInv.hasOwnProperty(transLan.LBL_POS_Excel) &&
                            iExInv.hasOwnProperty(transLan.LBL_Taxable_Value));
                        break;
                    case 'b2cs':
                        isValidData = (
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Type'));
                        break;
                    case 'b2csa':
                        isValidData = (
                            iExInv.hasOwnProperty('Financial Year') &&
                            iExInv.hasOwnProperty('Original Month') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Type'));
                        break;
                    case 'atadj':
                        isValidData = (
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty("Gross Advance Adjusted") &&
                            iExInv.hasOwnProperty("Cess Amount"));
                        break;
                    case 'atadja':
                        isValidData = (
                            iExInv.hasOwnProperty('Financial Year') &&
                            iExInv.hasOwnProperty('Original Month') &&
                            iExInv.hasOwnProperty('Original Place Of Supply') &&
                            iExInv.hasOwnProperty("Gross Advance Adjusted") ||
                            iExInv.hasOwnProperty("Cess Amount"));
                        break;
                    case 'hsn':
                        if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {

                            isValidData = (
                                (
                                    (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                                    ||
                                    (iExInv.hasOwnProperty('Description') && iExInv['Description'] != '')
                                )
                                &&
                                iExInv.hasOwnProperty('UQC') &&
                                iExInv.hasOwnProperty('Total Quantity') &&
                                iExInv.hasOwnProperty('Rate') &&
                                iExInv.hasOwnProperty('Taxable Value'));
                        }
                        else {
                            isValidData = (
                                (
                                    (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                                    ||
                                    (iExInv.hasOwnProperty('Description') && iExInv['Description'] != '')
                                )
                                &&
                                iExInv.hasOwnProperty('UQC') &&
                                iExInv.hasOwnProperty('Total Quantity') &&
                                iExInv.hasOwnProperty('Total Value') &&
                                iExInv.hasOwnProperty('Taxable Value'));
                        }
                        break;
                        case 'hsn(b2b)':
                            var HSN_BIFURCATION_START_DATE = "052025";
                            var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                            if(showHSNTabs){
                            isValidData = (
                                (
                                    (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                                    ||
                                    (iExInv.hasOwnProperty('Description as per HSN Code') && iExInv['Description as per HSN Code'] != '')
                                )
                                &&
                                iExInv.hasOwnProperty('UQC') &&
                                iExInv.hasOwnProperty('Total Quantity') &&
                                iExInv.hasOwnProperty('Total Value') &&
                                iExInv.hasOwnProperty('Taxable Value'));
                            }
                                break;
                      case 'hsn(b2c)':
                        var HSN_BIFURCATION_START_DATE = "052025";
                        var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                        if(showHSNTabs){
                                    isValidData = (
                                        (
                                            (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                                            ||
                                            (iExInv.hasOwnProperty('Description as per HSN Code') && iExInv['Description as per HSN Code'] != '')
                                        )
                                        &&
                                        iExInv.hasOwnProperty('UQC') &&
                                        iExInv.hasOwnProperty('Total Quantity') &&
                                        iExInv.hasOwnProperty('Total Value') &&
                                        iExInv.hasOwnProperty('Taxable Value'));
                        }
                                        break;
                    case 'nil':
                        isValidData = (
                            iExInv.hasOwnProperty("Description") &&
                            iExInv.hasOwnProperty("Nil Rated Supplies") &&
                            iExInv.hasOwnProperty("Exempted(other than nil rated/non GST supply)") &&
                            iExInv.hasOwnProperty("Non-GST Supplies")
                        );
                        break;
                    case 'doc_issue':
                        isValidData = (
                            iExInv.hasOwnProperty('Nature of Document') &&
                            iExInv.hasOwnProperty("Sr. No. From") &&
                            iExInv.hasOwnProperty("Sr. No. To") &&
                            iExInv.hasOwnProperty("Total Number") &&
                            iExInv.hasOwnProperty("Cancelled")
                        );

                        break;
                    case 'supeco':
                        isValidData = (
                            iExInv.hasOwnProperty('Nature of Supply') &&
                            iExInv.hasOwnProperty("GSTIN of E-Commerce Operator") &&
                            iExInv.hasOwnProperty("E-Commerce Operator Name") &&
                            iExInv.hasOwnProperty("Net value of supplies") 
                        );
                        break;
                    case 'supecoa':
                        isValidData = (
                            iExInv.hasOwnProperty('Nature of Supply') &&
                            iExInv.hasOwnProperty("Revised GSTIN of E-Commerce Operator") &&
                            iExInv.hasOwnProperty("E-Commerce Operator Name") &&
                            iExInv.hasOwnProperty("Revised Net value of supplies") 
                        );
                        break;
                    case 'ecomb2b':
                        isValidData = (
                            iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                            iExInv.hasOwnProperty('Supplier Name') &&
                            iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                            iExInv.hasOwnProperty('Recipient Name') &&
                            iExInv.hasOwnProperty('Document Number') &&
                            iExInv.hasOwnProperty('Document Date') &&
                            iExInv.hasOwnProperty('Value of supplies made') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Document type') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;
                        case 'ecomab2b':
                            isValidData = (
                                iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                                iExInv.hasOwnProperty('Supplier Name') &&
                                iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                                iExInv.hasOwnProperty('Recipient Name') &&
                                iExInv.hasOwnProperty('Original Document Number') &&
                                iExInv.hasOwnProperty('Original Document Date') &&
                                iExInv.hasOwnProperty('Revised Document Number') &&
                                iExInv.hasOwnProperty('Revised Document Date') &&
                                iExInv.hasOwnProperty('Value of supplies made') &&
                                iExInv.hasOwnProperty('Place Of Supply') &&
                                iExInv.hasOwnProperty('Document type') &&
                                iExInv.hasOwnProperty('Rate') &&
                                iExInv.hasOwnProperty('Taxable Value') &&
                                iExInv.hasOwnProperty('Cess Amount') 
                            );
                            break;
                    case 'ecomb2c':
                        isValidData = (
                            iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                            iExInv.hasOwnProperty('Supplier Name') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;
                    case 'ecomab2c':
                        isValidData = (
                            iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                            iExInv.hasOwnProperty('Supplier Name') &&
                            iExInv.hasOwnProperty('Original Month') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;
                    case 'ecomurp2b':
                        isValidData = (
                            iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                            iExInv.hasOwnProperty('Recipient Name') &&
                            iExInv.hasOwnProperty('Document Number') &&
                            iExInv.hasOwnProperty('Document Date') &&
                            iExInv.hasOwnProperty('Value of supplies made') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Document type') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;
                    case 'ecomaurp2b':
                        isValidData = (
                            iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                            iExInv.hasOwnProperty('Recipient Name') &&
                            iExInv.hasOwnProperty('Original Document Number') &&
                            iExInv.hasOwnProperty('Original Document Date') &&
                            iExInv.hasOwnProperty('Revised Document Number') &&
                            iExInv.hasOwnProperty('Revised Document Date') &&
                            iExInv.hasOwnProperty('Value of supplies made') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Document type') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;
                    case 'ecomurp2c':
                        isValidData = (
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;
                    case 'ecomaurp2c':
                        isValidData = (
							iExInv.hasOwnProperty('Financial Year') &&
                            iExInv.hasOwnProperty('Original Month') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value') &&
                            iExInv.hasOwnProperty('Cess Amount') 
                        );
                        break;

                }
            } else if (iForm === "GSTR2") {
                switch (iSecID) {
                    case 'b2b': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('GSTIN of Supplier') &&
                            iExInv.hasOwnProperty('Invoice Number') &&
                            iExInv.hasOwnProperty('Invoice date') &&
                            iExInv.hasOwnProperty('Invoice Value') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Reverse Charge')
                        );
                        break;
                    case 'b2bur': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('Invoice Number') &&
                            iExInv.hasOwnProperty('Invoice date') &&
                            iExInv.hasOwnProperty('Invoice Value') &&
                            iExInv.hasOwnProperty('Supply Type') &&
                            iExInv.hasOwnProperty('Place Of Supply')
                        );
                        break;
                    case 'b2ba': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('Supplier GSTIN') &&
                            iExInv.hasOwnProperty('Original Invoice Number') &&
                            iExInv.hasOwnProperty('Original Invoice date') &&
                            iExInv.hasOwnProperty('Revised Invoice Number') &&
                            iExInv.hasOwnProperty('Revised Invoice date') &&
                            iExInv.hasOwnProperty('Total Invoice Value') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Reverse Charge')
                        );
                        break;
                    case 'b2bura': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Supplier Name') &&
                            iExInv.hasOwnProperty('Original Invoice Number') &&
                            iExInv.hasOwnProperty('Original Invoice date') &&
                            iExInv.hasOwnProperty('Revised Invoice Number') &&
                            iExInv.hasOwnProperty('Revised Invoice date') &&
                            iExInv.hasOwnProperty('Total Invoice Value') &&
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Reverse Charge')
                        );
                        break;
                    case 'cdnr': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('GSTIN of Supplier') &&
                            iExInv.hasOwnProperty('Note/Refund Voucher Number') &&
                            iExInv.hasOwnProperty('Note/Refund Voucher date') &&
                            iExInv.hasOwnProperty('Document Type') &&
                            iExInv.hasOwnProperty('Supply Type') &&
                            iExInv.hasOwnProperty('Reason For Issuing document') &&
                            iExInv.hasOwnProperty('Invoice/Advance Payment Voucher Number') &&
                            iExInv.hasOwnProperty('Invoice/Advance Payment Voucher date') &&
                            iExInv.hasOwnProperty('Pre GST') &&
                            iExInv.hasOwnProperty('Taxable Value')
                        );
                        break;
                    case 'cdnur': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('Note/Voucher Number') &&
                            iExInv.hasOwnProperty('Note/Voucher date') &&
                            iExInv.hasOwnProperty('Document Type') &&
                            iExInv.hasOwnProperty('Reason For Issuing document') &&
                            iExInv.hasOwnProperty('Invoice/Advance Payment Voucher number') &&
                            iExInv.hasOwnProperty('Invoice/Advance Payment Voucher date') &&
                            iExInv.hasOwnProperty('Pre GST') &&
                            iExInv.hasOwnProperty('Invoice Type') &&
                            iExInv.hasOwnProperty('Taxable Value')
                        );
                        break;
                    case 'cdnra': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Supplier GSTIN') &&
                            iExInv.hasOwnProperty('Original Debit Note Number') &&
                            iExInv.hasOwnProperty('Original Debit Note date') &&
                            iExInv.hasOwnProperty('Revised Debit Note Number') &&
                            iExInv.hasOwnProperty('Revised Debit Note date') &&
                            iExInv.hasOwnProperty('Note Type') &&
                            iExInv.hasOwnProperty('Reason For Issuing Note') &&
                            iExInv.hasOwnProperty('Invoice Number') &&
                            iExInv.hasOwnProperty('Invoice date') &&
                            iExInv.hasOwnProperty('Total Invoice Value'));
                        break;
                    case 'imp_g': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Document type') &&
                            iExInv.hasOwnProperty('Port Code') &&
                            iExInv.hasOwnProperty('Bill Of Entry Number') &&
                            iExInv.hasOwnProperty('Bill Of Entry Date') &&
                            iExInv.hasOwnProperty('Bill Of Entry Value'));
                        break;
                    case 'imp_ga': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Port Code') &&
                            iExInv.hasOwnProperty('Original Bill Of Entry Number') &&
                            iExInv.hasOwnProperty('Original Bill Of Entry date') &&
                            iExInv.hasOwnProperty('Revised Bill Of Entry Number') &&
                            iExInv.hasOwnProperty('Revised Bill Of Entry date') &&
                            iExInv.hasOwnProperty('Total Invoice Value'));
                        break;
                    case 'imp_s': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Invoice Number of Reg Recipient') &&
                            (iExInv.hasOwnProperty('Invoice date') || iExInv.hasOwnProperty('Invoice Date')) &&//there is a mismatch between the excel template and then export excel template
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty('Invoice Value'));
                        break;
                    case 'imp_sa': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Original Invoice Number') &&
                            iExInv.hasOwnProperty('Original Invoice date') &&
                            iExInv.hasOwnProperty('Revised Invoice Number') &&
                            iExInv.hasOwnProperty('Revised Invoice date') &&
                            iExInv.hasOwnProperty('Total Invoice Value'));
                        break;
                    case 'txi': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty("Gross Advance Paid") &&
                            iExInv.hasOwnProperty("Cess Amount") &&
                            iExInv.hasOwnProperty("Supply Type"));
                        break;
                    case 'atxi': // GSTR2

                        isValidData = (
                            iExInv.hasOwnProperty('Recipient State Code') &&
                            iExInv.hasOwnProperty('Revised Supplier GSTIN') &&
                            iExInv.hasOwnProperty('Original Supplier GSTIN') &&
                            iExInv.hasOwnProperty('Original Document Number') &&
                            iExInv.hasOwnProperty('Original Document date') &&
                            iExInv.hasOwnProperty('Revised Document Number') &&
                            iExInv.hasOwnProperty('Revised Document date'));
                        break;
                    case 'hsnsum': // GSTR2
                        isValidData = (
                            (
                                (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                                ||
                                (iExInv.hasOwnProperty('Description') && iExInv['Description'] != '')
                            )
                            &&
                            iExInv.hasOwnProperty('UQC') &&
                            iExInv.hasOwnProperty('Total Quantity') &&
                            iExInv.hasOwnProperty('Total Value') &&
                            iExInv.hasOwnProperty('Taxable Value'));

                        break;
                    case 'itc_rvsl': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('Description for reversal of ITC'));

                        break;
                    case 'atadj': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('Place Of Supply') &&
                            iExInv.hasOwnProperty("Gross Advance Paid to be Adjusted") &&
                            iExInv.hasOwnProperty("Cess Adjusted") &&
                            iExInv.hasOwnProperty("Supply Type"));
                        break;
                    case 'nil': // GSTR2
                        isValidData = (
                            iExInv.hasOwnProperty('Description') &&
                            iExInv.hasOwnProperty("Nil Rated Supplies") &&
                            iExInv.hasOwnProperty("Exempted (other than nil rated/non GST supply )") &&
                            iExInv.hasOwnProperty("Non-GST supplies")
                        );

                        break;

                }
            }

            return (isValidData);
        }

        //To check mandatory fields n regex patterns for fields from excel
        function validatePattern(iString, isMandatory, iPattern, isPos) {
            var isValid = false;
            if (iString != null && iString !== "") {
                isValid = isMandatory ? true : true;
                if (iPattern) {
                    var patt = new RegExp(iPattern),
                        isPatternValid = false;
                    isPatternValid = patt.test(iString);

                    isValid = isValid && isPatternValid ? true : false;
                }
                if (isPos) {
                    var pos0to38 = (parseInt(iString) >= 1 && parseInt(iString) <= 38),
                        pos97 = (parseInt(iString) == 97), pos96 = (parseInt(iString) == 96);
                    isValid = (pos0to38 || pos97 || pos96) ? true : false;

                }
            } else {
                isValid = isMandatory ? false : true;
            }
            return isValid;
        }

        //To check all negative or all positive for Supeco and Supecoa
        function validateAllNegorAllPosPattern(suppval, igst, cgst, sgst, cess) {
            var isValid = true;
                if(suppval > 0 && (igst < 0 || cgst < 0 || sgst < 0 || cess < 0)){
                    //$scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    isValid = false;
                } else if (suppval < 0 && (igst > 0 || cgst > 0 || sgst > 0 || cess > 0)){
                    isValid = false;
                } else if (!validateCgstSgstEqual(cgst,sgst)){
                    isValid = false;
                }
            return isValid;
        }

        function validateCgstSgstEqual(cgst,sgst) {
            var isValid = true;
                if ( cgst != sgst){
                    isValid = false;
                }
            return isValid;
        }

        //To chck value in b2cl >=250000 or not from excel
        function isValidTotalInvValue(val, b2clVal) {
            return (val > b2clVal) ? true : false
        }


        //To check itc this month values greater than Earlier

        function validateItcValues(prvAmt, curntAmt) {
            if (prvAmt && curntAmt) {
                return (parseFloat(curntAmt) <= parseFloat(prvAmt)) ? true : false;
            }
        }

        //To validate GSTIN/UIN
        function validateGSTIN(gstin, iForm) {
            var validGstin = false;
            if (iForm == 'GSTR1')
                validGstin = validations.gstin(gstin) || validations.uin(gstin) || validations.tdsid(gstin) || validations.nrtp(gstin);
            else
                validGstin = validations.gstin(gstin);

            return validGstin;

        }
        //To check for POS in case of UR Type 'EXPWP' and 'EXPWOP' CDNUR/RA
        function validatePOSwithURType(iInv, transLan) {
            if ((iInv[transLan.LBL_UR_TYPE] == "EXPWOP") || (iInv[transLan.LBL_UR_TYPE] == "EXPWP")) {
                return (!iInv[transLan.LBL_POS_Excel]) ? true : false;
            }

        }
        //To check for Diff % in case of UR Type 'EXPWP' and 'EXPWOP' CDNUR/RA
        function validateDiffPerwithURType(iInv, transLan) {
            if ((iInv[transLan.LBL_UR_TYPE] == "EXPWOP") || (iInv[transLan.LBL_UR_TYPE] == "EXPWP")) {
                return (!iInv[transLan.LBL_Diff_Percentage] || iInv[transLan.LBL_Diff_Percentage] == 100.00) ? true : false;
            }
        }
        //To check if supplier state code and POS are same
        function validatePOSWithSupStCode(iInv, transLan, supplier_gstin) {
            let supStCode = supplier_gstin.substring(0, 2); // get supplier state code from supplier gstin
            if ((iInv[transLan.LBL_UR_TYPE] !== "EXPWOP") && (iInv[transLan.LBL_UR_TYPE] !== "EXPWP")) {
                if ((iInv[transLan.LBL_POS_Excel] != null) || (iInv[transLan.LBL_POS_Excel] != undefined)) {
                    return ((iInv[transLan.LBL_POS_Excel].substring(0, 2)) !== supStCode) ? true : false;
                }
            } else {
                return true;
            }
        }
        //To check if note supply type is valid
        function validateNoteSupplyType(iInv, transLan, iSecId) {
            let evaluateType;
            if (iSecId == 'cdnr' || iSecId == 'cdnra')
                evaluateType = getNoteSupplyType(iSecId, iInv[transLan.LBL_NT_SPLY_TY]);
            else
                evaluateType = getNoteSupplyType(iSecId, iInv[transLan.LBL_INVOICE_TYPE]);

            if (evaluateType == "CBW")
                return (iInv[transLan.LBL_RECHRG] == "Y") ? true : false;
            else if (evaluateType == "Warning")
                return false;
            else if (evaluateType == "DE")
                return (iInv[transLan.LBL_RECHRG] == "Y") ? false : true;
            else
                return true;
        }

        //To check mandatory fields n regex patterns for fields from excel
        function validateExcelMandatoryFields(iInv, iSecId, iForm, transLan, supplier_gstin, b2clLimit) {
            var isPttnMthced = false;
            if (iForm == "GSTR1") {
                switch (iSecId) {
                    case 'b2b':
                        var isInvTypeValid = validateNoteSupplyType(iInv, transLan, iSecId);
                        if (!iInv['Reverse Charge']) {
                            iInv['Reverse Charge'] = 'N';
                        }
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100;
                        }
                        if (iInv['Invoice Type'] != 'Regular B2B' && (iInv['E-Commerce GSTIN'])) {
                            isPttnMthced = false;
                        } else {
                            isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Invoice date']) &&
                                validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                validatePattern(iInv['Invoice Type'], true, null) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                                validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                                validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                                validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                                validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                                (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                isInvTypeValid
                                //                           
                            );
                        }
                        break;
                    case 'b2ba':
                        var isInvTypeValid = validateNoteSupplyType(iInv, transLan, iSecId);
                        if (!iInv['Reverse Charge']) {
                            iInv['Reverse Charge'] = 'N';
                        }
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        isPttnMthced = (validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                            validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                            validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                            validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                            ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                            validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            validatePattern(iInv['Revised Invoice date'], true, null) &&
                            validatePattern(iInv['Original Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Revised Invoice date']) &&
                            isValidDateFormat(iInv['Original Invoice date']) &&
                            validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Invoice Type'], true, null) &&
                            validatePattern(iInv['Taxable Value'], true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                            (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                            isInvTypeValid
                        );
                        break;
                    case 'b2cl':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        isPttnMthced = (
                            validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Invoice date']) &&
                            validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            isValidTotalInvValue(iInv['Invoice Value'], b2clLimit) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                            (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                        );
                        break;
                    case 'b2cla':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        isPttnMthced = (
                            validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                            ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                            validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Revised Invoice date'], true, null) &&
                            validatePattern(iInv['Original Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Original Invoice date']) &&
                            isValidDateFormat(iInv['Revised Invoice date']) &&
                            validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            isValidTotalInvValue(iInv['Invoice Value'], b2clLimit) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                        );
                        break;
                    case 'b2cs':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        var isRequired = (iInv['Type'] && iInv['Type'] == "E") ? true : false,
                            isERecord = false;

                        if (isRequired) {
                            isERecord = validatePattern(iInv['E-Commerce GSTIN'], isRequired, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/);

                        }
                        else {

                            if (!(iInv['E-Commerce GSTIN'])) {
                                isERecord = true;
                            }
                        }

                        isPttnMthced = (
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(iInv['Type'], true, /^(OE)$/) && isERecord &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );

                        break;
                    case 'b2csa':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        var isRequired = (iInv['Type'] && iInv['Type'] == "E") ? true : false,
                            isERecord = false;

                        if (isRequired) {
                            isERecord = validatePattern(iInv['E-Commerce GSTIN'], isRequired, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/);

                        }
                        else {

                            if (!(iInv['E-Commerce GSTIN'])) {
                                isERecord = true;
                            }
                        }

                        isPttnMthced = (
                            validatePattern(iInv['Financial Year'], true, yearPattern) &&
                            validatePattern(iInv['Original Month'], true, monthPattern) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Type'], true, /^(OE)$/) &&
                            isERecord &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                    case 'cdnr':
                        var isNtsplyValid = validateNoteSupplyType(iInv, transLan, iSecId);
                        if (!iInv[transLan.LBL_Diff_Percentage]) {
                            iInv[transLan.LBL_Diff_Percentage] = 100.00;
                        }
                        isPttnMthced = (
                            isValidDateFormat(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE]) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_Taxable_Value]), true, validations.taxableVal) &&
                            validatePattern(iInv[transLan.LBL_NOTE_TYP], true, validations.noteType) &&
                            validateGSTIN(iInv[transLan.LBL_GSTIN_UIN_RECIPIENT], iForm) &&
                            validatePattern(iInv[transLan.LBL_GSTIN_UIN_RECIPIENT], true, null) &&
                            validatePattern(iInv[transLan.LBL_RECEIVER_NAME], false, validations.tName) &&
                            ((Number(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_NO], true, validations.InvNoteNumber) &&
                            validatePattern(iInv[transLan.LBL_Diff_Percentage], true, validations.diffPercentage) &&
                            validatePattern(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                            validatePattern(iInv[transLan.LBL_POS_Excel], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_NOTE_VAL_Excel]), true, validations.InvNoteValue) &&
                            ((Number(iInv[transLan.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                            ((Number(iInv[transLan.LBL_Cess_Amount]) >= 0) ? true : false) &&
                            ((Number(iInv[transLan.LBL_Taxable_Value]) > 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_Rate], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_Cess_Amount]), false, validations.cessAmount) &&
                            validatePattern(iInv[transLan.LBL_RECHRG], true, validations.reverseChrge) &&
                            validatePattern(iInv[transLan.LBL_NT_SPLY_TY], true, null) &&
                            isNtsplyValid
                        );
                        break;
                    case 'cdnur':
                        if (!iInv[transLan.LBL_Diff_Percentage]) {
                            iInv[transLan.LBL_Diff_Percentage] = 100.00;
                        }
                        var isRequired = false;
                        var isValidPosStCd = validatePOSWithSupStCode(iInv, transLan, supplier_gstin);
                        if ((iInv[transLan.LBL_UR_TYPE] == "EXPWOP") || (iInv[transLan.LBL_UR_TYPE] == "EXPWP")) {
                            if (!iInv[transLan.LBL_POS_Excel] && iInv[transLan.LBL_Diff_Percentage] == 100.00)
                                isRequired = true;
                        } else {
                            isRequired = validatePattern(iInv[transLan.LBL_POS_Excel], true, null, true)
                        }
                        // changes for delinking  start
                        isPttnMthced = (
                            isValidDateFormat(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE]) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_Taxable_Value]), true, validations.taxableVal) &&
                            validatePattern(iInv[transLan.LBL_NOTE_TYP], true, validations.noteType) &&
                            validatePattern(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_NO], true, validations.InvNoteNumber) &&
                            ((Number(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_Diff_Percentage], true, validations.diffPercentage) &&
                            validatePattern(iInv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_NOTE_VAL_Excel]), true, validations.InvNoteValue) &&
                            ((Number(iInv[transLan.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                            ((Number(iInv[transLan.LBL_Cess_Amount]) >= 0) ? true : false) &&
                            ((Number(iInv[transLan.LBL_Taxable_Value]) > 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_UR_TYPE], true, validations.urType) &&
                            isRequired &&
                            validatePattern(iInv[transLan.LBL_Rate], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_Cess_Amount]), false, validations.cessAmount) &&
                            isValidPosStCd
                        );
                        //changes for delinking end
                        break;
                    case 'cdnra':
                        var isNtsplyValid = validateNoteSupplyType(iInv, transLan, iSecId);
                        if (!iInv[transLan.LBL_Diff_Percentage]) {
                            iInv[transLan.LBL_Diff_Percentage] = 100.00;
                        }
                        isPttnMthced =
                            (isValidDateFormat(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]) &&
                                isValidDateFormat(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]) &&
                                validatePattern(cnvt2Nm(iInv[transLan.LBL_Taxable_Value]), true, validations.taxableVal) &&
                                validatePattern(iInv[transLan.LBL_NOTE_TYP], true, validations.noteType) &&
                                validateGSTIN(iInv[transLan.LBL_GSTIN_UIN_RECIPIENT], iForm) &&
                                validatePattern(iInv[transLan.LBL_Diff_Percentage], true, validations.diffPercentage) &&
                                validatePattern(iInv[transLan.LBL_GSTIN_UIN_RECIPIENT], true, null) &&
                                validatePattern(iInv[transLan.LBL_RECEIVER_NAME], false, validations.tName) &&
                                ((Number(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                                ((Number(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                                validatePattern(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO], true, validations.InvNoteNumber) &&
                                validatePattern(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                                validatePattern(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO], true, validations.InvNoteNumber) &&
                                validatePattern(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                                validatePattern(iInv[transLan.LBL_POS_Excel], true, null, true) &&
                                validatePattern(cnvt2Nm(iInv[transLan.LBL_NOTE_VAL_Excel]), true, validations.InvNoteValue) &&
                                ((Number(iInv[transLan.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                                ((Number(iInv[transLan.LBL_Cess_Amount]) >= 0) ? true : false) &&
                                ((Number(iInv[transLan.LBL_Taxable_Value]) > 0) ? true : false) &&
                                validatePattern(iInv[transLan.LBL_Rate], true, validations.rates) &&
                                validatePattern(cnvt2Nm(iInv[transLan.LBL_Cess_Amount]), false, validations.cessAmount) &&
                                validatePattern(iInv[transLan.LBL_RECHRG], true, validations.reverseChrge) &&
                                validatePattern(iInv[transLan.LBL_NT_SPLY_TY], true, null) &&
                                isNtsplyValid
                            );
                        break;
                    case 'cdnura':
                        if (!iInv[transLan.LBL_Diff_Percentage]) {
                            iInv[transLan.LBL_Diff_Percentage] = 100.00;
                        }
                        var isRequired = false;
                        var isValidPosStCd = validatePOSWithSupStCode(iInv, transLan, supplier_gstin);
                        if ((iInv[transLan.LBL_UR_TYPE] == "EXPWOP") || (iInv[transLan.LBL_UR_TYPE] == "EXPWP")) {
                            if (!iInv[transLan.LBL_POS_Excel] && iInv[transLan.LBL_Diff_Percentage] == 100.00)
                                isRequired = true;
                        } else {
                            isRequired = validatePattern(iInv[transLan.LBL_POS_Excel], true, null, true)
                        }
                        isPttnMthced = (
                            isValidDateFormat(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]) &&
                            isValidDateFormat(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_Taxable_Value]), true, validations.taxableVal) &&
                            validatePattern(iInv[transLan.LBL_NOTE_TYP], true, validations.noteType) &&
                            validatePattern(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO], true, validations.InvNoteNumber) &&
                            ((Number(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                            validatePattern(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO], true, validations.InvNoteNumber) &&
                            ((Number(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_NOTE_VAL_Excel]), true, validations.InvNoteValue) &&
                            ((Number(iInv[transLan.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                            ((Number(iInv[transLan.LBL_Cess_Amount]) >= 0) ? true : false) &&
                            ((Number(iInv[transLan.LBL_Taxable_Value]) > 0) ? true : false) &&
                            validatePattern(iInv[transLan.LBL_Diff_Percentage], true, validations.diffPercentage) &&
                            validatePattern(iInv[transLan.LBL_UR_TYPE], true, validations.urType) &&
                            isRequired &&
                            validatePattern(iInv[transLan.LBL_Rate], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv[transLan.LBL_Cess_Amount]), false, validations.cessAmount) &&
                            isValidPosStCd
                        );

                        break;
                    case 'exp':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        if (iInv['Shipping Bill Number'] || iInv['Shipping Bill Date']) {
                            isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Invoice date']) &&
                                validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                                validatePattern(iInv['Shipping Bill Number'], true, /^[0-9]{3,7}$/) &&
                                validatePattern(iInv['Shipping Bill Date'], true, null) &&
                                isValidDateFormat(iInv['Shipping Bill Date']) &&
                                validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                                validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                                validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                                validatePattern(iInv['Rate'], true, validations.rates)
                            );
                        }
                        else {
                            isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Invoice date']) &&
                                validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                                validatePattern(iInv['Shipping Bill Number'], false, /^[0-9]{3,7}$/) &&
                                validatePattern(iInv['Shipping Bill Date'], false, null) &&
                                validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                                validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                                validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                                validatePattern(iInv['Rate'], true, validations.rates)
                            );
                        }

                        break;
                    case 'expa':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        if (iInv['Shipping Bill Number'] || iInv['Shipping Bill Date']) {
                            isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Original Invoice date']) &&
                                validatePattern(iInv['Revised Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Revised Invoice date']) &&
                                validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                                validatePattern(iInv['Shipping Bill Number'], true, /^[0-9]{3,7}$/) &&
                                validatePattern(iInv['Shipping Bill Date'], true, null) &&
                                isValidDateFormat(iInv['Shipping Bill Date']) &&
                                validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                                validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                                validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                                ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                                validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                validatePattern(iInv['Rate'], true, validations.rates)
                            );
                        }
                        else {
                            isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Original Invoice date']) &&
                                validatePattern(iInv['Revised Invoice date'], true, null) &&
                                isValidDateFormat(iInv['Revised Invoice date']) &&
                                validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                                validatePattern(iInv['Shipping Bill Number'], false, /^[0-9]{3,7}$/) &&
                                validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                                validatePattern(iInv['Shipping Bill Date'], false, null) &&
                                validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                                validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                                ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                                validatePattern(iInv['Rate'], true, validations.rates)
                            );
                        }
                        break;
                    case 'at':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        if (!iInv['Cess Amount']) {
                            iInv['Cess Amount'] = 0;
                        }
                        isPttnMthced = (
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Gross Advance Received']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            ((Number(iInv['Gross Advance Received']) != 0) ? true : false) &&
                            ((((Number(iInv['Gross Advance Received']) < 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) < 0))) ? true : false) ||
                                (((Number(iInv['Gross Advance Received']) > 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) > 0))) ? true : false)) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                    case 'ata':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        if (!iInv['Cess Amount']) {
                            iInv['Cess Amount'] = 0;
                        }
                        isPttnMthced = (
                            validatePattern(iInv['Financial Year'], true, yearPattern) &&
                            validatePattern(iInv['Original Month'], true, monthPattern) &&
                            validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Gross Advance Received'], true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            ((Number(iInv['Gross Advance Received']) != 0) ? true : false) &&
                            ((((Number(iInv['Gross Advance Received']) < 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) < 0))) ? true : false) ||
                                (((Number(iInv['Gross Advance Received']) > 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) > 0))) ? true : false)) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                    case 'atadj':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        isPttnMthced = (
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Gross Advance Adjusted']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                        );
                        break;
                    case 'atadja':
                        if (!iInv['Applicable % of Tax Rate']) {
                            iInv['Applicable % of Tax Rate'] = 100.00;
                        }
                        isPttnMthced = (
                            validatePattern(iInv['Financial Year'], true, yearPattern) &&
                            validatePattern(iInv['Original Month'], true, monthPattern) &&
                            validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Gross Advance Adjusted'], true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                        );
                        break;
                    case 'hsn':
                        var descRegexPattern = new RegExp("^[ A-Za-z0-9_@./&-]{0,30}$", "gi");
                        var hsnRegexPatter = new RegExp("^[0-9]{2,8}$", "gi");
                        var isHSNReq = true, isDescrReq = true;
                        var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                        var isRateReq = false, isTotalVal = true;

                        if (iInv['Integrated Tax Amount']) {
                            isSTUTAmt = false; isCTAmt = false;

                        } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                            isITAmt = false;
                        }

                        if (iInv['HSN']) {
                            isDescrReq = false;
                        }
                        else if (iInv['Description']) {
                            isHSNReq = false;
                        }

                        if (iInv['UQC'] && iInv['UQC'] != "NA") {
                            iInv['UQC'] = (iInv['UQC']).trim()
                        }

                        if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                            isHSNReq = true;
                            isDescrReq = true;
                            isRateReq = true;
                            isTotalVal = false;

                            descRegexPattern = new RegExp("^[^]{1,}$", "gi");
                            if (shareData.disableHSNRestrictions) {
                                isDescrReq = false;
                            }
                            if (shareData.disableAATOLengthCheck) {
                                hsnRegexPatter = new RegExp("^[0-9]{4,8}$", "gi");
                            }
                            else {
                                if (shareData.aatoGreaterThan5CR) {
                                    hsnRegexPatter = new RegExp("^[0-9]{6,8}$", "gi");
                                }

                                else {
                                    hsnRegexPatter = new RegExp("^[0-9]{4,8}$", "gi");
                                }
                            }

                            isPttnMthced = (
                                validatePattern(iInv['HSN'], isHSNReq, hsnRegexPatter) &&
                                validatePattern(iInv['Description'], isDescrReq, descRegexPattern) &&
                                validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                                validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) && // &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(iInv['Rate'], isRateReq, /^(0|0.1|0.25|1|1.5|3|5|6|7.5|12|18|28|40)$/) && //RateValidationInReturn
                                validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)

                            );
                        }
                        else {
                            isPttnMthced = (
                                validatePattern(iInv['HSN'], isHSNReq, hsnRegexPatter) &&
                                validatePattern(iInv['Description'], isDescrReq, descRegexPattern) &&
                                validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                                validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,15})(\.\d{0,2})?)$/) && // &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Total Value'])), isTotalVal, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                            );
                        }
                        break;
                    case 'hsn(b2c)':
                         var HSN_BIFURCATION_START_DATE = "052025";
                         var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                         if(showHSNTabs){
                        var descRegexPattern = new RegExp("^[ A-Za-z0-9_@./&-]{0,30}$", "gi");
                        var hsnRegexPatter = new RegExp("^[0-9]{2,8}$", "gi");
                        var isHSNReq = true, isDescrReq = true;
                        var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                        var isRateReq = false, isTotalVal = true;

                        if (iInv['Integrated Tax Amount']) {
                            isSTUTAmt = false; isCTAmt = false;

                        } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                            isITAmt = false;
                        }

                        if (iInv['HSN']) {
                            isDescrReq = false;
                        }
                        else if (iInv['Description as per HSN Code']) {
                            isHSNReq = false;
                        }

                        if (iInv['UQC'] && iInv['UQC'] != "NA") {
                            iInv['UQC'] = (iInv['UQC']).trim()
                        }
                            isHSNReq = true;
                            isDescrReq = true;
                            isRateReq = true;
                            isTotalVal = false;

                            descRegexPattern = new RegExp("^[^]{1,}$", "gi");
                            if (shareData.disableHSNRestrictions) {
                                isDescrReq = false;
                            }
                            if (shareData.disableAATOLengthCheck) {
                                hsnRegexPatter = new RegExp("^[0-9]{4,8}$", "gi");
                            }
                            else {
                                if (shareData.aatoGreaterThan5CR) {
                                    hsnRegexPatter = new RegExp("^[0-9]{6,8}$", "gi");
                                }

                                else {
                                    hsnRegexPatter = new RegExp("^[0-9]{4,8}$", "gi");
                                }
                            }

                            isPttnMthced = (
                                validatePattern(iInv['HSN'], isHSNReq, hsnRegexPatter) &&
                                validatePattern(iInv['Description as per HSN Code'], isDescrReq, descRegexPattern) &&
    
                                validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                                validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) && // &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(iInv['Rate'], isRateReq, /^(0|0.1|0.25|1|1.5|3|5|6|7.5|12|18|28|40)$/) && //RateValidationInReturn
                                validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)

                            );
                        }
                        break;
                        case 'hsn(b2b)':
                            var HSN_BIFURCATION_START_DATE = "052025";
                           var  showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                            if(showHSNTabs){
                            var descRegexPattern = new RegExp("^[ A-Za-z0-9_@./&-]{0,30}$", "gi");
                            var hsnRegexPatter = new RegExp("^[0-9]{2,8}$", "gi");
                            var isHSNReq = true, isDescrReq = true;
                            var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                            var isRateReq = false, isTotalVal = true;
    
                            if (iInv['Integrated Tax Amount']) {
                                isSTUTAmt = false; isCTAmt = false;
    
                            } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                                isITAmt = false;
                            }
    
                            if (iInv['HSN']) {
                                isDescrReq = false;
                            }
                            else if (iInv['Description as per HSN Code']) {
                                isHSNReq = false;
                            }
    
                            if (iInv['UQC'] && iInv['UQC'] != "NA") {
                                iInv['UQC'] = (iInv['UQC']).trim()
                            }
                                isHSNReq = true;
                                isDescrReq = true;
                                isRateReq = true;
                                isTotalVal = false;
    
                                descRegexPattern = new RegExp("^[^]{1,}$", "gi");
                                if (shareData.disableHSNRestrictions) {
                                    isDescrReq = false;
                                }
                                if (shareData.disableAATOLengthCheck) {
                                    hsnRegexPatter = new RegExp("^[0-9]{4,8}$", "gi");
                                }
                                else {
                                    if (shareData.aatoGreaterThan5CR) {
                                        hsnRegexPatter = new RegExp("^[0-9]{6,8}$", "gi");
                                    }
    
                                    else {
                                        hsnRegexPatter = new RegExp("^[0-9]{4,8}$", "gi");
                                    }
                                }
                               
                                isPttnMthced = (
                                    validatePattern(iInv['HSN'], isHSNReq, hsnRegexPatter) &&
                                    validatePattern(iInv['Description as per HSN Code'], isDescrReq, descRegexPattern) &&
        
                                    validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                                    validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) && // &&
                                    validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                    validatePattern(iInv['Rate'], isRateReq, /^(0|0.1|0.25|1|1.5|3|5|6|7.5|12|18|28|40)$/) && //RateValidationInReturn
                                    validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                    validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                    validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                                    validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)
    
                            );
                        }
                        break;
                    case 'nil':
                        isPttnMthced = (
                            validatePattern(cnvt2Nm(iInv['Nil Rated Supplies']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(cnvt2Nm(iInv['Exempted(other than nil rated/non GST supply)']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(cnvt2Nm(iInv['Non-GST Supplies']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            (
                                iInv['Description'] == 'Inter-State supplies to registered persons' ||
                                iInv['Description'] == 'Intra-State supplies to registered persons' ||
                                iInv['Description'] == 'Inter-State supplies to unregistered persons' ||
                                iInv['Description'] == 'Intra-State supplies to unregistered persons'
                            )
                        );
                        break;
                    case 'doc_issue':
                        isPttnMthced = (validatePattern(iInv['Sr. No. From'], true, /^(?=.{1,16}$)([/\-0]*[a-zA-Z0-9/\-]*[a-zA-Z1-9]+[a-zA-Z0-9/\-]*)$/) &&
                            validatePattern(iInv['Sr. No. To'], true, /^(?=.{1,16}$)([/\-0]*[a-zA-Z0-9/\-]*[a-zA-Z1-9]+[a-zA-Z0-9/\-]*)$/) &&
                            validatePattern(iInv['Total Number'], true, /^(\d*)$/) &&
                            validatePattern(iInv['Cancelled'], true, /^(\d*)$/) &&
                            (cnvt2Nm(iInv['Total Number']) >= cnvt2Nm(iInv['Cancelled'])) &&
                            validatePattern(iInv['Nature of Document'], true, /^(Delivery Challan in case other than by way of supply \(excluding at S no. 9 to 11\)|Invoices for outward supply|Invoices for inward supply from unregistered person|Revised Invoice|Debit Note|Credit Note|Receipt Voucher|Payment Voucher|Refund Voucher|Delivery Challan for job work|Delivery Challan for supply on approval|Delivery Challan in case of liquid gas)$/));
                        break;
                    case 'supeco':
                        if (!iInv['Cess']) {
                            iInv['Cess'] = 0.00;
                        }
                        var paytx,clttx = false;
                        suppval = cnvt2Nm(iInv['Net value of supplies']);
                        igst = cnvt2Nm(iInv['Integrated tax']);
                        cgst = cnvt2Nm(iInv['Central tax']);
                        sgst = cnvt2Nm(iInv['State/UT tax']);
                        cess = cnvt2Nm(iInv['Cess']);
                        if (iInv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)') {
                            clttx =  validateGSTIN(iInv['GSTIN of E-Commerce Operator'], iForm) && 
                            validatePattern(iInv['GSTIN of E-Commerce Operator'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/)
                        }
                         if (iInv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)') {
                            paytx = validateGSTIN(iInv['GSTIN of E-Commerce Operator'], iForm) && validatePattern(iInv['GSTIN of E-Commerce Operator'], true, null)
                        }

                        isPttnMthced = 
                        (
                            (clttx || paytx) &&
                            validatePattern(suppval, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(igst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(cgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(sgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(cess, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validateAllNegorAllPosPattern(suppval, igst, cgst, sgst, cess) 
                        );
                        break;
                    case 'supecoa':

                        var paytxa,clttxa = false;
                        
                        if (iInv['Nature of Supply'] == "Liable to collect tax u/s 52(TCS)") {
                            clttxa = 
                            (
                            validateGSTIN(iInv['Revised GSTIN of E-Commerce Operator'], iForm) && 
                            validatePattern(iInv['Revised GSTIN of E-Commerce Operator'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/) &&
                            validateGSTIN(iInv['Original GSTIN of E-Commerce Operator'], iForm) && 
                            validatePattern(iInv['Original GSTIN of E-Commerce Operator'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/))
                        }
                        if (iInv['Nature of Supply'] == "Liable to pay tax u/s 9(5)") {
                            paytxa = 
                            (validateGSTIN(iInv['Revised GSTIN of E-Commerce Operator'], iForm) && 
                            validatePattern(iInv['Revised GSTIN of E-Commerce Operator'], true, null) &&
                            validateGSTIN(iInv['Original GSTIN of E-Commerce Operator'], iForm) && 
                            validatePattern(iInv['Original GSTIN of E-Commerce Operator'], true, null))
                        }

                        suppval = cnvt2Nm(iInv['Revised Net value of supplies']);
                        igst = cnvt2Nm(iInv['Integrated tax']);
                        cgst = cnvt2Nm(iInv['Central tax']);
                        sgst = cnvt2Nm(iInv['State/UT tax']);
                        cess = cnvt2Nm(iInv['Cess']);

                        isPttnMthced = 
                        (
                            (clttxa || paytxa) &&
                            validatePattern(iInv['Financial Year'], true, yearPattern) &&
                            validatePattern(iInv['Original Month/Quarter'], true, monthPattern) &&
                            validatePattern(suppval, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(igst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(cgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(sgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validatePattern(cess, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                            validateAllNegorAllPosPattern(suppval, igst, cgst, sgst, cess) 
                        );
                        break;
                    case 'ecomb2b':
                        isPttnMthced = 
                        (
                                
                                validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                                validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                                validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                                validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                                validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Document Date'], true, null) &&
                                isValidDateFormat(iInv['Document Date']) &&
                                validatePattern(iInv['Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Document Number']) != 0) ? true : false) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                //validatePattern(iInv['Document type'], true, null)
                                validatePattern(iInv['Document type'], true, /^(Regular|Deemed Exp|SEZ supplies with payment|SEZ supplies without payment)$/)
                        );
                        break;
                        case 'ecomab2b':


                            isPttnMthced = 
                            (
                                    validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                                    validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                                    validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                                    validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                                    validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                    validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                    validatePattern(iInv['Revised Document Date'], true, null) &&
                                    isValidDateFormat(iInv['Revised Document Date']) &&
                                    validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                    ((Number(iInv['Revised Document Number']) != 0) ? true : false) &&
                                    validatePattern(iInv['Original Document Date'], true, null) &&
                                    isValidDateFormat(iInv['Original Document Date']) &&
                                    validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                    ((Number(iInv['Original Document Number']) != 0) ? true : false) &&
                                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                    validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                    //validatePattern(iInv['Rate'], true, validations.rates) &&
                                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                    validatePattern(iInv['Document type'], true, /^(Regular|Deemed Exp|SEZ supplies with payment|SEZ supplies without payment)$/)
                            );
                            break;
                    case 'ecomb2c':
                        isPttnMthced = 
                        (
                                validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                                validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                                validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                //validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                    case 'ecomab2c':
                        //var year = iInv['Financial Year'],
                          //  month = iInv['Original Month/Quarter'],
                            //curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                        isPttnMthced = 
                        (

                                validatePattern(iInv['Financial Year'], true, yearPattern) &&
                                validatePattern(iInv['Original Month'], true, monthPattern) &&
                                validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                                validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                                validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                //validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                    case 'ecomurp2b':
                        isPttnMthced = 
                        (
                                validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                                validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                                validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Document Date'], true, null) &&
                                isValidDateFormat(iInv['Document Date']) &&
                                validatePattern(iInv['Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Document Number']) != 0) ? true : false) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Document type'], true, /^(Regular|Deemed Exp|SEZ supplies with payment|SEZ supplies without payment)$/)
                        );
                        break;
                    case 'ecomaurp2b':
                        isPttnMthced = 
                        (
                                validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                                validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                                validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                                validatePattern(iInv['Original Document Date'], true, null) &&
                                isValidDateFormat(iInv['Original Document Date']) &&
                                validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Original Document Number']) != 0) ? true : false) &&
                                validatePattern(iInv['Revised Document Date'], true, null) &&
                                isValidDateFormat(iInv['Revised Document Date']) &&
                                validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                                ((Number(iInv['Revised Document Number']) != 0) ? true : false) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(iInv['Document type'], true, /^(Regular|Deemed Exp|SEZ supplies with payment|SEZ supplies without payment)$/)
                        );
                        break;
                    case 'ecomurp2c': 
                        isPttnMthced = 
                        (
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                //validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                    case 'ecomaurp2c':
                        isPttnMthced = 
                        (
                                validatePattern(iInv['Financial Year'], true, yearPattern) &&
                                validatePattern(iInv['Original Month'], true, monthPattern) &&
                                validatePattern(iInv['Place Of Supply'], true, null, true) &&
                                //validatePattern(iInv['Rate'], true, validations.rates) &&
                                validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                                //validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                                validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                                validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                        );
                        break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSecId) {
                    case 'b2b': // GSTR2
                        if (!iInv['Reverse Charge']) {
                            iInv['Reverse Charge'] = 'N';
                        }
                        if (!iInv['Integrated Tax Paid'])
                            iInv['Integrated Tax Paid'] = 0;

                        if (!iInv['Central Tax Paid'])
                            iInv['Central Tax Paid'] = 0;

                        if (!iInv['State/UT Tax Paid'])
                            iInv['State/UT Tax Paid'] = 0;
                        isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Invoice date']) &&
                            validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Integrated Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Central Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['State/UT Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Availed ITC Integrated Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Central Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC State/UT Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Cess']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&




                            validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                            validateGSTIN(iInv['GSTIN of Supplier'], iForm) &&
                            validatePattern(iInv['GSTIN of Supplier'], true, null) &&
                            validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) && isEligibleForITC(iInv['Place Of Supply'], iInv['Eligibility For ITC'])

                        );
                        break;
                    case 'b2bur': // GSTR2



                        isPttnMthced = (

                            validatePattern(iInv['Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Invoice date']) &&
                            validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&

                            validatePattern(cnvt2Nm(iInv['Integrated Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Central Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['State/UT Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Availed ITC Integrated Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Central Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC State/UT Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Cess']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&

                            validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                            validatePattern(iInv['Supply Type'].trim(), true, /^(Inter State|Intra State)$/) && isEligibleForITC(iInv['Place Of Supply'], iInv['Eligibility For ITC'])
                        );

                        break;
                    case 'b2ba': // GSTR2
                        if (!iInv['Reverse Charge']) {
                            iInv['Reverse Charge'] = 'N';
                        }
                        isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                            validatePattern(iInv['Revised Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Original Invoice date']) &&
                            isValidDateFormat(iInv['Revised Invoice date']) &&
                            validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                            validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                            validatePattern(iInv['Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                            validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['IGST Rate'], true, validations.rates) &&
                            validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                            validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                            validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                            validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                            validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                            validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                            validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                            validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                            validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                        );
                        break;
                    case 'b2bura': // GSTR2
                        if (!iInv['Reverse Charge']) {
                            iInv['Reverse Charge'] = 'N';
                        }
                        isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                            validatePattern(iInv['Revised Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Original Invoice date']) &&
                            isValidDateFormat(iInv['Revised Invoice date']) &&
                            validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                            validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                            validatePattern(iInv['Supplier Name'], true, /[A-Za-z0-9_@\s]{50}/) &&
                            validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,8}$/) &&
                            validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['IGST Rate'], true, validations.rates) &&
                            validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                            validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                            validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                            validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                            validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                            validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                            validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                            validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                            validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                        );
                        break;
                    case 'cdnr': // GSTR2
                        if (!iInv['Pre GST']) {
                            iInv['Pre GST'] = 'N';
                        }



                        isPttnMthced = (validatePattern(iInv['Invoice/Advance Payment Voucher date'], true, null) &&
                            isValidDateFormat(iInv['Invoice/Advance Payment Voucher date']) &&
                            validateGSTIN(iInv['GSTIN of Supplier'], iForm) &&
                            validatePattern(iInv['GSTIN of Supplier'], true, null) &&
                            isValidDateFormat(iInv['Note/Refund Voucher date']) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Note/Refund Voucher Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Integrated Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Central Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['State/UT Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Availed ITC Integrated Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Central Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC State/UT Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Cess']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&


                            validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                            validatePattern(iInv['Document Type'], true, /^(C|D)$/) &&
                            validatePattern(iInv['Invoice/Advance Payment Voucher Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Note/Refund Voucher Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Note/Refund Voucher date'], true, null) &&
                            validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)
                        );
                        break;
                    case 'cdnur': // GSTR2

                        if (!iInv['Pre GST']) {
                            iInv['Pre GST'] = 'N';
                        }


                        isPttnMthced = (validatePattern(iInv['Invoice/Advance Payment Voucher date'], true, null) &&
                            isValidDateFormat(iInv['Invoice/Advance Payment Voucher date']) &&
                            isValidDateFormat(iInv['Note/Voucher date']) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Note/Voucher Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Integrated Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Central Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['State/UT Tax Paid']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            validatePattern(cnvt2Nm(iInv['Availed ITC Integrated Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Central Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC State/UT Tax']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Availed ITC Cess']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                            (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                            (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&


                            validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                            validatePattern(iInv['Document Type'], true, /^(C|D)$/) &&
                            validatePattern(iInv['Invoice/Advance Payment Voucher number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            validatePattern(iInv['Note/Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                            validatePattern(iInv['Note/Voucher date'], true, null) &&
                            validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                            validatePattern(iInv['Invoice Type'], true, /^(IMPS|B2BUR)$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(iInv['Supply Type'].trim(), true, /^(Inter State|Intra State)$/) &&
                            isValidSuplyType(iInv['Invoice Type'], iInv['Supply Type'].trim())
                        );
                        break;
                    case 'cdnra': // GSTR2
                        isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Invoice date']) &&
                            isValidDateFormat(iInv['Original Debit Note date']) &&
                            isValidDateFormat(iInv['Revised Debit Note date']) &&
                            validatePattern(iInv['Total Differential Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Reason For Issuing Note'], true, /^(Balance|Sales Return|Post Sale Discount|Deficiency in Service|Not mentioned|Others)$/) &&
                            validatePattern(iInv['Note Type'], true, /^(C|D)$/) &&
                            validatePattern(iInv['Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                            validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Original Debit Note Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Original Debit Note date'], true, null) &&
                            validatePattern(iInv['Revised Debit Note Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Revised Debit Note date'], true, null) &&
                            validatePattern(iInv['E-Commerce GSTIN'], false, /^[a-zA-Z0-9]{15}$/) &&
                            validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['IGST Rate'], true, validations.rates) &&
                            validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                            validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                            validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                            validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                            validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                            validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                            validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                            validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                            validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                        );
                        break;
                    case 'imp_g': // GSTR2
                        if (!iInv['GSTIN Of SEZ Supplier']) {
                            iInv['GSTIN Of SEZ Supplier'] = '';
                        }
                        var validGstn, isRequired;
                        if (iInv['Document Type'] == 'Received from SEZ') {
                            validGstn = validateGSTIN(iInv['GSTIN Of SEZ Supplier'], iForm),
                                isRequired = true;
                        }
                        else {
                            validGstn = true;
                            isRequired = false;
                        }

                        isPttnMthced = (
                            validGstn &&
                            validatePattern(iInv['GSTIN Of SEZ Supplier'], isRequired, null) &&
                            validatePattern(iInv['Bill Of Entry Date'], true, null) &&
                            isValidDateFormat(iInv['Bill Of Entry Date']) &&
                            validatePattern(cnvt2Nm(iInv['Bill Of Entry Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) && validatePattern(iInv['Document type'], true, /^(Imports|Received from SEZ)$/) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Port Code'], true, /^[a-zA-Z0-9-\/]{6}$/) &&
                            validatePattern(iInv['Bill Of Entry Number'], true, /^[0-9]{7}$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                            (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) && isImportFromSez(iInv['GSTIN Of SEZ Supplier'], iInv['Document type'])
                        );
                        break;
                    case 'imp_ga': // GSTR2


                        isPttnMthced = (validatePattern(iInv['Original Bill Of Entry date'], true, null) &&
                            isValidDateFormat(iInv['Original Bill Of Entry date']) &&
                            validatePattern(iInv['Revised Bill Of Entry date'], true, null) &&
                            isValidDateFormat(iInv['Revised Bill Of Entry date']) &&
                            validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                            validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Original Bill Of Entry Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['Revised Bill Of Entry Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['IGST Rate'], true, validations.rates) &&
                            validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                            validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                            validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                            validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                            validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                        );
                        break;
                    case 'imp_s': // GSTR2
                        isPttnMthced = ((validatePattern(iInv['Invoice date'], true, null) || validatePattern(iInv['Invoice Date'], true, null)) &&
                            (isValidDateFormat(iInv['Invoice date']) || isValidDateFormat(iInv['Invoice Date'])) &&
                            validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(iInv['Invoice Number of Reg Recipient'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) && isEligibleForITC(iInv['Place Of Supply'], iInv['Eligibility For ITC']) &&
                            validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                            (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid']))
                        );
                        break;
                    case 'imp_sa': // GSTR2
                        isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Original Invoice date']) &&
                            validatePattern(iInv['Revised Invoice date'], true, null) &&
                            isValidDateFormat(iInv['Revised Invoice date']) &&
                            validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                            validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                            validatePattern(iInv['IGST Rate'], true, validations.rates) &&
                            validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                            validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                            validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                            validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                            validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                        );
                        break;
                    case 'txi': // GSTR2
                        isPttnMthced = (
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Gross Advance Paid']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)
                        );
                        break;
                    case 'atxi': // GSTR2
                        isPttnMthced = (
                            validatePattern(iInv['Recipient State Code'], true, null, true) &&
                            validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                            validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                            validatePattern(iInv['Type'], true, /^(REGD|UNREGD)$/) &&
                            validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Original Document date'], true, null) &&
                            validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9]*$/) &&
                            validatePattern(iInv['Revised Document date'], true, null) &&
                            isValidDateFormat(iInv['Original Document date']) &&
                            isValidDateFormat(iInv['Revised Document date']) &&
                            validatePattern(iInv['Original Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                            validatePattern(iInv['Revised Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                            validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                            validatePattern(iInv['IGST Rate'], true, validations.rates) &&
                            validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                            validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                            validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                            validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                            validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                            validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                            validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                            validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                            validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                        );
                        break;
                    case 'hsnsum': // GSTR2
                        var isHSNReq = true, isDescrReq = true;
                        var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                        if (iInv['Integrated Tax Amount']) {
                            isSTUTAmt = false; isCTAmt = false;

                        } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                            isITAmt = false;
                        }

                        if (!iInv['Central Tax Amount']) {
                            iInv['Central Tax Amount'] = '';
                        }
                        if (!iInv['State/UT Tax Amount']) {
                            iInv['State/UT Tax Amount'] = '';
                        }
                        if (!iInv['Integrated Tax Amount']) {
                            iInv['Integrated Tax Amount'] = '';

                        }
                        if (!iInv['Cess Amount']) {
                            iInv['Cess Amount'] = '';
                        }
                        if (iInv['HSN']) {
                            isDescrReq = false;
                        }
                        else if (iInv['Description']) {
                            isHSNReq = false;
                        }

                        if (!iInv['Description'])
                            iInv['Description'] = '';


                        // as per system, either HSN or DESCRIPTION is required
                        // changes undo done by vasu

                        if (iInv['UQC'])
                            iInv['UQC'] = (iInv['UQC']).trim()

                        isPttnMthced = (


                            validatePattern(iInv['HSN'], isHSNReq, /^[0-9]{2,8}$/) &&
                            validatePattern(iInv['Description'], isDescrReq, /^[ A-Za-z0-9_@./&-]{0,30}$/) &&
                            validatePattern(iInv['UQC'], true, /^[a-zA-Z0-9 -]*$/) &&
                            validatePattern(iInv['Total Quantity'], true, /^([-]?[0-9]{0,15}|[-]?[0-9]{0,15}\.{1}[0-9]{0,2})$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Total Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)

                        );
                        break;


                    case 'itc_rvsl': // GSTR2
                        isPttnMthced = (
                            validatePattern(cnvt2Nm(iInv['ITC Integrated Tax Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['ITC Central Tax Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['ITC State/UT Tax Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(cnvt2Nm(iInv['ITC Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)

                        );
                        break;
                    case 'atadj': // GSTR2
                        isPttnMthced = (
                            validatePattern(iInv['Place Of Supply'], true, null, true) &&
                            validatePattern(cnvt2Nm(iInv['Gross Advance Paid to be Adjusted']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Rate'], true, validations.rates) &&
                            validatePattern(cnvt2Nm(iInv['Cess Adjusted']), false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                            validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)
                        );
                        break;

                    case 'nil': // GSTR2
                        isPttnMthced = (
                            validatePattern(cnvt2Nm(iInv['Nil Rated Supplies']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(cnvt2Nm(iInv['Exempted (other than nil rated/non GST supply )']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(cnvt2Nm(iInv['Non-GST supplies']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(cnvt2Nm(iInv['Composition taxable person']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            (
                                iInv['Description'] == 'Inter-State supplies' ||
                                iInv['Description'] == 'Intra-State supplies'
                            )
                        )
                        break;

                }
            }
            return isPttnMthced;
        }


        //To check rates a/c to supplytype(in case of exp/expa withoutpayment values should be 0)
        function validateRates(iInv, iType, iSecId) {
            return true;
            var isValid = false;
            if (iType) {
                if (iType.name === "Intra-State") {
                    //                    if (iInv['IGST Rate'] == 0 && iInv['IGST Amount'] == 0) {
                    if (iInv['Rate'] == 0) {
                        isValid = true;
                    }
                } else {
                    //                    if (iInv['CGST Rate'] == 0 && iInv['CGST Amount'] == 0 && iInv['SGST Rate'] == 0 && iInv['SGST Amount'] == 0) {
                    if (iInv['Rate'] == 0 /* && iInv['CGST Amount'] == 0 && iInv['SGST Rate'] == 0 && iInv['SGST Amount'] == 0*/) {
                        isValid = true;
                    }
                }
            }

            if (iSecId == "exp" || iSecId == "expa")
                if (iInv["Export Type"] == "WOPAY") {
                    if (iInv['Rate'] == 0) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }
                } else {
                    if (iInv['Rate'] == 0) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }
                }

            return isValid;

        }

        //To check rates a/c to supplytype(in case of exp/expa withoutpayment values should be 0)
        function validateExcelTaxRates(iInv, iSecId, iSpLs, iForm) {
            var isValidTaxRates = false;

            suplyTyp = null;
            if (iForm == "GSTR1") {
                switch (iSecId) {
                    case 'b2b':
                    case 'b2ba':
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv["GSTIN/UIN of Recipient"], (iInv["Place Of Supply"]).substring(0, 2));
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;
                    case 'b2cl':
                    case 'b2cla':
                        var gstin = (shareData.dashBoardDt.gstin).slice(0, 2),
                            pos = iInv["Place Of Supply"],
                            suplyTyp;

                        if (pos) {
                            if (gstin === pos) {
                                suplyTyp = iSpLs[1];
                            } else {
                                suplyTyp = iSpLs[1];
                            }
                        }
                        //suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place Of Supply"]);
                        // suplyTyp = iSpLs[1];
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;
                    case "b2cs":
                    case "b2csa":
                    case "cdnr":
                    case "cdnra":
                    case "cdnur":
                        suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place Of Supply"]);
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;

                    case "atadj":
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                        isValidTaxRates = true;//validateRates(iInv, suplyTyp);
                        break;
                    case "at":
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                        isValidTaxRates = true;//validateRates(iInv, suplyTyp);
                        break;
                    case "ata":
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv["Revised Customer GSTIN/UIN/Name"], iInv["Recipient State Code"]);
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;
                    case 'exp':
                    case 'expa':
                        isValidTaxRates = validateRates(iInv, null, iSecId);
                        break;
                    case 'hsn':
                    case 'hsn(b2b)':
                    case 'hsn(b2c)':  
                        isValidTaxRates = validateRates(iInv, null, iSecId);
                        break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSecId) {
                    case 'b2b':
                    case 'b2ba':
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv["GSTIN of Supplier"], iInv["Place Of Supply"]);
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;
                    case 'b2bur':
                    case 'b2bura':
                        //suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place Of Supply"]);
                        suplyTyp = iInv["Supply Type"];
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;

                    case "cdnr":
                    case "cdnra":
                    case "cdnur":
                        //suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place of Supply"]);
                        suplyTyp = iInv["Supply Type"];
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;
                    case 'imp_g':
                    case 'imp_ga':
                    case 'imp_s':
                    case 'imp_sa':
                        //  suplyTyp =iSpLs[1];
                        isValidTaxRates = true;
                        break;
                    case 'txi':
                        suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place of Supply"]);
                        isValidTaxRates = true;//validateRates(iInv, suplyTyp);
                        break;
                    case 'atxi':
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv['Revised Supplier GSTIN'], iInv["Recipient State Code"]);
                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        break;
                    case 'hsnsum':
                        isValidTaxRates = validateRates(iInv, null, iSecId);
                        break;
                    case 'itc_rvsl':
                        //                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv['Supplier GSTIN']);
                        //                        isValidTaxRates = validateRates(iInv, suplyTyp);
                        isValidTaxRates = true;
                        break;
                    //                    case 'hsn':
                    //                        suplyTyp = R1Util.getSupplyType(iSpLs, null, null, iInv['Nature of Supply']);
                    //                        isValidTaxRates = validateRates(iInv, suplyTyp);
                    //                        break;
                    case "atadj":
                        suplyTyp = R1Util.getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                        isValidTaxRates = true;//validateRates(iInv, suplyTyp);
                        break;


                }
                //                isValidTaxRates = true;
            }
            return isValidTaxRates;
        }


        function isInterStateRow(iInv, iSecId, isSEZ) {
            var isInterStateRw;
            if (iSecId == 'b2cl' || iSecId == 'b2cla') { //  || (iSecId == 'b2b' && iInv['Invoice Type'] !== 'Regular')) { removed iSecId == "cdnur"
                var gstin = (shareData.dashBoardDt.gstin).slice(0, 2),
                    oPos = (iSecId == 'b2cla') ? iInv["Original Place Of Supply"] : iInv["Place Of Supply"],
                    pos = (oPos) ? (oPos).substring(0, 2) : 0;
                if (gstin == pos) {
                    isInterStateRw = false;
                }
                else {
                    isInterStateRw = true;
                }
            }
            else if ((iSecId == "cdnra" || iSecId == "cdnura") && isSEZ) {
                if (iInv['Supply Type'] == 'Inter State') {
                    isInterStateRw = true;
                }
                else {
                    isInterStateRw = false;
                }
            }
            else if ((iSecId == "nil") && isSEZ) {
                if (iInv['Description'] == 'Intra-State supplies to registered persons' || iInv['Description'] == 'Intra-State supplies to unregistered persons') {
                    if (cnvt2Nm(iInv['Nil Rated Supplies']) > 0 || cnvt2Nm(iInv['Exempted(other than nil rated/non GST supply)']) > 0 || cnvt2Nm(iInv['Non-GST Supplies']) > 0) {
                        isInterStateRw = false;
                    }
                    else {
                        isInterStateRw = true;
                    }
                }
                else {
                    isInterStateRw = true;
                }
            }
            else {
                isInterStateRw = true;
            }
            return isInterStateRw;
        }
        // To get Invoice Type
        function getNoteSupplyType(isec, invtype) {
            if (isec == 'cdnr' || isec == 'cdnra' || isec == 'b2b' || isec == 'b2ba') {
                if (invtype == undefined) return "Error";
                else if (invtype.trim() == 'Regular B2B') return "R";
                else if (invtype.trim() == "Deemed Exp") return "DE";
                else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
                else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
                else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
                else return "Warning";
            }
        };

        //To seperate valid n invalid data from excel by checking all validations
        function preparePayloadFromExcel(oData, getInvFn, getItmFn, excelRefKey, newFormateKey, iSecID, iForm, iMonthsList, iYearsList, iSpLs, supplier_gstin, isSEZ, typee, transLan, b2clLimit) {
            if (!typee)
                typee = 'copy';
            var iData = null;
            var invAry = [];
            iData = convertStrToNum(oData, "Rate");
            iData = convertStrToNum(iData, "Amount");
            iData = convertStrToNum(iData, "Value");
            if (iSecID != "doc_issue") iData = convertNumToStr(iData, "Number");
            iData = convertNumToStr(iData, "HSN");

            function getMatchedInv(iAry, iNum, iCompareKey, iExInv, iYearsList) {

                var rInv = null,
                    rErrInv = null,
                    checkOriginalKey = false;
                if (iSecID.endsWith('a') || iSecID == "ecomab2c"|| iSecID == "ecomaurp2c" ) {
                    var oNum = null, oMonth = null, oYear = null, curntOMon = null;
                    var oCompareKey = 'o' + iCompareKey;
                    if (iSecID == 'b2ba') {
                        oNum = iExInv[transLan.LBL_ORG_INV_NO];
                    } else if (iSecID == 'b2cla' || iSecID == 'expa') {
                        oNum = iExInv[transLan.LBL_ORG_INV_NO]
                    } else if (iSecID == 'cdnra' || iSecID == 'cdnura') {
                        oNum = iExInv['Original Note/Refund Voucher Number'];
                    } else if (iSecID == 'ata' || iSecID == 'atadja' || iSecID == 'b2csa' || iSecID == "ecomab2c"|| iSecID == "ecomaurp2c" ) {
                        oCompareKey = "omon";
                        oYear = iExInv[transLan.LBL_FINANCIAL_YEAR];
                        oMonth = iExInv[transLan.LBL_ORG_MONTH];
                        curntOMon = isValidRtnPeriod(iYearsList, oYear, oMonth).monthValue;
                    }else if(iSecID == 'supecoa'){
                        oCompareKey = "omon";
                        oYear = iExInv['Financial Year'];
                        oMonth = iExInv['Original Month/Quarter'];
                        curntOMon = isValidRtnPeriod(iYearsList, oYear, oMonth).monthValue;
                    }

                }
                for (var i = 0, len = iAry.length; i < len; i++) {


                    var isMatchedKeys;
                    if (iSecID == "atadja" || iSecID == "ata" || iSecID == 'b2csa') {
                        checkOriginalKey = curntOMon && iAry[i][oCompareKey] && (curntOMon).toLowerCase() == (iAry[i][oCompareKey]).toLowerCase();
                        isMatchedKeys = iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() && checkOriginalKey;
                    }
                    else {
                        checkOriginalKey = oNum && iAry[i][oCompareKey] && (oNum).toLowerCase() == (iAry[i][oCompareKey]).toLowerCase();
                        isMatchedKeys = iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() || checkOriginalKey;
                    }
                    //added by Subrat for key changes in 6 sections for GSTR1
                    if (iForm == "GSTR1" && (iSecID == "b2cs" || iSecID == "b2csa" || iSecID == "at" || iSecID == "ata" || iSecID == "atadja" || iSecID == "atadj")) {
                        isMatchedKeys = isMatchedKeys && (iAry[i].diff_percent == iExInv[transLan.LBL_Diff_Percentage] / 100);
                    }

                    if (iForm == "GSTR1" && (iSecID == "ecomab2c" )) {
                        isMatchedKeys = 
                        (iExInv["Supplier GSTIN/UIN"] && iAry[i]['stin'] && (iExInv["Supplier GSTIN/UIN"]).toLowerCase() == (iAry[i]["stin"]).toLowerCase() &&
                        iExInv['Place Of Supply'] && iAry[i]['pos'] && (iExInv["Place Of Supply"]).toLowerCase() == (iAry[i]["pos"]).toLowerCase() &&
                        curntOMon && iAry[i]['omon'] && curntOMon == (iAry[i]["omon"]));
                    }

                    if (iForm == "GSTR1" && (iSecID == "ecomaurp2c" )) {
                        isMatchedKeys = 
                        (iExInv['Place Of Supply'] && iAry[i]['pos'] && (iExInv["Place Of Supply"]).toLowerCase() == (iAry[i]["pos"]).toLowerCase() &&
                        curntOMon && iAry[i]['omon'] && curntOMon == (iAry[i]["omon"]));
                    }

                    if (iForm == "GSTR1" && (iSecID == "ecomab2b" )) {
                        isMatchedKeys = true;
                        (
                        iExInv["Supplier GSTIN/UIN"] && iAry[i]['stin'] && (iExInv["Supplier GSTIN/UIN"]).toLowerCase() == (iAry[i]["stin"]).toLowerCase() &&
                        iExInv["Recipient GSTIN/UIN"] && iAry[i]['rtin'] && (iExInv["Recipient GSTIN/UIN"]).toLowerCase() == (iAry[i]["rtin"]).toLowerCase() &&
                        iExInv["Original Document Number"] && iAry[i]['oinum'] && (iExInv["Original Document Number"]).toLowerCase() == (iAry[i]["oinum"]).toLowerCase() &&
                        iExInv["Original Document Date"] && iAry[i]['oidt'] && (iExInv["Original Document Date"]).toLowerCase() == (iAry[i]["oidt"]).toLowerCase() &&
                        iExInv["Revised Document Number"] && iAry[i]['inum'] && (iExInv["Revised Document Number"]).toLowerCase() == (iAry[i]["inum"]).toLowerCase() &&
                        iExInv["Revised Document Date"] && iAry[i]['idt'] && (iExInv["Revised Document Date"]).toLowerCase() == (iAry[i]["idt"]).toLowerCase() &&
                        iExInv["Value of supplies made"] && iAry[i]['val'] && (iExInv["Value of supplies made"]) == (iAry[i]["val"]) &&
                        iExInv['Place Of Supply'] && iAry[i]['pos'] && (iExInv["Place Of Supply"]).toLowerCase() == (iAry[i]["pos"]).toLowerCase() 
                        );
                    }
                    
                    if (isMatchedKeys) {
                        var existingInv = iAry[i];

                        var isValidInv = validateInvoice(iForm, iSecID, iExInv, existingInv, iYearsList, transLan);

                        if (isValidInv) {
                            rInv = iAry[i];
                        } else {
                            if (iCompareKey != 'hsn_sc')
                                rErrInv = iNum;
                        }
                        break;
                    }
                }
                return {
                    rInv: rInv,
                    rErrInv: rErrInv
                };
            }

            var excelErrList = [],
                excelDateErrList = [],
                excelb2clErrList = [],
                excelMatchErrInvList = [],
                excelInvalidPattrnList = [],
                excelInvalidURtypePOSList = [],
                excelInvalidURtypeDiffPerList = [],
                excelInvalidPosSupStCode = [],
                excelInvalidNtSplyTypList = [],
                getMatchObj = {}, matchedInv, excelErrInv;
            iData.forEach(function (inv, i) {
                if (excelRefKey == transLan.LBL_POS_Excel || excelRefKey == transLan.LBL_POS_Excel_Org || excelRefKey == transLan.LBL_POS_Excel_Rev) {
                    inv[excelRefKey] = inv[excelRefKey].substring(0, 2);
                }


                var curInum = inv[excelRefKey],
                    isValidExcelFields = validateExcelMandatoryFields(inv, iSecID, iForm, transLan, supplier_gstin, b2clLimit),
                    isValidExcelDates = false;
                if (isValidExcelFields) isValidExcelDates = validateExcelDates(inv, iSecID, iForm, iMonthsList, iYearsList, transLan);
                var isValidExcelData = validateExcelData(inv, iSecID, iForm, transLan),
                    isValidShipDate = validateLessThanInvDate(inv, iSecID, iForm);
                if (iSecID == "cdnur" || iSecID == "cdnura") {
                    let isPOSRequiredCDN = validatePOSwithURType(inv, transLan);
                    let isDiffPerRequired = validateDiffPerwithURType(inv, transLan);
                    let isValidPosSupStCode = validatePOSWithSupStCode(inv, transLan, supplier_gstin);
                    if (!isPOSRequiredCDN && isPOSRequiredCDN !== undefined && isPOSRequiredCDN != null) {
                        let errListPOS = [];
                        if (typee == 'copy')
                            errListPOS.push(parseInt(i) + 5);
                        else
                            errListPOS.push(parseInt(i) + 2);
                        excelInvalidURtypePOSList.push({
                            cd: iSecID,
                            dt: errListPOS
                        });
                    }
                    if (!isDiffPerRequired && isDiffPerRequired !== undefined && isDiffPerRequired != null) {
                        let errListDiff = [];
                        if (typee == 'copy')
                            errListDiff.push(parseInt(i) + 5);
                        else
                            errListDiff.push(parseInt(i) + 2);
                        excelInvalidURtypeDiffPerList.push({
                            cd: iSecID,
                            dt: errListDiff
                        });
                    }
                    if (!isValidPosSupStCode && isValidPosSupStCode !== undefined && isValidPosSupStCode != null) {
                        let errListPosStCode = [];
                        if (typee == 'copy')
                            errListPosStCode.push(parseInt(i) + 5);
                        else
                            errListPosStCode.push(parseInt(i) + 2);
                        excelInvalidPosSupStCode.push({
                            cd: iSecID,
                            dt: errListPosStCode
                        });
                    }
                }
                if (iSecID == "cdnr" || iSecID == "cdnra" || iSecID == "b2b" || iSecID == "b2ba") {
                    let isValidNtSplyTyp = validateNoteSupplyType(inv, transLan, iSecID);
                    if (!isValidNtSplyTyp && isValidNtSplyTyp !== undefined && isValidNtSplyTyp != null) {
                        let errListNtSply = [];
                        if (typee == 'copy')
                            errListNtSply.push(parseInt(i) + 5);
                        else
                            errListNtSply.push(parseInt(i) + 2);
                        excelInvalidNtSplyTypList.push({
                            cd: iSecID,
                            dt: errListNtSply
                        });
                    }
                }
                if (isValidExcelData && isValidExcelDates && isValidExcelFields && isValidShipDate) {
                    getMatchObj = getMatchedInv(invAry, curInum, newFormateKey, inv, iYearsList);
                    matchedInv = getMatchObj.rInv;
                    excelErrInv = getMatchObj.rErrInv;
                    if (!excelErrInv) {
                        if (matchedInv && getItmFn) {
                            //item repeated
                            if (iSecID == 'doc_issue') {
                                var newItmNum = (matchedInv.docs.length + 1),
                                    newItm = getItmFn(newItmNum, inv);
                                matchedInv.docs.push(newItm);
                            }
                            else {
                                var newItmNum = (matchedInv.itms.length + 1);
                                var newItm = getItmFn(newItmNum, inv);
                                var rateFound = false;
                                for (var ll = 0; ll < matchedInv.itms.length; ll++) {

                                    if (typeof matchedInv.itms[ll].itm_det != 'undefined' && typeof matchedInv.itms[ll].itm_det.rt != 'undefined' && matchedInv.itms[ll].itm_det.rt == newItm.itm_det.rt) {
                                        matchedInv.itms[ll] = newItm;
                                        rateFound = true;
                                    } else if (typeof matchedInv.itms[ll].rt != 'undefined' && matchedInv.itms[ll].rt == newItm.rt) {
                                        matchedInv.itms[ll] = newItm;
                                        rateFound = true;
                                    }
                                }

                                if (rateFound == false) {
                                    matchedInv.itms.push(newItm);
                                }
                            }
                        } else {
                            if (((iSecID == 'b2cl' || iSecID == 'b2cla') && !isSEZ)) {
                                var isValidRow = isInterStateRow(inv, iSecID, isSEZ);
                                if (isValidRow) {
                                    invAry.push(getInvFn(1, inv, getItmFn));
                                }
                                else {
                                    var errList = [];
                                    errList.push(curInum);
                                    excelb2clErrList.push({
                                        cd: iSecID,
                                        dt: errList
                                    });
                                }
                            }
                            else {
                                //new invoice
                                invAry.push(getInvFn(1, inv, getItmFn));
                            }
                        }
                    }
                    else if (excelErrInv && getItmFn) {

                        var errList = [];
                        errList.push(curInum);
                        var unique = errList.filter(function (curInum, index, self) {
                            return index == self.indexOf(curInum);
                        })
                        errList = unique;
                        excelMatchErrInvList.push({
                            cd: iSecID,
                            dt: errList
                        });
                    }
                } else if (curInum && isValidExcelData && isValidExcelFields && isValidShipDate) {

                    var errList = [];
                    errList.push(curInum);
                    excelErrList.push({
                        cd: iSecID,
                        dt: errList
                    });
                } else if (curInum && isValidExcelData && isValidExcelFields && !isValidShipDate) {

                    var errList = [];
                    errList.push(curInum);
                    excelDateErrList.push({
                        cd: iSecID,
                        dt: errList
                    });
                } else if (!isValidExcelFields && isValidExcelData && isValidShipDate) {

                    var errList = [];
                    if (typee == 'copy')
                        errList.push(parseInt(i) + 5);
                    else
                        errList.push(parseInt(i) + 2);
                    excelInvalidPattrnList.push({
                        cd: iSecID,
                        dt: errList
                    });
                } else if (!isValidExcelData || !isValidExcelFields || !isValidExcelDates) {

                    var errList = [];
                    if (typee == 'copy')
                        errList.push(parseInt(i) + 5);
                    else
                        errList.push(parseInt(i) + 2);
                    excelInvalidPattrnList.push({
                        cd: iSecID,
                        dt: errList
                    });

                }
            });

            if ((iSecID == 'nil' && iForm == 'GSTR2') || iSecID == 'itc_rvsl') {
                var my_obj = {}
                for (var i = 0; i < invAry.length; i++) {
                    var this_keys = Object.keys(invAry[i]);
                    for (var j = 0; j < this_keys.length; j++) {
                        my_obj[this_keys[j]] = invAry[i][this_keys[j]];
                    }
                }
                invAry = [my_obj];

            }



            return {
                inv: invAry,
                errInv: excelErrList,
                macthedErrList: excelMatchErrInvList,
                excelInvldPattrnList: excelInvalidPattrnList,
                excelb2clErrList: excelb2clErrList,
                excelDateErrList: excelDateErrList,
                excelInvalidURtypePOSList: excelInvalidURtypePOSList,
                excelInvalidURtypeDiffPerList: excelInvalidURtypeDiffPerList,
                excelInvalidPosSupStCode: excelInvalidPosSupStCode,
                excelInvalidNtSplyTypList: excelInvalidNtSplyTypList
            };

        }
    }

    OfflineFactory.factory('ReturnStructure', ReturnStructure);
    ReturnStructure.$inject = ["$log", "$q", "R1Util", "shareData", "g1FileHandler", "$http"];

    function ReturnStructure($log, Q, R1Util, shareData, g1FileHandler, Http) {
        return {
            getInv: getInv,
            getItm: getItm,
            getNewInv: getNewInv,
            getNewItm: getNewItm,
            reformateInv: reformateInv,
            formateNodePayload: formateNodePayload,
            getUpdatedNodeDetails: getUpdatedNodeDetails,
            getExcelTitle: getExcelTitle,
            getInvKey: getInvKey,
            getItmNodeStructure: getItmNodeStructure,
            getInvNum: getInvNum,
            fetchDescFromHsn: fetchDescFromHsn,
            validateHsnAPI: validateHsnAPI
        };

        // To get Invoice Type
        function getInvType(isec, invtype) {
            if ((isec == 'b2b' || isec == 'b2ba' || isec == 'cdnr' || isec == 'cdnra') && shareData.dashBoardDt.form == 'GSTR1') {
                if (invtype.trim() == 'Regular B2B') return "R";
                else if (invtype.trim() == "Deemed Exp") return "DE";
                else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
                else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
                else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
            }
            else if (isec == 'b2b' || isec == 'b2ba' || isec == 'cdnr' || isec == 'cdnra' || isec == 'ecomb2b' 
                        || isec == 'ecomab2b' || isec == 'ecomurp2b' || isec == 'ecomaurp2b' ) {
                if (invtype.trim() == 'Regular') return "R";
                else if (invtype.trim() == "Deemed Exp") return "DE";
                else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
                else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
                else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
            }
        };

        function getNilType(isec, sply_ty) {
            if (isec == 'nil') {
                if (sply_ty == 'Inter-State supplies to registered persons') return "INTRB2B";
                else if (sply_ty == 'Inter-State supplies to unregistered persons') return "INTRB2C";
                else if (sply_ty == 'Intra-State supplies to registered persons') return "INTRAB2B";
                else if (sply_ty == 'Intra-State supplies to unregistered persons') return "INTRAB2C";
            }
        };

        function getItcRvslType(iDesc) {

            if (iDesc == 'Amount in terms of Rule 2(2) of ITC Rules') return "rule2_2";
            else if (sply_ty == 'Amount in terms of rule 7(1)(m)of ITC Rules') return "INTRB2C";
            else if (sply_ty == 'Intra-State supplies to registered person') return "INTRAB2B";
            else if (sply_ty == 'Intra-State supplies to unregistered person') return "INTRAB2C";

        };

        function getSupplyTypeForAt(pos) {
            var dashGstin = shareData.dashBoardDt.gstin.slice(0, 2),
                isSEZ = shareData.isSezTaxpayer,
                sply_ty;
            if (dashGstin == pos && !isSEZ) {
                sply_ty = 'INTRA'

            }
            else {
                sply_ty = 'INTER'
            }
            return sply_ty;
        };

        function fetchDescFromHsn(hsn) {
            var deferred = Q.defer();
            var url = "/hsnDescForOfflineTool/" + hsn;
            Http.get(url).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        function validateHsnAPI(hsn,index) {
            var deferred = Q.defer();
            var param={"hsn":hsn,
             "index":index}
            var url = "/validateHsnAPI";
            Http.get(url,{params:param}).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //To get the invoice level values from excel a/c payload properties
        function getInv(iSec, iForm, iYearsList, transLan) {
            var dashGstin = (shareData.dashBoardDt.gstin).substring(0, 2),
                isSEZ = shareData.isSezTaxpayer;
            /* added this rule object for itc_revarsal rules mapping by sridhar */
            var rules = {

                "(a) Amount in terms of rule 37 (2)": "rule2_2",
                "(b) Amount in terms of rule 42 (1) (m)": "rule7_1_m",
                "(c) Amount in terms of rule 43(1) (h)": "rule8_1_h",
                "(d) Amount in terms of rule 42 (2)(a)": "rule7_2_a",
                "(e) Amount in terms of rule 42(2)(b)": "rule7_2_b",
                "(f) On account of amount paid subsequent to reversal of ITC": "revitc",
                "(g) Any other liability (Specify)": "other"

            };
            var rtFn = null;
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case 'b2b':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }

                            return {
                                "inum": inv['Invoice Number'],
                                "idt": inv['Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "rchrg": inv['Reverse Charge'],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "etin": inv['E-Commerce GSTIN'],
                                "inv_typ": getInvType(iSec, inv['Invoice Type']),
                                "ctin": inv['GSTIN/UIN of Recipient'],
                                "cname": inv['Receiver Name'],
                                "itms": [itemFn(i, inv)],
                                "status": inv['E-invoice status']
                            };
                        }
                        break;
                    case 'b2ba':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "oinum": inv['Original Invoice Number'],
                                "oidt": inv['Original Invoice date'],
                                "inum": inv['Revised Invoice Number'],
                                "idt": inv['Revised Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "rchrg": inv['Reverse Charge'],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "etin": inv['E-Commerce GSTIN'],
                                "inv_typ": getInvType(iSec, inv['Invoice Type']),
                                "cname": inv['Receiver Name'],
                                "ctin": inv['GSTIN/UIN of Recipient'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'b2cl':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "etin": inv['E-Commerce GSTIN'],
                                "inum": inv['Invoice Number'],
                                "idt": inv['Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "pos": (inv['Place Of Supply']).slice(0, 2),
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "itms": [itemFn(i, inv)]

                            };
                        }
                        break;
                    case 'b2cla':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "oinum": inv['Original Invoice Number'],
                                "oidt": inv['Original Invoice date'],
                                "etin": inv['E-Commerce GSTIN'],
                                "inum": inv['Revised Invoice Number'],
                                "idt": inv['Revised Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "pos": (inv['Original Place Of Supply']).slice(0, 2),
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'at':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            var statecd = inv['Place Of Supply'].substring(0, 2);
                            if (dashGstin == statecd && !isSEZ) {
                                return {
                                    "pos": inv["Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTRA',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "inv_typ": getInvType(iSec, inv['Invoice Type']),
                                    "itms": [itemFn(i, inv)]
                                };

                            }
                            else {
                                return {
                                    "pos": inv["Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTER',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };
                            }


                        }
                        break;
                    case 'ata':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            var statecd = inv['Original Place Of Supply'].substring(0, 2),
                                year = inv['Financial Year'],
                                month = inv['Original Month'];

                            if (dashGstin == statecd && !isSEZ) {
                                return {
                                    "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                    "pos": inv["Original Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTRA',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };

                            }
                            else {
                                return {
                                    "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                    "pos": inv["Original Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTER',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };
                            }

                        }

                        break;
                    case 'exp':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "exp_typ": inv['Export Type'],
                                "inum": inv['Invoice Number'],
                                "idt": inv['Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "sbpcode": inv['Port Code'],
                                "sbnum": inv['Shipping Bill Number'],
                                "sbdt": inv['Shipping Bill Date'],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "itms": [itemFn(i, inv)],

                                "status": inv['E-invoice status']
                            };
                        }
                        break;
                    case 'expa':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "exp_typ": inv['Export Type'],
                                "oinum": inv['Original Invoice Number'],
                                "oidt": inv['Original Invoice date'],
                                "inum": inv['Revised Invoice Number'],
                                "idt": inv['Revised Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "sbpcode": inv['Port Code'],
                                "sbnum": inv['Shipping Bill Number'],
                                "sbdt": inv['Shipping Bill Date'],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'cdnr':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null) {
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "nt_num": inv[transLan.LBL_DEBIT_CREDIT_NOTE_NO],
                                "nt_dt": inv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE],
                                "ntty": inv[transLan.LBL_NOTE_TYP],
                                "val": cnvt2Nm(inv[transLan.LBL_NOTE_VAL_Excel]),
                                "pos": inv[transLan.LBL_POS_Excel].substring(0, 2),
                                "ctin": inv[transLan.LBL_GSTIN_UIN_RECIPIENT],
                                "cname": inv[transLan.LBL_RECEIVER_NAME],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "rchrg": inv[transLan.LBL_RECHRG],
                                "inv_typ": getInvType(iSec, inv[transLan.LBL_NT_SPLY_TY]),
                                "itms": [itemFn(i, inv)],

                                "status": inv['E-invoice status']
                            };
                        }
                        break;
                    case 'cdnur':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null) {
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "nt_num": inv[transLan.LBL_DEBIT_CREDIT_NOTE_NO],
                                "nt_dt": inv[transLan.LBL_DEBIT_CREDIT_NOTE_DATE],
                                "ntty": inv[transLan.LBL_NOTE_TYP],
                                "val": cnvt2Nm(inv[transLan.LBL_NOTE_VAL_Excel]),
                                "typ": inv[transLan.LBL_UR_TYPE],
                                "pos": (inv[transLan.LBL_POS_Excel]) ? (inv[transLan.LBL_POS_Excel]).substring(0, 2) : inv[transLan.LBL_POS_Excel],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "itms": [itemFn(i, inv)],

                                "status": inv['E-invoice status']
                            };
                        }
                        break;
                    case 'cdnra':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null) {
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "ont_num": inv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO],
                                "ont_dt": inv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE],
                                "nt_num": inv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO],
                                "nt_dt": inv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE],
                                "ntty": inv[transLan.LBL_NOTE_TYP],
                                "val": cnvt2Nm(inv[transLan.LBL_NOTE_VAL_Excel]),
                                "pos": inv[transLan.LBL_POS_Excel].substring(0, 2),
                                "ctin": inv[transLan.LBL_GSTIN_UIN_RECIPIENT],
                                "cname": inv[transLan.LBL_RECEIVER_NAME],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "rchrg": inv[transLan.LBL_RECHRG],
                                "inv_typ": getInvType(iSec, inv[transLan.LBL_NT_SPLY_TY]),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'cdnura':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null) {
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);
                                diffval = false;
                            }
                            return {
                                "ont_num": inv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO],
                                "ont_dt": inv[transLan.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE],
                                "nt_num": inv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO],
                                "nt_dt": inv[transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE],
                                "ntty": inv[transLan.LBL_NOTE_TYP],
                                "val": cnvt2Nm(inv[transLan.LBL_NOTE_VAL_Excel]),
                                "typ": inv[transLan.LBL_UR_TYPE],
                                "pos": (inv[transLan.LBL_POS_Excel]) ? (inv[transLan.LBL_POS_Excel]).substring(0, 2) : inv[transLan.LBL_POS_Excel],
                                "diff_percent": cnvt2Nm(diffFactor),
                                "diffval": diffval,
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'b2cs':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactorField = null, diffFactorCalc = 1.00, diffval = true;

                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactorField = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffFactorCalc = diffFactorField;
                                diffval = false;
                            }
                            var pos = (inv['Place Of Supply']).substring(0, 2);

                            if (pos == dashGstin && !isSEZ) {
                                return {
                                    "sply_ty": "INTRA",
                                    "rt": inv['Rate'],
                                    "typ": inv['Type'],
                                    "etin": inv['E-Commerce GSTIN'],
                                    "pos": pos,
                                    "diff_percent": cnvt2Nm(diffFactorField),
                                    "diffval": diffval,
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactorCalc),
                                    "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactorCalc),
                                    "csamt": cnvt2Nm(inv['Cess Amount'])
                                }
                            } else {
                                return {
                                    "sply_ty": "INTER",
                                    "rt": (inv['Rate']),
                                    "typ": inv['Type'],
                                    "etin": inv['E-Commerce GSTIN'],
                                    "pos": pos,
                                    "diff_percent": cnvt2Nm(diffFactorField),
                                    "diffval": diffval,
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactorCalc),
                                    "csamt": cnvt2Nm(inv['Cess Amount']),
                                }
                            }
                        }
                        break;
                    case 'b2csa':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            var pos = (inv['Place Of Supply']).substring(0, 2),
                                year = inv['Financial Year'],
                                month = inv['Original Month'];

                            if (pos == dashGstin && !isSEZ) {
                                return {
                                    "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                    "sply_ty": "INTRA",
                                    "typ": inv['Type'],
                                    "etin": inv['E-Commerce GSTIN'],
                                    "pos": (inv['Place Of Supply']).substring(0, 2),
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]

                                }
                            } else {
                                return {
                                    "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                    "sply_ty": "INTER",
                                    "typ": inv['Type'],
                                    "etin": inv['E-Commerce GSTIN'],
                                    "pos": (inv['Place Of Supply']).substring(0, 2),
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                }
                            }

                        }
                        break;
                    case 'atadj':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            var statecd = inv['Place Of Supply'].substring(0, 2);

                            if (dashGstin == statecd && !isSEZ) {
                                return {
                                    "pos": inv["Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTRA',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };

                            }
                            else {
                                return {
                                    "pos": inv["Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTER',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };
                            }


                        }
                        break;
                    case 'atadja':
                        rtFn = function (i, inv, itemFn) {
                            var diffFactor = null, diffval = true;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null) {
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                                diffval = false;
                            }
                            var statecd = inv['Original Place Of Supply'].substring(0, 2),
                                year = inv['Financial Year'],
                                month = inv['Original Month'];
                            if (dashGstin == statecd && !isSEZ) {
                                return {
                                    "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                    "pos": inv["Original Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTRA',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };

                            }
                            else {
                                return {
                                    "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                    "pos": inv["Original Place Of Supply"].substring(0, 2),
                                    "sply_ty": 'INTER',
                                    "diff_percent": cnvt2Nm(diffFactor),
                                    "diffval": diffval,
                                    "itms": [itemFn(i, inv)]
                                };
                            }


                        }
                        break;
                        break;
                    case 'hsn':

                        rtFn = function (i, inv, itemFn) {
                            if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                                if (inv.UQC == "NA") {
                                    return {
                                        "num": parseInt(i),
                                        "hsn_sc": inv['HSN'],
                                        "desc": inv['Description'],
                                        "uqc": inv['UQC'],
                                        "qty": cnvt2Nm(inv['Total Quantity']),
                                        "rt": cnvt2Nm(inv['Rate']),
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                        "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                        "camt": cnvt2Nm(inv['Central Tax Amount']),
                                        "csamt": cnvt2Nm(inv['Cess Amount'])
                                    }
                                }
                                return {
                                    "num": parseInt(i),
                                    "hsn_sc": inv['HSN'],
                                    "desc": inv['Description'],
                                    "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                    "qty": cnvt2Nm(inv['Total Quantity']),
                                    "rt": cnvt2Nm(inv['Rate']),
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                    "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                    "camt": cnvt2Nm(inv['Central Tax Amount']),
                                    "csamt": cnvt2Nm(inv['Cess Amount'])
                                }
                            }
                            return {
                                "num": parseInt(i),
                                "hsn_sc": inv['HSN'],
                                "desc": inv['Description'],
                                "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                "qty": cnvt2Nm(inv['Total Quantity']),
                                "val": cnvt2Nm(inv['Total Value']),
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                "camt": cnvt2Nm(inv['Central Tax Amount']),
                                "csamt": cnvt2Nm(inv['Cess Amount'])
                            }
                        }
                        break;
                        case 'hsn(b2c)':
                            var HSN_BIFURCATION_START_DATE = "052025";
                            var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                            if(showHSNTabs){
                        rtFn = function (i, inv, itemFn) {
                                if (inv.UQC == "NA") {
                                    return {
                                        "num": parseInt(i),
                                        "hsn_sc": inv['HSN'],                                       
                                        "user_desc":inv['Description'],
                                        "desc": inv['Description as per HSN Code'],
                                        "uqc": inv['UQC'],
                                        "qty": cnvt2Nm(inv['Total Quantity']),
                                        "rt": cnvt2Nm(inv['Rate']),
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                        "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                        "camt": cnvt2Nm(inv['Central Tax Amount']),
                                        "csamt": cnvt2Nm(inv['Cess Amount'])
                                    }
                                }
                                return {
                                    "num": parseInt(i),
                                    "hsn_sc": inv['HSN'],
                                    "user_desc":inv['Description'],
                                    "desc": inv['Description as per HSN Code'],
                                    "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                    "qty": cnvt2Nm(inv['Total Quantity']),
                                    "rt": cnvt2Nm(inv['Rate']),
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                    "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                    "camt": cnvt2Nm(inv['Central Tax Amount']),
                                    "csamt": cnvt2Nm(inv['Cess Amount'])
                                }
                            }
                        }
                        break;
                        case 'hsn(b2b)':
                            var HSN_BIFURCATION_START_DATE = "052025";
                            var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                            if(showHSNTabs){
                        rtFn = function (i, inv, itemFn) {
                                if (inv.UQC == "NA") {
                                    return {
                                        "num": parseInt(i),
                                        "hsn_sc": inv['HSN'],                                       
                                        "user_desc":inv['Description'],
                                        "desc": inv['Description as per HSN Code'],
                                        "uqc": inv['UQC'],
                                        "qty": cnvt2Nm(inv['Total Quantity']),
                                        "rt": cnvt2Nm(inv['Rate']),
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                        "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                        "camt": cnvt2Nm(inv['Central Tax Amount']),
                                        "csamt": cnvt2Nm(inv['Cess Amount'])
                                    }
                                }
                                return {
                                    "num": parseInt(i),
                                    "hsn_sc": inv['HSN'],
                                    "user_desc":inv['Description'],
                                    "desc": inv['Description as per HSN Code'],
                                    "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                    "qty": cnvt2Nm(inv['Total Quantity']),
                                    "rt": cnvt2Nm(inv['Rate']),
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                    "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                    "camt": cnvt2Nm(inv['Central Tax Amount']),
                                    "csamt": cnvt2Nm(inv['Cess Amount'])
                                }
                            }
                        }
                        break;
                    case 'nil':
                        rtFn = function (i, inv, itemFn) {
                            var type = getNilType(iSec, inv['Description']);

                            return {
                                "sply_ty": type,
                                "expt_amt": (inv['Exempted(other than nil rated/non GST supply)']) ? cnvt2Nm(inv['Exempted(other than nil rated/non GST supply)']) : 0,
                                "nil_amt": (inv['Nil Rated Supplies']) ? cnvt2Nm(inv['Nil Rated Supplies']) : 0,
                                "ngsup_amt": (inv['Non-GST Supplies']) ? cnvt2Nm(inv['Non-GST Supplies']) : 0
                            };
                        };
                        break;
                    case 'doc_issue':
                        var docDetails = ["Invoices for outward supply",
                            "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", "Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "doc_num": docDetails.indexOf(inv['Nature of Document']) + 1,
                                "doc_typ": inv['Nature of Document'],
                                "docs": [itemFn(i, inv)]
                            };
                        };
                        break;
                    case 'supeco':
                        rtFn = function (i, inv, itemFn) {
                            var natSup = null;
                            if(inv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)'){
                                natSup = 'clttx';
                            } else if(inv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)'){
                                natSup = 'paytx';
                            }
                            return {
                                "nat_supp":  natSup,
                                "etin": inv['GSTIN of E-Commerce Operator'].toUpperCase(),
                                "cname": inv['E-Commerce Operator Name'],
                                "suppval": cnvt2Nm(inv['Net value of supplies']),
                                "igst": cnvt2Nm(inv['Integrated tax']),
                                "cgst": cnvt2Nm(inv['Central tax']),
                                "sgst": cnvt2Nm(inv['State/UT tax']),
                                "cess": cnvt2Nm(inv['Cess'])
                            };
                        }
                    break;
                    case 'supecoa':
                        rtFn = function (i, inv, itemFn) {
                            var natSup = null;
                            if(inv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)'){
                                natSup = 'clttxa';
                            } else if(inv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)'){
                                natSup = 'paytxa';
                            }

                            var year = inv['Financial Year'];
                            var month = inv['Original Month/Quarter'];
                            
                            curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                            
                            return {
                                "nat_supp": natSup,
                                "oyear": inv['Financial Year'],
                                "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                                "oetin": inv['Original GSTIN of E-Commerce Operator'].toUpperCase(),
                                "etin": inv['Revised GSTIN of E-Commerce Operator'].toUpperCase(),
                                "cname": inv['E-Commerce Operator Name'],
                                "suppval": cnvt2Nm(inv['Revised Net value of supplies']),
                                "igst": cnvt2Nm(inv['Integrated tax']),
                                "cgst": cnvt2Nm(inv['Central tax']),
                                "sgst": cnvt2Nm(inv['State/UT tax']),
                                "cess": cnvt2Nm(inv['Cess']),
                                "omon":  curntOMon,
                                "oyear": getYearFromTheMonth(iYearsList, curntOMon),
                                "supplierRecipientName":null,
                                "val": null
                            };
                        }
                    break;
                    case 'ecomb2b': 
                    rtFn = function (i, inv, itemFn) {
                        var statecd = inv['Place Of Supply'].substring(0, 2);
                        if (dashGstin == statecd && !isSEZ) {
                        return {
                            "inum": inv['Document Number'],
                            "idt": inv['Document Date'],
                            "val": cnvt2Nm(inv['Value of supplies made']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "supplierName": null,
                            "receipientName":null,
                            "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                            "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                            "inv_typ": getInvType(iSec, inv['Document type']),
                            "itms": [itemFn(i, inv)],
                            "sname": inv['Supplier Name'].toUpperCase(),
                            "cname":inv['Recipient Name'].toUpperCase(),
                            "flag": "N",
                            "sply_ty": 'INTRA'

                        };
                    } else {
                        return {
                            "inum": inv['Document Number'],
                            "idt": inv['Document Date'],
                            "val": cnvt2Nm(inv['Value of supplies made']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "supplierName": null,
                            "receipientName":null,
                            "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                            "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                            "inv_typ": getInvType(iSec, inv['Document type']),
                            "itms": [itemFn(i, inv)],
                            "sname": inv['Supplier Name'].toUpperCase(),
                            "cname":inv['Recipient Name'].toUpperCase(),
                            "flag": "N",
                            "sply_ty": 'INTER'

                        };
                    }
                    }
                
                break;
            
                    case 'ecomab2b': 
                    rtFn = function (i, inv, itemFn) {
                        var statecd = inv['Place Of Supply'].substring(0, 2);
                            if (dashGstin == statecd && !isSEZ) {
                        return {
                            "inum": inv['Revised Document Number'],
                            "idt": inv['Revised Document Date'],
                            "oinum": inv['Original Document Number'],
                            "oidt": inv['Original Document Date'],
                            "val": cnvt2Nm(inv['Value of supplies made']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "supplierName": null,
                            "receipientName":null,
                            "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                            "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                            "inv_typ": getInvType(iSec, inv['Document type']),
                            "itms": [itemFn(i, inv)],
                            "sname": inv['Supplier Name'].toUpperCase(),
                            "cname":inv['Recipient Name'].toUpperCase(),
                            "flag": "N",
                            "sply_ty": 'INTRA'

                        };
                    } else {
                        return {
                            "inum": inv['Revised Document Number'],
                            "idt": inv['Revised Document Date'],
                            "oinum": inv['Original Document Number'],
                            "oidt": inv['Original Document Date'],
                            "val": cnvt2Nm(inv['Value of supplies made']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "supplierName": null,
                            "receipientName":null,
                            "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                            "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                            "inv_typ": getInvType(iSec, inv['Document type']),
                            "itms": [itemFn(i, inv)],
                            "sname": inv['Supplier Name'].toUpperCase(),
                            "cname":inv['Recipient Name'].toUpperCase(),
                            "flag": "N",
                            "sply_ty": 'INTER'

                        };
                    }
                    }
                    break;
                    case 'ecomb2c':
                        rtFn = function (i, inv, itemFn) {
                            var statecd = inv['Place Of Supply'].substring(0, 2);
                            if (dashGstin == statecd && !isSEZ) {
                            return {
                                "sply_ty": 'INTRA',
                                "stin": inv['Supplier GSTIN/UIN'].toUpperCase(),
                                "cname": inv['Supplier Name'].toUpperCase(),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "rt": inv['Rate'],
                                "csamt": inv['Cess Amount'],
                                "sply_ty": 'INTRA',
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                                "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                                "iamt": 0.00,
                                "flag": "N"
                            };
                        } else {
                            return {
                                "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                                "cname": inv['Supplier Name'].toUpperCase(),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "csamt": inv['Cess Amount'],
                                "sply_ty": 'INTER',
                                "camt": 0.00,
                                "samt": 0.00,
                                "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01),
                                "flag": "N"
                            };
                            }
                        }
                    break;
                    case 'ecomab2c':
                        rtFn = function (i, inv, itemFn) {
                            var statecd = inv['Place Of Supply'].substring(0, 2);
                            var year = inv['Financial Year'],
                            month = inv['Original Month'],
                            curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                            if (dashGstin == statecd && !isSEZ) {
                            return {
                                "sply_ty": 'INTRA',
                                "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                                "sname": inv['Supplier Name'].toUpperCase(),
                                "omon": curntOMon, 
                                "ostin":null, 
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                //"txval": inv['Taxable Value'],
                                //"rt": inv['Rate'],
                                //"csamt": inv['Cess Amount'],
                                "itms": [itemFn(i, inv)],
                                "oyear": getYearFromTheMonth(iYearsList, curntOMon),
                                "flag": "N"
                            };
                        } else {
                            return {
                                "sply_ty": 'INTER',
                                "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                                "sname": inv['Supplier Name'].toUpperCase(),
                                "omon": curntOMon,
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                //"txval": inv['Taxable Value'],
                                //"rt": inv['Rate'],
                                //"csamt": inv['Cess Amount'],
                                "itms": [itemFn(i, inv)],
                                "oyear": getYearFromTheMonth(iYearsList, curntOMon),
                                "flag": "N"
                            };
                            }
                        }
                    break;
                    case 'ecomurp2b': 
                        rtFn = function (i, inv, itemFn) {
                            var statecd = inv['Place Of Supply'].substring(0, 2);
                        if (dashGstin == statecd && !isSEZ) {
                            return {
                                "inum": inv['Document Number'],
                                "idt": inv['Document Date'],
                                "val": cnvt2Nm(inv['Value of supplies made']),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "receipientName":null,
                                "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                                "inv_typ": getInvType(iSec, inv['Document type']),
                                "itms": [itemFn(i, inv)],
                                "cname":inv['Recipient Name'].toUpperCase(),
                                "flag": "N",
                                "sply_ty": 'INTRA'

                            };
                        } else {
                            return {
                                "inum": inv['Document Number'],
                                "idt": inv['Document Date'],
                                "val": cnvt2Nm(inv['Value of supplies made']),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "receipientName":null,
                                "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                                "inv_typ": getInvType(iSec, inv['Document type']),
                                "itms": [itemFn(i, inv)],
                                "cname":inv['Recipient Name'].toUpperCase(),
                                "flag": "N",
                                "sply_ty": 'INTER'
                            };
                        }
                        }
                        break;
                    case 'ecomaurp2b': 
                    rtFn = function (i, inv, itemFn) {
                        var statecd = inv['Place Of Supply'].substring(0, 2);
                        if (dashGstin == statecd && !isSEZ) {
                        return {
                            "inum": inv['Revised Document Number'],
                            "idt": inv['Revised Document Date'],
                            "oinum": inv['Original Document Number'],
                            "oidt": inv['Original Document Date'],
                            "val": cnvt2Nm(inv['Value of supplies made']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "receipientName":null,
                            "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                            "inv_typ": getInvType(iSec, inv['Document type']),
                            "itms": [itemFn(i, inv)],
                            "cname":inv['Recipient Name'],
                            "flag": "N",
                            "sply_ty": 'INTRA'

                        };
                    } else {
                        return {
                            "inum": inv['Revised Document Number'],
                            "idt": inv['Revised Document Date'],
                            "oinum": inv['Original Document Number'],
                            "oidt": inv['Original Document Date'],
                            "val": cnvt2Nm(inv['Value of supplies made']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "receipientName":null,
                            "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                            "inv_typ": getInvType(iSec, inv['Document type']),
                            "itms": [itemFn(i, inv)],
                            "cname":inv['Recipient Name'],
                            "flag": "N",
                            "sply_ty": 'INTER'

                        };
                    }
                    }
                    break;
                    case 'ecomurp2c':
                        rtFn = function (i, inv, itemFn) {
                            var statecd = inv['Place Of Supply'].substring(0, 2);
                            if (dashGstin == statecd && !isSEZ) {
                            return {
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "csamt": inv['Cess Amount'],
                                "sply_ty": 'INTRA',
                                "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                                "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                                "iamt": 0.00,
                                "flag": "N"
                            };
                        } else {
                            return {
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "csamt": inv['Cess Amount'],
                                "sply_ty": 'INTER',
                                "camt": 0.00,
                                "samt": 0.00,
                                "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01),
                                "flag": "N"
                            };
                            }
                        }
                    break;
                    case 'ecomaurp2c':
                        rtFn = function (i, inv, itemFn) {
                            var statecd = inv['Place Of Supply'].substring(0, 2);
                            var year = inv['Financial Year'],
                            month = inv['Original Month'],
                            curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                            if (dashGstin == statecd && !isSEZ) {
                                return {
                                    "sply_ty": 'INTRA',
                                    "pos": (inv['Place Of Supply']).substring(0, 2),
                                    "omon":curntOMon,
                                    "itms": [itemFn(i, inv)],
                                    "oyear": getYearFromTheMonth(iYearsList, curntOMon),
                                    "flag": "N"
                                };
                            } else {
                                return {
                                    "sply_ty": 'INTER',
                                    "pos": (inv['Place Of Supply']).substring(0, 2),
                                    "omon":curntOMon,
                                    "itms": [itemFn(i, inv)],
                                    "oyear": getYearFromTheMonth(iYearsList, curntOMon),
                                    "flag": "N"
                                };
                            }
                        }
                    break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case 'b2b': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "inum": inv['Invoice Number'],
                                "idt": inv['Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "rchrg": inv['Reverse Charge'],
                                "ctin": inv['GSTIN of Supplier'],
                                "inv_typ": getInvType(iSec, inv['Invoice Type']),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'b2bur': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "inum": inv['Invoice Number'],
                                "idt": inv['Invoice date'],
                                "val": cnvt2Nm(inv['Invoice Value']),
                                "sup_name": inv['Supplier Name'],
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "sp_typ": inv['Supply Type'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'b2ba': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "oinum": inv['Original Invoice Number'],
                                "oidt": inv['Original Invoice date'],
                                "inum": inv['Revised Invoice Number'],
                                "idt": inv['Revised Invoice date'],
                                "val": inv['Total Invoice Value'],
                                "pos": (inv['Place Of Supply'] < 10) ? "0" + inv['Place Of Supply'] : "" + inv['Place Of Supply'],
                                "rchrg": inv['Reverse Charge'],
                                "ctin": inv['Supplier GSTIN'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'b2bura': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "oinum": inv['Original Invoice Number'],
                                "oidt": inv['Original Invoice date'],
                                "inum": inv['Revised Invoice Number'],
                                "idt": inv['Revised Invoice date'],
                                "val": inv['Total Invoice Value'],
                                "pos": (inv['Place Of Supply'] < 10) ? "0" + inv['Place Of Supply'] : "" + inv['Place Of Supply'],
                                "rchrg": inv['Reverse Charge'],
                                "cname": inv['Supplier Name'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'imp_g': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            if (!inv['GSTIN Of SEZ Supplier']) {
                                inv['GSTIN Of SEZ Supplier'] = '';
                            }
                            return {
                                "ctin": inv['GSTIN Of SEZ Supplier'],
                                "boe_num": inv['Bill Of Entry Number'],
                                "boe_dt": inv['Bill Of Entry Date'],
                                "is_sez": (inv['Document type'] == 'Received from SEZ') ? "Y" : "N",
                                "boe_val": cnvt2Nm(inv['Bill Of Entry Value']),
                                "port_code": inv['Port Code'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'imp_ga': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "oboe_num": inv['Original Bill Of Entry Number'],
                                "oboe_dt": inv['Original Bill Of Entry date'],
                                "boe_num": inv['Revised Bill Of Entry Number'],
                                "boe_dt": inv['Revised Bill Of Entry date'],
                                "port_code": inv['Port Code'],
                                "boe_val": inv['Total Invoice Value'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'txi': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": inv["Supply Type"],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'atxi': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "reg_type": inv['Type'],
                                "ocpty": inv['Original Supplier GSTIN'],
                                "odnum": inv['Original Document Number'],
                                "otdt": inv['Original Document date'],
                                "cpty": inv['Revised Supplier GSTIN'],
                                "state_cd": "" + inv['Recipient State Code'],
                                "dnum": inv['Revised Document Number'],
                                "dt": inv['Revised Document date'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'imp_s': // GSTR2
                        var tempInvDate = "";

                        rtFn = function (i, inv, itemFn) {
                            //there is a mismatch between excel template and the export to excel
                            if (inv.hasOwnProperty('Invoice date'))
                                tempInvDate = inv['Invoice date'];
                            else
                                tempInvDate = inv['Invoice Date'];
                            return {
                                "inum": inv['Invoice Number of Reg Recipient'],
                                "idt": tempInvDate,
                                "ival": cnvt2Nm(inv['Invoice Value']),
                                "pos": (inv['Place Of Supply']).substring(0, 2),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'imp_sa': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "oi_num": inv['Original Invoice Number'],
                                "oi_dt": inv['Original Invoice date'],
                                "i_num": inv['Revised Invoice Number'],
                                "i_dt": inv['Revised Invoice date'],
                                "i_val": inv['Total Invoice Value'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        break;
                    case 'cdnr': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "nt_num": inv['Note/Refund Voucher Number'],
                                "nt_dt": inv['Note/Refund Voucher date'],
                                "inum": inv['Invoice/Advance Payment Voucher Number'],
                                "ntty": inv["Document Type"],
                                "rsn": inv["Reason For Issuing document"],
                                "idt": inv['Invoice/Advance Payment Voucher date'],
                                "val": inv['Note/Refund Voucher Value'] ? cnvt2Nm(inv['Note/Refund Voucher Value']) : 0,
                                "p_gst": inv['Pre GST'],
                                "sp_typ": inv['Supply Type'],
                                "ctin": inv['GSTIN of Supplier'],
                                "itms": [itemFn(i, inv)]

                            };
                        }
                        break;
                    case 'cdnur': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "nt_num": inv['Note/Voucher Number'],
                                "nt_dt": inv['Note/Voucher date'],
                                "inum": inv['Invoice/Advance Payment Voucher number'],
                                "ntty": inv["Document Type"],
                                "rsn": inv["Reason For Issuing document"],
                                "idt": inv['Invoice/Advance Payment Voucher date'],
                                "val": inv['Note/Voucher Value'] ? cnvt2Nm(inv['Note/Voucher Value']) : 0,
                                "p_gst": inv['Pre GST'],
                                "sp_typ": inv['Supply Type'],
                                "inv_typ": inv['Invoice Type'],
                                "itms": [itemFn(i, inv)]

                            };
                        }
                        break;
                    case 'cdnra': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "ont_num": inv['Original Debit Note Number'],
                                "ont_dt": inv['Original Debit Note date'],
                                "nt_num": inv['Revised Debit Note Number'],
                                "nt_dt": inv['Revised Debit Note date'],
                                "inum": inv['Invoice Number'],
                                "ntty": inv["Note Type"],
                                "rsn": inv["Reason For Issuing Note"],
                                "idt": inv['Invoice date'],
                                "val": inv['Total Invoice Value'],
                                "ctin": inv['Supplier GSTIN'],
                                "irt": inv['IGST Rate'],
                                "iamt": inv['IGST Amount'],
                                "crt": inv['CGST Rate'],
                                "camt": inv['CGST Amount'],
                                "srt": inv['SGST Rate'],
                                "samt": inv['SGST Amount'],
                                "csrt": inv['CESS Rate'],
                                "csamt": inv['Cess Amount'],
                                "itc": {
                                    "elg": inv['Eligibility For ITC'],
                                    "tx_i": inv["Taxable IGST"],
                                    "tx_s": inv["Taxable SGST"],
                                    "tx_c": inv["Taxable CGST"],
                                    "tx_cs": inv["Taxable CESS"],
                                    "tc_i": inv["ITC IGST"],
                                    "tc_s": inv["ITC SGST"],
                                    "tc_c": inv["ITC CGST"],
                                    "tc_cs": inv["ITC CESS"]
                                }
                            };
                        }
                        break;
                    case 'hsnsum': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            return {
                                "hsn_sc": inv['HSN'],
                                "desc": inv['Description'],
                                "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                "qty": parseFloat(inv['Total Quantity']),
                                "val": cnvt2Nm(inv['Total Value']),
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                "camt": cnvt2Nm(inv['Central Tax Amount']),
                                "csamt": cnvt2Nm(inv['Cess Amount'])
                            };
                        }
                        break;
                    case 'atadj': // GSTR2

                        rtFn = function (i, inv, itemFn) {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": inv["Supply Type"],
                                "itms": [itemFn(i, inv)]
                            };

                        }
                        break;
                    case 'nil': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            var m = {};
                            var k = inv['Description'];
                            if (k == 'Inter-State supplies') {
                                var desc = 'inter';
                            } else if (k == 'Intra-State supplies') {
                                var desc = 'intra';
                            }

                            m[desc] = {
                                "sply_ty": getNilType(iSec, inv['Description']),
                                "exptdsply": inv['Exempted (other than nil rated/non GST supply )'] ? cnvt2Nm(inv['Exempted (other than nil rated/non GST supply )']) : 0,
                                "cpddr": inv['Composition taxable person'] ? cnvt2Nm(inv['Composition taxable person']) : 0,
                                "nilsply": inv['Nil Rated Supplies'] ? cnvt2Nm(inv['Nil Rated Supplies']) : 0,
                                "ngsply": inv['Non-GST supplies'] ? cnvt2Nm(inv['Non-GST supplies']) : 0
                            }
                            return m;
                        };
                        break;
                    case 'itc_rvsl': // GSTR2
                        rtFn = function (i, inv, itemFn) {
                            var itcrvsl = {};
                            var dec = inv['Description for reversal of ITC'];
                            var rule = rules[dec]
                            itcrvsl[rule] = {
                                "iamt": inv['ITC Integrated Tax Amount'] ? cnvt2Nm(inv['ITC Integrated Tax Amount']) : 0,
                                "camt": inv['ITC Central Tax Amount'] ? cnvt2Nm(inv['ITC Central Tax Amount']) : 0,
                                "samt": inv['ITC State/UT Tax Amount'] ? cnvt2Nm(inv['ITC State/UT Tax Amount']) : 0,
                                "csamt": inv['ITC Cess Amount'] ? cnvt2Nm(inv['ITC Cess Amount']) : 0,
                            };
                            return itcrvsl;
                        }
                        break;
                }

            }
            return rtFn;
        }
        //To get the item level values from excel a/c payload properties
        function getItm(iSec, iForm, transLan) {
            var rtFn = null;
            var dashGstin = (shareData.dashBoardDt.gstin).substring(0, 2),
                isSEZ = shareData.isSezTaxpayer;
            if (iForm == "GSTR1" || iForm == 'GSTR1A') {
                var intraState = false;
                switch (iSec) {
                    case 'b2b':
                    case 'b2ba':
                        rtFn = function (i, inv) {
                            var invType = getInvType(iSec, inv['Invoice Type']);


                            var diffFactor = 1.00;

                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            var tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                            //tempNum = parseInt(i)//Old code for num; Now changed to Rate*100
                            if (dashGstin == inv['Place Of Supply'].substring(0, 2) && (invType == 'R' || invType == 'DE') && !isSEZ) {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "camt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2))),
                                        "samt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2))),
                                        "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    }
                                };
                            } else {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "iamt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2))),
                                        "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '' || invType === 'SEWOP') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    }
                                };
                            }
                        }
                        break;


                    case 'b2cl':
                    case 'b2cla':
                        rtFn = function (i, inv) {
                            var tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                            var pos = '';
                            if (iSec == 'b2cl') {
                                pos = inv['Place Of Supply'].substring(0, 2);
                            }
                            else {
                                pos = inv['Original Place Of Supply'].substring(0, 2)
                            }

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            if (dashGstin == pos && !isSEZ) {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "camt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                        "samt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                        "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    }
                                };
                            } else {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                        "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    }
                                };
                            }
                        }
                        break;
                    case 'b2csa':
                        rtFn = function (i, inv) {
                            var statecd = inv['Place Of Supply'].substring(0, 2);

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            if (dashGstin == statecd && !isSEZ) {

                                return {

                                    "rt": inv['Rate'],
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "camt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "samt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "csamt": cnvt2Nm(inv['Cess Amount'])
                                }
                            }
                            else {
                                return {

                                    "rt": inv['Rate'],
                                    "txval": cnvt2Nm(inv['Taxable Value']),
                                    "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                    "csamt": cnvt2Nm(inv['Cess Amount'])
                                }
                            }

                        };
                        break;
                    case 'cdnr':
                        rtFn = function (i, inv) {
                            var ntSplyType = getInvType(iSec, inv[transLan.LBL_NOTE_SUP_TYP]);
                            var tempNum = inv[transLan.LBL_Rate] * 100 + 1;
                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null)
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);

                            if (dashGstin == inv[transLan.LBL_POS_Excel].substring(0, 2) && !isSEZ && (ntSplyType == "R" || ntSplyType == "DE")) {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv[transLan.LBL_Taxable_Value]),
                                        "rt": inv[transLan.LBL_Rate],
                                        "camt": (ntSplyType === 'SEWOP') ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.005 * diffFactor).toFixed(2)),
                                        "samt": (ntSplyType === 'SEWOP') ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.005 * diffFactor).toFixed(2)),
                                        "csamt": (!inv[transLan.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[transLan.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[transLan.LBL_Cess_Amount]).toFixed(2)))
                                    }
                                };

                            } else {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv[transLan.LBL_Taxable_Value]),
                                        "rt": inv[transLan.LBL_Rate],
                                        "iamt": (ntSplyType === 'SEWOP') ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.01 * diffFactor).toFixed(2)),
                                        "csamt": (!inv[transLan.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[transLan.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[transLan.LBL_Cess_Amount]).toFixed(2)))
                                    }
                                };
                            }
                        }
                        break;
                    case 'cdnra':
                        rtFn = function (i, inv) {
                            var ntSplyType = getInvType(iSec, inv[transLan.LBL_NOTE_SUP_TYP]);
                            var tempNum = inv[transLan.LBL_Rate] * 100 + 1;
                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null)
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);

                            if (dashGstin == inv[transLan.LBL_POS_Excel].substring(0, 2) && !isSEZ && (ntSplyType == "R" || ntSplyType == "DE")) {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv[transLan.LBL_Taxable_Value]),
                                        "rt": inv[transLan.LBL_Rate],
                                        "camt": (ntSplyType === 'SEWOP') ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.005 * diffFactor).toFixed(2)),
                                        "samt": (ntSplyType === 'SEWOP') ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.005 * diffFactor).toFixed(2)),
                                        "csamt": (!inv[transLan.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[transLan.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[transLan.LBL_Cess_Amount]).toFixed(2)))
                                    }
                                };

                            } else {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv[transLan.LBL_Taxable_Value]),
                                        "rt": inv[transLan.LBL_Rate],
                                        "iamt": (ntSplyType === 'SEWOP') ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.01 * diffFactor).toFixed(2)),
                                        "csamt": (!inv[transLan.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[transLan.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[transLan.LBL_Cess_Amount]).toFixed(2)))
                                    }
                                };
                            }
                        }
                        break;
                    case 'cdnur':
                    case 'cdnura':
                        rtFn = function (i, inv) {
                            var tempNum = inv[transLan.LBL_Rate] * 100 + 1; // now minimum 0 is required

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty(transLan.LBL_Diff_Percentage) && inv[transLan.LBL_Diff_Percentage] !== null)
                                diffFactor = (inv[transLan.LBL_Diff_Percentage] / 100).toFixed(2);

                            return {
                                "num": tempNum,
                                "itm_det": {
                                    "txval": cnvt2Nm(inv[transLan.LBL_Taxable_Value]),
                                    "rt": inv[transLan.LBL_Rate],

                                    "iamt": (inv[transLan.LBL_UR_TYPE] == "EXPWOP") ? 0 : parseFloat((inv[transLan.LBL_Taxable_Value] * inv[transLan.LBL_Rate] * 0.01 * diffFactor).toFixed(2)),

                                    "csamt": (!inv[transLan.LBL_Cess_Amount] || inv[transLan.LBL_Cess_Amount] == '' || inv[transLan.LBL_UR_TYPE] == "EXPWOP") ? 0 : parseFloat((parseFloat(inv[transLan.LBL_Cess_Amount]).toFixed(2)))
                                }
                            };

                        }
                        break;
                    case 'at':
                        rtFn = function (i, inv) {

                            var statecd = '';
                            if (iSec == 'ata') {
                                statecd = inv['Original Place Of Supply'].substring(0, 2);
                            } else {
                                statecd = inv['Place Of Supply'].substring(0, 2);
                            }

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            if (dashGstin == statecd && !isSEZ) {

                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Received']),
                                    "camt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "samt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }
                            else {
                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Received']),
                                    "iamt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }

                        };
                        break;
                    case 'ata':
                        rtFn = function (i, inv) {

                            var statecd = '';
                            if (iSec == 'ata') {
                                statecd = inv['Original Place Of Supply'].substring(0, 2);
                            } else {
                                statecd = inv['Place Of Supply'].substring(0, 2);
                            }

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                            if (dashGstin == statecd && !isSEZ) {

                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Received']),
                                    "camt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "samt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }
                            else {
                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Received']),
                                    "iamt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }

                        };
                        break;
                    case 'atadj':
                        rtFn = function (i, inv) {

                            var statecd = '';
                            if (iSec == 'atadja') {
                                statecd = inv['Original Place Of Supply'].substring(0, 2);
                            } else {
                                statecd = inv['Place Of Supply'].substring(0, 2);
                            }

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            //if (dashGstin == statecd && inv['Supplies covered under section 7 of IGST Act'] != 'Y' && !isSEZ) {
                            if (dashGstin == statecd && !isSEZ) {

                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Adjusted']),
                                    "camt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "samt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }
                            else {
                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Adjusted']),
                                    "iamt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }

                        };
                        break;
                    case 'atadja':
                        rtFn = function (i, inv) {

                            var statecd = '';
                            if (iSec == 'atadja') {
                                statecd = inv['Original Place Of Supply'].substring(0, 2);
                            } else {
                                statecd = inv['Place Of Supply'].substring(0, 2);
                            }

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            if (dashGstin == statecd && !isSEZ) {

                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Adjusted']),
                                    "camt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "samt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }
                            else {
                                return {

                                    "rt": inv['Rate'],
                                    "ad_amt": cnvt2Nm(inv['Gross Advance Adjusted']),
                                    "iamt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                                    "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                }
                            }

                        };
                        break;



                    case 'exp':
                    case 'expa':
                        rtFn = function (i, inv) {

                            var diffFactor = 1.00;
                            if (inv.hasOwnProperty('Applicable % of Tax Rate') && inv['Applicable % of Tax Rate'] !== null)
                                diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                            return {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "iamt": (inv["Export Type"] == "WOPAY") ? 0 : parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                "csamt": (inv["Export Type"] == "WOPAY") ? 0 : cnvt2Nm(inv['Cess Amount'])
                            }

                        };
                        break;
                    case 'doc_issue':
                        rtFn = function (i, inv) {
                            return {
                                "num": parseInt(i),
                                "from": inv['Sr. No. From'].toString(),
                                "to": inv['Sr. No. To'].toString(),
                                "totnum": parseFloat(inv['Total Number']),
                                "cancel": parseFloat(inv['Cancelled']),
                                "net_issue": parseFloat(inv['Total Number'] - inv['Cancelled'])
                            }

                        };
                        break;
                    case 'ecomb2b':
                    case 'ecomab2b':
                    case 'ecomurp2b':
                    case 'ecomaurp2b':
                    
                        rtFn = function (i, inv) {
                            var invType = getInvType(iSec, inv['Document type']);


                            var tempNum = inv['Rate'] * 100 + 1; 
                            if (dashGstin == inv['Place Of Supply'].substring(0, 2) && (invType == 'R' || invType == 'DE') && !isSEZ) {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "camt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 ).toFixed(2))),
                                        "samt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 ).toFixed(2))),
                                        "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    }
                                };
                            } else {
                                return {
                                    "num": tempNum,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "iamt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01).toFixed(2))),
                                        "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '' || invType === 'SEWOP') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    }
                                };
                            }
                        }
                        break;
                        case 'ecomab2c':
                        case 'ecomaurp2c':
                            rtFn = function (i, inv) {
                                if (dashGstin == inv['Place Of Supply'].substring(0, 2) && !isSEZ) {
                                    return {
                                            "rt": inv['Rate'],
                                            "txval": cnvt2Nm(inv['Taxable Value']),
                                            "camt": (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 ).toFixed(2))),
                                            "samt": (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 ).toFixed(2))),
                                            "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    };
                                } else {
                                    return {
                                            "rt": inv['Rate'],
                                            "txval": cnvt2Nm(inv['Taxable Value']),
                                            "iamt":  (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01).toFixed(2))),
                                            "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                                    };
                                }
                            }
                            break;
                    default:
                        rtFn = null
                        break;
                }
            } else if (iForm == "GSTR2") {

                var impDt = {
                    "Inputs": "ip", "Input services": "is", "Capital goods": "cp", "Ineligible": "no",
                    "ip": "ip", "is": "is", "cp": "cp", "no": "no"

                }

                switch (iSec) {

                    case 'b2b': // GSTR2
                        rtFn = function (i, inv) {
                            dashGstin = (inv['GSTIN of Supplier']).substring(0, 2);
                            var invType = getInvType(iSec, inv['Invoice Type']),
                                elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                            if (dashGstin == inv['Place Of Supply'].substring(0, 2) && invType == 'R') {
                                return {
                                    "num": parseInt(i) + 1,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "camt": inv['Central Tax Paid'] ? cnvt2Nm(inv['Central Tax Paid']) : 0,
                                        "samt": inv['State/UT Tax Paid'] ? cnvt2Nm(inv['State/UT Tax Paid']) : 0,
                                        "csamt": (invType === 'SEWOP') ? 0 : cnvt2Nm(inv['Cess Paid'])
                                    },
                                    "itc": {
                                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                        "tx_s": (inv["Availed ITC Central Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Central Tax"]) : 0,
                                        "tx_c": (inv["Availed ITC State/UT Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC State/UT Tax"]) : 0,
                                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,
                                    }
                                };
                            } else {
                                return {
                                    "num": parseInt(i) + 1,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                        "csamt": (invType === 'SEWOP') ? 0 : cnvt2Nm(inv['Cess Paid'])
                                    },
                                    "itc": {
                                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                        "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Integrated Tax"]) : 0,
                                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Cess"]) : 0,
                                    }
                                };
                            }
                        }
                        break;
                    case 'b2bur': // GSTR2
                        rtFn = function (i, inv) {
                            var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                            if ('Inter State' != inv['Supply Type']) {
                                return {
                                    "num": parseInt(i) + 1,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "camt": inv['Central Tax Paid'] ? cnvt2Nm(inv['Central Tax Paid']) : 0,
                                        "samt": inv['State/UT Tax Paid'] ? cnvt2Nm(inv['State/UT Tax Paid']) : 0,
                                        "csamt": inv['Cess Paid'] ? parseFloat(inv['Cess Paid']) : 0
                                    }, "itc": {
                                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                        "tx_s": (inv["Availed ITC Central Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Central Tax"]) : 0,
                                        "tx_c": (inv["Availed ITC State/UT Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC State/UT Tax"]) : 0,
                                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,

                                    }
                                };
                            } else {

                                return {
                                    "num": parseInt(i) + 1,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                        "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0
                                    },
                                    "itc": {
                                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                        "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,

                                    }
                                };
                            }

                        }
                        break;
                    case 'b2ba': // GSTR2
                    case 'b2bura': // GSTR2
                        rtFn = function (i, inv) {
                            return {
                                "num": parseInt(i) + 1,
                                "itm_det": {
                                    "txval": inv['Taxable Value'],
                                    "rt": inv['Rate'],
                                    "csamt": inv['Cess Amount'],
                                    "camt": inv['CGST Amount'],
                                    "samt": inv['SGST Amount'],

                                    "iamt": inv['IGST Amount'],
                                    "crt": inv['CGST Rate'],

                                    "srt": inv['SGST Rate'],

                                    "csrt": inv['CESS Rate'],

                                },
                                "itc": {
                                    "elg": inv['Eligibility For ITC'],
                                    "tx_i": inv["Taxable IGST"],
                                    "tx_s": inv["Taxable SGST"],
                                    "tx_c": inv["Taxable CGST"],
                                    "tx_cs": inv["Taxable CESS"],
                                    "tc_i": inv["ITC IGST"],
                                    "tc_s": inv["ITC SGST"],
                                    "tc_c": inv["ITC CGST"],
                                    "tc_cs": inv["ITC CESS"]
                                }
                            };
                        }
                        break;
                    case 'cdnr': // GSTR2
                    case 'cdnur': // GSTR2
                        rtFn = function (i, inv) {
                            var elgibility = impDt[(inv['Eligibility For ITC']).trim()];

                            if ('Inter State' != inv['Supply Type']) {
                                return {
                                    "num": parseInt(i) + 1,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "camt": inv['Central Tax Paid'] ? cnvt2Nm(inv['Central Tax Paid']) : 0,
                                        "samt": inv['State/UT Tax Paid'] ? cnvt2Nm(inv['State/UT Tax Paid']) : 0,
                                        "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0
                                    }, "itc": {
                                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                        "tx_s": (inv["Availed ITC Central Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Central Tax"]) : 0,
                                        "tx_c": (inv["Availed ITC State/UT Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC State/UT Tax"]) : 0,
                                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,

                                    }
                                };
                            } else {
                                return {
                                    "num": parseInt(i) + 1,
                                    "itm_det": {
                                        "txval": cnvt2Nm(inv['Taxable Value']),
                                        "rt": inv['Rate'],
                                        "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                        "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0
                                    },
                                    "itc": {
                                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                        "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,

                                    }
                                };
                            }

                        }
                        break;
                    case 'txi': // GSTR2
                    case 'atxi': // GSTR2
                        rtFn = function (i, inv) {
                            if ('Inter State' != inv['Supply Type']) {

                                return {
                                    "num": inv['Rate'] + 1,
                                    "rt": inv['Rate'],
                                    "adamt": cnvt2Nm(inv['Gross Advance Paid']),
                                    "camt": parseFloat((inv['Gross Advance Paid'] * inv['Rate'] * 0.005).toFixed(2)),
                                    "samt": parseFloat((inv['Gross Advance Paid'] * inv['Rate'] * 0.005).toFixed(2)),
                                    "csamt": inv['Cess Amount'] ? cnvt2Nm(inv['Cess Amount']) : 0
                                }
                            }
                            else {
                                return {
                                    "num": inv['Rate'] + 1,
                                    "rt": inv['Rate'],
                                    "adamt": parseFloat(inv['Gross Advance Paid']),
                                    "iamt": parseFloat((inv['Gross Advance Paid'] * inv['Rate'] * 0.01).toFixed(2)),//inv['CGST Amount'],
                                    "csamt": inv['Cess Amount'] ? cnvt2Nm(inv['Cess Amount']) : 0
                                }
                            }

                        };
                        break;

                    case 'imp_g': // GSTR2
                    case 'imp_ga': // GSTR2
                        rtFn = function (i, inv) {
                            var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                            return {
                                "num": i + 1,
                                "txval": inv['Taxable Value'] ? cnvt2Nm(inv['Taxable Value']) : 0,
                                "rt": inv['Rate'],
                                "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0,
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0
                            }
                        }
                        break;
                    case 'imp_s': // GSTR2
                    case 'imp_sa': // GSTR2
                        rtFn = function (i, inv) {
                            var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                            return {
                                "num": i + 1,
                                "txval": inv['Taxable Value'] ? cnvt2Nm(inv['Taxable Value']) : 0,
                                "rt": inv['Rate'],
                                "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0,
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0
                            }
                        }
                        break;
                    case 'atadj': // GSTR2
                        rtFn = function (i, inv) {
                            if ('Inter State' != inv['Supply Type']) {
                                return {
                                    "num": inv['Rate'] + 1,
                                    "rt": inv['Rate'],
                                    "adamt": cnvt2Nm(inv['Gross Advance Paid to be Adjusted']),
                                    "camt": parseFloat((inv['Gross Advance Paid to be Adjusted'] * inv['Rate'] * 0.005).toFixed(2)),
                                    "samt": parseFloat((inv['Gross Advance Paid to be Adjusted'] * inv['Rate'] * 0.005).toFixed(2)),
                                    "csamt": inv['Cess Adjusted'] ? cnvt2Nm(inv['Cess Adjusted']) : 0
                                }
                            }
                            else {
                                return {
                                    "num": inv['Rate'] + 1,
                                    "rt": inv['Rate'],
                                    "adamt": cnvt2Nm(inv['Gross Advance Paid to be Adjusted']),
                                    "iamt": parseFloat((inv['Gross Advance Paid to be Adjusted'] * inv['Rate'] * 0.01).toFixed(2)),//inv['CGST Amount'],
                                    "csamt": inv['Cess Adjusted'] ? cnvt2Nm(inv['Cess Adjusted']) : 0
                                }
                            }

                        };
                        break;
                    default: // GSTR2
                        rtFn = null
                        break;
                }
            }
            return rtFn;
        }

        //To get new invoice row structure
        function getNewInv(iSec, iForm) {
            var newInvRw = {};
            var dashGstin = (shareData.dashBoardDt.gstin).substring(0, 2);
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case "b2b":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "supplierRecipientName": null,
                            "rchrg": 'N',
                            "diff_percent": null,
                            "ctin": null,
                            "inv_typ": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "b2ba":
                        newInvRw = {
                            "oinum": null,
                            "oidt": null,
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "supplierRecipientName": null,
                            "rchrg": 'N',
                            'diff_percent': null,
                            "ctin": null,
                            "inv_typ": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "b2cl":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "etin": null,
                            "diff_percent": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "b2cla":
                        newInvRw = {
                            "oinum": null,
                            "oidt": null,
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "etin": null,
                            "diff_percent": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "cdnr":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "ntty": null,
                            "val": null,
                            "supplierRecipientName": null,
                            "ctin": null,
                            "inum": null,
                            "idt": null,
                            "rsn": null,
                            "pos": null,
                            "rchrg": 'N',
                            "diff_percent": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "cdnur":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "ntty": null,
                            "val": null,
                            "typ": null,
                            "inum": null,
                            "idt": null,
                            "rsn": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "cdnra":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "ont_num": null,
                            "ont_dt": null,
                            "ntty": null,
                            "val": null,
                            "supplierRecipientName": null,
                            "ctin": null,
                            "inum": null,
                            "idt": null,
                            "rsn": null,
                            "pos": null,
                            "rchrg": 'N',
                            "diff_percent": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                            /*"updby": "S"*/
                        }
                        break;
                    case "cdnura":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "ont_num": null,
                            "ont_dt": null,
                            "ntty": null,
                            "val": null,
                            "inum": null,
                            "idt": null,
                            "rsn": null,
                            "pos": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "b2cs":
                        newInvRw = {
                            "sply_ty": "",
                            "pos": null,
                            "diff_percent": null,
                            "etin": "",
                            "typ": "",
                            "txval": 0,
                            "rt": 0,
                            "iamt": 0,
                            "camt": 0,
                            "samt": 0,
                            "csamt": 0,
                        }


                        break;
                    case "b2csa":
                        newInvRw = {
                            "sply_ty": "",
                            "pos": null,
                            "etin": "",
                            "typ": "",
                            "diff_percent": null,
                            "itms": [],
                            "omon": ""
                        }
                        break;
                    case "at":
                        newInvRw = {
                            "pos": null,
                            "itms": [],
                            "sply_ty": null
                        }
                        break;
                    case "ata":
                    case 'atadja':
                        newInvRw = {
                            "omon": null,
                            "pos": null,
                            "itms": [],
                            "sply_ty": null
                        }
                        break;
                    case "exp":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "sbpcode": null,
                            "sbnum": null,
                            "sbdt": null,
                            "val": null,
                            "exp_typ": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "expa":
                        newInvRw = {
                            "oinum": null,
                            "oidt": null,
                            "inum": null,
                            "idt": null,
                            "sbnum": null,
                            "sbdt": null,
                            "sbpcode": null,
                            "val": null,
                            "exp_typ": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "atadj":
                        newInvRw = {
                            "pos": null,
                            "itms": [],
                            "sply_ty": null
                        }
                        break;
                    case "hsn":
                        if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                            newInvRw = {
                                "num": 0,
                                "hsn_sc": null,
                                "desc": null,
                                "uqc": null,
                                "qty": 0,
                                "rt": null,
                                "txval": 0,
                                "iamt": 0,
                                "camt": 0,
                                "samt": 0,
                                "csamt": 0
                            }
                        }
                        else {
                            newInvRw = {
                                "num": 0,
                                "hsn_sc": null,
                                "desc": null,
                                "uqc": null,
                                "qty": null,
                                "val": null,
                                "txval": 0,
                                "iamt": 0,
                                "camt": 0,
                                "samt": 0,
                                "csamt": 0
                            }
                        }
                        break;
                        case "hsn(b2b)":
                        case "hsn(b2c)":    
                                newInvRw = {
                                    "num": 0,
                                    "hsn_sc": null,
                                    "desc": null,
                                    "user_desc": null,
                                    "uqc": null,
                                    "qty": 0,
                                    "rt": null,
                                    "txval": 0,
                                    "iamt": 0,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0
                        }
                        break;
                    case 'supeco': 
                        newInvRw = {
                            "nat_supp": null,
                            "etin": null,
                            "suppval": null,
                            "igst": null,
                            "cgst": null,
                            "sgst": null,
                            "cess": null
                        }
                        break;
                    case 'supecoa': 
                        newInvRw = {
                            "oetin": null,
                            "nat_supp": null,
                            "etin": null,
                            "suppval": null,
                            "igst": null,
                            "cgst": null,
                            "sgst": null,
                            "cess": null,
                            "omon": null
                        }
                        break;
                    case 'ecomb2b':
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "supplierName": null,
                            "receipientName":null,
                            "rtin": null,
                            "stin":null,
                            "inv_typ": null,
                            "itms": [],
                            "flag": "N",
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case 'ecomb2c':
                        newInvRw = {
                            "stin":null,
                            "cname": null,
                            "pos": null,
                            "sply_ty" : null,
                            "txval": null,
                            "rt": 0,
                            "iamt": null,
                            "camt": null,
                            "samt": null,
                            "csamt": null,
                            "flag": "N"
                        }
                        break;
                    case 'ecomurp2b':
                            newInvRw = {
                                "inum": null,
                                "idt": null,
                                "val": null,
                                "pos": null,
                                "receipientName":null,
                                "rtin": null,
                                "inv_typ": null,
                                "itms": [],
                                "flag": "N",
                                "sp_typ": {
                                    "name": null
                                }
                            }
                            break;
                    case 'ecomurp2c':
                            newInvRw = {
                                "pos": null,
                                "sply_ty" : null,
                                "txval": null,
                                "rt": 0,
                                "iamt": null,
                                "camt": null,
                                "samt": null,
                                "flag": "N",
                                "csamt": null,
                            }
                            break;
                    case "ecomab2b":
                            newInvRw = {
                                    "oinum": null,
                                    "oidt": null,
                                    "inum": null,
                                    "idt": null,
                                    "val": null,
                                    "pos": null,
                                    "supplierName": null,
                                    "receipientName":null,
                                    "rtin": null,
                                    "stin":null,
                                    "inv_typ": null,
                                    "itms": [],
                                    "sp_typ": {
                                        "name": null
                                    },
                                    "flag": "N"
                                }
                                break;
                    case "ecomab2c":
                        newInvRw = {
                            "pos": null,
                            "sply_ty": null,
                            "stin":null,
                            "ostin": null,
                            "sname": null,
                            "omon": null,
                            "itms": [],
                            "flag": "N"
                        }
                        break;
                    case "ecomaurp2b":
                            newInvRw = {
                                    "oinum": null,
                                    "oidt": null,
                                    "inum": null,
                                    "idt": null,
                                    "val": null,
                                    "pos": null,
                                    "receipientName":null,
                                    "rtin": null,
                                    "inv_typ": null,
                                    "itms": [],
                                    "sp_typ": {
                                        "name": null
                                    },
                                    "flag": "N"
                                }
                                break;
                    case "ecomaurp2c":
                        newInvRw = {
                            "sply_ty": null,
                            "pos": null,
                            "itms": [],
                            "omon": null,
                            "flag": "N"
                        }
                        break;
                }
            }
            else if (iForm == "GSTR2") {
                switch (iSec) {
                    case "b2b":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "rchrg": 'N',
                            "ctin": null,
                            "inv_typ": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "b2ba":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "oinum": null,
                            "oidt": null,
                            "pos": null,
                            "rchrg": 'N',
                            "ctin": null,
                            "inv_typ": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "b2bur":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "val": null,
                            "pos": null,
                            "rchrg": 'N',
                            "cname": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "b2bura":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "oinum": null,
                            "oidt": null,
                            "val": null,
                            "pos": null,
                            "rchrg": 'N',
                            "cname": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "cdnr":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "ntty": null,
                            "val": null,
                            "ctin": null,
                            "etin": null,
                            "inum": null,
                            "idt": null,
                            "rsn": null,
                            "p_gst": 'N',
                            "pos": null,
                            "itms": [],
                            "sp_typ": null
                        }
                        break;
                    case "cdnur":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "ntty": null,
                            "val": null,

                            "inum": null,
                            "idt": null,
                            "rsn": null,
                            "p_gst": 'N',

                            "itms": [],
                            "sp_typ": null

                        }
                        break;
                    case "cdnra":
                        newInvRw = {
                            "nt_num": null,
                            "nt_dt": null,
                            "val": null,
                            "ctin": null,
                            "inum": null,
                            "idt": null,
                            "irt": 0,
                            "iamt": 0,
                            "crt": 0,
                            "camt": 0,
                            "srt": 0,
                            "samt": 0,
                            "csrt": 0,
                            "csamt": 0,
                            "itc": {
                                "elg": "",
                                "tx_i": 0,
                                "tx_s": 0,
                                "tx_c": 0,
                                "tx_cs": 0,
                                "tc_i": 0,
                                "tc_s": 0,
                                "tc_c": 0,
                                "tc_cs": 0
                            },

                            "rsn": null,
                            "sp_typ": {
                                "name": null
                            },
                            "ntty": null,
                        }
                        break;
                    case "imp_g":
                        newInvRw = {
                            "boe_num": null,
                            "boe_dt": null,
                            "boe_val": null,
                            "is_sez": 'N',
                            "port_code": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "imp_ga":
                        newInvRw = {
                            "boe_num": null,
                            "boe_dt": null,
                            "oboe_num": null,
                            "oboe_dt": null,
                            "boe_val": null,
                            "port_code": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "imp_s":
                        newInvRw = {
                            "inum": null,
                            "idt": null,
                            "ival": null,
                            "pos": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "imp_sa":
                        newInvRw = {
                            "oi_num": null,
                            "oi_dt": null,
                            "i_num": null,
                            "i_dt": null,
                            "i_val": null,
                            "itms": [],
                            "sp_typ": {
                                "name": "Inter-State"
                            }
                        }
                        break;
                    case "txi":
                        newInvRw = {
                            "pos": null,
                            "itms": [],
                            "sply_ty": null


                        }
                        break;
                    case "atxi":
                        newInvRw = {
                            "reg_type": "",
                            "ocpty": null,
                            "odnum": null,
                            "otdt": null,
                            "cpty": null,
                            "state_cd": null,
                            "dnum": null,
                            "dt": null,
                            "itms": [],
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "hsn":
                    case "hsnsum":
                        newInvRw = {
                            "hsn_sc": null,
                            "desc": null,
                            "uqc": null,
                            "qty": null,
                            "val": null,
                            "txval": null,
                            "iamt": 0,
                            "camt": 0,
                            "samt": 0,
                            "csamt": 0
                        }
                        break;
                        case "hsn(b2b)":
                        case "hsn(b2c)":
                                newInvRw = {
                                    "hsn_sc": null,
                                    "desc": null,
                                    "user_desc": null,
                            "uqc": null,
                            "qty": null,
                            "val": null,
                            "txval": null,
                            "iamt": 0,
                            "camt": 0,
                            "samt": 0,
                            "csamt": 0
                        }
                        break;

                    case "itc_rcd":
                        newInvRw = {
                            "stin": null,
                            "inv_doc_num": null,
                            "inv_doc_dt": null,
                            "o_ig": 0,
                            "n_ig": 0,
                            "o_cg": 0,
                            "n_cg": 0,
                            "o_sg": 0,
                            "n_sg": 0,
                            "o_cs": 0,
                            "n_cs": 0,
                            "sp_typ": {
                                "name": null
                            }
                        }
                        break;
                    case "atadj":
                        newInvRw = {
                            "pos": null,
                            "itms": [],
                            "sply_ty": null


                        }
                        break;


                }
            }
            return newInvRw;
        }

        //To get new item row structure
        function getNewItm(iSec, iForm) {
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case 'exp':
                    case 'expa':
                        return {
                            "ty": "",
                            "txval": null,
                            "rt": 0,
                            "iamt": 0,
                            "csamt": 0
                        }
                        break;
                    default:
                        return {
                            "ty": "",
                            "txval": null,
                            "rt": 0,
                            "iamt": 0,
                            "csamt": 0
                        }
                        break;
                }

            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case 'b2b':
                    case 'b2bur':
                    case 'b2ba':
                    case 'b2bura':
                        return {
                            //"ty": "",
                            //                            "hsn_sc": null,
                            "txval": null,
                            "irt": 0,
                            "iamt": 0,
                            "crt": 0,
                            "camt": 0,
                            "srt": 0,
                            "samt": 0,
                            "csrt": 0,
                            "csamt": 0,
                            "itc": {
                                "elg": "",
                                "tx_i": 0,
                                "tx_s": 0,
                                "tx_c": 0,
                                "tx_cs": 0,
                            }
                        };
                        break;
                    case 'cdnr':
                    case 'cdnur':
                        return {
                            "txval": null,
                            "irt": 0,
                            "iamt": 0,
                            "crt": 0,
                            "camt": 0,
                            "srt": 0,
                            "p_gst": 'N',
                            "samt": 0,
                            "csrt": 0,
                            "csamt": 0,
                            "itc": {
                                "elg": "",
                                "tx_i": 0,
                                "tx_s": 0,
                                "tx_c": 0,
                                "tx_cs": 0,

                            }
                        };
                        break;
                    case 'txi':
                    case 'atxi':
                        return {
                            "ty": "",
                            "txval": null,
                            "rt": 0,
                            "iamt": 0,
                            "camt": 0,
                            "samt": 0,
                            "csamt": 0

                        };
                        break;
                    case 'imp_g':
                    case 'imp_ga':
                        return {
                            "txval": null,
                            "rt": 0,
                            "iamt": 0,
                            "csrt": 0,
                            "csamt": 0,
                            "elg": "",
                            "tx_i": 0,
                            "tx_cs": 0,
                        };
                        break;
                    case 'imp_s':
                    case 'imp_sa':
                        return {
                            "txval": null,
                            "rt": 0,
                            "iamt": 0,
                            "csrt": 0,
                            "csamt": 0,
                            "elg": "",
                            "tx_i": 0,
                            "tx_cs": 0
                        };
                        break;
                    case 'atadj':
                        return {
                            "num": null,
                            "rt": 0,
                            "iamt": 0,
                            "adamt": 0,
                            "csamt": 0,
                            "camt": 0,
                            "samt": 0
                        };
                        break;
                }
            }

        }


        //reformating the response from payload we r getting inorder display in ui
        function reformateInv(spLs, gstn, iSec, iForm, isErrReform, isSEZ, iYearsList) {
            var rtFn = null;
            if (iForm == "GSTR1" || iForm == "GSTR2A" || iForm == "GSTR1A") {
                switch (iSec) {
                    case 'b2b':
                    case 'b2ba':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['ctin'] = list['ctin'];
                                    inv['cname'] = list['cname'];
                                    if (isErrReform) {
                                        inv['error_msg'] = list['error_msg'];
                                        inv['error_cd'] = list['error_cd'];
                                    }
                                    inv['sp_typ'] = R1Util.getSupplyType(spLs, inv['ctin'], inv['pos'], inv['inv_typ'], isSEZ);
                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'b2cl':
                    case 'b2cla':
                        function getSupplyType(iSpLs, gstn, pos) {
                            var suplyTyp;
                            if (pos) {
                                if (gstn === pos) {
                                    suplyTyp = iSpLs[1];
                                } else {
                                    suplyTyp = iSpLs[1];
                                }
                            }
                            return suplyTyp;
                        }
                        rtFn = function (iResp) {
                            var rtArry = [];

                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['pos'] = list['pos'];
                                    if (isErrReform) {
                                        inv['error_msg'] = list['error_msg'];
                                        inv['error_cd'] = list['error_cd'];
                                    }
                                    inv['sp_typ'] = getSupplyType(spLs, gstn, inv['pos']);
                                    rtArry.push(inv);
                                });
                            });


                            return rtArry;
                        }
                        break;
                    case 'b2cs':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {
                                inv['sply_ty'] = getSupplyTypeForAt(inv['pos']);

                                inv['uni_key'] = inv['pos'] + "_" + inv['rt'] + "_" + inv['diff_percent'] + "_" + inv['etin'];

                                rtArry.push(inv);
                            });

                            return rtArry;
                        }
                        break;
                    case 'b2csa':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {
                                inv['sply_ty'] = getSupplyTypeForAt(inv['pos']);

                                inv['uni_key'] = inv['omon'] + "_" + inv['pos'] + "_" + inv['diff_percent'] + "_" + inv['etin'];
                                inv['oyear'] = getYearFromTheMonth(iYearsList, inv['omon']);

                                rtArry.push(inv);
                            });

                            return rtArry;
                        }
                        break;
                    case 'at':
                    case 'atadj':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {
                                inv['sply_ty'] = getSupplyTypeForAt(inv.pos)
                                rtArry.push(inv);
                            });
                            return rtArry;
                        }
                        break;
                    case 'ata':
                    case 'atadja':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {
                                inv['oyear'] = getYearFromTheMonth(iYearsList, inv['omon']);
                                inv['sply_ty'] = getSupplyTypeForAt(inv.pos)
                                rtArry.push(inv);
                            });
                            return rtArry;
                        }
                        break;

                    case 'exp':
                    case 'expa':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['sp_typ'] = spLs[1];
                                    inv.exp_typ = list.exp_typ;
                                    if (isErrReform) {
                                        inv['error_msg'] = list['error_msg'];
                                        inv['error_cd'] = list['error_cd'];
                                    }
                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'cdnr':
                        rtFn = function (iResp) {
                            var rtArry = [];

                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.nt, function (nt) {
                                    nt['ctin'] = list['ctin'];
                                    nt['cname'] = list['cname'];
                                    if (isErrReform) {
                                        nt['error_msg'] = list['error_msg'];
                                        nt['error_cd'] = list['error_cd'];
                                        if (nt.itms.length && nt.itms[0].itm_det) {
                                            if (isSEZ) {
                                                //change by Janhavi 
                                                nt['sp_typ'] = spLs[1];
                                            }
                                            else {
                                                if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                                    nt['sp_typ'] = spLs[0];
                                                } else {
                                                    nt['sp_typ'] = spLs[1];
                                                }
                                            }

                                        } else {
                                            nt['sp_typ'] = R1Util.getSupplyType(spLs, nt['ctin'], nt['pos']); //spLs[1];
                                        }

                                    } else {
                                        if (nt.itms.length && nt.itms[0].itm_det && !nt.pos) {
                                            if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                                nt['sp_typ'] = spLs[0];
                                            } else {
                                                nt['sp_typ'] = spLs[1];
                                            }

                                        }
                                        else {

                                            nt['sp_typ'] = R1Util.getSupplyType(spLs, nt['ctin'], nt['pos'], nt['inv_typ'], isSEZ); //spLs[1];
                                        }
                                    }

                                    rtArry.push(nt);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'cdnra':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.nt, function (nt) {
                                    nt['ctin'] = list['ctin'];
                                    if (list['cname'])
                                        nt['cname'] = list['cname'];
                                    if (isErrReform) {
                                        nt['error_msg'] = list['error_msg'];
                                        nt['error_cd'] = list['error_cd'];
                                        if (nt.itms.length && nt.itms[0].itm_det) {
                                            if (isSEZ) {
                                                //change by Janhavi
                                                nt['sp_typ'] = spLs[1];
                                            }
                                            else {
                                                if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                                    nt['sp_typ'] = spLs[0];
                                                } else {
                                                    nt['sp_typ'] = spLs[1];
                                                }
                                            }

                                        } else {
                                            nt['sp_typ'] = R1Util.getSupplyType(spLs, nt['ctin'], nt['pos']); //spLs[1];
                                        }
                                    }
                                    else {
                                        if (nt.itms.length && nt.itms[0].itm_det && !nt.pos) {
                                            if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                                nt['sp_typ'] = spLs[0];
                                            } else {
                                                nt['sp_typ'] = spLs[1];
                                            }

                                        }
                                        else {

                                            nt['sp_typ'] = R1Util.getSupplyType(spLs, nt['ctin'], nt['pos'], nt['inv_typ'], isSEZ); //spLs[1];
                                        }
                                    }

                                    rtArry.push(nt);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'cdnur':
                    case 'cdnura':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list) {
                                list['sp_typ'] = spLs[1];
                                rtArry.push(list);
                            });
                            return rtArry;

                        }
                        break;
                    case 'hsn':
                    case 'nil':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (data) {
                                rtArry.push(data);
                            });

                            return iResp;
                        }
                        break;
                        case 'hsn(b2b)':
                            var HSN_BIFURCATION_START_DATE = "052025";
                            var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                            if(showHSNTabs){
                                rtFn = function (iResp) {
                                   var rtArry = {
                                        "hsn_b2b": []
                                    }
                                    angular.forEach(iResp, function (data) {
                                       rtArry['hsn_b2b'].push(data);
                                    });
        
                                    return rtArry['hsn_b2b'];
                                }
                            }
                                break;
                                case 'hsn(b2c)':
                                    var HSN_BIFURCATION_START_DATE = "052025";
                                    var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));;
                                    if(showHSNTabs){
                                    rtFn = function (iResp) {
                                      var rtArry = {
                                            "hsn_b2c": []
                                        }
                                        angular.forEach(iResp, function (data) {
                                              rtArry['hsn_b2c'].push(data);
                                        });
            
                                        return  rtArry['hsn_b2c'];
                                    }
                        }
                        break;
                    case 'supeco':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            if(iResp.clttx && iResp.clttx.length > 0){
                                angular.forEach(iResp.clttx, function (list, i) {
                                    list['nat_supp'] = 'clttx'
                                    list['uni_key'] = list['nat_supp'] + "_" +list['etin'];
                                    rtArry.push(list);
                                });
                            }
                            if(iResp.paytx && iResp.paytx.length > 0){
                                angular.forEach(iResp.paytx, function (list, i) {
                                    list['nat_supp'] = 'paytx'
                                    list['uni_key'] = list['nat_supp'] + "_" +list['etin'];
                                    rtArry.push(list);
                                });
                            }
                            return rtArry;
                        }
                        break;
                    case 'supecoa':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            if(iResp.clttxa && iResp.clttxa.length > 0){
                                angular.forEach(iResp.clttxa, function (list, i) {
                                    list['nat_supp'] = 'clttxa'
                                    list['uni_key'] = list['omon'] + "_" +list['oetin'];
                                    list['oyear'] = getYearFromTheMonth(iYearsList, list['omon']);
                                    rtArry.push(list);
                                });
                            }
                            if(iResp.paytxa && iResp.paytxa.length > 0){
                                angular.forEach(iResp.paytxa, function (list, i) {  
                                    list['nat_supp'] = 'paytxa'
                                    list['uni_key'] = list['omon'] + "_" +list['oetin'];
                                    list['oyear'] = getYearFromTheMonth(iYearsList, list['omon']);
                                    rtArry.push(list);      
                                });
                            }
                            return rtArry;
                        }
                        break;
                    case 'ecomb2b':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['stin'] = list['stin'];
                                    inv['rtin'] = list['rtin'];
                                    inv['error_msg'] = list['error_msg'];
                                    inv['error_cd'] = list['error_cd'];
                                    inv['sp_typ'] = R1Util.getSupplyType(spLs, inv['rtin'], inv['pos'], inv['inv_typ'], isSEZ);
                                    rtArry.push(inv);
                                });
                            }); 
                            return rtArry;
                        }
                        break;
                    case 'ecomb2c':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) { 
                                list['uni_key'] = list['pos'] + "_" + list['rt']  + "_" + list['stin'];
                                list['sp_typ'] = R1Util.getSupplyType(spLs, list['stin'], list['pos'], isSEZ);
                                rtArry.push(list);
                            });
                            return rtArry;
                        }
                        break;
                    case 'ecomurp2b':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['rtin'] = list['rtin'];
                                    inv['sp_typ'] = R1Util.getSupplyType(spLs, inv['rtin'], inv['pos'], inv['inv_typ'], isSEZ);
                                    inv['error_msg'] = list['error_msg'];
                                    inv['error_cd'] = list['error_cd'];
                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'ecomurp2c':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list) {
                                list['uni_key'] = list['pos'] + "_" + list['rt'];
                                list['sply_ty'] = getSupplyTypeForAt(list['pos']);
                                rtArry.push(list);
                            });
                            return rtArry;
                        }
                        break;
                    case 'ecomab2b':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {  
                                angular.forEach(list.inv, function (inv) {
                                    inv['stin'] = list['stin'];
                                    inv['rtin'] = list['rtin'];
                                    inv['error_msg'] = list['error_msg'];
                                    inv['error_cd'] = list['error_cd'];
                                    inv['sp_typ'] = R1Util.getSupplyType(spLs, inv['rtin'], inv['pos'], inv['inv_typ'], isSEZ);
                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'ecomab2c':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) { 
                                angular.forEach(list.posItms, function (posItms) {
                                    posItms['error_msg'] = list['error_msg'];
                                    posItms['error_cd'] = list['error_cd'];
                                    posItms['pos'] = list['pos'];
                                    posItms['sp_typ'] = R1Util.getSupplyType(spLs, posItms['stin'], posItms['pos'],isSEZ);
                                    posItms['oyear'] = getYearFromTheMonth(iYearsList, posItms['omon']);
                                    posItms['uni_key'] = list['pos']+"_"+posItms['omon']+"_"+posItms['stin'];
                                    rtArry.push(posItms); 
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'ecomaurp2b':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['rtin'] = list['rtin'];
                                    inv['error_msg'] = list['error_msg'];
                                    inv['error_cd'] = list['error_cd'];
                                    inv['sp_typ'] = R1Util.getSupplyType(spLs, inv['rtin'],
                                    inv['pos'], inv['inv_typ'], isSEZ);
                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'ecomaurp2c':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list) {
                                list['uni_key'] = list['pos'] + "_" + list['omon'];
                                list['sply_ty'] = getSupplyTypeForAt(list['pos']);
                                list['oyear'] = getYearFromTheMonth(iYearsList, list['omon']);
                                rtArry.push(list);
                            })
                            return rtArry;
                        }
                        break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case 'b2b':
                    case 'b2ba':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    inv['ctin'] = list['ctin'];
                                    if (list['cname'])
                                        inv['cname'] = list['cname'];
                                    if (list['cfs'])
                                        inv['cfs'] = list['cfs'];
                                    if (isErrReform) {
                                        inv['error_msg'] = list['error_msg'];
                                        inv['error_cd'] = list['error_cd'];
                                    }
                                    /*inv['sp_typ'] = $scope.getSupplyType(inv['etin'], inv['pos']);*/
                                    inv['sp_typ'] = R1Util.getSupplyType(spLs, inv['ctin'], inv['pos']);
                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'b2bur': // GSTR2
                    case 'b2bura': // GSTR2
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.inv, function (inv) {
                                    if (isErrReform) {
                                        inv['error_msg'] = list['error_msg'];
                                        inv['error_cd'] = list['error_cd'];
                                    }

                                    if (typeof inv.itms[0].itm_det.iamt == 'undefined') {
                                        inv['sp_typ'] = spLs[0];
                                    } else {
                                        inv['sp_typ'] = spLs[1];
                                    }

                                    rtArry.push(inv);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'imp_g': // GSTR2
                    case 'imp_ga': // GSTR2
                    case 'imp_s': // GSTR2
                    case 'imp_sa': // GSTR2
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {
                                inv['sp_typ'] = spLs[1]; //R1Util.getSupplyType(spLs, gstn, inv['state_cd']);
                                rtArry.push(inv);
                            });

                            return rtArry;
                        }
                        break;
                    case 'txi': // GSTR2
                    case 'atxi': // GSTR2
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {
                                if (typeof inv.itms[0].iamt == 'undefined') {
                                    inv['sply_ty'] = "INTRA";
                                } else {
                                    inv['sply_ty'] = "INTER";
                                }
                                rtArry.push(inv);
                            });
                            return rtArry;
                        }
                        break;
                    case 'hsnsum': // GSTR2
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (data) {
                                // if (isErrReform) {
                                //     data['error_msg'] = iResp['error_msg'];
                                //     data['error_cd'] = iResp['error_cd'];
                                // }
                                rtArry.push(data);
                            });
                            return iResp;
                        }

                        break;
                    case 'cdnr': // GSTR2
                    case 'cdnra': // GSTR2
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list, i) {
                                angular.forEach(list.nt, function (nt) {
                                    nt['ctin'] = list['ctin'];
                                    if (list['cname'])
                                        inv['cname'] = list['cname'];
                                    if (isErrReform) {
                                        nt['error_msg'] = list['error_msg'];
                                        nt['error_cd'] = list['error_cd'];
                                    }

                                    if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                        nt['sp_typ'] = spLs[0];
                                    } else {
                                        nt['sp_typ'] = spLs[1];
                                    }

                                    rtArry.push(nt);
                                });
                            });
                            return rtArry;
                        }
                        break;
                    case 'cdnur': // GSTR2
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (list) {
                                /*angular.forEach(iResp, function(inv) {
                                    inv['sp_typ'] = spLs[1];
     
                                    rtArry.push(inv);
                                });*/


                                if (typeof list.itms[0].itm_det.iamt == 'undefined') {
                                    list['sp_typ'] = spLs[0];
                                } else {
                                    list['sp_typ'] = spLs[1];
                                }

                                // list['sp_typ'] = spLs[1];


                                rtArry.push(list);
                            });
                            return rtArry;

                        }
                        break;
                    case 'atadj':
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (inv) {

                                if (typeof inv.itms[0].iamt == 'undefined') {
                                    inv['sply_ty'] = "INTRA";
                                } else {
                                    inv['sply_ty'] = "INTER";
                                }
                                rtArry.push(inv);
                            });
                            return rtArry;
                        }
                        break;
                    case 'nil':
                    case 'itc_rvsl':

                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEach(iResp, function (data) {
                                //  data['uni_key'] = data['hsn_sc'] + "_" + data['desc'];

                                rtArry.push(data);
                            });

                            return iResp;
                        }
                        break;

                }

            }
            return rtFn;
        }

        //formating again as payload in order to send to backend
        function formateNodePayload(iSec, iForm, isErrFormate) {
            var rtFn = null, rtData;
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case 'b2b':
                    case 'b2ba':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            delete iData.sp_typ;
                            if (isErrFormate) {
                                rtData = {
                                    "ctin": iData.ctin,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.ctin;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "ctin": iData.ctin,
                                    "cname": iData.cname,
                                    "inv": []
                                }
                                delete iData.ctin;
                                delete iData.cname;
                            }

                            rtData.inv.push(iData);
                            return rtData;
                        }
                        break;
                    case 'b2cl':
                    case 'b2cla':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            delete iData.sp_typ;
                            if (isErrFormate) {
                                rtData = {
                                    "pos": iData.pos,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.pos;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "pos": iData.pos,
                                    "inv": []
                                }
                                delete iData.pos;

                            }
                            rtData.inv.push(iData);

                            return rtData;
                        }
                        break;

                    case 'b2cs':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.etin == "" || iData.etin == null)
                                delete iData.etin;
                            if (iData.diff_percent == 1 || !iData.diff_percent)
                                delete iData.diff_percent;
                            if (iData.frozenOrder)
                                delete iData.frozenOrder;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'at':
                    case 'atadj':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.frozenOrder)
                                delete iData.frozenOrder;
                            if (iData.diff_percent == 1 || !iData.diff_percent)
                                delete iData.diff_percent;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'b2csa':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.frozenOrder)
                                delete iData.frozenOrder;
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (iData.etin == "" || iData.etin == null)
                                delete iData.etin;
                            if (iData.diff_percent == 1 || !iData.diff_percent)
                                delete iData.diff_percent;
                            delete iData.oyear;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'ata':
                    case 'atadja':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.frozenOrder)
                                delete iData.frozenOrder;
                            if (iData.diff_percent == 1 || !iData.diff_percent)
                                delete iData.diff_percent;
                            delete iData.oyear;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'exp':
                    case 'expa':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            delete iData.sp_typ;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            if (isErrFormate) {

                                rtData = {
                                    "exp_typ": iData.exp_typ,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.exp_typ;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "exp_typ": iData.exp_typ,

                                    "inv": []
                                }
                                delete iData.exp_typ;
                            }
                            rtData.inv.push(iData);

                            return rtData;
                        }
                        break;
                    case 'cdnr':
                    case 'cdnra':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            delete iData.sp_typ;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            if (isErrFormate) {
                                rtData = {
                                    "ctin": iData.ctin,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "nt": []
                                }
                                delete iData.ctin;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {

                                rtData = {
                                    "ctin": iData.ctin,
                                    "cname": iData.cname,
                                    "nt": []
                                }
                                delete iData.ctin;
                                delete iData.cname;
                            }

                            rtData.nt.push(iData);

                            return rtData;
                        }
                        break;
                    case 'cdnur':
                    case 'cdnura':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (iData.frozenOrder) {
                                delete iData.frozenOrder;
                            }

                            delete iData.sp_typ;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            var rtData = {}

                            var rtData = iData;


                            return rtData;
                        }
                        break;
                    case 'hsn':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.hsn_sc == "")
                                delete iData.hsn_sc;
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            iData.qty = Number(iData.qty);
                            var rtData = {
                                "data": []
                            }
                            rtData.data.push(iData);
                            return rtData;
                        }
                        break;
                             case 'hsn(b2b)':
                                var HSN_BIFURCATION_START_DATE = "052025";
                                var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                                if(showHSNTabs){
                            rtFn = function (oData) {
                                var iData = angular.copy(oData);
                                if (iData.hsn_sc == "")
                                    delete iData.hsn_sc;
                                if (iData.select)
                                    delete iData.select;
                                iData.qty = Number(iData.qty);
                                var rtData = {
                                    "hsn_b2b": []
                               }
                                rtData.hsn_b2b.push(iData);
                                return rtData;
                            }
                        }
                            break;
                            case 'hsn(b2c)':
                                var HSN_BIFURCATION_START_DATE = "052025";
                                var showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                                if(showHSNTabs){
                                rtFn = function (oData) {
                                    var iData = angular.copy(oData);
                                    if (iData.hsn_sc == "")
                                        delete iData.hsn_sc;
                                    if (iData.select)
                                        delete iData.select;
                                    iData.qty = Number(iData.qty);
                                    var rtData = {
                                        "hsn_b2c": []
                                    }
                                    rtData.hsn_b2c.push(iData);
                                    return rtData;
                                }
                        }
                        break;

                    case 'nil':
                    case 'doc_issue':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            //added by prakash to remove 'select' property
                            if (iData.select)
                                delete iData.select;
                            return iData;
                        }
                        break;
                    case 'supeco':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'supecoa':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'ecomb2b':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (isErrFormate) {
                                rtData = {
                                    "rtin": iData.rtin,
                                    "stin": iData.stin,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.stin;
                                delete iData.rtin;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "stin": iData.stin,
                                    "rtin": iData.rtin,
                                    "inv": []
                                }
                                if(iData.sp_typ && iData.sp_typ.name == 'Inter-State'){
                                    iData.sply_ty = "INTER"
                                }
                                else if(iData.sp_typ && iData.sp_typ.name == 'Intra-State'){
                                    iData.sply_ty = "INTRA"
                                }
                                delete iData.stin;
                                delete iData.rtin;
                                delete iData.sp_typ;
                                delete iData.supplierRecipientName;
                            }

                            rtData.inv.push(iData);
                            return rtData;
                        }
                        break;
                    case 'ecomb2c':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.stin == "" || iData.stin == null)
                                delete iData.stin;
                            if (iData.diff_percent == 1 || !iData.diff_percent)
                                delete iData.diff_percent;
                            if (iData.frozenOrder)
                                delete iData.frozenOrder;
                            
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'ecomurp2b':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (iData.select)
                                delete iData.select;
                            if (isErrFormate) {
                                rtData = {
                                    "rtin": iData.rtin,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.rtin;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "rtin": iData.rtin,
                                    "inv": []
                                }
                                if(iData.sp_typ && iData.sp_typ.name == 'Inter-State'){
                                    iData.sply_ty = "INTER"
                                }
                                else if(iData.sp_typ && iData.sp_typ.name == 'Intra-State'){
                                    iData.sply_ty = "INTRA"
                                }
                                delete iData.rtin;
                                delete iData.sp_typ;
                                
                            }
                            rtData.inv.push(iData);
                            return rtData;
                        }
                        break; 
                    case 'ecomurp2c':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.stin == "" || iData.stin == null)
                                delete iData.stin;
                            if (iData.diff_percent == 1 || !iData.diff_percent)
                                delete iData.diff_percent;
                            if (iData.frozenOrder)
                                delete iData.frozenOrder;
                            
                            if (iData.select)
                                delete iData.select;
                            var rtData = {};
                            var rtData = iData;

                            return rtData;
                        }
                        break;
                    case 'ecomab2b':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (isErrFormate) {
                                rtData = {
                                    "rtin": iData.rtin,
                                    "stin": iData.stin,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.stin;
                                delete iData.rtin;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "stin": iData.stin,
                                    "rtin": iData.rtin,
                                    "inv": []
                                }
                                if(iData.sp_typ && iData.sp_typ.name == 'Inter-State'){
                                    iData.sply_ty = "INTER"
                                }
                                else if(iData.sp_typ && iData.sp_typ.name == 'Intra-State'){
                                    iData.sply_ty = "INTRA"
                                }
                                delete iData.stin;
                                delete iData.rtin;
                                delete iData.sp_typ;
                                delete iData.supplierRecipientName;
                            }

                            rtData.inv.push(iData);
                            return rtData;
                        }
                        break;
                    case 'ecomab2c':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (isErrFormate) {
                                rtData = {
                                    
                                    "pos": iData.pos,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "posItms": []
                                }
                                delete iData.pos;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                                
                            }
                            else {
                                rtData = {
                                        "pos": iData.pos,
                                    "posItms": []
                                }
                                if(iData.sp_typ && iData.sp_typ.name == 'Inter-State'){
                                    iData.sply_ty = "INTER"
                                }
                                else if(iData.sp_typ && iData.sp_typ.name == 'Intra-State'){
                                    iData.sply_ty = "INTRA"
                                }
                                delete iData.supplierRecipientName;
                                delete iData.pos;
                                delete iData.sp_typ;
                                
                                
                            }

                            rtData.posItms.push(iData);
                            return rtData;
                        }
                        break;
                    case 'ecomaurp2b':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.old_val != "undefined")
                                delete iData.old_val;
                            if (iData.select)
                                delete iData.select;
                            if (isErrFormate) {
                                rtData = {
                                    "rtin": iData.rtin,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "inv": []
                                }
                                delete iData.rtin;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {
                                rtData = {
                                    "rtin": iData.rtin,
                                    "inv": []
                                }
                                if(iData.sp_typ && iData.sp_typ.name == 'Inter-State'){
                                    iData.sply_ty = "INTER"
                                }
                                else if(iData.sp_typ && iData.sp_typ.name == 'Intra-State'){
                                    iData.sply_ty = "INTRA"
                                }
                                delete iData.rtin;
                                delete iData.sp_typ;
                                
                            }
                            rtData.inv.push(iData);
                            return rtData;
                        }
                        break; 
                    case 'ecomaurp2c':
                            rtFn = function (oData) {
                                var iData = angular.copy(oData);
                                if (iData.pos == "" || iData.pos == null)
                                    delete iData.pos;
                                
                                
                                if (iData.select)
                                    delete iData.select;
                                var rtData = {};
                                var rtData = iData;
    
                                return rtData;
                            }
                            break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case 'b2b':
                    case 'b2ba':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            delete iData.sp_typ;
                            delete iData.cfs;

                            var rtData = {
                                "ctin": iData.ctin,
                                "cname": iData.cname,
                                "inv": []
                            }
                            delete iData.ctin;
                            delete iData.cname;
                            rtData.inv.push(iData);

                            return rtData;
                        }
                        break;
                    case 'b2bur':
                    case 'b2bura':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.sp_typ.name == 'Intra-State' || iData.sp_typ == 'Intra State') {
                                iData.sply_ty = "INTRA";
                            } else {
                                iData.sply_ty = "INTER";
                            }
                            delete iData.sp_typ;
                            var rtData = {
                                "inv": []
                            }

                            rtData.inv.push(iData);

                            return rtData;
                        }
                        break;


                    case 'txi':
                    case 'atxi':
                    case 'atadj':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            var rtData = {};
                            if (iData.sply_ty == 'Intra State') {
                                iData.sply_ty = "INTRA";
                            } else {
                                iData.sply_ty = "INTER";
                            }
                            var rtData = iData;
                            return rtData;
                        }
                        break;
                    //
                    case 'imp_g':
                    case 'imp_ga':
                    case 'imp_s':
                    case 'imp_sa':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (typeof iData.boe_val !== 'undefined') {
                                iData.boe_val = parseFloat(iData.boe_val);
                            }
                            if (typeof iData.ival !== 'undefined') {
                                iData.ival = parseFloat(iData.ival);
                            }
                            delete iData.sp_typ;
                            return iData;
                        }
                        break;
                    case 'hsnsum':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            if (iData.hsn_sc == "")
                                delete iData.hsn_sc;
                            iData.qty = Number(iData.qty);
                            var rtData = {
                                "det": []
                            }

                            rtData.det.push(iData);

                            return rtData;
                        }
                        break;
                    case 'cdnr':
                    case 'cdnra':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);

                            delete iData.sp_typ;

                            if (isErrFormate) {
                                rtData = {
                                    "ctin": iData.ctin,
                                    "cname": iData.cname,
                                    "error_msg": iData.error_msg,
                                    "error_cd": iData.error_cd,
                                    "nt": []
                                }
                                delete iData.ctin;
                                delete iData.cname;
                                delete iData.error_msg;
                                delete iData.error_cd;
                                delete iData.frozenOrder;
                            }
                            else {

                                rtData = {
                                    "ctin": iData.ctin,
                                    "cname": iData.cname,
                                    "nt": []
                                }
                                delete iData.ctin;
                                delete iData.cname;
                            }
                            rtData.nt.push(iData);
                            return rtData;
                        }
                        break;
                    case 'cdnur':
                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            delete iData.sp_typ;
                            var rtData = {}
                            var rtData = iData;
                            return rtData;
                        }
                        break;
                    case 'nil':
                    case 'itc_rvsl':

                        rtFn = function (oData) {
                            var iData = angular.copy(oData);
                            return iData;
                        }
                        break;
                }
            }
            return rtFn;
        }

        //unique values to update invoice
        function getUpdatedNodeDetails(iSec, iData, iForm, iFlag) {
            var updatedNodeDetails = {};
            if (iForm == "GSTR1" || iForm == "GSTR2A") {
                switch (iSec) {
                    case "b2b":

                        if (iData.hasOwnProperty('chksum')) {

                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                inum: iData.inum,
                                old_inum: iData.old_inum ? iData.old_inum : '',
                                chksum: iData.chksum ? iData.chksum : ''
                            };
                        }
                        else {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                inum: iData.inum,
                                old_inum: iData.old_inum ? iData.old_inum : ''
                            };
                        }

                        break;
                    case "b2ba":
                        if (iData.hasOwnProperty('chksum')) {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                inum: iData.inum,
                                oinum: iData.oinum,
                                old_inum: iData.old_inum ? iData.old_inum : '',
                                chksum: iData.chksum ? iData.chksum : ''
                            };
                        }
                        else {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                inum: iData.inum,
                                oinum: iData.oinum,
                                old_inum: iData.old_inum ? iData.old_inum : ''
                            };
                        }

                        break;
                    case "b2cl":
                        updatedNodeDetails = {
                            pos: iData.pos,
                            inum: iData.inum,
                            old_inum: iData.old_inum ? iData.old_inum : ''
                        };
                        break;
                    case "b2cla":
                        updatedNodeDetails = {
                            pos: iData.pos,
                            inum: iData.inum,
                            oinum: iData.oinum,
                            old_inum: iData.old_inum ? iData.old_inum : ''
                        };
                        break;
                    case "cdnr":

                        if (iData.hasOwnProperty('chksum')) {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                // pos: iData.pos,
                                nt_num: iData.nt_num,
                                old_ntnum: iData.old_ntnum ? iData.old_ntnum : '',
                                chksum: iData.chksum ? iData.chksum : ''
                            };
                        }
                        else {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                // pos: iData.pos,
                                nt_num: iData.nt_num,
                                old_ntnum: iData.old_ntnum ? iData.old_ntnum : ''
                            };
                        }

                        break;
                    case "cdnra":

                        if (iData.hasOwnProperty('chksum')) {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                ont_num: iData.ont_num,
                                nt_num: iData.nt_num,
                                old_ntnum: iData.old_ntnum ? iData.old_ntnum : '',
                                chksum: iData.chksum ? iData.chksum : ''

                            };
                        }
                        else {
                            updatedNodeDetails = {
                                ctin: iData.ctin,
                                ont_num: iData.ont_num,
                                nt_num: iData.nt_num,
                                old_ntnum: iData.old_ntnum ? iData.old_ntnum : ''

                            };
                        }

                        break;
                    case "cdnur":
                        updatedNodeDetails = {
                            nt_num: iData.nt_num,
                            old_ntnum: iData.old_ntnum ? iData.old_ntnum : ''
                        };
                        break;
                    case "cdnura":
                        updatedNodeDetails = {
                            nt_num: iData.nt_num,
                            ont_num: iData.ont_num,
                            old_ntnum: iData.old_ntnum ? iData.old_ntnum : ''
                        };
                        break;
                    case "b2cs":
                    case "b2csa":
                        updatedNodeDetails = {
                            uni_key: iData.uni_key
                        };
                        break;
                    case "at":
                        updatedNodeDetails = {
                            pos: iData.pos,
                            old_pos: iData.old_pos ? iData.old_pos : '',
                            diff_percent: iData.diff_percent
                        };
                        break;
                    case "exp":
                        updatedNodeDetails = {
                            exp_typ: iData.exp_typ,
                            inum: iData.inum,
                            old_inum: iData.old_inum ? iData.old_inum : ''
                        };
                        break;
                    case "expa":
                        updatedNodeDetails = {
                            exp_typ: iData.exp_typ,
                            inum: iData.inum,
                            oinum: iData.oinum,
                            old_inum: iData.old_inum ? iData.old_inum : ''
                        };
                        break;
                    case "atadj":
                        updatedNodeDetails = {
                            pos: iData.pos,
                            old_pos: iData.old_pos ? iData.old_pos : '',
                            diff_percent: iData.diff_percent
                        }
                        break;
                    case "ata":
                    case "atadja":
                        updatedNodeDetails = {
                            pos: iData.pos,
                            omon: iData.omon,
                            old_pos: iData.old_pos ? iData.old_pos : '',
                            old_omon: iData.old_omon ? iData.old_omon : '',
                            diff_percent: iData.diff_percent
                        };
                        break;
                    case "hsn":
                        if (iData.hsn_sc) {
                            updatedNodeDetails = {
                                num: iData.num,
                                hsn_sc: iData.hsn_sc
                            }
                        }
                        else if (iData.desc) {
                            updatedNodeDetails = {
                                num: iData.num,
                                desc: iData.desc
                            }
                        }
                        break;
                         case "hsn(b2b)":
                            if (iData.hsn_sc) {
                                updatedNodeDetails = {
                                    num: iData.num,
                                    hsn_sc: iData.hsn_sc
                                }
                            }
                            else if (iData.desc) {
                                updatedNodeDetails = {
                                    num: iData.num,
                                    desc: iData.desc
                                }
                            }
                            break;
                            case "hsn(b2c)":
                        if (iData.hsn_sc) {
                            updatedNodeDetails = {
                                num: iData.num,
                                hsn_sc: iData.hsn_sc
                            }
                        }
                        else if (iData.desc) {
                            updatedNodeDetails = {
                                num: iData.num,
                                desc: iData.desc
                            }
                        }
                        break;
                    case "supeco":
                        updatedNodeDetails = {
                            etin: iData.etin,
                            nat_supp: iData.nat_supp,
                            uni_key: iData.uni_key
                        };
                        break;
                    case "supecoa":
                            updatedNodeDetails = {
                                oetin: iData.oetin,
                                omon: iData.omon,
                                nat_supp: iData.nat_supp,
                                uni_key: iData.uni_key
                            };
                        break;    
                    case "ecomb2b":
                        if (iData.hasOwnProperty('chksum')) {
                            updatedNodeDetails = {
                                stin: iData.stin,
                                rtin: iData.rtin,
                                inum: iData.inum,
                                old_inum: iData.old_inum ? iData.old_inum : '',
                                chksum: iData.chksum ? iData.chksum : ''
                            };
                        }
                        else {
                            updatedNodeDetails = {
                                stin: iData.stin,
                                rtin: iData.rtin,
                                inum: iData.inum,
                                old_inum: iData.old_inum ? iData.old_inum : ''
                            };
                        }
                        break;
                    case "ecomb2c":
                        updatedNodeDetails = {
                            uni_key: iData.uni_key,
                        };
                        break;
                    case "ecomurp2b":
                        updatedNodeDetails = {
                            rtin: iData.rtin,
                            inum: iData.inum,
                            old_inum: iData.old_inum ? iData.old_inum : '',
                        };
                        break;
                    case "ecomurp2c":
                        updatedNodeDetails = {
                            uni_key: iData.uni_key 
                        };
                        break;
                    case "ecomab2b":
                        if (iData.hasOwnProperty('chksum')) {
                            updatedNodeDetails = {
                                stin: iData.stin,
                                rtin: iData.rtin,
                                inum: iData.inum,
                                oinum: iData.oinum,
                                old_inum: iData.old_inum ? iData.old_inum : '',
                                chksum: iData.chksum ? iData.chksum : ''
                            };
                        }
                        else {
                            updatedNodeDetails = {
                                stin: iData.stin,
                                rtin: iData.rtin,
                                inum: iData.inum,
                                oinum: iData.oinum,
                                old_inum: iData.old_inum ? iData.old_inum : ''
                            };
                        }
                        break;
                    case "ecomab2c":
                        updatedNodeDetails = {
                            stin: iData.stin,
                            pos: iData.pos,
                            omon: iData.omon,
                            uni_key: iData.uni_key
                            };
                        break;
                    case "ecomaurp2b":
                        updatedNodeDetails = {
                            rtin: iData.rtin,
                            inum: iData.inum,
                            oinum: iData.oinum,
                            old_inum: iData.old_inum ? iData.old_inum : '',
                        };
                        break;
                    case "ecomaurp2c":
                        updatedNodeDetails = {
                            uni_key: iData.uni_key
                        };
                        break;
                        
                        
                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case "b2b":
                    case "b2ba":
                        updatedNodeDetails = {
                            ctin: iData.ctin,
                            inum: iData.inum,
                            old_inum: iData.old_inum ? iData.old_inum : ''
                        };
                        break;
                    case "b2bur":
                    case "b2bura":
                        updatedNodeDetails = {
                            inum: iData.inum
                        };
                        break;
                    case "cdnr":
                    case "cdnra":
                        updatedNodeDetails = {
                            ctin: iData.ctin,
                            nt_num: iData.nt_num,
                            old_ntnum: iData.old_ntnum ? iData.old_ntnum : ''
                        };
                        break;
                    case "cdnur":
                        updatedNodeDetails = {
                            nt_num: iData.nt_num,
                            old_ntnum: iData.old_ntnum ? iData.old_ntnum : ''
                        };
                        break;
                    case "imp_g":
                    case "imp_ga":
                        updatedNodeDetails = {
                            boe_num: iData.boe_num
                        };
                        break;
                    case "imp_s":
                    case "imp_sa":
                        updatedNodeDetails = {
                            inum: iData.inum
                        };
                        break;
                    case "txi":
                    case "atxi":
                        updatedNodeDetails = {
                            pos: iData.pos
                        };
                        break;
                    case "hsnsum":
                        if (iData.hsn_sc) {
                            updatedNodeDetails = {
                                num: iData.num,
                                hsn_sc: iData.hsn_sc,
                                uqc: iData.uqc
                            }
                        }
                        else if (iData.desc) {
                            updatedNodeDetails = {
                                num: iData.num,
                                hsn_sc: iData.desc,
                                uqc: iData.uqc
                            }
                        }
                        break;
                    case "itc_rvsl":
                        updatedNodeDetails = {
                            inv_doc_num: iData.inv_doc_num
                        };
                        break;
                    case "atadj":
                        updatedNodeDetails = {
                            pos: iData.pos
                        };
                        break;


                }
            }
            return updatedNodeDetails;
        }

        //To get unique key from excel
        function getExcelTitle(iSec, iForm, transLan) {
            var title = null;
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case 'b2b':
                    case 'b2cl':
                    case 'exp':
                        title = "Invoice Number"
                        break;
                    case 'cdnr':
                    case 'cdnur':
                        title = transLan.LBL_DEBIT_CREDIT_NOTE_NO
                        break;
                    case 'cdnra':
                    case 'cdnura':
                        title = transLan.LBL_REVISED_DEBIT_CREDIT_NOTE_NO
                        break;
                    case 'b2ba':
                    case 'b2cla':
                    case 'expa':
                        title = "Revised Invoice Number"
                        break;
                    case 'at':
                    case 'atadj':
                        title = "Place Of Supply"
                        break;
                    case 'ata':
                    case 'atadja':
                        title = "Original Place Of Supply"
                        break;
                    case 'b2csa':
                        title = "Place Of Supply"
                        break;
                    case 'hsn':
                        title = "HSN"
                        break;
                     case 'hsn(b2b)':
                            title = "HSN(B2B)"
                            break;
                     case 'hsn(b2c)':
                     title = "HSN(B2C)"
                        break;
                    case 'nil':
                        title = "Description"
                        break;
                    case 'doc_issue':
                        title = "Nature of Document"
                        break;
                    case 'supeco':
                    case 'supecoa':
                        title = "Nature of Supply"
                        break;
                    case 'ecomb2b':
                    case 'ecomurp2b':
                        title = "Document Number"
                        break;
                    case 'ecomb2c':
                    case 'ecomab2c':
                    case 'ecomurp2c':
                    case 'ecomaurp2c':
                        title = "Place Of Supply"
                        break;
                    case 'ecomaurp2b':
                        title = "Revised Document Number"
                        break;

                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case 'b2b':
                    case 'cdnra':
                    case 'b2bur':
                        title = "Invoice Number"
                        break;
                    case 'imp_s':
                        title = "Invoice Number of Reg Recipient";
                        break;
                    case 'cdnr': // GSTR2
                        title = "Note/Refund Voucher Number"
                        break;
                    case 'cdnur': // GSTR2
                        title = "Note/Voucher Number"
                        break;
                    case 'b2ba':
                    case 'b2bura':
                    case 'imp_sa':
                        title = "Revised Invoice Number"
                        break;
                    case 'imp_g':
                        title = "Bill Of Entry Number"
                        break;
                    case 'imp_ga':
                        title = "Revised Bill Of Entry Number"
                        break;
                    case 'hsnsum':
                        title = "HSN/SAC of Supply"
                        break;
                    case 'atxi':
                    case 'txi':
                    case 'atadj':
                        title = "Place Of Supply"
                        break;
                    case 'nil':
                    case 'itc_rvsl':
                        title = "Description"
                        break;

                }
            }
            return title;
        }

        //To get unique id from excel
        function getInvKey(isec, iForm) {
            var invKey = null;
            if (iForm == "GSTR1") {
                switch (isec) {
                    case 'b2b':
                    case 'b2ba':
                    case 'b2cl':
                    case 'b2cla':
                    case 'exp':
                    case 'expa':
                        invKey = "inum"
                        break;
                    case 'cdnr':
                    case 'cdnra':
                    case 'cdnur':
                    case 'cdnura':
                        invKey = "nt_num"
                        break;
                    case 'at':
                    case 'ata':
                    case 'atadj':
                    case 'atadja':
                    case 'b2csa':
                        invKey = "pos"
                        break;
                    case 'hsn':
                    case 'hsn(b2b)':
                    case 'hsn(b2c)' :   
                        invKey = "hsn_sc";
                        break;
                    case 'nil':
                        invKey = "sply_ty";
                        break;
                    case 'doc_issue':
                        invKey = "doc_typ";
                        break;
                    case 'ecomb2b':
                    case 'ecomab2b':
                    case 'ecomurp2b':
                    case 'ecomaurp2b':
                        invKey = "inum";
                        break;
                    //case 'ecomab2c':
                    //case 'ecomaurp2c':
                        //invKey = "pos";
                      // break;

                }
            } else if (iForm == "GSTR2") {
                switch (isec) {
                    case 'b2b':
                    case 'b2ba':
                    case 'b2bur':
                    case 'b2bura':
                        invKey = "inum"
                        break;
                    case 'cdnr':
                    case 'cdnra':
                    case 'cdnur':
                        invKey = "nt_num"
                        break;
                    case 'imp_g':
                    case 'imp_ga':
                        invKey = "boe_num"
                        break;
                    case 'imp_s':
                    case 'imp_sa':
                        invKey = "inum"
                        break;
                    case 'txi':
                    case 'atxi':
                    case 'atadj':
                        invKey = "pos"
                        break;
                    case 'hsnsum':
                        invKey = "hsn_sc"
                        break;
                    case 'itc_rvsl':
                        invKey = "inv_doc_num"
                        break;

                }
            }
            return invKey;
        }

        //To decide itm structure before updating or saving
        function getItmNodeStructure(iSec, iData, iItmLn, iForm) {
            var rtObj = null;
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case "b2b":
                    case "b2ba":
                    case "b2cl":
                    case "b2cla":
                        rtObj = {
                            "num": iItmLn + 1,
                            "itm_det": angular.copy(iData)
                        };
                        break;
                    case "at":
                    case "ata":
                    case "exp":
                    case "expa":
                        rtObj = iData;
                        break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case "b2b":
                    case "b2ba":
                    case "b2bur":
                    case "b2bura":
                    case "cdnr":
                    case "cdnur":
                        var itc = angular.copy(iData.itc);
                        delete iData.itc;
                        rtObj = {
                            "num": iItmLn + 1,
                            "itm_det": angular.copy(iData),
                            "itc": itc
                        };
                        break;
                    case "txi":
                    case "atxi":
                        iData.num = iItmLn + 1;
                        rtObj = iData;
                        break;
                    case "imp_g":
                    case "imp_ga":
                    case "imp_s":
                    case "imp_sa":
                        iData.num = iItmLn + 1;
                        rtObj = iData;
                        break;

                }
            }
            return rtObj;
        }

        //To get invoice number display in items level

        function getInvNum(iSec, iData, iForm) {
            var inum = null;
            if (iForm == "GSTR1") {
                switch (iSec) {
                    case 'at':
                    case 'ata':
                        inum = iData.doc_num;
                        break;
                    case 'exp':
                    case 'expa':
                        inum = iData.inum;
                        break;
                }
            } else if (iForm == "GSTR2") {
                switch (iSec) {
                    case 'imp_g':
                    case 'imp_ga':
                        inum = iData.boe_num
                        break;
                    case 'txi':
                    case 'atxi':
                        inum = iData.doc_num;
                        break
                    case 'imp_s':
                    case 'imp_sa':
                        /* case 'atadj': */
                        inum = iData.inum;
                        break;
                }
            }
            return inum;
        }
    }

})();
