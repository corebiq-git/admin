myApp.controller("refundsdashboardcrtl", ['$scope', '$log', 'shareData', 'rfdFileHandler',
    function($scope, $log, shareData, rfdFileHandler) {
        $scope.StmtForms = null;
        $scope.StmtRsnList = null;
        shareData.curFyMonths = null;
        $scope.dropdown = null;
        $scope.prevRtUpStatus = 'N';
        shareData.stLsSetIdx = 0; //Statement List Set Index
        if (shareData.gstinNum && shareData.isfromhome == "N") {
            $scope.gstinNum = shareData.gstinNum;
        } else {
            $scope.gstinNum = null;
        }

        $scope.validGstin = false;
        $scope.onGstinChange = function() {
            $scope.validGstin = $scope.validations.gstin($scope.gstinNum);
        }

        initDashboard();

        function initDashboard() {
            $scope.initRfdInfo(null, null, null, null);

            //Get Dropdown list
            rfdFileHandler.getDropdown().then(function(response) {
                $log.debug("refunddashboardcrtl -> getDropdown success:: ", response);

                $scope.dropdown = response;
                if (shareData.refunddashBoardDt && shareData.isfromhome == "N") {
                    angular.forEach($scope.dropdown, function(obj, i) {
                        if (obj.year === shareData.refunddashBoardDt.fy) {
                            $scope.yearSelected = obj;
                            angular.forEach(obj.months, function(mon, i) {
                                if (mon.month === shareData.refunddashBoardDt.month) {
                                    $scope.monthSelected = mon;
                                }
                            });
                        }
                    });
                } else {
                    $scope.yearSelected = $scope.dropdown[0];
                    var monthLen = $scope.yearSelected.months.length;
                    $scope.monthSelected = $scope.yearSelected.months[monthLen - 1];
                }

            }, function(response) {
                $log.debug("refunddashboardcrtl -> getDropdown fail:: ", response);
            });

            //get Statement Forms
            rfdFileHandler.getStmtForms().then(function(response) {
                $log.debug("refunddashboardcrtl -> getStmtForms success:: ", response);

                $scope.StmtForms = response;
                $scope.formNum = $scope.StmtForms[1].cd;

                if (shareData.refunddashBoardDt && shareData.isfromhome == "N") {
                    $scope.formNum = shareData.refunddashBoardDt.form
                } else {
                    $scope.formNum = response[1].cd;
                }

            }, function(response) {
                $log.debug("refunddashboardcrtl -> getStmtForms fail:: ", response);
            });

            //get Statement Reason List
            rfdFileHandler.getStmtRsnList().then(function(response) {
                $log.debug("refunddashboardcrtl -> getStmtRsnList success:: ", response);

                $scope.StmtRsnList = response;
                $scope.rfdRsn = $scope.StmtRsnList[1].id;

            }, function(response) {
                $log.debug("refunddashboardcrtl -> getStmtRsnList fail:: ", response);
            });
        }

        $scope.refundsStatement = function() {
            if ($scope.validations.gstin($scope.gstinNum) && $scope.dashboard.$valid) {
                var reqParam = {
                    form: $scope.formNum,
                    gstin: $scope.gstinNum,
                    refundRsn: $scope.rfdRsn,
                    fy: $scope.yearSelected.year,
                    month: $scope.monthSelected.month,
                    fp: $scope.monthSelected.value,
                    status: $scope.prevRtUpStatus,
                    appendParameter: "N"
                };
                $log.debug("refunddashboardcrtl -> reqParam ", reqParam);
                //15CQHPK8080M5Z1
                shareData.refunddashBoardDt = reqParam;
                shareData.curFyMonths = $scope.yearSelected.months;
                shareData.gstinNum = $scope.gstinNum;
                shareData.isfromhome = "N";
                $scope.initRfdInfo($scope.formNum, $scope.gstinNum, $scope.yearSelected.year, $scope.monthSelected.month, "N");
                $scope.page("/refunds/summary");
            }
        }

        $scope.forlabel = function(formNum) {
            if (formNum == "statement1") {
                $scope.nameAsPerFormSelected = "GSTIN of Supplier";
            } else if (formNum == "statement2") {
                $scope.nameAsPerFormSelected = "GSTIN of Receiver";
            } else if (formNum == "statement3") {
                $scope.nameAsPerFormSelected = "GSTIN of Receiver";
            } else {
                $scope.nameAsPerFormSelected = "GSTIN of Supplier";
            }
        };

        $scope.changeReasonByStmt = function(formNum) {
            angular.forEach($scope.StmtForms, function(value, key) {
                if (value.cd == formNum) {
                    $scope.rfdRsn = value.reasonId;
                }
            });
        };
    }
]);

