/*
author @ Shiwali Srivastava
developed by GSTN
*/
/**
 *  @author:   Shiwali Srivastava
 *  @created:   Sep 2016
 *  @description: Offline utility some common function
 *  @copyright: (c) Copyright by Infosys technologies
 *  version GST3.2.4
 *  Last Updated:  Hsn validation team, Feb 02 2022
 **/
'use strict';
var fs = require('fs');
var moment = require('moment');
var multer = require("multer");
var log = require('../utility/logger');
var logger = log.logger;
var errorConstant = require('../utility/errorconstants');
var jsonSize = require('json-size');
var async = require('async');
var omitEmpty = require('omit-empty');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var _ = require('underscore');
let pathchange =true;
var storage = multer.diskStorage(
{
  destination: function(req, file, callback)
  
  {
    
    callback(null, 'public/upload');
    
  }, //location where uploaded files will be stored.
  filename: function(req, file, callback)
  {
    var fname = file.originalname.replace(/%/g, "");
    callback(null, fname);
  } //renaming of uploaded files.
});

//upload upto 10  file
var upload1 = multer(
{
  storage: storage
}).array('File', 200);



/*//this method find the particular object and replace the content of that object.
exports.findAndReplace = function(object, value, replacevalue) {

    for (var x in object) {
        if (typeof object[x] == typeof {}) {
            exports.findAndReplace(object[x], value, replacevalue);
        }
        if (object[x] == value) {
            object["itms"] = replacevalue;
            break; // uncomment to stop after first replacement
        }
    }
}*/
Array.prototype.commonMyFind = function(obj)
{

  return this.filter(function(item)
  {
    for (var prop in obj)
      if (!(prop in item) || (obj[prop] !== item[prop]))
      {
        if (prop in item && typeof obj[prop] == 'string' && prop == 'inum')
        {
          if ((obj[prop]).toLowerCase() === (item[prop]).toLowerCase())
          {
            return true;
          }
        }
        return false;
      }
    return true;
  });
};
//this method find the particular object and replace the content of that object.
exports.findAndReplace = function(object, value, replacevalue, tblcd)
{

  switch (tblcd)
  {
    case "b2b":
    case "b2ba":
    case "b2cl":
    case "b2cla":
    case "exp":
    case "expa":
    case "nil":
    case "ecomb2b":
    case "ecomurp2b":
    case "ecomab2b":
    case "ecomaurp2b":
      for (var x in object)
      {
        if (typeof object[x] == typeof
          {})
        {
          exports.findAndReplace(object[x], value, replacevalue);
        }
        if (object[x] == value)
        {
          object["inv"] = replacevalue;
          break; // uncomment to stop after first replacement
        }
      }
      break;
    case "cdnr":
    case "cdnra":
      for (var x in object)
      {
        if (typeof object[x] == typeof
          {})
        {
          exports.findAndReplace(object[x], value, replacevalue);
        }
        if (object[x] == value)
        {
          object["nt"] = replacevalue;
          break; // uncomment to stop after first replacement
        }
      }
      break;
    case "cdnur":
    case "cdnura":
    case "at":
    case "ata":
    case "atadj":
    case "atadja":
      for (var x in object)
      {
        if (typeof object[x] == typeof
          {})
        {
          exports.findAndReplace(object[x], value, replacevalue);
        }
        if (object[x] == value)
        {
          object["itms"] = replacevalue;
          break; // uncomment to stop after first replacement
        }
      }
      break;

  }
}

