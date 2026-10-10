/**
 *  @author:   Prakash Balasubramanian
 *  @created:   Aug 2017
 *  @description: Offline Tool
 *  @copyright: (c) Copyright by Infosys technologies
 *  version GST1.00
 **/

'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var mkdirp = require('mkdirp');
var del = require('delete');
var AdmZip = require('adm-zip');
var filepath = "No File Found";
var omitEmpty = require('omit-empty');
var errorConstant = require('../utility/errorconstants');
var common = require('../utility/common.refunds');
var angular = require('../utility/angularHelper');
var RefundStructure = require('../utility/refundStructure');
var controlFiledir = './public/userData/';
var uploadedFiledir = './public/upload/';
var uploadedErrdir = './public/error/';
var log = require('../utility/logger');
var response = require('../utility/response');
var logger = log.logger;
var async = require('async');
//var zip = require("node-native-zip");
var _ = require('underscore');
const NodeCache = require("node-cache");
var path = require('path');




// for finding a object in a array .
Array.prototype.myFind = function(obj) {
    return this.filter(function(item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return true;
    });
};

function fixUQC(file_data) {

    if (!file_data || !file_data.hsn || !file_data.hsn.data) {
        return file_data;
    }
    var data_length = file_data.hsn.data.length;
    for (var i = 0; i < data_length; i++) {
        file_data.hsn.data[i].uqc = (typeof file_data.hsn.data[i].uqc == 'string' && file_data.hsn.data[i].uqc != '') ? (((file_data.hsn.data[i].uqc.split('-'))[0]).trim()) : file_data.hsn.data[i].uqc;
    }
    return file_data;
}

function sbnumInt(exports) {


    if (!exports || !exports.length) {
        return exports;
    }
    var tmp_len;
    for (var i = 0; i < exports.length; i++) {
        if (exports[i].inv && exports[i].inv.length) {
            tmp_len = exports[i].inv.length
            for (var j = 0; j < tmp_len; j++) {
                if (exports[i].inv[j].sbnum)
                    exports[i].inv[j].sbnum = parseInt(exports[i].inv[j].sbnum);
            }
        }
    }
    return exports;
}

function generateTotalInvRfd(total, iForm, iResp) {
    switch (iForm) {
        case 'statement3':
            total.iTl += (iResp.val) ? parseFloat(iResp.val) : 0;
    }

    return total;
};

function reformSummary(iResp, prevContent, formName, callback) {
    if (formName == 'statement3') {
        iResp = iResp['statements'];
    }

    //    console.log(iResp);
    var retArry = [];
    for (var a = 0, alen = iResp.length; a < alen; a++) {
        var section = iResp[a],
            count = 0,
            result = {},
            total = null,
            refundRsn, ctinInv;

        switch (section.cd) {
            case "statement3":
                refundRsn = prevContent.refundRsn;
                ctinInv = prevContent.inv,
                    total = {
                        "rsn": "",
                        "iTl": 0
                    };
                break;
        }

        switch (section.cd) {
            case "statement3":
                total.rsn = RefundStructure.getRsnFromTypeForRfd(section.cd, refundRsn);
                angular.forEachCustom(ctinInv, function(inv, i) {
                    count += 1;
                    result = generateTotalInvRfd(total, section.cd, inv);
                });
                break;
        }

        if (count) {
            retArry.push({
                cd: section.cd,
                result: result,
                count: count,
                name: section.nm
            });
        }
    }

    callback(retArry);
}

var update_meta_file = function(filename, json, form, cb) {

    var meta_filename = filename.replace(".json", "_meta.json");
    var config_keys = Object.keys(json);
    var metaJSON = {};
    var formName = form;
    var response = fs.readFileSync(__dirname + '/../public/data/refundtablename.json', "utf8");
    response = JSON.parse(response);

    var metaJSON = {};
    for (var i = 0; i < config_keys.length; i++) {
        if (typeof json[config_keys[i]] != 'object') {
            metaJSON[config_keys[i]] = json[config_keys[i]];
        }
    }
    reformSummary(response, json, formName, function(iData) {
        metaJSON['counts'] = iData;
        if (!cb)
            fs.writeFileSync(meta_filename, JSON.stringify(metaJSON));
        else {
            fs.writeFile(meta_filename, JSON.stringify(metaJSON), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
                cb(err)
            });
        }
    });
}