myApp.controller("refundssummarycrtl", ['$scope', '$rootScope', 'shareData', 'rfdFileHandler', '$log', function($scope, $rootScope, shareData, rfdFileHandler, $log) {
    $scope.statementListSelected = {};
    $scope.templateLoaded = false;
    $scope.InvTypeList = null;

    //Pagination related controls
    $scope.currentPage = (shareData.pageNum) ? shareData.pageNum : 1;
    $scope.pageSize = 25;
    shareData.filter_val = '';
    $scope.search_filter_value = { val: '' }; // use object for pass by ref and avoid cloning

    $scope.rfdFilterValChanged = function() {
        shareData.filter_val = $scope.search_filter_value.val;
        $scope.$broadcast('rfdFilterValChanged');
    };

    if (shareData.refunddashBoardDt) {
        $scope.refunddashBoardDt = shareData.refunddashBoardDt;
        getStatementList();
        getRfdInvTypes();
    } else {
        $scope.page("/refunds/dashboard");
    }

    function getStatementList() {
        rfdFileHandler.getStatementList(shareData.refunddashBoardDt.form).then(function(response) {
            $log.debug("refundssummarycrtl -> getStatementList success:: ", response);
            if (response) {
                $scope.statementList = response;
                $scope.statementListSelected = $scope.statementList[shareData.stLsSetIdx];
            }
        }, function(response) {
            $log.debug("refundssummarycrtl -> getStatementList fail:: ", response);
        });
    }

    function getRfdInvTypes() {
        rfdFileHandler.getRfdInvTypes(shareData.refunddashBoardDt.form).then(function(response) {
            $log.debug("refundssummarycrtl -> getRfdInvTypes success:: ", response);
            if (response) {
                $scope.InvTypeList = response;
            }
        }, function(response) {
            $log.debug("refundssummarycrtl -> getRfdInvTypes fail:: ", response);
        });
    }

    $scope.deleteRefund = function() {
        var param = {
                gstin: shareData.refunddashBoardDt.gstin,
                form: shareData.refunddashBoardDt.form,
                year: shareData.refunddashBoardDt.fy,
                month: shareData.refunddashBoardDt.month
            },
            formName = param.form.toLowerCase();
        rfdFileHandler.deleteRefund(param).then(function(response) {
            $log.debug("rfdFileHandler -> deleteRefund succ :: ", response);
            $scope.createAlert("Success", "Refund File Deleted");
            $scope.statementListSelected.url = "pages/refunds/statements/" + $scope.statementListSelected.cd + ".summary.html";

        }, function(error) {
            $log.debug("rfdFileHandler -> deleteRefund fail :: ", error);
            $scope.createAlert("Error", "Refund File Deletion Failed");
        });
    }

    $scope.finishLoading = function() {
        $scope.templateLoaded = true;
    };
}]);

myApp.controller("refundsprvctrl", ['$scope', '$log', 'shareData', 'rfdFileHandler', function($scope, $log, shareData, rfdFileHandler) {
    $scope.previewModel = [];
    if (!shareData.refunddashBoardDt) {
        $scope.page("/refunds/summary");
    } else {
        $scope.refunddashBoardDt = shareData.refunddashBoardDt;
        initPreview();
    }

    var statemaneLs = null;

    function initPreview() {
        var reqParam = shareData.refunddashBoardDt;
        reqParam.type = "N";

        rfdFileHandler.getStatementList(shareData.refunddashBoardDt.form)
            .then(function(response) {
                statemaneLs = response;
                reformSummary(response, function(iData) {
                    $scope.previewModel = iData;
                });
            }, function(response) {
                $log.debug("refundsprvctrl -> getStatementList fail:: ", response);
            });

    }

    function reformSummary(iResp, callback) {
        rfdFileHandler.getRfdContentsForMeta(shareData.refunddashBoardDt).then(function(prevContent) {

            // CODE SHIFTED TO BACKEND SIDE, offline.js ( 10/07/2017 )

            var retArry = prevContent.counts;
            callback(retArry);

        }, function(response) {
            // $log.debug("refundsprvctrl -> reformSummary fail:: ", response);
        });
    }
    // CHANGES BY V END

    //To generate File to upload gst portal
    $scope.generateRefund = function() {

        var reqParam = shareData.refunddashBoardDt;
        rfdFileHandler.createRfdFile(reqParam)
            .then(function(response) {
                $log.debug("refundsprvctrl -> file generated :: ", response);
                saveAs(new Blob([response], {
                    type: "application/json"
                }), shareData.refunddashBoardDt.month + "_" + shareData.refunddashBoardDt.fy + "_" + shareData.refunddashBoardDt.form + "_" + shareData.refunddashBoardDt.gstin + '.json');
            }, function(error) {
                $log.debug("refundsprvctrl -> file generation  failed :: response");

            })

    }

    //Navigation to respective section summary
    $scope.openSection = function(sectionCode) {
        angular.forEach(sectionLs, function(section, i) {
            if (section.cd === sectionCode) {
                shareData.scLsSetIdx = i;
            }
        });
        $scope.page("/gstr/summary");
    }
}]);