"use strict";

myApp.controller("gstr2sumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'R2Structure',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, R2Structure) {

        var tableCode = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.SummaryList = [];
        shareData.isNewRec = true;
        $scope.newInvValidtr = false;
        $scope.newInvRw = null;
        $scope.monthList = null;

        $scope.typeList = [{
            "value": "REGD",
            "name": "REGISTERED"
        },
        {
            "value": "UNREGD",
            "name": "UNREGISTERED"
        }]

        $scope.minYearsAllowed = "4";

        if (!$scope.dashBoardDt) {
            $scope.page("/gstr/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            $scope.dashBoardDt = shareData.dashBoardDt;

            initNewInvRow();
            initSumryList();
        }

        //Formaters
        var reformateInv = R2Structure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode),
            formateNodePayload = R2Structure.formateNodePayload(tableCode),
            getExcelTitle = R2Structure.getExcelTitle(tableCode),
            getInvKey = R2Structure.getInvKey(tableCode),
            getInv = R2Structure.getInv(tableCode),
            getItm = R2Structure.getItm(tableCode);

        //To init new invoice row
        function initNewInvRow() {
            $scope.newInvRw = R2Structure.getNewInv(tableCode);
        }

        //To get list
        function initSumryList() {
            g1FileHandler.getContentsFor($scope.dashBoardDt, tableCode).then(function (response) {
               // $log.debug("initSumryList -> initSumryList success:: ", response);

                $scope.SummaryList = reformateInv(response);

            }, function (response) {
                $log.debug("initSumryList -> initSumryList fail:: ", response);
            });
        }

        //sorting functionality
        $scope.sortReverse = false;
        $scope.sort = function (sortKey) {
            $scope.sortBy = sortKey;
            $scope.sortReverse = !$scope.sortReverse;
        }

        //duplicate invoice check
        $scope.isExistingInv = function (iNum) {
            var isExistInv = false;
            angular.forEach($scope.SummaryList, function (inv, i) {
                if ((inv.onum && inv.onum == iNum) || (inv.inum && inv.inum == iNum) || (inv.doc_num && inv.doc_num == iNum) || (inv.odoc_num && inv.odoc_num == iNum)) {
                    isExistInv = true;
                }
            });
            return (isExistInv) ? true : false;
        }


        //To disable Future Dates
        $scope.datefunc = function () {
            var rtDt = null,
                today = moment().format(dateFormat),
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat);
            if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
                rtDt = today;
            } else {
                rtDt = lastDate1;
            }
            return rtDt;
        };
				$scope.todayDate = function () {
					return moment().format(dateFormat);
				}
        //Navigate to Items Page 
        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.itmInv = $scope.newInvRw;
                    shareData.isNewRec = true;
                    $scope.page("/gstr2/items/" + tableCode);
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                var pgIndex = (($scope.currentPage - 1) * $scope.pageSize) + iIndex;

                shareData.isNewRec = false;
                shareData.itmInv = $scope.SummaryList[pgIndex];

                $scope.page("/gstr2/items/" + tableCode);

            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var pgIndex = (($scope.currentPage - 1) * $scope.pageSize) + iIndex;

            var stdata = angular.copy($scope.SummaryList[pgIndex]);

            var updatedNodeDetails = R2Structure.getUpdatedNodeDetails(tableCode, stdata);

            if (stdata.itms) {
                R1InvHandler.update($scope, stdata, updatedNodeDetails, formateNodePayload);
            } else {
                R1InvHandler.emptyItemUpdate($scope, stdata, updatedNodeDetails, formateNodePayload);
            }
        }

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.SummaryList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(R2Structure.getUpdatedNodeDetails(tableCode, inv));
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.SummaryList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }

        $scope.isIntraState = function (isNew, iIndex) {
            var pgIndex = (($scope.currentPage - 1) * $scope.pageSize) + iIndex;

            if (isNew) {
                return ($scope.newInvRw.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            } else {
                return ($scope.SummaryList[pgIndex].sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }

        //To add new invoice 
        $scope.savePayload = function () {
            var newInvoice = angular.copy($scope.newInvRw)
            if ($scope.newInvFrm.$valid) {
                var stdata = angular.copy(newInvoice);
                if (stdata) {
                    R1InvHandler.emptyItemAdd($scope, stdata, formateNodePayload).then(function (response) {
                        if (response.length < 1) {
                            $scope.SummaryList.push(newInvoice);
                            $scope.newInvValidtr = false;
                            initNewInvRow();
                        }
                    });

                }
            } else {
                $scope.newInvValidtr = true;
            }
        }

        //Functionalities triggered after paste
        // $scope.onpastedone = function (iData) {
        //     iData = JSON.parse(iData);
        //     console.log(iData);
        //     var newInvAry1 = [],
        //         newInvAry2 = [];

        //     $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
        //         var invAry = R1InvHandler.preparePayloadFromExcel(iData, getInv, getItm, getExcelTitle, getInvKey);
        //         angular.forEach(invAry, function (sInv, i) {
        //             newInvAry1.push(formateNodePayload(sInv));
        //             newInvAry2.push(angular.copy(sInv));
        //         });

        //         R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
        //             angular.forEach(newInvAry2, function (inv) {
        //                 if (iRs.indexOf(inv.inum) === -1) {
        //                     $scope.SummaryList.push(inv);
        //                 }
        //             });

        //             timeout(function () {
        //                 $scope.$digest();
        //             }, 0);
        //         }, function () { });
        //     });
        // }


    }
]);


myApp.controller("gstr2itmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', 'R2Structure',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler, R2Structure) {

        $scope.newItmValidtr = false;
        $scope.selectAll = null;
        var tblcd = null;

        //check if GSTR info available
        if (!shareData.dashBoardDt && !shareData.itmInv) {
            $scope.page("/gstr/summary");
            return false;
        } else {

            $scope.dashBoardDt = shareData.dashBoardDt;

            tblcd = $scope.dashBoardDt.tbl_cd;

            $scope.itmList = shareData.itmInv;
        }

        initItm();

        function initItm() {
            $scope.nwItm = R2Structure.getNewItm(tblcd);
        }


        $scope.isNewRec = shareData.isNewRec;

        $scope.invNum = getInvoiceNumber(tblcd);

        function getInvoiceNumber(iSec) {
            var inum = null;
            switch (iSec) {
                case 'imp_g':
                case 'imp_ga':
                    inum = $scope.itmList.boe_num
                    break;
                case 'imp_s':
                case 'imp_sa':
                case 'atadj':
                    inum = $scope.itmList.i_num;
                    break;
            }
            return inum;
        }

        $scope.isImpg = function () {
            return (tblcd === "imp_g" || tblcd === "imp_ga") ? true : false;
        }

        //Formaters

        var formateNodePayload = R2Structure.formateNodePayload(tblcd);



        $scope.isIntraState = function () {
            if ($scope.itmList && $scope.itmList.sp_typ) {
                return ($scope.itmList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }

        //Add Item - softadd
        $scope.addItem = function () {
            if ($scope.newItmFrm.$valid) {
                var itmLs = (tblcd == "atadj") ? $scope.itmList.doc : $scope.itmList.itms,
                    itmLn = itmLs.length,
                    newItm = R2Structure.getItmNodeStructure(tblcd, $scope.nwItm, itmLn);

                if (tblcd == 'atadj') {
                    $scope.itmList.doc.push(newItm);
                }
                else {
                    $scope.itmList.itms.push(newItm);
                }

                $scope.newItmValidtr = false;
                initItm();

            } else {
                $scope.newItmValidtr = true;
            }
        }

        //Delete Item - soft delete
        $scope.deleteSelectedItms = function () {
            var rtArry = [], iData = null;
            if (tblcd == "atadj") {
                iData = $scope.itmList.doc;
            }
            else {
                iData = $scope.itmList.itms;
            }
            angular.forEach(iData, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            iData = angular.copy(rtArry);
            $log.debug("gstr2itmctrl -> deleteSelectedRows :: ", $scope.itmList);
            $scope.selectAll = 'N';
        }


        //To add new invoice 
        $scope.savePayload = function () {
            var stdata = angular.copy($scope.itmList);

            R1InvHandler.add($scope, stdata, formateNodePayload);
        }

        //To Update Invoice
        $scope.updatePayload = function () {
            var stdata = angular.copy($scope.itmList);

            var updatedNodeDetails = R2Structure.getUpdatedNodeDetails(tblcd, stdata);

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateNodePayload);


        }

    }
]);