exports.formDataFormat = function(req, callback)
{
  logger.log("info", "entered to formDataFormat")
 //B2B and B2C in hsn
  var HSN_BIFURCATION_START_DATE = "052025";
  var sys_date = new Date();
  var fp = req.body.fp;
  var showHSNTabs = !(moment(exports.getDate(fp), 'DD/MM/YYYY').isBefore(moment(exports.getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));

  var version = "GST3.2.4";
  var hash = "hash";
  var gstin = req.body.gstin;
  var form = req.body.form;
  var gt = parseInt(req.body.gt);
  var cur_gt = parseInt(req.body.cur_gt);
  var fp = req.body.fp;
  var fy = req.body.fy;
  var month = req.body.month;
  var crclm_17_3 = req.body.crclm_17_3;
  var formDataFormat;
  if (form == "GSTR1" || form == 'GSTR1A')
  {
    if (!showHSNTabs) {
      if (isNaN(gt)) 
        {
        logger.log("info", " creating formDataFormat of form without gt :: %s ", form);
        formDataFormat = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"cdnura":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"atadja":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"data":[' + " " + "]}" + ',' + '"supeco":{"clttx":[' + " " + "]" + ',' + '"paytx":[' + " " + "]}" + ',' + '"supecoa":{"clttxa":[' + " " + "]" + ',' + '"paytxa":[' + " " + "]}" + ',' + '"ecom":{"b2b":[' + " " + "]" + ',' + '"b2c":[' + " " + "]" + ',' + '"urp2b":[' + " " + "]" + ',' + '"urp2c":[' + " " + "]}" + ',' + '"ecoma":{"b2ba":[' + " " + "]" + ',' + '"b2ca":[' + " " + "]" + ',' + '"urp2ba":[' + " " + "]" + ',' + '"urp2ca":[' + " " + "]}}"
      }
      else 
      {
        logger.log("info", " creating formDataFormat of form :: %s ", form);
        formDataFormat = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"gt":' + gt + ',' + '"cur_gt":' + cur_gt + ',' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"cdnura":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"atadja":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"data":[' + " " + "]}" + ',' + '"supeco":{"clttx":[' + " " + "]" + ',' + '"paytx":[' + " " + "]}" + ',' + '"supecoa":{"clttxa":[' + " " + "]" + ',' + '"paytxa":[' + " " + "]}" + ',' + '"ecom":{"b2b":[' + " " + "]" + ',' + '"b2c":[' + " " + "]" + ',' + '"urp2b":[' + " " + "]" + ',' + '"urp2c":[' + " " + "]}" + ',' + '"ecoma":{"b2ba":[' + " " + "]" + ',' + '"b2ca":[' + " " + "]" + ',' + '"urp2ba":[' + " " + "]" + ',' + '"urp2ca":[' + " " + "]}	}"
      }

    }
    else 
    {
      if (isNaN(gt)) 
      {
        logger.log("info", " creating formDataFormat of form without gt :: %s ", form);
        formDataFormat = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"cdnura":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"atadja":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"hsn_b2b":[' + " " + "]" + ',' + '"hsn_b2c":[' + " " + "]}" + ',' + '"supeco":{"clttx":[' + " " + "]" + ',' + '"paytx":[' + " " + "]}" + ',' + '"supecoa":{"clttxa":[' + " " + "]" + ',' + '"paytxa":[' + " " + "]}" + ',' + '"ecom":{"b2b":[' + " " + "]" + ',' + '"b2c":[' + " " + "]" + ',' + '"urp2b":[' + " " + "]" + ',' + '"urp2c":[' + " " + "]}" + ',' + '"ecoma":{"b2ba":[' + " " + "]" + ',' + '"b2ca":[' + " " + "]" + ',' + '"urp2ba":[' + " " + "]" + ',' + '"urp2ca":[' + " " + "]}}"
      }
      else 
      {
        logger.log("info", " creating formDataFormat of form :: %s ", form);
        formDataFormat = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"gt":' + gt + ',' + '"cur_gt":' + cur_gt + ',' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"cdnura":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"atadja":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"hsn_b2b": [' + "" + "]" + ',' + '"hsn_b2c": [' + " " + "]}" + ',' + '"supeco":{"clttx":[' + " " + "]" + ',' + '"paytx":[' + " " + "]}" + ',' + '"supecoa":{"clttxa":[' + " " + "]" + ',' + '"paytxa":[' + " " + "]}" + ',' + '"ecom":{"b2b":[' + " " + "]" + ',' + '"b2c":[' + " " + "]" + ',' + '"urp2b":[' + " " + "]" + ',' + '"urp2c":[' + " " + "]}" + ',' + '"ecoma":{"b2ba":[' + " " + "]" + ',' + '"b2ca":[' + " " + "]" + ',' + '"urp2ba":[' + " " + "]" + ',' + '"urp2ca":[' + " " + "]}	}"
      }
    }
  }
  else if (form == "GSTR2")
  {
    logger.log("info", " creating formDataFormat of form :: %s ", form);
    formDataFormat = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2bur":[{"inv":[' + "" + "]}]" + ',' + '"b2bura":[{"inv":[' + "" + "]}] " + ',' + '"imp_g":[' + " " + "]" + ',' + '"imp_ga":[' + " " + "]" + ',' + '"nil_supplies":{}' + ',' + '"imp_s":[' + " " + "] " + ',' + '"imp_sa":[' + " " + "]  " + ',' + '"hsnsum":{"det":[' + " " + "]}  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"txi":[' + " " + "]  " + ',' + '"atxi":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"itc_rvsl":[' + " " + "]  " + ',' + '"atadj":[' + " " + "]   }"

  }
  else
  {
    logger.log("error", "Wrong form no. sent");
  }
  return callback(formDataFormat);
}

exports.upload1 = upload1;


exports.diffObject = function(a, b)
{
  return Object.keys(a).reduce(function(map, k)
  {
    if (a[k] !== b[k]) map[k] = b[k];
    return map;
  },
  {});
}
 exports.getDate = function (retprd) {
  var a = "01/" + retprd.substring(0, 2) + "/" + retprd.substring(2);
  return a;
};

exports.chunk = function(req, callback)
{
  //var fileArray=[];
  var errorObject = null;

  try
  {
 //B2B and B2C in hsn
   var HSN_BIFURCATION_START_DATE = "052025";
   var sys_date = new Date();
   var fp = req.body.fp;
   var showHSNTabs = !(moment(exports.getDate(fp), 'DD/MM/YYYY').isBefore(moment(exports.getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
   //var showHSNTabs = true;
    //var chunked_json;
    var gstfileNew = req.body.gstfileNew;
    var chunk_format;
    var max_size = req.body.max_size;
    var form = req.body.form;
    var gstin = req.body.gstin;
    var fp = req.body.fp;
    var version = "GST3.2.4";
    var hash = "hash";
    var gt = req.body.gt;
    var cur_gt = req.body.cur_gt;
    var fy = req.body.fy;
    var month = req.body.month;
    async.waterfall([
      function(callback)
      {
        //                            console.log('function 1')
        if (form == "GSTR1" || form == 'GSTR1A') 
          {
           if (!showHSNTabs) 
            {
            if (isNaN(gt)) 
              {

            chunk_format = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"data":[' + " " + "]}   }";
          }
          else
          {
            chunk_format = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"gt":' + gt + ',' + '"cur_gt":' + cur_gt + ',' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"data":[' + " " + "]}   }";
      }
    } else 
    {
      if (isNaN(gt)) {

        chunk_format = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"hsn_b2b": [' + "" + "]" + ',' + '"hsn_b2c": [' + "" + "]}" + " }";
      }
      else {
        chunk_format = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '"gt":' + gt + ',' + '"cur_gt":' + cur_gt + ',' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2cl":[' + "" + "]" + ',' + '"b2cla":[' + "" + "] " + ',' + '"b2cs":[' + " " + "]" + ',' + '"b2csa":[' + " " + "]" + ',' + '"nil":{"inv":[' + "" + "]}" + ',' + '"exp":[' + " " + "] " + ',' + '"expa":[' + " " + "]  " + ',' + '"hsnSac":[' + " " + "]  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"at":[' + " " + "]  " + ',' + '"ata":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"atadj":[' + " " + "]  " + ',' + '"doc_issue":{"doc_det":[' + " " + "]}" + ',' + '"hsn":{"hsn_b2b": [' + "" + "]" + ',' + '"hsn_b2c": [' + "" + "]}" + " }";
      }
    }


        }
        else if (form == "GSTR2")
        {

          chunk_format = "{ " + '"gstin":"' + gstin + '",' + '"fp":"' + fp + '",' + '' + '"version":"' + version + '",' + '"hash":"' + hash + '",' + '"b2b" :[' + " " + "]" + ',' + '"b2ba" :[' + "" + "]" + ',' + '"b2bur":[{"inv":[' + "" + "]}]" + ',' + '"b2bura":[{"inv":[' + "" + "]}] " + ',' + '"imp_g":[' + " " + "]" + ',' + '"imp_ga":[' + " " + "]" + ',' + '"nil_supplies":{}' + ',' + '"imp_s":[' + " " + "] " + ',' + '"imp_sa":[' + " " + "]  " + ',' + '"hsnsum":{"det":[' + " " + "]}  " + ',' + '"cdnra":[' + " " + "]  " + ',' + '"txi":[' + " " + "]  " + ',' + '"atxi":[' + " " + "]  " + ',' + '"cdnr":[' + " " + "] " + ',' + '"cdnur":[' + " " + "] " + ',' + '"itc_rvsl":[' + " " + "]  " + ',' + '"atadj":[' + " " + "]   }";

        }
        else
        {
          logger.log("error", "Wrong form no. sent");
        }



        fs.writeFile("./public/download/" + "ChunkFile" + ".json", chunk_format, function(err) // creating a new file with data format for the respective form 
          {

            if (err) // if we are facing issue in creating the file
            {

              logger.log("error", "Unexpected error while creating the file:: %s", err.message);
              callback(err, null);
            }
            else // file is created 
            {


              fs.readFile("./public/download/" + "ChunkFile" + ".json", 'utf8', function(err, data)
              {
                if (err) //if we are unable to read the file
                {
                  logger.log("error", "Unexpected error while reading the file:: %s", err.message);

                }
                else // if we are able to read the file
                {

                  var chunk_file = JSON.parse(data);
                  callback(null, chunk_file); //callback to call the next function in the order.

                }
              });


            }

          });


      },
      function(chunk_file, callback)
      {
        //                            console.log('chunk.... function 2')
        //iterate over the sections in the file
        var filsSize = 0;
        var ranDnum;
        var old_ranDnum;
        var keyArray = [];
        var sys_date = new Date();
        var date_stamp = sys_date.getDate() + '-' + (sys_date.getMonth() + 1) + '-' + sys_date.getFullYear() + '_' + (sys_date.getHours()) + 'h' + '_' + sys_date.getMinutes() + 'm' + '_' + sys_date.getSeconds() + 's';
        var fp_date = (sys_date.getDate()).toString() + (sys_date.getMonth() + 1).toString() + (sys_date.getFullYear()).toString();
        var _dir = "./public/download/chunked_files/";
        var chunk_dir = _dir + date_stamp + "/";
        mkdirp(chunk_dir, function(err)
        {
          if (err)
          {
            logger.log("error", "error while creating the directory :: %s ", err.message);
          }
        });

        for (var secKey in gstfileNew)
        {
          //                                    console.log('----', secKey);
          var secData = gstfileNew[secKey];
          var secSize = jsonSize(JSON.stringify(secData));


          if (secSize > max_size)
          {
              
            switch (secKey)
            {
              case "b2b":
              case "b2ba":
                // var keyObj = {};
                // var newInv = [];
                // var thisSize;
                // var SecChunk = [];
                    
                while (!_.isEmpty(secData))
                {
                    
                      var chunkedtbl = chunk_file[secKey];
                      var chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                       var chunklimit;
                       if(secSize>max_size)
                       {
                        var chunkdiv = Math.ceil(secSize/max_size);
                        chunklimit = secSize/chunkdiv;
                       }
                       else
                       {
                        chunklimit = secSize;
                       }
                       
                      for(var j = (secData.length)-1; j>=0;j--)
                          {
                            var objSize = jsonSize(JSON.stringify(secData[j]));
                            if(objSize<chunklimit)
                            {
                              if (chunkSize < chunklimit)
                              {
                                  chunkedtbl.push(secData[j]);
                                  
                                  chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                                  // console.log(secSize+" this is the section size------------------");
                                  // console.log(chunkSize);
                                  secData.splice(j, 1);
                              }
                            }
                            else
                            {
                              var chunkedtblobj = chunk_file[secKey];
                              chunkedtblobj.push(secData[j]);
                              secData.splice(j, 1);
                              chunk_file=omitEmpty(chunk_file);
                              ranDnum = Math.floor((Math.random() * 100000) + 1);
                                fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));

                                    secSize = jsonSize(JSON.stringify(secData));
                                    //console.log(secSize+" this is the section size afterwards------------------");
                                    
                            }
                              
                              
                               
                          }
                  
      
                  /*for (var j = secData.length - 1; j >= 0; j--)
                  {
                    ranDnum = Math.floor((Math.random() * 100000) + 1);
                    var objSize = jsonSize(JSON.stringify(secData[j]));
                    if (max_size < objSize)
                    {
                      console.log('in here!')
                      thisSize = 0;
                      var datatbl = chunk_file[secKey];
                      var objChunk = [];
                        
                        
                        
                        
                      while (max_size > thisSize && secData[j].inv.length > 0)
                      {
                        newInv = [];
                        keyObj.ctin = secData[j].ctin;
                        var k = secData[j].inv.length - 1;
                        while (k >= 0)
                        {
                          newInv.push(secData[j].inv[k]);
                          secData[j].inv.splice(k, 1);
                          k -= 1;
                        }
                        keyObj.inv = newInv;
                        objChunk.push(keyObj);
                        thisSize = jsonSize(JSON.stringify(objChunk));
                        keyObj = {};
                      //  console.log(max_size, thisSize)
                      }
                        
                        
                        
                        
                        
                      if (secData[j].inv.length === 0)
                      {
                        secData.splice(j, 1);
                      }

                      for (var objIndex = 0; objIndex < objChunk.length; objIndex++)
                      {


                        var arrayFound = datatbl.commonMyFind(
                        {
                          'ctin': objChunk[objIndex].ctin
                        });
                        if (arrayFound.length !== 0)
                        {
                          var subarray = {};
                          subarray = arrayFound[0].inv;
                          var subarrayFound = subarray.commonMyFind(
                          {
                            'inum': objChunk[objIndex].inv[0].inum
                          });
                          if (subarrayFound.length === 0)
                          {
                            subarray.push(objChunk[objIndex].inv[0]);
                          }
                        }
                        else
                        {
                          datatbl.push(objChunk[objIndex]);
                        }
                      }
                        
                        chunk_file[secKey] = datatbl;
                        chunk_file = omitEmpty(chunk_file);
                        ranDnum = Math.floor((Math.random() * 100000) + 1);
                        fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
                        
                        

                    }
                    else
                    {
                      var chunkSize = 0;
                      newInv = [];
                      while (max_size > chunkSize && secData[j].inv.length > 0)
                      {
                        keyObj.ctin = secData[j].ctin;
                        for (var k = secData[j].inv.length - 1; k >= 0; k--)
                        {
                          newInv.push(secData[j].inv[k]);
                          secData[j].inv.splice(k, 1);
                          keyObj.inv = newInv;
                        }
                        SecChunk.push(keyObj);
                        keyObj = {};
                        chunkSize = jsonSize(JSON.stringify(SecChunk));
                      }
                      if (secData[j].inv.length === 0)
                      {
                        secData.splice(j, 1);
                      }
                      chunk_file[secKey] = SecChunk;
                      chunk_file = omitEmpty(chunk_file);

                    }

                  }*/
                ranDnum = Math.floor((Math.random() * 100000) + 1);
                chunk_file=omitEmpty(chunk_file);
                  fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));

                  secSize = jsonSize(JSON.stringify(secData));
                  //console.log(secSize+" this is the section size afterwards------------------");
                  chunk_file[secKey] = [];
                  
                }


                break;

              case "cdn":
              case "cdnr":
                

                while (!_.isEmpty(secData))
                {
                    
                      var chunkedtbl = chunk_file[secKey];
                      var chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                       var chunklimit;
                       if(secSize>max_size)
                       {
                        var chunkdiv = Math.ceil(secSize/max_size);
                        chunklimit = secSize/chunkdiv;
                       }
                       else
                       {
                        chunklimit = secSize;
                       }
                      for(var j = (secData.length)-1; j>=0;j--)
                          {
                            var objSize = jsonSize(JSON.stringify(secData[j]));
                            if(objSize<chunklimit)
                            {
                              if (chunkSize < chunklimit)
                              {
                                  chunkedtbl.push(secData[j]);
                                  
                                  chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                                  // console.log(secSize+" this is the section size------------------");
                                  // console.log(chunkSize);
                                  secData.splice(j, 1);
                              }
                            }
                            else
                            {
                              var chunkedtblobj = chunk_file[secKey];
                              chunkedtblobj.push(secData[j]);
                              secData.splice(j, 1);
                              chunk_file=omitEmpty(chunk_file);
                              ranDnum = Math.floor((Math.random() * 100000) + 1);
                                fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));

                                    secSize = jsonSize(JSON.stringify(secData));
                                    //console.log(secSize+" this is the section size afterwards------------------");
                                    
                            }
                              
                              
                               
                          }
                  
                ranDnum = Math.floor((Math.random() * 100000) + 1);
                chunk_file=omitEmpty(chunk_file);
                  fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));

                  secSize = jsonSize(JSON.stringify(secData));
                  //console.log(secSize+" this is the section size afterwards------------------");
                  chunk_file[secKey] = [];
                  
                }

                // while (secSize > max_size)
                // {


                //   for (var j = secData.length - 1; j >= 0; j--)
                //   {
                //     ranDnum = Math.floor((Math.random() * 100000) + 1);


                //     var objSize = jsonSize(JSON.stringify(secData[j]));
                //     if (max_size < objSize)
                //     {
                //       thisSize = 0;

                //       var datatbl = chunk_file[secKey];
                //       var objChunk = [];

                //       while (max_size > thisSize && secData[j].nt.length > 0)
                //       {

                //         newInv = [];

                //         keyObj.ctin = secData[j].ctin;
                //         var k = secData[j].nt.length - 1;
                //         while (k >= 0)
                //         {

                //           newInv.push(secData[j].nt[k]);

                //           secData[j].nt.splice(k, 1);

                //           keyObj.nt = newInv;

                //           k = -1;
                //         }



                //         objChunk.push(keyObj);


                //         thisSize = jsonSize(JSON.stringify(objChunk));


                //         keyObj = {};




                //       }
                //       if (secData[j].nt.length === 0)
                //       {
                //         secData.splice(j, 1);
                //       }

                //       for (var objIndex = 0; objIndex < objChunk.length; objIndex++)
                //       {
                //         if (typeof(datatbl) === "undefined")
                //         {
                //           var newkey = secKey;
                //           var value = [];
                //           chunk_file[newkey] = value;
                //           datatbl = chunk_file[secKey];
                //         }

                //         var arrayFound = datatbl.commonMyFind(
                //         {
                //           'ctin': objChunk[objIndex].ctin
                //         });



                //         if (arrayFound.length !== 0)
                //         {

                //           var subarray = {};
                //           subarray = arrayFound[0].nt;

                //           var subarrayFound = subarray.commonMyFind(
                //           {
                //             'nt_num': objChunk[objIndex].nt[0].nt_num
                //           });

                //           if (subarrayFound.length === 0)
                //           {

                //             subarray.push(objChunk[objIndex].nt[0]);


                //           }

                //         }
                //         else
                //         {

                //           datatbl.push(objChunk[objIndex]);

                //         }
                //       }

                //       chunk_file[secKey] = datatbl;
                //         chunk_file[secKey] = datatbl;
                //         chunk_file = omitEmpty(chunk_file);
                //         ranDnum = Math.floor((Math.random() * 100000) + 1);
                //         fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));


                //     }
                //     else
                //     {

                //       var chunkSize = 0;
                //       var SecChunk = [];
                //       newInv = [];
                //       while (max_size > chunkSize && secData[j].nt.length > 0)

                //       {


                //         keyObj.ctin = secData[j].ctin;


                //         for (var k = secData[j].nt.length - 1; k >= 0; k--)
                //         {

                //           newInv.push(secData[j].nt[k]);

                //           secData[j].nt.splice(k, 1);

                //           keyObj.nt = newInv;


                //         }

                //         SecChunk.push(keyObj);

                //         keyObj = {};

                //         chunkSize = jsonSize(JSON.stringify(SecChunk));


                //       }
                //       if (secData[j].nt.length === 0)
                //       {
                //         secData.splice(j, 1);
                //       }

                //       chunk_file[secKey] = SecChunk;
                //       chunk_file = omitEmpty(chunk_file);

                //     }

                //   }
                //   fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
                //   secSize = jsonSize(JSON.stringify(secData));
                //   chunk_file[secKey] = [];
                //   SecChunk = [];

                // }


                break;

              case "b2cl":
              case "b2cla":
               
              while (!_.isEmpty(secData))
              {
                  
                    var chunkedtbl = chunk_file[secKey];
                    var chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                     var chunklimit;
                     if(secSize>max_size)
                     {
                      var chunkdiv = Math.ceil(secSize/max_size);
                      chunklimit = secSize/chunkdiv;
                     }
                     else
                     {
                      chunklimit = secSize;
                     }
                    for(var j = (secData.length)-1; j>=0;j--)
                        {
                          var objSize = jsonSize(JSON.stringify(secData[j]));
                          if(objSize<chunklimit)
                          {
                            if (chunkSize < chunklimit)
                            {
                                chunkedtbl.push(secData[j]);
                                
                                chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                               // console.log(secSize+" this is the section size------------------");
                                //console.log(chunkSize);
                                secData.splice(j, 1);
                            }
                          }
                          else
                          {
                            var chunkedtblobj = chunk_file[secKey];
                            chunkedtblobj.push(secData[j]);
                            secData.splice(j, 1);
                            chunk_file=omitEmpty(chunk_file);
                            ranDnum = Math.floor((Math.random() * 100000) + 1);
                              fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));

                                  secSize = jsonSize(JSON.stringify(secData));
                                  //console.log(secSize+" this is the section size afterwards------------------");
                                  
                          }
                            
                            
                             
                        }
              ranDnum = Math.floor((Math.random() * 100000) + 1);
              chunk_file=omitEmpty(chunk_file);
                fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));

                secSize = jsonSize(JSON.stringify(secData));
                //console.log(secSize+" this is the section size afterwards------------------");
                chunk_file[secKey] = [];
                
              }


                // while (secSize > max_size)
                // {


                //   for (var j = secData.length - 1; j >= 0; j--)
                //   {
                //     ranDnum = Math.floor((Math.random() * 100000) + 1);


                //     var objSize = jsonSize(JSON.stringify(secData[j]));
                //     if (max_size < objSize)
                //     {
                //       thisSize = 0;

                //       var datatbl = chunk_file[secKey];
                //       var objChunk = [];

                //       while (max_size > thisSize && secData[j].inv.length > 0)
                //       {

                //         newInv = [];

                //         keyObj.pos = secData[j].pos;
                //         var k = secData[j].inv.length - 1;
                //         while (k >= 0)
                //         {

                //           newInv.push(secData[j].inv[k]);

                //           secData[j].inv.splice(k, 1);

                //           keyObj.inv = newInv;

                //           k = -1;
                //         }



                //         objChunk.push(keyObj);


                //         thisSize = jsonSize(JSON.stringify(objChunk));


                //         keyObj = {};




                //       }
                //       if (secData[j].inv.length === 0)
                //       {
                //         secData.splice(j, 1);
                //       }

                //       for (var objIndex = 0; objIndex < objChunk.length; objIndex++)
                //       {
                //         if (typeof(datatbl) === "undefined")
                //         {
                //           var newkey = secKey;
                //           var value = [];
                //           chunk_file[newkey] = value;
                //           datatbl = chunk_file[secKey];
                //         }

                //         var arrayFound = datatbl.commonMyFind(
                //         {
                //           'pos': objChunk[objIndex].pos
                //         });



                //         if (arrayFound.length !== 0)
                //         {

                //           var subarray = {};
                //           subarray = arrayFound[0].inv;

                //           var subarrayFound = subarray.commonMyFind(
                //           {
                //             'inum': objChunk[objIndex].inv[0].inum
                //           });

                //           if (subarrayFound.length === 0)
                //           {

                //             subarray.push(objChunk[objIndex].inv[0]);


                //           }

                //         }
                //         else
                //         {

                //           datatbl.push(objChunk[objIndex]);

                //         }
                //       }

                //       chunk_file[secKey] = datatbl;


                //     }
                //     else
                //     {

                //       var chunkSize = 0;
                //       var SecChunk = [];
                //       newInv = [];
                //       while (max_size > chunkSize && secData[j].inv.length > 0)

                //       {


                //         keyObj.pos = secData[j].pos;


                //         for (var k = secData[j].inv.length - 1; k >= 0; k--)
                //         {

                //           newInv.push(secData[j].inv[k]);

                //           secData[j].inv.splice(k, 1);

                //           keyObj.inv = newInv;


                //         }

                //         SecChunk.push(keyObj);

                //         keyObj = {};

                //         chunkSize = jsonSize(JSON.stringify(SecChunk));


                //       }
                //       if (secData[j].inv.length === 0)
                //       {
                //         secData.splice(j, 1);
                //       }

                //       chunk_file[secKey] = SecChunk;
                //       chunk_file = omitEmpty(chunk_file);

                //     }

                //   }

                //   fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
                //   secSize = jsonSize(JSON.stringify(secData));
                //   chunk_file[secKey] = [];
                //   SecChunk = [];
                // }
                break;
                case "ecomb2b":
                  case "ecomurp2b":
                  case "ecomab2b":
                    case "ecomurp2c":
                        
                    while (!_.isEmpty(secData))
                    {
                        
                          var chunkedtbl = chunk_file[secKey];
                          var chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                           var chunklimit;
                           if(secSize>max_size)
                           {
                            var chunkdiv = Math.ceil(secSize/max_size);
                            chunklimit = secSize/chunkdiv;
                           }
                           else
                           {
                            chunklimit = secSize;
                           }
                           
                          for(var j = (secData.length)-1; j>=0;j--)
                              {
                                var objSize = jsonSize(JSON.stringify(secData[j]));
                                if(objSize<chunklimit)
                                {
                                  if (chunkSize < chunklimit)
                                  {
                                      chunkedtbl.push(secData[j]);
                                      
                                      chunkSize = jsonSize(JSON.stringify(chunkedtbl));
                                      // console.log(secSize+" this is the section size------------------");
                                      // console.log(chunkSize);
                                      secData.splice(j, 1);
                                  }
                                }
                                else
                                {
                                  var chunkedtblobj = chunk_file[secKey];
                                  chunkedtblobj.push(secData[j]);
                                  secData.splice(j, 1);
                                  chunk_file=omitEmpty(chunk_file);
                                  ranDnum = Math.floor((Math.random() * 100000) + 1);
                                    fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
    
                                        secSize = jsonSize(JSON.stringify(secData));
                                        //console.log(secSize+" this is the section size afterwards------------------");
                                        
                                }
                                  
                                  
                                   
                              }
                      
          
                    ranDnum = Math.floor((Math.random() * 100000) + 1);
                    chunk_file=omitEmpty(chunk_file);
                      fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + secKey + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
    
                      secSize = jsonSize(JSON.stringify(secData));
                      //console.log(secSize+" this is the section size afterwards------------------");
                      chunk_file[secKey] = [];
                      
                    }
    
    
                    break;

            }




          }
          else
          {
            old_ranDnum = ranDnum;
            ranDnum = Math.floor((Math.random() * 100000) + 1);
            filsSize = jsonSize(JSON.stringify(chunk_file));
            if (max_size - secSize >= filsSize)
            {
                ranDnum = old_ranDnum;
              chunk_file[secKey] = secData;
              keyArray.push(secKey);
            }
            else
            {
              //ranDnum = Math.floor((Math.random() * 100000) + 1);
              chunk_file = omitEmpty(chunk_file);
              fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + "others" + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
              for (var m = 0; m < keyArray.length; m++)
              {
                var ex_key = keyArray[m];
                chunk_file[ex_key] = [];
              }
              chunk_file[secKey] = secData;
              keyArray = [];

            }


          }
            
          if (typeof(chunk_file[secKey]) === "object" && chunk_file[secKey].length !== 0)
          {
              
            chunk_file = omitEmpty(chunk_file);
            fs.writeFileSync(chunk_dir + "returns" + "_" + fp_date + "_" + form.substring(3) + "_" + gstin + "_" + "offline" + "_" + "others" + "_" + ranDnum + ".json", JSON.stringify(chunk_file));
          }

          //chunk_file[secKey] = chunkData;
        }
        //var dir = "./public/download/chunked_files/";

        callback(null, chunk_dir);
      },
      function(chunk_dir)
      {
        //console.log('function 3')

        toRet(chunk_dir);
      }

    ], function(err, result)
    {
      logger.log("info", "entered in async.waterfall function");
      if (err)
      {
        errorObject = {
          statusCd: err,
          errorCd: err,
        };
        logger.log("error", "Error While chunking the invoices :: %s", errorObject);

      }
      else
      {
        logger.log("info", "Return Details chunked Successfully :: %s", result);


      }

    });
    var toRet = function(chunk_dir)
    {
      //console.log("return is called ", chunk_dir);
      return callback(chunk_dir);
    };

  }
  catch (err)
  {
    errorObject = {
      statusCd: errorConstant.STATUS_500,
      errorCd: errorConstant.STATUS_500,
    };
    logger.log("error", "Unexpected Error");

  }
  finally
  {
    errorObject = null;
  }



};