var addTblDataRfd = function(req, res) {
    var errorObject = null;
    logger.log("info", "Entering Offline js:: addTblDataRfd ");
    try {
        var gstin = req.body.gstin;
        var form = req.body.form;
        var fp = req.body.fp;
        var fy = req.body.fy;
        var month = req.body.month;
        var tblcd = req.body.tbl_cd;
        var tbl_data = req.body.tbl_data;
        var jsonObj = [];
        var type = req.body.type;
        var dir, filename;
        var impfileName = req.body.returnFileName;
        async.waterfall([
            function(callback) {
                logger.log("info", "entered in async.waterfall function 1");
                common.formDataFormat(req, function(formDataFormat) {
                    logger.log("info", "entered in async.waterfall formDataFormat");
                    callback(null, formDataFormat)
                })
            },
            function(formDataFormat, callback) {
                logger.log("info", "entered in async.waterfall function 2");
                if (type == "Import") {
                    dir = uploadedImpFiledir;
                    filename = dir + "/" + impfileName.replace("./download", "");
                } else {
                    dir = controlFiledir + gstin + "/" + form + "/" + fy + "/" + month;
                    filename = dir + "/" + form + '_' + gstin + '_' + fy + '_' + month + '.json';
                }
                if (!fs.existsSync(dir)) {
                    mkdirp(dir, function(err) {
                        logger.log("info", "entered to create the directory")
                        if (err) // if we are facing issue in creating the directory 
                        {
                            logger.log("error", "error while creating the directory :: %s ", err.message);
                            callback(err, null)
                        } else // if we are not facing issue in creating the directory.
                        {
                            fs.writeFile(filename, formDataFormat, function(err) // after creating the directory we are creating file inside that in order to save the table data. 
                                {
                                    logger.log("info", "file created with form data format");
                                    if (err) // if we are facing issue in creating the file
                                    {
                                        logger.log("error", "error while writing into the file :: %s", err.message);
                                        callback(err, null);
                                    } else // file is created 
                                    {
                                        fs.readFile(filename, 'utf8', function(err, data) {
                                            if (err) //if we are unable to read the file
                                            {
                                                logger.log("error", "unable to read the file:: %s", err.message);
                                                callback(err, null);
                                            } else // if we are able to read the file
                                            {
                                                var gstfile = JSON.parse(data);
                                                var tbldata;
                                                var jsonObj = [];
                                                /* push data according to table no.*/
                                                switch (tblcd) {
                                                    case "statement3":
                                                        logger.log("info", "entered in statement3 refunds");
                                                        tbldata = gstfile.inv;

                                                        for (var k = 0; k < tbl_data.length; k++) {
                                                            var arrayFound = tbldata.myFind({
                                                                'gstin': tbl_data[k].gstin
                                                            });
                                                            if (arrayFound.length == 0) {
                                                                logger.log("info", "if part");
                                                                tbldata.push(tbl_data[k].inv[0]);
                                                            } else {
                                                                logger.log("info", "else part");
                                                                var subarray = {};
                                                                subarray = arrayFound[0].inv;
                                                                subarray.push(tbl_data[k].inv[0]);
                                                                common.findAndReplace(tbldata, tbl_data[k].ctin, subarray, tblcd);
                                                            }
                                                        }
                                                        break;
                                                    default:
                                                        logger.log("error", "table_cd not present :: %s", tblcd);
                                                }
                                                // gstfile = omitEmpty(gstfile);
                                                var configJSON = JSON.stringify(gstfile);
                                                fs.writeFileSync(filename, configJSON); //after pushing the data we need to commit this data into the file.  
                                                update_meta_file(filename, gstfile, form);
                                                //res.send();
                                                logger.log("info", "after writing into the file");
                                                callback(null, "Success! Refunds details added.");
                                            }
                                        });
                                    }
                                });
                        }
                    })
                } else {
                    fs.readFile(filename, 'utf8', function(err, data) { // 1. read the file 2.Create file if not exist.  3.Append data if exist
                        if (err) //1. error reading the file 
                        {
                            fs.writeFile(filename, formDataFormat, function(err) //create a file since directory is there .
                                {

                                    if (err) //error in creating a file
                                    {
                                        logger.log("error", "error in creating a file:: %s", err.message);
                                        callback(err, null);
                                    } else //file is created
                                    {
                                        logger.log("info", "file is created");
                                        fs.readFile(filename, 'utf8', function(err, data) { //read the created file and push data into it .
                                            logger.log("info", "read the created file and push data into it");
                                            var gstfile = JSON.parse(data);
                                            var tbldata;
                                            var jsonObj = [];
                                            /* push data according to table no.*/
                                            switch (tblcd) {
                                                case "statement3":
                                                    logger.log("info", "entered in statement3 refunds");
                                                    tbldata = gstfile.inv;

                                                    for (var k = 0; k < tbl_data.length; k++) {
                                                        var arrayFound = tbldata.myFind({
                                                            'gstin': tbl_data[k].gstin
                                                        });
                                                        if (arrayFound.length == 0) {
                                                            logger.log("info", "if part");
                                                            tbldata.push(tbl_data[k].inv[0]);
                                                        } else {
                                                            logger.log("info", "else part");
                                                            var subarray = {};
                                                            subarray = arrayFound[0].inv;
                                                            subarray.push(tbl_data[k].inv[0]);
                                                            common.findAndReplace(tbldata, tbl_data[k].ctin, subarray, tblcd);
                                                        }
                                                    }
                                                    break;
                                                default:
                                                    logger.log("error", "table_cd not present :: %s", tblcd);
                                            }

                                            fs.writeFileSync(filename, JSON.stringify(gstfile)); //after pushing data write into file	
                                            // update_meta_file(filename, gstfile, form);
                                            callback(null, "Success! Refunds details added.");
                                        })
                                    }

                                });
                        } else // If file is there.
                        {
                            logger.log("info", "file is there.We will append data into it");
                            var gstfile = JSON.parse(data);
                            if (type == "Upload") {
                                var inv = {
                                    "inv": []
                                };
                                fs.writeFileSync(filename, JSON.stringify(gstfile));
                                update_meta_file(filename, gstfile, form);
                            }

                            var tbldata;
                            var jsonObj = [];
                            switch (tblcd) {
                                case "statement3":
                                    logger.log("info", "entered in statement3 section");
                                    tbldata = gstfile.inv;
                                    var responseinvce = [];
                                    var keyObj = {};

                                    for (var i = 0; i < tbl_data.length; i++) {
                                        keyObj.gstin = tbl_data[i].gstin;

                                        keyObj.inum = tbl_data[i].inv[0].inum;

                                        responseinvce.push(keyObj);

                                        var arrayFound = tbldata.myFind({
                                            'gstin': responseinvce[0].gstin
                                        });

                                        if (arrayFound.length != 0) {
                                            var subarray = {};
                                            subarray = arrayFound[0].inv;
                                            var subArrayFound = subarray.myFind({
                                                'inum': responseinvce[0].inum
                                            });
                                            var subIndex = subarray.indexOf(subArrayFound[0]);

                                            if (subArrayFound.length == 0) {
                                                subarray.push(tbl_data[i].inv[0]);
                                                common.findAndReplace(tbldata, tbl_data[i].ctin, subarray, tblcd);
                                            } else {
                                                subarray.splice(subIndex, 1);
                                                subarray.splice(subIndex, 0, tbl_data[i].inv[0])
                                                jsonObj.push(responseinvce[0].inum);
                                            }
                                        } else {
                                            tbldata = tbl_data[i].inv;
                                        }
                                    }
                                    gstfile.inv = tbldata;
                                    break;
                                default:
                                    logger.log("error", "table_cd not present :: %s", tblcd);
                            }
                            //gstfile = omitEmpty(gstfile);
                            fs.writeFileSync(filename, JSON.stringify(gstfile)); // write into file after pushing data into it. 
                            update_meta_file(filename, gstfile, form);
                            if (jsonObj.length == 0) {
                                logger.log("info", "No duplicate invoice found and data added successfully");
                                callback(null, "Success! Refunds details added.");
                            } else {
                                logger.log("info", "duplicate invoice found and non duplicated rows added successfully");
                                callback(err, jsonObj);
                            }
                        }
                    })
                }
            }
        ], function(err, result) {
            logger.log("info", "entered in async.waterfall function")
            if (err) {
                errorObject = {
                    statusCd: err,
                    errorCd: err,
                };
                logger.log("error", "Error While writing into the files :: %s", errorObject);
                response.error(errorObject, res);
            } else {
                logger.log("info", "Data added successfully :: %s", result);
                response.success(result, res)
            }
        })
    } catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
        };
        logger.log("error", "Unexpected Error while writing into the file :: %s", err.message)
        response.error(errorObject, res);
    } finally {
        errorObject = null;
    }
};

