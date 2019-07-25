const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
const nforce = require("nforce");
const http = require("http");
var localStorage = require("localStorage");
var cors = require("cors");
var oauth;
var token = "";
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var USERNAME = process.env.USERNAME;
var PASSWORD = process.env.PASSWORD;
var BASEURL = process.env.BASEURL;
var SECURITYTOKEN = process.env.SECURITYTOKEN;
var REDIRECT_URL = process.env.REDIRECT_URL;
var audienceauth0 = process.env.audienceauth0;
var clientIDauth0 = process.env.clientIDauth0;
var domainauth0 = process.env.domainauth0;
var redirectUriauth0 = process.env.redirectUriauth0;
var responseTypeauth0 = process.env.responseTypeauth0;
var scopeauth0 = process.env.scopeauth0;
var dateNotice = process.env.dateNotice;

var MODE = "single",
  ENVIRONMENT = "production",
  APIVERSION = "v41.0";
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
if (process.env.MODE != null) {
  MODE = process.env.MODE;
}

if (process.env.ENVIRONMENT != null) {
  ENVIRONMENT = process.env.ENVIRONMENT;
}

if (process.env.APIVERSION != null) {
  APIVERSION = process.env.APIVERSION;
}
const org = nforce.createConnection({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URL,
  apiVersion: APIVERSION, // optional, defaults to current salesforce API version
  environment: ENVIRONMENT, // optional, salesforce 'sandbox' or 'production', production default
  mode: MODE, // optional, 'single' or 'multi' user mode, multi default
  username: USERNAME,
  password: PASSWORD,
  securityToken: SECURITYTOKEN
});
console.log('ORGG');
console.log(org);
app.use("/", express.static(__dirname + "/"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/callback", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/work-log", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/dashboard", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/api/salesforce/baseurl", function(req, res) {
  return res.json({ BASEURL: BASEURL });
});
app.get("/api/auth0/data", function(req, res) {
  return res.json({
    audienceauth0: audienceauth0,
    clientIDauth0: clientIDauth0,
    domainauth0: domainauth0,
    redirectUriauth0: redirectUriauth0,
    responseTypeauth0: responseTypeauth0,
    scopeauth0: scopeauth0
  });
});

app.get("/api/salesforce/token", function(req, res) {
  org.authenticate({}, function(err, resp) {
    if (!err) {
      oauth = resp;
      token = resp.access_token;
    } else {
      console.log(err);
    }
  });
  return res.json({ TOKEN: token });
});

app.get("/api/salesforce/dateNotice", function(req, res) {  
  return res.json({ dateNotice: dateNotice });
});
