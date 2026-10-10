/*
author @ Prakash Balasubramanian
developed by GSTN
*/

/**
 *  @author:   Prakash Balasubramanian
 *  @created:   August 2017
 *  @description: Offline utility some common function
 *  @copyright: (c) Copyright by Infosys technologies
 **/
'use strict';
var log = require('../utility/logger');
var logger = log.logger;

//this method find the particular object and replace the content of that object.
exports.findAndReplace = function(object, value, replacevalue, tblcd) {
    switch (tblcd) {
        case "statement3":
            for (var x in object) {
                if (typeof object[x] == typeof {}) {
                    exports.findAndReplace(object[x], value, replacevalue);
                }
            }
            break;

    }
}

exports.formDataFormat = function(req, callback) {
    logger.log("info", "entered to formDataFormat")
    var gstin = req.body.gstin;
    var form = req.body.form;
    var fp = req.body.fp;
    var fy = req.body.fy;
    var month = req.body.month;
    var formDataFormat;
    var refundRsn = req.body.refundRsn;
    if (form == "statement3") {
        formDataFormat = "{ " + '"gstin":"' + gstin + '",' + '"refundRsn":"' + refundRsn + '",' + '"fromRetPrd":"' + fp + '",' + '"inv" :[' + " " + "]}"
    } else {
        logger.log("error", "Wrong form no. sent")
    }
    return callback(formDataFormat);
}