myApp.controller("b2bsumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {
        // alert("inside");
        $scope.B2BList = [];
        shareData.isNewRec = true;

        $scope.newInvValidtr = false;
        $scope.newInvRw = {
            "inum": null,
            "idt": null,
            "val": null,
            "pos": null,
            "rchrg": 'N',
            "ctin": null,
            "itms": [],
            "sp_typ": {
                "name": null
            }
        };


        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }


        //Formate B2B payload for UI
        function reformateB2B(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (list, i) {
                angular.forEach(list.inv, function (inv) {
                    inv['ctin'] = list['ctin'];
                    /*inv['sp_typ'] = $scope.getSupplyType(inv['etin'], inv['pos']);*/
                    inv['sp_typ'] = $scope.getSupplyType(inv['ctin'], inv['pos']);
                    rtArry.push(inv);
                });
            });
            return rtArry;
        }

        //Formate B2B payload for Node API
        function formateB2BNodePayload(oData) {
            var iData = angular.copy(oData);
            delete iData.sp_typ;

            var rtData = {
                "ctin": iData.ctin,
                // "cfs": iData.cfs,
                "inv": []
            }
            delete iData.ctin;
            // delete iData.cfs;
            rtData.inv.push(iData);

            return rtData;
        }

        //Paste structure for Inv
        function getB2BInv(i, inv, itemFn) {
            return {
                "inum": inv['Invoice Number'],
                "idt": inv['Invoice date'],
                // "cfs": inv['Filing Status'],
                "val": inv['Total Invoice Value'],
                "pos": "" + inv['POS'],
                // "updby": inv['Uploaded By'],
                "rchrg": inv['Reverse Charge'],
                // "prs": inv['Prv.Amnt'],
                // "etin": inv['ETIN'],
                "ctin": inv['GSTIN'],
                "itms": [itemFn(i, inv)],
                "sp_typ": {
                    "name": inv['Supply Type']
                }
            };
        }

        //Paste structure for Item
        function getB2BItem(i, inv) {
            return {
                "num": i,
                //"status": "A",
                "itm_det": {
                    "ty": inv['Category'],
//                    "hsn_sc": inv['HSN/SAC of Supply'],
                    "txval": inv['Total Taxable Value'],
                    "irt": inv['IGST Rate'],
                    "iamt": inv['IGST Amount'],
                    "crt": inv['CGST Rate'],
                    "camt": inv['CGST Amount'],
                    "srt": inv['SGST Rate'],
                    "samt": inv['SGST Amount'],
                    "csrt": inv['CESS Rate'],
                    "csamt": inv['CESS Amount'],
                    "elg": inv['Eligibility For ITC']
                },
                "itc": {
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

        //To get B2B list
        $scope.initB2bSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("b2bsumryctrl -> initB2bSumryList success:: ", response);

                    $scope.B2BList = reformateB2B(response);

                }, function (response) {
                    $log.debug("b2bsumryctrl -> initB2bSumryList fail:: ", response);
                });
            }
        }

        //Navigate to Items Page 
        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.b2bInv = $scope.newInvRw;

                    shareData.isNewRec = true;
                    $scope.page("/gstr2/b2b/items");
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.isNewRec = false;
                shareData.b2bInv = $scope.B2BList[iIndex];
                $scope.page("/gstr2/b2b/items");
            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.B2BList[iIndex]);

            var updatedNodeDetails = {
                ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BNodePayload);
        }

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.B2BList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        ctin: inv.ctin,
                        inum: inv.inum
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.B2BList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }

        //Functionalities triggered after paste
        $scope.onpastedone = function (iData) {
            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [];

            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                var invAry = R1InvHandler.preparePayloadFromExcel(iData, getB2BInv, getB2BItem, "Invoice Number", "inum");
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateB2BNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.B2BList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            });
        }




    }
]);

