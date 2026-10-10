/*
author @ Shiwali Srivastava
developed by GSTN
*/

/**
 *  @author:   Shiwali Srivastava
 *  @created:   Sep 2016
 *  @description: Offline utility
 *  @copyright: (c) Copyright by Infosys technologies
 *  version GST1.00
 *  Last Updated:  Shiwali Srivastava, April 28 2017
 **/


'use strict';
var express = require("express");
var offline = require("../service/offline");
var offline2 = require("../service/offline2"); //ADDITION BY V START-END 
var offlineRefund = require("../service/offline.refunds");
var app = express();
var router = express.Router();
var log = require('../utility/logger');
var constants = require('../utility/constants');
var errorConstant = require('../utility/errorconstants');
var logger = log.logger;
var firebaseAuth = require('../utility/firebaseAuth');

router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'COREBIQ GSTR1 TOOL',
		requireAuth: firebaseAuth.required
	});
});

router.use(firebaseAuth.middleware);
router.use(function (req, res, next) {
	if (/^\/(?:userData|upload|download|error|generatedFile|uploadXML)(?:\/|$)/.test(req.path)) {
		return res.status(404).end();
	}
	next();
});

/**LOGGER CONFIGURATION URL**/
router.get('/log/debug', function (req, res) {
	logger.level = constants.LOG_LEVEL;
	res.status(errorConstant.STATUS_200).send("Log Level set to DEBUG");
	res.end();
});

router.get('/log/error', function (req, res) {
	logger.level = constants.LOG_LVL_ERROR;
	res.status(errorConstant.STATUS_200).send("Log Level set to ERROR");
	res.end();
});

router.get('/log/info', function (req, res) {
	logger.level = constants.LOG_LVL_INFO;
	res.status(errorConstant.STATUS_200).send("Log Level set to INFO");
	res.end();
});
/**logger configuration ends here**/

router.get('/health', function (req, res) {
	res.status(errorConstant.STATUS_200).send("OK");
	res.end();
});




router.post('/fetchMeta', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /fetchMeta");
	offline.fetchMeta(req, res, err);
});


router.get('/versionCheck', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /versionCheck");
	offline2.versionCheck(req, res, err);
});

router.post('/fetchJsonFile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /fetchJsonFile");
	offline2.fetchJsonFile(req, res, err);
});

router.post('/addtbldata', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /addtbldata");
	offline.addtbldata(req, res, err);
});

router.post('/listJsonData', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /listJsonData");
	offline.listJsonData(req, res, err);
});
router.post('/addSupNmToJson', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /addSupNmToJson");
	offline2.addSupNmToJson(req, res, err);
});

router.get('/listHSNData/:searchText', function(req, res, err){
	logger.log("info", "Entering routes:: user.js :: /listHSNData");
	offline.loadHSNData(req, res, err);
});

router.get('/hsnDescForOfflineTool/:searchText', function(req, res, err){
	logger.log("info", "Entering routes:: user.js :: /hsnDescForOfflineTool");
	offline.hsnDescForOfflineTool(req, res, err);
});

router.get('/validateHsnAPI', function(req, res, err){
	logger.log("info", "Entering routes:: user.js :: /validateHsnAPI");
	offline.hsnDescForOfflineTool(req, res, err);
});

router.post('/itemExists', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /listJsonData");
	offline.itemExists(req, res, err);
});



/* ADDITION BY V START */
router.post('/addtblfile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /addtblfile");
	offline2.addtblfile(req, res, err);
});
/* ADDITION BY V END */

router.post('/generateFile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /generateFile");
	req.setTimeout(0);
	offline.generateFile(req, res, err);
});

router.post('/deleteallinvoices', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /deleteallinvoices");
	offline.deleteallinvoices(req, res, err);
});

router.post('/deleteMltplInv', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /generateFile");
	offline.deleteMltplInv(req, res, err);
});

