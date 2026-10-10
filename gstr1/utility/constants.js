/*global exports */
'use strict';

exports.LOG_FILE_PATH ="uploadLog.log"; 
exports.LOG_FILE_MAX_SIZE = "2147483648";
exports.TOTAL_LOG_FILE ="1";

exports.LOG_LEVEL ="debug";
exports.LOG_LVL_ERROR ="error";
exports.LOG_LVL_INFO ="info";

exports.UPLOAD_PATH;


//Redis Cache Ip and Port
exports.REDIS_IP;// = "10.232.37.17";
exports.REDIS_PORT;// = "15358";
exports.CLAM_IP;
exports.CLAM_PORT;

exports.CACHE_REFRESH_TIME;
exports.DOC_PATH_REFRESH_TIME;
exports.HTTP_REFERER;
exports.IS_DEV;


exports.RDS_IP="REDIS_SESSIONDB_HOST";
exports.RDS_PORT="REDIS_SESSIONDB_PORT";
exports.CLM_URL="DOCUMENTWEB_CLAM_URL";


exports.STATE_COUNT = "100";
exports.IS_REDIS = true;
exports.ADMIN_WEB_URL="AdminWebUrl";
exports.ADMIN_WEB_MODULE_URL="/cachemanager/config/db/DOCUMENTWEB"
exports.CONFIG_PROP="/cachemanager/loadconfigprop";
exports.UPLOAD_BASE_PATH ="/registration/st_";
exports.UPLOAD_MOBILE_PATH ="/mobapp_doc";
exports.PN_PATH = "/pn_"
exports.FILE_NAME = "document";
exports.BASE64 = "base64";
exports.BINARY = "binary";
exports.CONT_TYP = "Content-Type";
exports.APPLN_JSON = "application/json";
exports.SUCCESS = "success";
//exports.FILE_NAME = "image.jpg";
exports.MIME_TYPE = "image/jpeg";
exports.ENTITY_TY="TP";

exports.APPLNID="applnid";
exports.DOC_TYPE="ty";
exports.UPFILE="upfile";
exports.SESSIONID="sessionid";
exports.CACHE_STD_TTL =12;
exports.CLAM_STATUS = false;
exports.GST_HTTP_REFERER="GST_HTTP_REFERER";
exports.DOC_TYP_MSTR = "DOC_TYP_MSTR";
exports.STATIC_CONFIG_PROP_MSTR="STATIC_CONFIG_PROP_MSTR";
exports.PROP_VAL ="PROP_VAL";

exports.DATE="Date";
exports.REVISION="Revision";

exports.JPEG = "JPG";
exports.PDF = "PDF";
exports.PDF_EXT =".pdf";
exports.JPG_EXT =".jpg";
exports.SHEET = ".xlsx";
exports.DOCUMENT = ".docx";
exports.BMP = ".bmp";
exports.PNG = ".png";
exports.GIF = ".gif";
exports.EXCEL = ".xls";
exports.WORD = ".doc";
exports.JSON ="JSON";
exports.JSON_FILE_EXT = ".json";
exports.JSON_FILE_MIME ="application/octet-stream";
exports.REQ_STATUS ="1";
exports.CHARSET= "charset=utf-8;";//To replace from mobileappreq
exports.DATA_TEXT_REPLACE_B64="data:"
exports.BASE64_TEXT_REPLACE_B64 =";base64,"	
exports.REDIS_CONNECTION_STATUS;
exports.B2CL_MIN_VAL = 100000;
exports.B2CL_MIN_VAL_STR_PRD = "082024";
exports.NODE_PORT = 3010 ;