myApp.controller("b2bitmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

        $scope.newItmValidtr = false;
        $scope.selectAll = null;

        $scope.elgBltyList = [{
            "value": "ip",
            "name": "Input/Input Services"
        },
        {
            "value": "cg",
            "name": "Capital Goods"
        },
        {
            "value": "isd",
            "name": "Transfer To ISD"
        },
        {
            "value": "none",
            "name": "None"
        }]

        initItm();

        function initItm() {
            $scope.nwItm = {
                "ty": "",
//                "hsn_sc": null,
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
                    "tx_i": 0,
                    "tx_s": 0,
                    "tx_c": 0,
                    "tx_cs": 0,
                    "tc_i": 0,
                    "tc_s": 0,
                    "tc_c": 0,
                    "tc_cs": 0
                },

            }

            //check if GSTR info available
            if (!shareData.dashBoardDt) {
                $scope.page("/gstr1/dashboard");
            } else {
                $scope.dashBoardDt = shareData.dashBoardDt;
            }


            //check if invoice info available
            if (shareData.b2bInv) {
                $scope.B2BList = shareData.b2bInv;
            } else {
                $scope.page("/gstr1/summary");
            }

            $scope.isNewRec = shareData.isNewRec;
        }

        function formateB2BNodePayload(iData) {
            delete iData.sp_typ;
            iData.flag = "A";
            var rtData = {
                "ctin": iData.ctin,
                // "cfs": iData.cfs,
                "inv": []
            }
            delete iData.ctin;
            // delete iData.cfs;
            rtData.inv.push(iData);
            return rtData;
        }

        $scope.isIntraState = function () {
            if ($scope.B2BList && $scope.B2BList.sp_typ) {
                return ($scope.B2BList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        //Add Item - softadd
        $scope.addItem = function () {
            var newItem = angular.copy($scope.nwItm),
                itc = angular.copy($scope.nwItm.itc);

            if ($scope.newItmFrm.$valid) {
                var itmLs = $scope.B2BList.itms,
                    itmLn = itmLs.length;

                delete newItem.itc;

                $scope.B2BList.itms.push({
                    "num": itmLn + 1,
                    "itm_det": newItem,
                    "itc": itc

                });
                $scope.newItmValidtr = false;
                initItm();
            } else {
                $scope.newItmValidtr = true;
            }
        }

        //Delete Item - soft delete
        $scope.deleteSelectedItms = function () {
            var rtArry = [];
            angular.forEach($scope.B2BList.itms, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            $scope.B2BList.itms = angular.copy(rtArry);
            $log.debug("b2bitmctrl -> deleteSelectedRows :: ", $scope.B2BList);
            $scope.selectAll = 'N';
        }

        //To add new invoice 
        $scope.saveB2BPayload = function () {
            var stdata = angular.copy($scope.B2BList);
            R1InvHandler.add($scope, stdata, formateB2BNodePayload);
        }

        //To Update Invoice
        $scope.updateB2BPayload = function () {
            delete $scope.B2BList.itms.select;
            var stdata = angular.copy($scope.B2BList);

            var updatedNodeDetails = {
                ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BNodePayload);
        }

    }
]);

myApp.controller("b2bursumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {
        //    alert("inside");
        $scope.B2BURList = [];
        shareData.isNewRec = true;

        $scope.newInvValidtr = false;

        $scope.newInvRw = {
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
        };


        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }


        //Formate B2B payload for UI
        function reformateB2BUR(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (list, i) {
                angular.forEach(list.inv, function (inv) {
                    inv['sp_typ'] = $scope.getSupplyType($scope.dashBoardDt.gstin, inv['pos']);
                    rtArry.push(inv);
                });
            });
            return rtArry;
        }

        //Formate B2B payload for Node API
        function formateB2BURNodePayload(oData) {
            var iData = angular.copy(oData);
            delete iData.sp_typ;

            var rtData = {
                "inv": []
            }

            rtData.inv.push(iData);

            return rtData;
        }

        //Paste structure for Inv
        function getB2BURInv(i, inv, itemFn) {
            return {
                "inum": inv['Invoice Number'],
                "idt": inv['Invoice date'],
                "val": inv['Total Invoice Value'],
                "pos": "" + inv['POS'],
                "rchrg": inv['Reverse Charge'],
                "cname": inv['UID'],
                "itms": [itemFn(i, inv)],
                "sp_typ": {
                    "name": inv['Supply Type']
                }
            };
        }

        //Paste structure for Item
        function getB2BURItem(i, inv) {
            return {
                "num": i,
                //"status": "A",
                "itm_det": {
                    "ty": inv['Category'],
//                    "hsn_sc": inv['HSN/SAC of Supply'],
                    "txval": inv['Total Taxable Value'],
                    "irt": inv['IGST Rate'],
                    "iamt": inv['IGST Amount'],
                    "crt": inv['CGST Rate'],
                    "camt": inv['CGST Amount'],
                    "srt": inv['SGST Rate'],
                    "samt": inv['SGST Amount'],
                    "csrt": inv['CESS Rate'],
                    "csamt": inv['CESS Amount'],
                    "elg": inv['Eligibility For ITC']
                },
                "itc": {
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

        //To get B2B list
        $scope.initB2burSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("b2bursumryctrl -> initB2burSumryList success:: ", response);

                    $scope.B2BURList = reformateB2BUR(response);

                }, function (response) {
                    $log.debug("b2bursumryctrl -> initB2burSumryList fail:: ", response);
                });
            }
        }


        $scope.onCtinChange = function (iInv) {
            timeout(function () {
                if (iInv.pos) {
                    var ctin = $scope.dashBoardDt.gstin.slice(0, 2),
                        pos = iInv.pos,
                        suplyList = $scope.suplyList;

                    if (ctin === pos) {
                        iInv.sp_typ = suplyList[0];
                    } else {
                        iInv.sp_typ = suplyList[1];

                    }
                }
            }, 0)
        }

        //Navigate to Items Page 
        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.b2burInv = $scope.newInvRw;

                    shareData.isNewRec = true;
                    $scope.page("/gstr2/b2bur/items");
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.isNewRec = false;
                shareData.b2burInv = $scope.B2BURList[iIndex];
                $scope.page("/gstr2/b2bur/items");
            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.B2BURList[iIndex]);

            var updatedNodeDetails = {
                // ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BURNodePayload);
        }

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.B2BURList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        // ctin: inv.ctin,
                        inum: inv.inum
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.B2BURList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }

        //Functionalities triggered after paste
        $scope.onpastedone = function (iData) {
            iData = JSON.parse(iData);
            //console.log(iData);
            var newInvAry1 = [],
                newInvAry2 = [];

            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                var invAry = R1InvHandler.preparePayloadFromExcel(iData, getB2BURInv, getB2BURItem, "Invoice Number", "inum");
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateB2BURNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.B2BURList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            });
        }




    }
]);

