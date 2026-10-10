"use strict";
myApp.controller("gstr2asumryctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util', '$rootScope',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util, $rootScope) {

        var tableCode = null,
            form = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.ReturnsList = [];
        $scope.monthList = null;

        $scope.minYearsAllowed = "4";

        if (!$scope.dashBoardDt) {
            $scope.page("/gstr/upload/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            form = shareData.dashBoardDt.form;
            $scope.dashBoardDt = shareData.dashBoardDt;
            $scope.monthList = shareData.curFyMonths;
            initSumryList();
        }
        $scope.sections = ["Invoice No.", "Invoice Date"];



        //Formaters
        var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, form);
        // formateNodePayload = ReturnStructure.formateNodePayload(tableCode, form);

        var formName = $scope.dashBoardDt.form,
            getInv = ReturnStructure.getInv(tableCode, formName),
            getItm = ReturnStructure.getItm(tableCode, formName),
            getInvKey = ReturnStructure.getInvKey(tableCode, formName);

        var iffStrtprd=202101;
        var rtnprd= parseInt($scope.dashBoardDt.fp.slice(2)+$scope.dashBoardDt.fp.slice(0,2));
        $scope.iffprd= (rtnprd>=iffStrtprd) ? true: false;

        // Dropdown Method for Delinking credit/Debit Notes
        $scope.multiSelectEvents = {
            onSelectAll: function () {
                $scope.trdcol = true;
                $scope.valcol = true;
            },
            onDeselectAll: function () {
                $scope.trdcol = false;
                $scope.valcol = false;
            },
            onItemSelect: function (item) {
                switch (item.id) {
                    case 1: $scope.trdcol = true;
                        break;
                    case 2: $scope.valcol = true;
                        break;
                }
            },
            onItemDeselect: function (item) {
                switch (item.id) {
                    case 1: $scope.trdcol = false;
                        break;
                    case 2: $scope.valcol = false;
                        break;
                }
            }
        } 
        //To clear the invoice num and invoice date on edit of imported old transitional data post delinking
        $scope.clearOldInv = function (inv,sectionName) {
            if(inv){
                inv.inum = '';
                inv.idt = '';
                if(!inv.rchrg && (sectionName=='cdnr' || sectionName=='cdnra'))
                inv.rchrg='N';
                
                return inv 
            } 
        }
        // Dropdown Method for Delinking credit/Debit Notes
        $scope.myDropdownModelsettings = {
            scrollable: true,
            checkBoxes: true,
            scrollableHeight: '200px',
            styleActive: true,
            buttonClasses: "btn , btn-default",
            buttonDefaultText: 'hide/unhide column',
            selectedToTop: true
        }
        $scope.loadCol = function () {
            let disableTbCd = shareData.dashBoardDt.tbl_cd;
            if (disableTbCd == "cdnura" || disableTbCd == "cdnra") {
                $scope.dropdownList = [
                    { id: 1, label: 'Original Invoice No.' },
                    { id: 2, label: 'Original Invoice Date' },
                ];
            }
            else {
                $scope.dropdownList = [
                    { id: 1, label: 'Invoice No.' },
                    { id: 2, label: 'Invoice Date' },
                ];
            }

            $scope.selectedItems = [];
            $scope.trdcol = false;
            $scope.valcol = false;
        }

        $scope.loadCol();
        //To get list
        function initSumryList() {
            jQuery('.table-responsive').css('opacity', 0.5);
            if (!shareData.pageNum) shareData.pageNum = 1;
            g1FileHandler.getContentsForPaged(
                $scope.dashBoardDt,
                tableCode,
                shareData.pageNum,
                $scope.dashBoardDt.form,
                shareData,
                shareData.filter_val,
                $scope.sortBy,
                $scope.sortReverse,
                'FL3', // to identify second flow, 
                true //  file name will be provided, DO NOT RE_CREATE
            ).then(function (response) {


                jQuery('.table-responsive').css('opacity', 1);
                //                $scope.ReturnsList = reformateInv(response);

                if (response) {

                    $scope.ReturnsList = response.rows;
                    $scope.totalAvailable = response.count;
                    //$scope.loadCol();
                    if (!$scope.first_init) {
                        $scope.sortReverse = !$scope.sortReverse;
                        $scope.sort(getInvKey);
                        $scope.first_init = true;
                    }

                }


            }, function (response) {
                jQuery('.table-responsive').css('opacity', 1);
                //                $scope.createAlert("WarningOk", response, function () { });
                $log.debug("initSumryList -> initSumryList fail:: ", response);
                //                $scope.page("/gstr/upload/dashboard");
            });
        }
        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryList();
        });

        // CHANGES BY V START
        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;
            initSumryList();
        };
        $scope.sortReverse = false;
        $scope.sort = function (sortKey) {
            $scope.sortBy = sortKey;
            $scope.sortReverse = !$scope.sortReverse;
            initSumryList();
        }
        //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoice(iList, oldInv, modifiedInv, isIntraStateFn) {
            var returnValue = null,
                iIndex = null;
            if (oldInv) {
                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, form),
                    keys = Object.keys(updatedNodeDetails),
                    oData = angular.copy(iList);

                var idx = keys.indexOf('old_inum');
                if (idx > -1) { keys.splice(idx, 1); }
                var idn = keys.indexOf('old_ntnum');
                if (idn > -1) { keys.splice(idn, 1); }

                if (oData)
                    oData.filter(function (inv, index) {
                        var count = 0;
                        keys.filter(function (key) {
                            if (inv[key] != null && inv[key] != undefined && inv[key] == oldInv[key])
                                count++;
                        });
                        if (count == keys.length) {
                            iIndex = index;
                            oData[index] = modifiedInv || oldInv;
                            returnValue = modifiedInv || oldInv;
                        }
                    });
            }
            return returnValue;
        }
        //added for POS - 96
        if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr" || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR2A"){
			$scope.StateList = $.grep($scope.StateList, function(element, index){return element.cd == "96"}, true);
            		     var obj = {};
						 obj["cd"] = "96";
                         obj["nm"] = "Foreign Country";                       
                         $scope.StateList.push(obj);
                         $scope.StateList.sort(function(a,b) {
                        	    return a.cd - b.cd;
                        	});
			}else{
				$scope.StateList = $.grep($scope.StateList, function(element, index){return element.cd == "96"}, true);
			}
        //Navigate to Items Page 
        $scope.gotoAddItems = function (iInv) {
            if (iInv) {
                shareData.itmInv = getUniqueInvoice($scope.ReturnsList, iInv);
                //  shareData.itmInv=iInv;
                $scope.page("/upload/gstr2a/items");
            }


        }

    }
]);