var updateTblDataRfd = function(req, res) {
    logger.log("info", "Entering Offline File:: updateTblDataRfd ");
    var errorObject = null;
    try {
        async.waterfall([
            function(callback) {
                var gstin = req.body.gstin;
                var form = req.body.form;
                var fy = req.body.fy;
                var month = req.body.month;
                var tblcd = req.body.tbl_cd;
                var tbl_data = req.body.tbl_data;
                var dir;
                logger.log("info", "Entering Offline File:: updateTblDataRfd with tbl_data :: %s", tbl_data);
                logger.log("info", "Entering Offline File:: updateTblDataRfd with tblcd :: %s", tblcd);
                var invdltArray = req.body.invdltArray; // this will contain an array of objects.Each object will consist of ctin and respective invoice no. to update
                var type = req.body.type;
                var filename;
                if (type == "Upload") {
                    dir = uploadedFiledir + gstin + "_" + form + "_" + fy + "_" + month;
                    filename = dir + "/" + gstin + '_' + form + '_' + fy + '_' + month + '.json';
                } else if (type == "Error") {
                    dir = uploadedFiledir + Error;
                    filename = dir + "/" + gstin + '_' + form + '_' + fy + '_' + month + '.json';
                } else {
                    dir = controlFiledir + gstin + "/" + form + "/" + fy + "/" + month;
                    filename = dir + "/" + form + '_' + gstin + '_' + fy + '_' + month + '.json';
                }
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        if (type == "Upload") {
                            logger.log("error", "error while reading the file :: %s ", err.message);
                            callback("Entered details are not correct", null)
                        } else {
                            logger.log("error", "error while reading the file :: %s ", err.message);
                            callback(err, null)
                        }
                    } else {
                        var gstfile = JSON.parse(data);
                        logger.log("info", " gstfile:: %s", gstfile);
                        var tbldata;
                        switch (tblcd) {
                            case 'statement3':
                                tbldata = gstfile.inv;

                                for (var i = 0; i < invdltArray.length; i++) {
                                    var arrayFound = tbldata.myFind({
                                        'inum': invdltArray[i].inum
                                    });
                                    if (arrayFound.length <= 1) {

                                        var index = tbldata.indexOf(arrayFound[0]); // to find the index of the object 
                                        if (arrayFound.length == 0 || arrayFound.length == 1) {

                                            tbldata.splice(index, 1); //delete row first with matched ctin
                                            /*  for (var i = 0; i < tbl_data.length; i++) {
                                              tbldata.splice(index, 0, tbl_data[i]); //insert updated row in the same index of previous row
                                              }*/
                                            tbldata.splice(index, 0, tbl_data[i].inv);
                                        } else {

                                            var subarray = {};
                                            subarray = arrayFound[0].inv;
                                            var subArrayFound = subarray.myFind({
                                                'inum': invdltArray[i].inum
                                            });
                                            var subIndex = subarray.indexOf(subArrayFound[0]);
                                            subarray.splice(subIndex, 1); //delete row first with matched inum

                                            /*  for (var i = 0; i < tbl_data.length; i++) {*/
                                            var arrayFound = tbldata.myFind({
                                                'gstin': tbl_data[i].gstin
                                            });
                                            if (arrayFound.length == 0) {
                                                tbldata.splice(subIndex, 0, tbl_data[i]);
                                            } else {
                                                var subarray = {};
                                                subarray = arrayFound[0].inv;
                                                subarray.splice(subIndex, 0, tbl_data[i].inv[0]); //insert updated row in the same index of previous row
                                                common.findAndReplace(tbldata, tbl_data[i].gstin, subarray, tblcd);
                                            }

                                            /* }*/

                                        }
                                    }

                                }
                                break;
                            default:
                                tbldata = gstfile.hsnSac;
                        }
                        if (type == "Upload") {
                            fs.writeFileSync(filename, JSON.stringify(gstfile));
                            update_meta_file(filename, gstfile, form);
                            callback(null, "Invoice updated successfully")
                        } else {
                            fs.writeFileSync(filename, JSON.stringify(gstfile));
                            update_meta_file(filename, gstfile, form);
                            callback(null, "Refund Invoice updated successfully");
                        }
                    }
                });
            }
        ], function(err, result) {
            logger.log("info", "entered in async.waterfall function")
            if (err) {
                errorObject = {
                    statusCd: err,
                    errorCd: err,
                };
                logger.log("error", "Error While updating the invoices :: %s", errorObject);
                response.error(errorObject, res);
            } else {
                logger.log("info", "Return Invoice updated successfully:: %s", result);
                response.success(result, res)
            }

        })
    } catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
        };
        logger.log("error", "Unexpected error while updating the data:: %s", err.message);
        response.error(errorObject, res);
    } finally {
        errorObject = null;
    }
};