myApp.controller("b2buritmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

        $scope.newItmValidtr = false;
        $scope.selectAll = null;

        $scope.elgBltyList = [{
            "value": "ip",
            "name": "Input/Input Services"
        },
        {
            "value": "cg",
            "name": "Capital Goods"
        },
        {
            "value": "isd",
            "name": "Transfer To ISD"
        },
        {
            "value": "none",
            "name": "None"
        }]

        initItm();

        function initItm() {
            $scope.nwItm = {
                "ty": "",
//                "hsn_sc": null,
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
                    "tx_i": 0,
                    "tx_s": 0,
                    "tx_c": 0,
                    "tx_cs": 0,
                    "tc_i": 0,
                    "tc_s": 0,
                    "tc_c": 0,
                    "tc_cs": 0
                },

            }

            //check if GSTR info available
            if (!shareData.dashBoardDt) {
                $scope.page("/gstr1/dashboard");
            } else {
                $scope.dashBoardDt = shareData.dashBoardDt;
            }


            //check if invoice info available
            if (shareData.b2burInv) {
                $scope.B2BURList = shareData.b2burInv;
            } else {
                $scope.page("/gstr1/summary");
            }

            $scope.isNewRec = shareData.isNewRec;
        }

        function formateB2BURNodePayload(iData) {
            delete iData.sp_typ;
            iData.flag = "A";
            var rtData = {
                "inv": []
            }
            rtData.inv.push(iData);
            return rtData;
        }

        $scope.isIntraState = function () {
            if ($scope.B2BURList && $scope.B2BURList.sp_typ) {
                return ($scope.B2BURList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        //Add Item - softadd
        $scope.addItem = function () {
            var newItem = angular.copy($scope.nwItm),
                itc = angular.copy($scope.nwItm.itc);



            if ($scope.newItmFrm.$valid) {
                var itmLs = $scope.B2BURList.itms,
                    itmLn = itmLs.length;

                delete newItem.itc;

                $scope.B2BURList.itms.push({
                    "num": itmLn + 1,
                    "itm_det": newItem,
                    "itc": itc

                });
                $scope.newItmValidtr = false;
                initItm();
            } else {
                $scope.newItmValidtr = true;
            }
        }

        //Delete Item - soft delete
        $scope.deleteSelectedItms = function () {
            var rtArry = [];
            angular.forEach($scope.B2BURList.itms, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            $scope.B2BURList.itms = angular.copy(rtArry);
            $log.debug("b2buritmctrl -> deleteSelectedRows :: ", $scope.B2BList);
            $scope.selectAll = 'N';
        }

        //To add new invoice 
        $scope.saveB2BURPayload = function () {
            var stdata = angular.copy($scope.B2BURList);
            R1InvHandler.add($scope, stdata, formateB2BURNodePayload);
        }

        //To Update Invoice
        $scope.updateB2BURPayload = function () {
            delete $scope.B2BURList.itms.select;
            var stdata = angular.copy($scope.B2BURList);

            var updatedNodeDetails = {
                // ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BURNodePayload);
        }

    }
]);


myApp.controller("b2basumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {

        $scope.B2BAList = [];
        shareData.isNewRec = true;


        $scope.newInvValidtr = false;
        $scope.newInvRw = {
            "inum": null,
            "idt": null,
            "val": null,
            "oinum": null,
            "odt": null,
            "pos": null,
            "rchrg": 'N',
            "ctin": null,
            "itms": [],
            "sp_typ": {
                "name": null
            }
        };

        // $scope.upLoadList = [{
        //     value: "S",
        //     name: "Supplier"
        // },
        // {
        //     value: "R",
        //     name: "Receiver"
        // }]

        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }

        //Formate response for UI
        function reformateB2BA(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (list, i) {
                angular.forEach(list.inv, function (inv) {
                    inv['ctin'] = list['ctin'];
                    /*inv['sp_typ'] = $scope.getSupplyType(inv['etin'], inv['pos']);*/
                    inv['sp_typ'] = $scope.getSupplyType(inv['ctin'], inv['pos']);
                    rtArry.push(inv);
                });
            });
            return rtArry;
        }

        //Formate response for Node API
        function formateB2BANodePayload(oData) {
            var iData = angular.copy(oData);
            delete iData.sp_typ;

            var rtData = {
                "ctin": iData.ctin,
                // "cfs": iData.cfs,
                "inv": []
            }
            delete iData.ctin;
            // delete iData.cfs;
            rtData.inv.push(iData);

            return rtData;
        }

        //Paste structure for Inv
        function getB2BAInv(i, inv, itemFn) {
            return {
                "oinum": inv['Original Invoice Number'],
                "oidt": inv['Original Invoice date'],
                "inum": inv['Revised Invoice Number'],
                "idt": inv['Revised Invoice date'],
                // "cfs": inv['Filing Status'],
                "val": inv['Total Invoice Value'],
                "pos": "" + inv['POS'],
                // "updby": inv['Uploaded By'],
                "rchrg": inv['Reverse Charge'],
                // "prs": inv['Prv.Amnt'],
                // "etin": inv['ETIN'],
                "ctin": inv['GSTIN'],
                "itms": [itemFn(i, inv)],
                "sp_typ": {
                    "name": inv['Supply Type']
                }
            };
        }

        //Paste structure for Item
        function getB2BAItem(i, inv) {
            return {
                "num": i,
                //"status": "A",
                "itm_det": {
                    "ty": inv['Category'],
//                    "hsn_sc": inv['HSN/SAC of Supply'],
                    "txval": inv['Total Taxable Value'],
                    "irt": inv['IGST Rate'],
                    "iamt": inv['IGST Amount'],
                    "crt": inv['CGST Rate'],
                    "camt": inv['CGST Amount'],
                    "srt": inv['SGST Rate'],
                    "samt": inv['SGST Amount'],
                    "csrt": inv['CESS Rate'],
                    "csamt": inv['CESS Amount'],
                    "elg": inv['Eligibility For ITC']
                },
                "itc": {
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

        //To get B2BA List
        $scope.initB2baSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("b2basumryctrl -> initB2baSumryList success:: ", response);

                    $scope.B2BAList = reformateB2BA(response); //new NgTableParams({}, { counts: [], dataset: response });
                }, function (response) {
                    $log.debug("b2basumryctrl -> initB2baSumryList fail:: ", response);
                });
            }
        }


        //To navigate to item level

        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.b2baInv = $scope.newInvRw;

                    shareData.isNewRec = true;
                    $scope.page("/gstr2/b2ba/items");
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.isNewRec = false;
                shareData.b2baInv = $scope.B2BAList[iIndex];
                $scope.page("/gstr2/b2ba/items");
            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.B2BAList[iIndex]);

            var updatedNodeDetails = {
                ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BANodePayload);
        }


        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.B2BAList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        ctin: inv.ctin,
                        inum: inv.inum
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.B2BAList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }




        $scope.onpastedone = function (iData) {
            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [];


            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                var invAry = R1InvHandler.preparePayloadFromExcel(iData, getB2BAInv, getB2BAItem, "Revised Invoice Number", "inum");
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateB2BANodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.B2BAList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            });
        }

    }
]);

