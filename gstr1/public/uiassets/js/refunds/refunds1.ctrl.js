"use strict";
myApp.controller("refundsctrl", ['$scope', '$rootScope', 'shareData', 'RefundsStructure', 'rfdFileHandler', '$log', function($scope, $rootScope, shareData, RefundsStructure, rfdFileHandler, $log) {

    var tableCode = null,
        formName = null,
        dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

    $scope.RefundsList = [];
    shareData.isNewRec = true;
    $scope.newInvValidtr = false;
    $scope.newInvRw = null;
    $scope.monthList = null;
    $scope.totalAvailable = 0;
    $scope.minYearsAllowed = "4";

    if (!shareData.refunddashBoardDt) {
        $scope.page("/refunds/dashboard");
        return false;
    } else {
        tableCode = $scope.statementListSelected['cd'];
        shareData.refunddashBoardDt.tbl_cd = tableCode;
        $scope.refunddashBoardDt = shareData.refunddashBoardDt;
        formName = $scope.refunddashBoardDt.form;
        $scope.monthList = shareData.curFyMonths; //In B2CSA we need FY month list

        initNewInvRow();
        initSumryList();
    }

    //To display empty row in Lastpage only in case of pagination
    $rootScope.isLastPage = function(currentPage, pageSize) {
        var isLast = false,
            total = Math.ceil(($scope.totalAvailable / pageSize));
        if (total == currentPage) {
            isLast = true;
        }
        // if no records, we are always on last page.
        if ($scope.totalAvailable == 0)
            return true;
        return isLast;
    }

    //To init new invoice row
    function initNewInvRow() {
        $scope.newInvRw = RefundsStructure.getNewInv(tableCode, formName);
    }

    var getInvKey = RefundsStructure.getInvKey(tableCode, formName);

    //To get list 
    function initSumryList() {
        jQuery('.table-responsive').css('opacity', 0.5);
        if (!shareData.pageNum) shareData.pageNum = 1;
        rfdFileHandler.getRfdContentForPaged($scope.refunddashBoardDt, tableCode, shareData.pageNum, $scope.refunddashBoardDt.form, shareData, shareData.filter_val, $scope.sortBy, $scope.sortReverse).then(function(response) {
            jQuery('.table-responsive').css('opacity', 1);

            // $log.debug("refundsctrl -> initSumryList success:: ", response);
            if (response) {
                $scope.RefundsList = response.rows;
                $scope.totalAvailable = response.count;
                if (!$scope.first_init) {
                    $scope.sortReverse = !$scope.sortReverse;
                    $scope.sort(getInvKey);
                    $scope.first_init = true;
                }
            }

        }, function(response) {
            jQuery('.table-responsive').css('opacity', 1);
            $log.debug("refundsctrl -> initSumryList fail:: ", response);
        });
    }

    $scope.initSumryList = initSumryList;

    //date validation		
    $scope.dateLimit = function(isNew, invdt, frm) {
        var frmName = (isNew) ? $scope.newInvFrm : frm;
        var dtflag = true;
        if (invdt !== undefined && invdt !== null && invdt !== "") {
            if (moment(invdt, dateFormat).isValid()) {
                if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                    dtflag = false;
                    if (isNew) {
                        $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                    }

                } else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                }

            } else {
                dtflag = false;
                if (isNew)
                    $scope.invdtmsg = "Date does not exists in the calendar";
                // return true;
            }
        } else {
            dtflag = true;
        }

        frmName.idt.$setValidity('idt', dtflag);

    };

    $scope.maxmDate = "";
    //To disable Future Dates
    $scope.datefunc = function() {
        var rtDt = null,
            today = moment().format(dateFormat),
            temp = "01" + shareData.refunddashBoardDt.fp.slice(0, 2) + shareData.refunddashBoardDt.fp.slice(2),
            lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
            lastDate1 = lastDate.format(dateFormat);
        if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
            rtDt = today;
        } else {
            rtDt = lastDate1;
        }
        $scope.maxmDate = rtDt;
        return rtDt;
    };

    $scope.min_dt = "";
    $scope.minDate = function() {
        var firstMonth = $scope.monthList[0],
            temp1 = "01" + shareData.refunddashBoardDt.fp.slice(0, 2) + shareData.refunddashBoardDt.fp.slice(2),
            temp2 = "01072017",
            firstDate = moment(temp2, dateFormat),
            firstDate1 = firstDate.format(dateFormat),
            lastDate = moment(temp1, dateFormat),
            lastDate1 = lastDate.format(dateFormat);
        var diff = lastDate.diff(firstDate, 'months');
        if (diff <= 18) {
            $scope.min_dt = firstDate1;
        } else {
            $scope.min_dt = moment(temp1, "DD/MM/YYYY").add(1, 'days').subtract(18, 'months').format("DD/MM/YYYY");
        }
        //temp = "01" + shareData.refunddashBoardDt.fp.slice(0, 2) + shareData.refunddashBoardDt.fp.slice(2)

        return $scope.min_dt;

    };

    $scope.dateVal = $scope.minDate();

    //Navigate to Items Page 
    $scope.gotoAddItems = function(iInv) {
        if (iInv == 'add') {
            if ($scope.newInvFrm.$valid) {
                var newInvoice = angular.copy($scope.newInvRw);
                newInvoice = RefundsStructure.validateAndRemoveNullValueKey(newInvoice);
                shareData.isNewRec = true;
                newInvoice.val = Number(newInvoice.val);
                if (newInvoice.sbnum != undefined) {
                    newInvoice.sbnum = Number(newInvoice.sbnum);
                }
                $scope.RefundsList.push(newInvoice);
                var fdata = { "inv": $scope.RefundsList };

                var reqParam = shareData.refunddashBoardDt;
                reqParam.tbl_data = [fdata];
                $scope.newInvValidtr = false;

                rfdFileHandler.saveRfdPayload(reqParam)
                    .then(function(response) {
                        $log.debug("rfdFileHandler -> add new refund invoice succ :: ", response);
                        if (Array.isArray(response) && response.length) {
                            $scope.createAlert("Error", "Duplicate Invoice!");
                        } else {
                            $scope.createAlert("Success", response);
                        }
                        initNewInvRow();
                        $scope.page("/refunds/summary");
                    }, function(error) {
                        $log.debug("rfdFileHandler -> add new refund invoice fail :: ", error);
                        $scope.createAlert("Error", "Invoice Failed");
                    });
            } else {
                $scope.newInvValidtr = true;
            }
        }
    }

    //duplicate invoice check
    $scope.isExistingInv = function(isNew, iNum, frm) {
        var isExistInv = false,
            frmName = (isNew) ? $scope.newInvFrm : frm;
        angular.forEach($scope.RefundsList, function(inv, i) {
            if ((inv.onum && inv.onum == iNum) || (inv.inum && inv.inum == iNum) || (inv.doc_num && inv.doc_num == iNum) || (inv.odoc_num && inv.odoc_num == iNum)) {
                isExistInv = true;
            }
        });
        // return (isExistInv) ? true : false;
        frmName.inum.$setValidity('inum', !isExistInv);
    };

    $scope.onInvTypeChange = function(iInv) {
        if (iInv.type == 'G' || iInv.type == 'S') {
            iInv.sbnum = null;
            iInv.sbdt = null;
            iInv.sbpcode = null;
            iInv.egmref = null;
            iInv.egmrefdt = null;
            iInv.brcfircnum = null;
            iInv.brcfircdt = null;
        }
    };

    //sorting functionality
    $scope.sortReverse = false;
    $scope.sort = function(sortKey) {
        $scope.sortBy = sortKey;
        $scope.sortReverse = !$scope.sortReverse;
        initSumryList();
    }

    //To update Invoices at level1
    $scope.updateInvoice = function(iInv) {
        iInv = RefundsStructure.removeSelectKey(iInv);
        iInv.val = Number(iInv.val);
        if (iInv.sbnum != undefined) {
            iInv.sbnum = Number(iInv.sbnum);
        }
        var fdata = { "inv": iInv };

        var reqParam = shareData.refunddashBoardDt;
        reqParam.tbl_data = [fdata];

        var iUpdateDetails = RefundsStructure.getUpdatedRfdNodeDetails(formName, iInv, shareData.gstinNum);
        reqParam.invdltArray = [iUpdateDetails];

        rfdFileHandler.updateRfdPayload(reqParam)
            .then(function(response) {
                $log.debug("rfdFileHandler -> update succ :: ", response);
                // timeout(function () {
                //     R1Util.setSuplyTyp($scope.suplyList, iInv);
                // }, 0)
                $scope.createAlert("Success", response);
                $scope.page("/refunds/summary");
            }, function(error) {
                $log.debug("rfdFileHandler -> update fail :: ", error);
                $scope.createAlert("Error", "Invoice Updation Failed");
            });
    };

    //Check all implementation
    $scope.checkAll = function(iLs, iFg) {
        angular.forEach(iLs, function(inv) {
            inv.select = iFg;
        });
    };

    //This method will delete multiple inv
    $scope.deleteSelectedRows = function() {
        var rtArry = [],
            invdltArray = [];

        angular.forEach($scope.RefundsList, function(inv) {
            if (inv.select !== 'Y') {
                rtArry.push(inv);
            } else {
                invdltArray.push(RefundsStructure.getUpdatedRfdNodeDetails(formName, inv, shareData.gstinNum));
            }
        });
        if (invdltArray.length > 0) {
            var reqParam = shareData.refunddashBoardDt;
            reqParam.invdltArray = invdltArray;
            rfdFileHandler.deleteRfdInvoices(reqParam)
                .then(function(response) {
                    $log.debug("rfdFileHandler -> deleteRfdInvoices succ :: ", response);
                    $scope.createAlert("Success", response);

                    $scope.RefundsList = angular.copy(rtArry);
                    $scope.selectAll = 'N';
                    $scope.page("/refunds/summary");
                }, function(error) {
                    $log.debug("rfdFileHandler -> deleteRfdInvoices fail :: ", error);
                    $scope.createAlert("Error", "Invoice Deletion Failed");
                });
        } else {
            $scope.createAlert("WarningOk", "Please Select Atleast one item", function() {});
        }
    }

    $scope.pageChangeHandler = function(newPage) {
        shareData.pageNum = newPage;
        initSumryList();
    };

    $scope.$on('rfdFilterValChanged', function(e) {
        shareData.pageNum = 1;
        initSumryList();
    });

}]);