function listJsonDataForRfd(req, res) {
    logger.log("info", "Entering Offline js:: listJsonDataForRfd ");
    var sec = req.body.section;
    var page = req.body.page_num;
    if (!page) page = 1;
    var page_count = 25;
    var file = req.body.file;
    var filter = req.body.filter;
    var formName = req.body.form;
    var shareData = req.body.shareData;
    var sort_by = req.body.sort_by;
    var sort_order = req.body.sort_order;

    try {
        var fileData = fs.readFileSync(__dirname + '/../public/' + file, "utf8");
        fileData = JSON.parse(fileData);

        var gstin = fileData.gstin;
        if (typeof fileData["inv"] == 'object') {
            fileData = fileData["inv"];
            var reformateInv = RefundStructure.reformateInv(formName, shareData),
                fileData = reformateInv(fileData);
            if (filter && filter.trim() != '')
                fileData = angular.keySearchFor(filter, fileData, sort_by);
            var fileDataMeta = fileData.length;

            if (sort_by && sort_by != '') {
                if (sort_order) {
                    fileData.sort(function(a, b) {
                        var nameA = a[sort_by];
                        var nameB = b[sort_by];

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });
                } else {
                    //reverse
                    fileData.sort(function(a, b) {
                        var nameA = a[sort_by];
                        var nameB = b[sort_by];

                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }


            fileData = fileData.slice((page - 1) * page_count, (page_count * page));

            res.status(200).send(JSON.stringify({ rows: fileData, count: fileDataMeta }));
        } else {
            logger.log("info", "no data for section in  json file");
            //console.log('in else');
            res.status(404).end();
        }
    } catch (err) {
        //  console.log(err);
     //   logger.log("info", "NO JSON FILE EXISTS FOR SELECTION");
        res.status(404).end();
    }
};

function fetchRfdMeta(req, res) {
    logger.log("info", "Entering Offline js:: fetchRfdMeta ");
    var errorObject;
    try {
        var fileName = req.body.fName;
        var form = req.body.form;
        var jSonfileName = __dirname + '/../public/' + fileName + '_meta.json';
        var payloadfileName = __dirname + '/../public/' + fileName + '.json';
        var payload = fs.readFileSync(payloadfileName, "utf8");
        payload = JSON.parse(payload);

        update_meta_file(payloadfileName, payload, form, function(err) {
            if (err) {
                console.log(err)
                errorObject = {
                    statusCd: errorConstant.STATUS_500,
                    errorCd: errorConstant.STATUS_500,
                };
                logger.log("error", "Unexpected Error whilecreating summary :: %s", err.message)
                response.error(errorObject, res);
                return;
            } else {
                payload = fs.readFileSync(jSonfileName, "utf8");
                payload = JSON.parse(payload);
                response.success(payload, res)
            }

        })
    } catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
        };
        logger.log("error", "Unexpected Error while generating file :: %s", err.message)
        response.error(errorObject, res);
    } finally {
        errorObject = null;

    }

};

var generateRfdFile = function(req, res) {
    logger.log("info", "Entering Offline File:: generateRfdFile ");
    var errorObject = null;
    try {
        var gstin = req.body.gstin;
        var form = req.body.form;
        var fy = req.body.fy;
        var month = req.body.month;
        var type = req.body.type;
        var filename;
        var dir;
        if (type == "Upload") {
            dir = uploadedFiledir + gstin + "_" + form + "_" + fy + "_" + month;
            filename = dir + "/" + gstin + '_' + form + '_' + fy + '_' + month + '.json';
        } else {
            dir = controlFiledir + gstin + "/" + form + "/" + fy + "/" + month; // to read the file whose zip need to be created
            filename = dir + "/" + form + '_' + gstin + '_' + fy + '_' + month + '.json'

        }
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) console.log(err);
            else {
                var gstfile = JSON.parse(data)
                gstfile.txpd = gstfile.atadj;
                gstfile.atadj = [];
                gstfile = omitEmpty(gstfile);
                gstfile = fixUQC(gstfile);
                gstfile.exp = sbnumInt(gstfile.exp)

                fs.writeFileSync(dir + "/tabledata" + '.json', JSON.stringify(gstfile));
                res.setHeader('Content-type', 'application/json');
                res.setHeader('Content-disposition', 'attachment; filename=' + "tabledata.json");
                var fileStream = fs.createReadStream(dir + "/tabledata" + '.json');
                fileStream.on('open', function(err) {
                    if (err) {
                        console.log(err);
                    }
                    fileStream.pipe(res);
                    res.on('finish', function() {
                        del.sync(['./public/generatedFile/*']);
                        del.sync(['./public/userData/' + gstin + "/" + form + "/" + fy + "/" + month + '/' + 'tabledata.json']);
                    });
                });
            }
        });


    } catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
        };
        logger.log("error", "Unexpected Error");
        response.error(errorObject, res);
    } finally {
        errorObject = null;
    }
};