myApp.controller("b2baitmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {


        $scope.newItmValidtr = false;
        $scope.selectAll = null;

        $scope.elgBltyList = [{
            "value": "ip",
            "name": "Input/Input Services"
        },
        {
            "value": "cg",
            "name": "Capital Goods"
        },
        {
            "value": "isd",
            "name": "Transfer To ISD"
        },
        {
            "value": "none",
            "name": "None"
        }]

        initItm();

        function initItm() {
            $scope.nwItm = {
                "ty": "",
//                "hsn_sc": null,
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
                    "tx_i": 0,
                    "tx_s": 0,
                    "tx_c": 0,
                    "tx_cs": 0,
                    "tc_i": 0,
                    "tc_s": 0,
                    "tc_c": 0,
                    "tc_cs": 0
                },

            }

            //check if GSTR info available
            if (!shareData.dashBoardDt) {
                $scope.page("/gstr1/dashboard");
            } else {
                $scope.dashBoardDt = shareData.dashBoardDt;
            }


            //check if invoice info available
            if (shareData.b2baInv) {
                $scope.B2BAList = shareData.b2baInv;
            } else {
                $scope.page("/gstr1/summary");
            }

            $scope.isNewRec = shareData.isNewRec;
        }

        function formateB2BANodePayload(iData) {
            delete iData.sp_typ;
            iData.flag = "A";
            var rtData = {
                "ctin": iData.ctin,

                "inv": []
            }
            delete iData.ctin;

            rtData.inv.push(iData);
            return rtData;
        }



        $scope.isIntraState = function () {
            if ($scope.B2BAList && $scope.B2BAList.sp_typ) {
                return ($scope.B2BAList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        $scope.addItem = function () {
            var newItem = angular.copy($scope.nwItm),
                itc = angular.copy($scope.nwItm.itc);

            if ($scope.newItmFrm.$valid) {
                var itmLs = $scope.B2BAList.itms,
                    itmLn = itmLs.length;

                delete newItem.itc;

                $scope.B2BAList.itms.push({
                    "num": itmLn + 1,
                    "itm_det": newItem,
                    "itc": itc

                });
                $scope.newItmValidtr = false;
                initItm();
            } else {
                $scope.newItmValidtr = true;
            }
        }

        //Delete Item - soft delete
        $scope.deleteSelectedItms = function () {
            var rtArry = [];
            angular.forEach($scope.B2BAList.itms, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            $scope.B2BAList.itms = angular.copy(rtArry);
            $log.debug("b2baitmctrl -> deleteSelectedRows :: ", $scope.B2BAList);
            $scope.selectAll = 'N';
        }

        //To add new invoice 
        $scope.saveB2BAPayload = function () {
            var stdata = angular.copy($scope.B2BAList);
            R1InvHandler.add($scope, stdata, formateB2BANodePayload);
        }

        //To Update Invoice
        $scope.updateB2BAPayload = function () {
            var stdata = angular.copy($scope.B2BAList);

            var updatedNodeDetails = {
                ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BANodePayload);
        }

    }
]);


myApp.controller("b2baursumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {

        $scope.B2BAURList = [];
        shareData.isNewRec = true;


        $scope.newInvValidtr = false;
        $scope.newInvRw = {
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
        };

        // $scope.upLoadList = [{
        //     value: "S",
        //     name: "Supplier"
        // },
        // {
        //     value: "R",
        //     name: "Receiver"
        // }]

        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }

        //Formate response for UI
        function reformateB2BAUR(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (list, i) {
                angular.forEach(list.inv, function (inv) {
                    // inv['ctin'] = list['ctin'];
                    inv['sp_typ'] = $scope.getSupplyType($scope.dashBoardDt.gstin, inv['pos']);
                    rtArry.push(inv);
                });
            });
            return rtArry;
        }

        //Formate response for Node API
        function formateB2BAURNodePayload(oData) {
            var iData = angular.copy(oData);
            delete iData.sp_typ;

            var rtData = {
                "inv": []
            }
            rtData.inv.push(iData);

            return rtData;
        }

        //Paste structure for Inv
        function getB2BAURInv(i, inv, itemFn) {
            return {
                "oinum": inv['Original Invoice Number'],
                "oidt": inv['Original Invoice date'],
                "inum": inv['Revised Invoice Number'],
                "idt": inv['Revised Invoice date'],
                "val": inv['Total Invoice Value'],
                "pos": "" + inv['POS'],
                "rchrg": inv['Reverse Charge'],
                "cname": inv['UID'],
                "itms": [itemFn(i, inv)],
                "sp_typ": {
                    "name": inv['Supply Type']
                }
            };
        }

        //Paste structure for Item
        function getB2BAURItem(i, inv) {
            return {
                "num": i,
                //"status": "A",
                "itm_det": {
                    "ty": inv['Category'],
//                    "hsn_sc": inv['HSN/SAC of Supply'],
                    "txval": inv['Total Taxable Value'],
                    "irt": inv['IGST Rate'],
                    "iamt": inv['IGST Amount'],
                    "crt": inv['CGST Rate'],
                    "camt": inv['CGST Amount'],
                    "srt": inv['SGST Rate'],
                    "samt": inv['SGST Amount'],
                    "csrt": inv['CESS Rate'],
                    "csamt": inv['CESS Amount'],
                    "elg": inv['Eligibility For ITC']
                },
                "itc": {
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

        //To get B2BA List
        $scope.initB2baurSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("b2baursumryctrl -> initB2baurSumryList success:: ", response);

                    $scope.B2BAURList = reformateB2BAUR(response); //new NgTableParams({}, { counts: [], dataset: response });
                }, function (response) {
                    $log.debug("b2baursumryctrl -> initB2baurSumryList fail:: ", response);
                });
            }
        }

        $scope.onCtinChange = function (iInv) {
            timeout(function () {
                if (iInv.pos) {
                    var ctin = $scope.dashBoardDt.gstin.slice(0, 2),
                        pos = iInv.pos,
                        suplyList = $scope.suplyList;

                    if (ctin === pos) {
                        iInv.sp_typ = suplyList[0];
                    } else {
                        iInv.sp_typ = suplyList[1];

                    }
                }
            }, 0)
        }

        //To navigate to item level

        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.b2baurInv = $scope.newInvRw;

                    shareData.isNewRec = true;
                    $scope.page("/gstr2/b2baur/items");
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.isNewRec = false;
                shareData.b2baurInv = $scope.B2BAURList[iIndex];
                $scope.page("/gstr2/b2baur/items");
            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.B2BAURList[iIndex]);

            var updatedNodeDetails = {
                // ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BAURNodePayload);
        }


        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.B2BAURList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        // ctin: inv.ctin,
                        inum: inv.inum
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.B2BAURList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }




        $scope.onpastedone = function (iData) {
            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [];


            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                var invAry = R1InvHandler.preparePayloadFromExcel(iData, getB2BAURInv, getB2BAURItem, "Revised Invoice Number", "inum");
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateB2BAURNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.B2BAURList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            });
        }

    }
]);