myApp.controller("gstr2aitmctrl", ['$scope', 'shareData', 'R1InvHandler', 'ReturnStructure', function ($scope, shareData, R1InvHandler, ReturnStructure) {
    $scope.newItmValidtr = false;
    $scope.selectAll = null;

    var tblcd = null,
        formName = null;

    $scope.isIntraState = function () {
        if ($scope.itmList && $scope.itmList.sp_typ) {
            return ($scope.itmList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
        }
    };
    $scope.rateWiseData = [];

    function initializeData(iTblCode) {
        switch (iTblCode) {
            case 'b2b':
            case 'cdnr':
            case 'b2ba':
            case 'cdnra':
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                    if (!$scope.rateWiseData[val.value]) {
                        if ($scope.intraState) {
                            if (formName == "GSTR2") {
                                $scope.rateWiseData[val.value] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_c": 0,
                                        "tx_s": 0,
                                        "tx_cs": 0
                                    }
                                };
                            }
                            else {
                                $scope.rateWiseData[val.value] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        } else {
                            if (formName == "GSTR2") {
                                $scope.rateWiseData[val.value] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_i": 0,
                                        "tx_cs": 0
                                    }
                                };
                            }
                            else {
                                $scope.rateWiseData[val.value] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        }
                    }
                });
                break;
        }
    }

    function getAlreadyExistingData(iTblCode) {
        switch (iTblCode) {
            case 'b2b':
            case 'cdnr':
            case 'b2ba':
            case 'cdnra':
                if (formName == 'GSTR2') {
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        $scope.rateWiseData[val.itm_det.rt] = val.itm_det;
                        $scope.rateWiseData[val.itm_det.rt].itc = val.itc;
                        if (!val.num) {
                            $scope.rateWiseData[val.itm_det.rt].num = key + 1;
                        }
                        else {
                            $scope.rateWiseData[val.itm_det.rt].num = val.num;
                        }
                    });
                } else {
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        $scope.rateWiseData[val.itm_det.rt] = val.itm_det;
                        if (!val.num) {
                            $scope.rateWiseData[val.itm_det.rt].num = key + 1;
                        }
                        else {
                            $scope.rateWiseData[val.itm_det.rt].num = val.num;
                        }
                    });
                }
                break;
        }

    }

    if (!shareData.dashBoardDt && !shareData.itmInv) {

        $scope.page("/gstr/upload/summary");
        return false;
    } else {

        $scope.dashBoardDt = shareData.dashBoardDt;
        formName = shareData.dashBoardDt.form;
        tblcd = $scope.dashBoardDt.tbl_cd;
        $scope.itmList = shareData.itmInv;
        $scope.intraState = $scope.isIntraState();
        $scope.itemsLength = $scope.itmList.itms.length;

        if ($scope.itemsLength > 0) {
            getAlreadyExistingData(tblcd);
            initializeData(tblcd);
        } else {
            initializeData(tblcd);
        }

    }

}]);