var deleteAllRfdInvoices = function(req, res) {
    var errorObject = null;
    logger.log("info", "Entering Offline File:: deleteAllRfdInvoices ");
    try {
        async.waterfall([function(callback) {
            var gstin = req.body.gstin;
            var form = req.body.form;
            var fy = req.body.year;
            var month = req.body.month;
            var filename = './public/userData/' + gstin + '/' + form + '/' + fy + '/' + month + '/*.json';
            del.sync([filename]);
            callback(null, "Refund File Deleted")
        }], function(err, result) {
            logger.log("info", "entered in async.waterfall function")
            if (err) {
                errorObject = {
                    statusCd: err,
                    errorCd: err,
                };
                logger.log("error", "Error While deleting the files :: %s", errorObject);
                response.error(errorObject, res);
            } else {
                logger.log("info", "Refund File Deleted" + " :: %s", result);
                response.success(result, res)
            }

        })

    } catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
        };
        logger.log("error", "Unexpected Error while deleting the file:: %s", err.message);
        response.error(errorObject, res);
    } finally {
        errorObject = null;
    }
};

var deleteRfdMltplInv = function(req, res) {
    logger.log("info", "Entering Offline File:: deleteRfdMltplInv ");
    var errorObject = null;
    try {
        async.waterfall([

            function(callback) {
                var gstin = req.body.gstin;
                var form = req.body.form;
                var fy = req.body.fy;
                var month = req.body.month;
                var tblcd = req.body.tbl_cd;
                var invdltArray = req.body.invdltArray; // this will contain an array of objects.Each object will consist of ctin and respective invoice no. to delete
                var type = req.body.type;
                var dir, filename;
                if (type == "Upload") {
                    dir = uploadedFiledir + gstin + "_" + form + "_" + fy + "_" + month;
                    filename = dir + "/" + gstin + '_' + form + '_' + fy + '_' + month + '.json';
                } else {
                    var dir = controlFiledir + gstin + "/" + form + "/" + fy + "/" + month;
                    filename = dir + "/" + form + '_' + gstin + '_' + fy + '_' + month + '.json';
                }

                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        callback("Unable to read the file for deleting invoices", null)
                    } else {
                        var gstfile = JSON.parse(data);
                        var tbldata;
                        switch (tblcd) {
                            case 'statement3':
                                tbldata = gstfile.inv;

                                for (var i = 0; i < invdltArray.length; i++) {
                                    var arrayFound = tbldata.myFind({
                                        'inum': invdltArray[i].inum
                                    });
                                    if (arrayFound.length <= 1) {
                                        var index = tbldata.indexOf(arrayFound[0]); // to find the index of the object 
                                        if (arrayFound.length == 0 || arrayFound.length == 1) {
                                            tbldata.splice(index, 1);
                                            //fs.writeFileSync(dir+"/" + form +'_'+ gstin+'_'+ fy +'_'+ month+'.json', JSON.stringify(gstfile));
                                        } else {
                                            var subarray = {};
                                            subarray = arrayFound[0].inv;
                                            var subArrayFound = subarray.myFind({
                                                'inum': invdltArray[i].inum
                                            });
                                            var subIndex = subarray.indexOf(subArrayFound[0]);
                                            subarray.splice(subIndex, 1);
                                        }
                                    }
                                }
                                break;
                            default:
                                tbldata = gstfile.hsnSac;
                        }
                        fs.writeFileSync(filename, JSON.stringify(gstfile));
                        update_meta_file(filename, gstfile, form);
                        callback(null, "Invoice deleted successfully")
                    }

                });

            }
        ], function(err, result) {
            logger.log("info", "entered in async.waterfall function")
            if (err) {
                errorObject = {
                    statusCd: err,
                    errorCd: err,
                };
                logger.log("error", "Error While deleting the files :: %s", errorObject);
                response.error(errorObject, res);
            } else {
                logger.log("info", "Invoices deleted successfully :: %s", result);
                response.success(result, res)
            }
        })
    } catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
        };
        logger.log("error", "Unexpected error while deleting the invoices:: %s", err.message);
        response.error(errorObject, res);
    } finally {
        errorObject = null;
    }
};

module.exports = {
    addTblDataRfd: addTblDataRfd,
    updateTblDataRfd: updateTblDataRfd,
    listJsonDataForRfd: listJsonDataForRfd,
    fetchRfdMeta: fetchRfdMeta,
    generateRfdFile: generateRfdFile,
    deleteAllRfdInvoices: deleteAllRfdInvoices,
    deleteRfdMltplInv: deleteRfdMltplInv
}