myApp.controller("b2bauritmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {


        $scope.newItmValidtr = false;
        $scope.selectAll = null;

        $scope.elgBltyList = [{
            "value": "ip",
            "name": "Input/Input Services"
        },
        {
            "value": "cg",
            "name": "Capital Goods"
        },
        {
            "value": "isd",
            "name": "Transfer To ISD"
        },
        {
            "value": "none",
            "name": "None"
        }]

        initItm();

        function initItm() {
            $scope.nwItm = {
                "ty": "",
//                "hsn_sc": null,
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
                    "tx_i": 0,
                    "tx_s": 0,
                    "tx_c": 0,
                    "tx_cs": 0,
                    "tc_i": 0,
                    "tc_s": 0,
                    "tc_c": 0,
                    "tc_cs": 0
                },

            }

            //check if GSTR info available
            if (!shareData.dashBoardDt) {
                $scope.page("/gstr1/dashboard");
            } else {
                $scope.dashBoardDt = shareData.dashBoardDt;
            }


            //check if invoice info available
            if (shareData.b2baurInv) {
                $scope.B2BAURList = shareData.b2baurInv;
            } else {
                $scope.page("/gstr1/summary");
            }

            $scope.isNewRec = shareData.isNewRec;
        }

        function formateB2BAURNodePayload(iData) {
            delete iData.sp_typ;
            iData.flag = "A";
            var rtData = {
                "inv": []
            }
            // delete iData.ctin;

            rtData.inv.push(iData);
            return rtData;
        }



        $scope.isIntraState = function () {
            if ($scope.B2BAURList && $scope.B2BAURList.sp_typ) {
                return ($scope.B2BAURList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        $scope.addItem = function () {
            var newItem = angular.copy($scope.nwItm),
                itc = angular.copy($scope.nwItm.itc);

            if ($scope.newItmFrm.$valid) {
                var itmLs = $scope.B2BAURList.itms,
                    itmLn = itmLs.length;

                delete newItem.itc;

                $scope.B2BAURList.itms.push({
                    "num": itmLn + 1,
                    "itm_det": newItem,
                    "itc": itc

                });
                $scope.newItmValidtr = false;
                initItm();
            } else {
                $scope.newItmValidtr = true;
            }
        }

        //Delete Item - soft delete
        $scope.deleteSelectedItms = function () {
            var rtArry = [];
            angular.forEach($scope.B2BAURList.itms, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            $scope.B2BAURList.itms = angular.copy(rtArry);
            $log.debug("b2baitmctrl -> deleteSelectedRows :: ", $scope.B2BAURList);
            $scope.selectAll = 'N';
        }

        //To add new invoice 
        $scope.saveB2BAURPayload = function () {
            var stdata = angular.copy($scope.B2BAURList);
            R1InvHandler.add($scope, stdata, formateB2BAURNodePayload);
        }

        //To Update Invoice
        $scope.updateB2BAURPayload = function () {
            var stdata = angular.copy($scope.B2BAURList);

            var updatedNodeDetails = {
                // ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateB2BAURNodePayload);
        }

    }
]);

myApp.controller("Cdnsumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {

        $scope.CdnList = [];
        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }

       /* $scope.rsnList = [{
            name: "Balance"
        }, {
            name: "Sales Return"
        },
        {
            name: "Post Sale Discount"
        },
        {
            name: "Deficiency in Service"
        },
        {
            name: "Not mentioned"
        },
        {
            name: "Others"
        }];*/

        $scope.noteList = [{
            "value": "C",
            "name": "Credit"
        }, {
            "value": "D",
            "name": "Debit"
        }];

        // $scope.elgBltyList = [{
        //     "value": "ip",
        //     "name": "Input/Input Services"
        // },
        // {
        //     "value": "cg",
        //     "name": "Capital Goods"
        // },
        // {
        //     "value": "isd",
        //     "name": "Transfer To ISD"
        // },
        // {
        //     "value": "none",
        //     "name": "None"
        // }]


        $scope.onpastedone = function (iData) {

            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [],
                iLen = iData.length;

            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                angular.forEach(iData, function (inv, i) {

                    var sInv = {

                        "nt_num": inv['Debit Note Number'],
                        "nt_dt": inv['Debit Note date'],
                        "inum": inv['Invoice Number'],
                        "ntty": inv["Note Type"],
                        "rsn": inv["Reason For Issuing Note"],
                        "idt": inv['Invoice date'],
                        "val": inv['Total Invoice Value'],
                        // "etin": inv['ETIN'],
                        "ctin": inv['GSTIN'],
                        "irt": inv['IGST Rate'],
                        "iamt": inv['IGST Amount'],
                        "crt": inv['CGST Rate'],
                        "camt": inv['CGST Amount'],
                        "srt": inv['SGST Rate'],
                        "samt": inv['SGST Amount'],
                        "csrt": inv['CESS Rate'],
                        "csamt": inv['CESS Amount'],
                        "sp_typ": {
                            "name": inv['Supply Type']
                        },
                        "elg": inv['Eligibility For ITC'],
                        "itc": {
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

                    newInvAry1.push(formateCdnNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.CdnList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            })
        }



        $scope.newInvValidtr = false;
        initNote();

        function initNote() {
            $scope.newInvRw = {
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
                "elg": null,
                "itc": {
                    "tx_i": 0,
                    "tx_s": 0,
                    "tx_c": 0,
                    "tx_cs": 0,
                    "tc_i": 0,
                    "tc_s": 0,
                    "tc_c": 0,
                    "tc_cs": 0
                },

                "rsn": "Sales Return",
                "sp_typ": {
                    "name": "Inter-State"
                },
                "ntty": "C",
                //  "updby": "S"

            };
        }



        function reformateCdn(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (list, i) {
                angular.forEach(list.nt, function (nt) {
                    nt['ctin'] = list['ctin'];
                    nt['sp_typ'] = $scope.suplyList[1];
                    rtArry.push(nt);
                });
            });
            return rtArry;
        }

        $scope.initCdnSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("cdnsumryctrl -> initCdnSumryList success:: ", response);

                    $scope.CdnList = reformateCdn(response); //new NgTableParams({}, { counts: [], dataset: response });
                }, function (response) {
                    $log.debug("cdnsumryctrl -> initcdnSumryList fail:: ", response);
                });
            }
        }


        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.CdnList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        ctin: inv.ctin
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.CdnList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }

        // $scope.isIntra = false;
        // $scope.isIntraNwRw = false;
        // $scope.isIntraState = function (index, supplyType) {
        //     var flag = (supplyType.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
        //     if (index == "add") {
        //         $scope.isIntraNwRw = flag;
        //     } else {
        //         $scope.isIntra = flag;
        //     }
        // }

        $scope.isIntraState = function (sp_typ) {
            if (sp_typ) {
                $scope.isIntra = (sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }

        function formateCdnNodePayload(oData) {

            // if (!oData.updby) {
            //     oData.updby = "S";
            // }
            var iData = angular.copy(oData);

            delete iData.sp_typ;

            var rtData = {
                "ctin": iData.ctin,
                "nt": []
            }
            delete iData.ctin;

            rtData.nt.push(iData);

            return rtData;
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.CdnList[iIndex]);

            var updatedNodeDetails = {
                ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.emptyItemUpdate($scope, stdata, updatedNodeDetails, formateCdnNodePayload);
        }


        //To add new invoice 
        $scope.saveCdnPayload = function () {
            var newNote = angular.copy($scope.newInvRw)
            if ($scope.newInvFrm.$valid) {
                $scope.CdnList.push(newNote);
                var stdata = angular.copy(newNote);
                if (stdata) {
                    R1InvHandler.emptyItemAdd($scope, stdata, formateCdnNodePayload);
                    $scope.newInvValidtr = false;
                    initNote();
                }
            }
            else {
                $scope.newInvValidtr = true;
            }
        }


    }
]);

myApp.controller("Cdnasumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {
        $scope.CdnaList = [];
        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }

      /*  $scope.rsnList = [{
            name: "Balance"
        }, {
            name: "Sales Return"
        },
        {
            name: "Post Sale Discount"
        },
        {
            name: "Deficiency in Service"
        },
        {
            name: "Not mentioned"
        },
        {
            name: "Others"
        }];*/

        $scope.noteList = [{
            "value": "C",
            "name": "Credit"
        }, {
            "value": "D",
            "name": "Debit"
        }];

        $scope.elgBltyList = [{
            "value": "ip",
            "name": "Input/Input Services"
        },
        {
            "value": "cg",
            "name": "Capital Goods"
        },
        {
            "value": "isd",
            "name": "Transfer To ISD"
        },
        {
            "value": "none",
            "name": "None"
        }]


        $scope.onpastedone = function (iData) {

            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [],
                iLen = iData.length;

            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                angular.forEach(iData, function (inv, i) {

                    var sInv = {
                        "ont_num": inv['Original Debit Note Number'],
                        "ont_dt": inv['Original Debit Note date'],
                        "nt_num": inv['Debit Note Number'],
                        "nt_dt": inv['Debit Note date'],
                        "inum": inv['Invoice Number'],
                        "ntty": inv["Note Type"],
                       // "rsn": inv["Reason For Issuing Note"],
                        "idt": inv['Invoice date'],
                        "val": inv['Total Invoice Value'],
                        // "etin": inv['ETIN'],
                        "ctin": inv['GSTIN'],
                        "irt": inv['IGST Rate'],
                        "iamt": inv['IGST Amount'],
                        "crt": inv['CGST Rate'],
                        "camt": inv['CGST Amount'],
                        "srt": inv['SGST Rate'],
                        "samt": inv['SGST Amount'],
                        "csrt": inv['CESS Rate'],
                        "csamt": inv['CESS Amount'],
                        "sp_typ": {
                            "name": inv['Supply Type']
                        },
                        "elg": inv['Eligibility For ITC'],
                        "itc": {
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

                    newInvAry1.push(formateCdnaNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.CdnaList.push(inv);
                        }
                    });
                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            })
        }



        $scope.newInvValidtr = false;
        initNote();

        function initNote() {
            $scope.newInvRw = {
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
                "elg": null,
                "itc": {
                    "tx_i": 0,
                    "tx_s": 0,
                    "tx_c": 0,
                    "tx_cs": 0,
                    "tc_i": 0,
                    "tc_s": 0,
                    "tc_c": 0,
                    "tc_cs": 0
                },

                "rsn": "Sales Return",
                "sp_typ": {
                    "name": "Inter-State"
                },
                "ntty": "C",
                // "updby": "S"

            };
        }



        function reformateCdn(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (list, i) {
                angular.forEach(list.nt, function (nt) {
                    nt['ctin'] = list['ctin'];
                    nt['sp_typ'] = $scope.suplyList[1];
                    rtArry.push(nt);
                });
            });
            return rtArry;
        }

        $scope.initCdnaSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("cdnasumryctrl -> initCdnaSumryList success:: ", response);

                    $scope.CdnaList = reformateCdn(response); //new NgTableParams({}, { counts: [], dataset: response });
                }, function (response) {
                    $log.debug("cdnasumryctrl -> initcdnaSumryList fail:: ", response);
                });
            }
        }


        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.CdnaList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        ctin: inv.ctin
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.CdnaList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }


        // $scope.isIntra = false;
        // $scope.isIntraNwRw = false;
        // $scope.isIntraState = function (index, supplyType) {
        //     var flag = (supplyType.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
        //     if (index == "add") {
        //         $scope.isIntraNwRw = flag;
        //     } else {
        //         $scope.isIntra = flag;
        //     }
        // }

        $scope.isIntraState = function (sp_typ) {
            if (sp_typ) {
                $scope.isIntra = (sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }

        function formateCdnaNodePayload(oData) {

            // if (!oData.updby) {
            //     oData.updby = "S";
            // }
            var iData = angular.copy(oData);

            delete iData.sp_typ;

            var rtData = {
                "ctin": iData.ctin,
                "nt": []
            }
            delete iData.ctin;

            rtData.nt.push(iData);

            return rtData;
        }



        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.CdnaList[iIndex]);

            var updatedNodeDetails = {
                ctin: stdata.ctin,
                inum: stdata.inum
            };

            R1InvHandler.emptyItemUpdate($scope, stdata, updatedNodeDetails, formateCdnaNodePayload);
        }


        //To add new invoice 
        $scope.saveCdnaPayload = function () {
            var newNote = angular.copy($scope.newInvRw)
            if ($scope.newInvFrm.$valid) {
                $scope.CdnaList.push(newNote);
                var stdata = angular.copy(newNote);
                if (stdata) {
                    R1InvHandler.emptyItemAdd($scope, stdata, formateCdnaNodePayload);
                    $scope.newInvValidtr = false;
                    initNote();
                }
            }
            else {
                $scope.newInvValidtr = true;
            }
        }



    }
]);


