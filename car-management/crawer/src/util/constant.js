const path = require('path');

// init url
// const URL = "https://image.baidu.com/search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&ie=gbk&word=%B3%B5%C5%C6%CD%BC%C6%AC&fr=ala&ala=1&alatpl=adress&pos=0&hs=2&xthttps=111111"
const URL = "http://pic.sogou.com/pics?query=%C6%FB%B3%B5%B3%B5%C5%C6&p=40230500&st=255&mode=255"
// ArrowDown times

const ARROWDOWNTIMES = 10

// except number

const EXCEPTNUMBER = 10000

const SAVEPATH = path.join(__dirname, '../images');

module.exports = {
    URL,
    ARROWDOWNTIMES,
    EXCEPTNUMBER,
    SAVEPATH
}

// image storage path