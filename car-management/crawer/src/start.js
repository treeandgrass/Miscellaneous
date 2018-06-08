var {getServiceJsObject, getServiceJsObjectSync} = require('./util/readFile.js');
const c = require("./util/constant.js");
const httpRequestImage = require('./parser/httpRequestImage.js');

// init 
var initPath = '../init'
getServiceJsObjectSync(initPath);

// flag
const arg = process.argv.slice().pop()


if (arg === 'url') {
    // start parse url
    require('./parser/httpRequestURL.js')(c.URL);
} else if (arg === 'image') {
    httpRequestImage();
}