router.post('/upload', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /upload");
	offline.upload(req, res, err);
});

router.get('/unzip', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /unzip");
	offline.unzip(req, res, err);
});
router.get('/unzipError', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /unzipError");
	offline.unzipError(req, res, err);
});
router.post('/unzipFile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /unzipFile");
	offline.unzipFile(req, res, err);
});

router.post('/importFile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /importFile");
	offline.importFile(req, res, err);
});

router.post('/generateJson', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /generateJson");
	offline.generateJson(req, res, err);
});


router.post('/updatetbldata', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /updatetbldata");
	offline.updatetbldata(req, res, err);
});
router.post('/updateaccepteddata', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /updateaccepteddata");
	offline.updateaccepteddata(req, res, err);
});

router.post('/updateerrdata', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /updateerrdata");
	offline.updateerrdata(req, res, err);
});
router.post('/updateImport', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /updateImport");
	offline.updateImport(req, res, err);
});
router.post('/deleteErrData', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /deleteErrData");
	offline.deleteErrData(req, res, err);
});
router.post('/setDeleteFlag', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /setDeleteFlag");
	offline.setDeleteFlag(req, res, err);
});
router.post('/setFlagAll', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /setFlagAll");
	offline.setFlagAll(req, res, err);
});

router.post('/addmltpldata', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /addmltpldata");
	offline.addmltpldata(req, res, err);
});

router.post('/addmltplerrdata', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /addmltpldata");
	offline.addmltplerrdata(req, res, err);
});

router.post('/generateZip', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /generateZip");
	offline.generateZip(req, res, err);
});

router.post('/generateErrorFile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /generateErrorFile");
	offline.generateErrorFile(req, res, err);
});

router.post('/clearSectionData', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /clearSectionData");
	offline.clearSectionData(req, res, err);
});
/* ADDITION BY Prakash Balasubramanian START */
router.post('/addTblDataRfd', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /addTblDataRfd");
	offlineRefund.addTblDataRfd(req, res, err);
});

router.post('/updateTblDataRfd', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /updateTblDataRfd");
	offlineRefund.updateTblDataRfd(req, res, err);
});

router.post('/listJsonDataForRfd', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /listJsonDataForRfd");
	offlineRefund.listJsonDataForRfd(req, res, err);
});

router.post('/fetchRfdMeta', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /fetchRfdMeta");
	offlineRefund.fetchRfdMeta(req, res, err);
});
router.post('/exportJsonToExcel', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /exportJsonToExcel");
	offline2.exportJsonToExcel(req, res, err);
});

router.post('/generateRfdFile', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /generateRfdFile");
	offlineRefund.generateRfdFile(req, res, err);
});
//Product master 
router.post('/saveMstrforprod', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /saveMstrforprod");
	offline.saveMstrforprod(req, res, err);
});
//getMasterData
router.post('/getMasterData', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /getMasterData");
	offline.getMasterData(req, res, err);
	
});
//Mark for delete
router.post('/markforDelete', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /markforDelete");
	offline.markforDelete(req, res, err);
	
});

router.post('/deleteAllRfdInvoices', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /deleteAllRfdInvoices");
	offlineRefund.deleteAllRfdInvoices(req, res, err);
});

router.post('/deleteRfdMltplInv', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /deleteRfdMltplInv");
	offlineRefund.deleteRfdMltplInv(req, res, err);
});

/* ADDITION BY Prakash Balasubramanian END */

//Addition by akarsh Starts

router.post('/updateData', function (req, res, err) {
	logger.log("info", "Entering routes:: user.js :: /updateData");
	offline.updateData(req, res, err);
});
//Addition by akarsh ENDS

// Addition by triveni Starts
router.get('/b2clConstants', function (req, res) {
    res.json({
        minVal: constants.B2CL_MIN_VAL,
        minStrPrd: constants.B2CL_MIN_VAL_STR_PRD
    });
});

// Addition by triveni ends

module.exports = router;