myApp.controller("impgsumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {

        $scope.ImpgList = [];
        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }

        shareData.isNewRec = true;

        $scope.newInvValidtr = false;
        $scope.newInvRw = {
            "boe_num": null,
            "boe_dt": null,
            "boe_val": null,
            "itms": [],
            "sp_typ": {
                "name": null
            }
        };




        function reformateImpg(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (inv) {
                inv['sp_typ'] = $scope.suplyList[1];
                rtArry.push(inv);
            });
            return rtArry;
        }


        //Paste structure for Inv
        function getImpgInv(i, inv, itemFn) {
            return {

                "boe_num": inv['Bill Of Entry Number'],
                "boe_dt": inv['Bill Of Entry date'],
                "boe_val": inv['Total Invoice Value'],
                "pos": "" + inv['POS'],
//                "prs": inv['Prv.Amnt'],
                "sp_typ": {
                    "name": inv['Supply Type']
                },
                "itms": [itemFn(i, inv)]

            };
        }

        //Paste structure for Item
        function getImpgItem(i, inv) {
            return {
                "num": i,
//                "hsn_sc": inv['HSN/SAC of Supply'],
                "txval": inv['Total Taxable Value'],
                "irt": inv['IGST Rate'],
                "iamt": inv['IGST Amount'],
                "crt": inv['CGST Rate'],
                "camt": inv['CGST Amount'],
                "srt": inv['SGST Rate'],
                "samt": inv['SGST Amount'],
                "csrt": inv['CESS Rate'],
                "csamt": inv['CESS Amount']

            };
        }


        $scope.initImpgSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("impgSumryctrl -> initImpgSumryList success:: ", response);

                    $scope.ImpgList = reformateImpg(response); //new NgTableParams({}, { counts: [], dataset: response });
                }, function (response) {
                    $log.debug("impgSumryctrl -> initImpgSumryList fail:: ", response);
                });
            }
        }



        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.ImpgList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        boe_num: inv.boe_num
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.ImpgList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }


        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.impgInv = $scope.newInvRw;
                    shareData.isNewRec = true;
                    $scope.page("/gstr2/impg/items");
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.impgInv = $scope.ImpgList[iIndex];
                shareData.isNewRec = false;
                $scope.page("/gstr2/impg/items");

            }

        }

        function formateImpgNodePayload(oData) {
            var iData = angular.copy(oData);
            delete iData.sp_typ;
            return iData;
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.ImpgList[iIndex]);

            var updatedNodeDetails = {
                boe_num: stdata.boe_num
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateImpgNodePayload);
        }




        $scope.onpastedone = function (iData) {
            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [];


            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                var invAry = R1InvHandler.preparePayloadFromExcel(iData, getImpgInv, getImpgItem, "Invoice Number", "inum");
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateImpgNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });


                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.ImpgList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            })
        }


    }
]);

myApp.controller("impgitmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {


        $scope.newItmValidtr = false;
        $scope.selectAll = null;

        initItm();

        function initItm() {
            $scope.nwItm = {
//                "hsn_sc": null,
                "txval": null,
                "irt": 0,
                "iamt": 0,
                "crt": 0,
                "camt": 0,
                "srt": 0,
                "samt": 0,
                "csrt": 0,
                "csamt": 0,
                "elg": null,
                "tx_i": 0,
                "tx_s": 0,
                "tx_c": 0,
                "tx_cs": 0,
                "tc_i": 0,
                "tc_s": 0,
                "tc_cs": 0,
                "tc_c": 0,


            }

            //check if GSTR info available
            if (!shareData.dashBoardDt) {
                $scope.page("/gstr1/dashboard");
            } else {
                $scope.dashBoardDt = shareData.dashBoardDt;
            }


            //check if invoice info available
            if (shareData.impgInv) {
                $scope.ImpgList = shareData.impgInv;
            } else {
                $scope.page("/gstr1/summary");
            }
            $scope.isNewRec = shareData.isNewRec;
        }

        function formateImpgNodePayload(iData) {
            delete iData.sp_typ;
            return iData;
        }

        $scope.isIntraState = function () {
            if ($scope.ImpgList) {
                return ($scope.ImpgList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        $scope.addItem = function () {
            if ($scope.newItmFrm.$valid) {
                var itmLs = $scope.ImpgList.itms,
                    itmLn = itmLs.length,
                    newItem = angular.copy($scope.nwItm);
                newItem.num = itmLn + 1;

                $scope.ImpgList.itms.push(newItem);
                $scope.newItmValidtr = false;
                initItm();
            } else {
                $scope.newItmValidtr = true;
            }
        }

        //To add new invoice 
        $scope.saveImpgPayload = function () {
            var stdata = angular.copy($scope.ImpgList);
            R1InvHandler.add($scope, stdata, formateImpgNodePayload);
        }




        //To Update Invoice
        $scope.updateImpgPayload = function () {
            var stdata = angular.copy($scope.ImpgList);

            var updatedNodeDetails = {
                boe_num: stdata.boe_num
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateImpgNodePayload);
        }

        $scope.deleteSelectedItms = function () {
            var rtArry = [];
            angular.forEach($scope.ImpgList.itms, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            $scope.ImpgList.itms = angular.copy(rtArry);
            $log.debug("impgitmctrl -> deleteSelectedItems :: ", $scope.ImpgList);
            $scope.selectAll = 'N';
        }
    }
]);


myApp.controller("impgasumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler) {

        $scope.ImpgaList = [];
        if (!$scope.dashBoardDt) {
            $scope.page("/gstr1/dashboard");
        } else {
            shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
            $scope.dashBoardDt = shareData.dashBoardDt;
        }

        shareData.isNewRec = true;

        $scope.newInvValidtr = false;
        $scope.newInvRw = {
            "boe_num": null,
            "boe_dt": null,
            "oboe_num": null,
            "oboe_dt": null,
            "boe_val": null,
            "itms": [],
            "sp_typ": {
                "name": null
            }
        };




        function reformateImpga(iResp) {
            var rtArry = [];
            angular.forEach(iResp, function (inv) {
                inv['sp_typ'] = $scope.suplyList[1];
                rtArry.push(inv);
            });
            return rtArry;
        }


        //Paste structure for Inv
        function getImpgaInv(i, inv, itemFn) {
            return {

                "boe_num": inv['Revised Bill Of Entry Number'],
                "boe_dt": inv['Revised Bill Of Entry date'],
                "oboe_num": inv['Original Bill Of Entry Number'],
                "oboe_dt": inv['Original Bill Of Entry date'],
                "boe_val": inv['Total Invoice Value'],
                "sp_typ": {
                    "name": inv['Supply Type']
                },
                "itms": [itemFn(i, inv)]

            };
        }

        //Paste structure for Item
        function getImpgaItem(i, inv) {
            return {
                "num": i,
//                "hsn_sc": inv['HSN/SAC of Supply'],
                "txval": inv['Total Taxable Value'],
                "irt": inv['IGST Rate'],
                "iamt": inv['IGST Amount'],
                "crt": inv['CGST Rate'],
                "camt": inv['CGST Amount'],
                "srt": inv['SGST Rate'],
                "samt": inv['SGST Amount'],
                "csrt": inv['CESS Rate'],
                "csamt": inv['CESS Amount']

            };
        }


        $scope.initImpgaSumryList = function () {
            if ($scope.dashBoardDt) {
                g1FileHandler.getContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
                    $log.debug("impgaSumryctrl -> initImpgaSumryList success:: ", response);

                    $scope.ImpgaList = reformateImpga(response); //new NgTableParams({}, { counts: [], dataset: response });
                }, function (response) {
                    $log.debug("impgaSumryctrl -> initImpgaSumryList fail:: ", response);
                });
            }
        }

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.ImpgList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push({
                        boe_num: inv.boe_num
                    });
                }
            });

            R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                $scope.ImpgList = angular.copy(response);
                $scope.selectAll = 'N';
            });
        }


        $scope.gotoAddItems = function (iIndex) {
            if (iIndex == 'add') {
                if ($scope.newInvFrm.$valid) {
                    shareData.impgInv = $scope.newInvRw;
                    shareData.isNewRec = true;
                    $scope.page("/gstr2/impg/items");
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.impgInv = $scope.ImpgList[iIndex];
                shareData.isNewRec = false;
                $scope.page("/gstr2/impg/items");

            }

        }

        function formateImpgaNodePayload(oData) {
            var iData = angular.copy(oData);
            delete iData.sp_typ;
            return iData;
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iIndex) {
            var stdata = angular.copy($scope.ImpgaList[iIndex]);

            var updatedNodeDetails = {
                boe_num: stdata.boe_num
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateImpgaNodePayload);
        }




        $scope.onpastedone = function (iData) {
            iData = JSON.parse(iData);
            var newInvAry1 = [],
                newInvAry2 = [];


            $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
                var invAry = R1InvHandler.preparePayloadFromExcel(iData, getImpgaInv, getImpgaItem, 'Revised Bill Of Entry Number', 'boe_num');
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateImpgaNodePayload(sInv));
                    newInvAry2.push(angular.copy(sInv));
                });


                R1InvHandler.onPaste($scope, newInvAry1).then(function (iRs) {
                    angular.forEach(newInvAry2, function (inv) {
                        if (iRs.indexOf(inv.inum) === -1) {
                            $scope.ImpgaList.push(inv);
                        }
                    });

                    timeout(function () {
                        $scope.$digest();
                    }, 0);
                }, function () { });
            })
        }


    }
]);

myApp.controller("impgaitmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {


        $scope.newItmValidtr = false;
        $scope.selectAll = null;

        initItm();

        function initItm() {
            $scope.nwItm = {
//                "hsn_sc": null,
                "txval": null,
                "irt": 0,
                "iamt": 0,
                "crt": 0,
                "camt": 0,
                "srt": 0,
                "samt": 0,
                "csrt": 0,
                "csamt": 0,
                "elg": null,
                "tx_i": 0,
                "tx_s": 0,
                "tx_c": 0,
                "tx_cs": 0,
                "tc_i": 0,
                "tc_s": 0,
                "tc_cs": 0,
                "tc_c": 0

            }

            //check if GSTR info available
            if (!shareData.dashBoardDt) {
                $scope.page("/gstr1/dashboard");
            } else {
                $scope.dashBoardDt = shareData.dashBoardDt;
            }


            //check if invoice info available
            if (shareData.impgaInv) {
                $scope.ImpgaList = shareData.impgInv;
            } else {
                $scope.page("/gstr1/summary");
            }
            $scope.isNewRec = shareData.isNewRec;
        }

        function formateImpgaNodePayload(iData) {
            delete iData.sp_typ;
            return iData;
        }

        $scope.isIntraState = function () {
            if ($scope.ImpgaList) {
                return ($scope.ImpgaList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        $scope.addItem = function () {
            if ($scope.newItmFrm.$valid) {
                var itmLs = $scope.ImpgaList.itms,
                    itmLn = itmLs.length,
                    newItem = angular.copy($scope.nwItm);
                newItem.num = itmLn + 1;

                $scope.ImpgaList.itms.push(newItem);
                $scope.newItmValidtr = false;
                initItm();
            } else {
                $scope.newItmValidtr = true;
            }
        }

        //To add new invoice 
        $scope.saveImpgaPayload = function () {
            var stdata = angular.copy($scope.ImpgaList);
            R1InvHandler.add($scope, stdata, formateImpgaNodePayload);
        }




        //To Update Invoice
        $scope.updateImpgaPayload = function () {
            var stdata = angular.copy($scope.ImpgaList);

            var updatedNodeDetails = {
                boe_num: stdata.boe_num
            };

            R1InvHandler.update($scope, stdata, updatedNodeDetails, formateImpgaNodePayload);
        }

        $scope.deleteSelectedItms = function () {
            var rtArry = [];
            angular.forEach($scope.ImpgaList.itms, function (itm) {
                if (itm.select !== 'Y') {
                    rtArry.push(itm);
                }
            });
            $scope.ImpgaList.itms = angular.copy(rtArry);
            $log.debug("impgaitmctrl -> deleteSelectedItems :: ", $scope.ImpgaList);
            $scope.selectAll = 'N';
        }
    }
]);
