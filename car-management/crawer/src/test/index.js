const c = require("../util/constant.js");
// 测试 bloomfilter
// const BloomFilter = new require("../util/bloomfilter.js").BloomFilter
// const bloomFilter = new BloomFilter(32 * 256, 16)
// const path = require("path")
// bloomFilter.add("dddd")
// console.log(bloomFilter.test("dddd"))
// bloomFilter.dump("test.txt", "test1.txt")
// bloomFilter.add("cccc")
// console.log(bloomFilter.test("cccc"))
// bloomFilter.load("test.txt", "test1.txt")
// console.log(bloomFilter.test("dddd"))
// console.log(bloomFilter.test("cccc"))

// test http method
// const h = require("../util/http.js")

// h({urls: ["http", "url", "jjsdsd"]}, "/url/save", "POST")

require('../start.js');
// 测试http
const http = require('../util/http.js');
const fs = require('fs');

const imagePath = 'D:/jupyter/car-management/crawer/src/images';

http(null, 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=623054485,857985843&fm=27&gp=0.jpg' ,'ss0.bdstatic.com', 443, 'GET').then(res => {
    const imageSuffix = res.url.split('/').pop();
    const filename = imagePath + '/' + Date.now() + imageSuffix ;
    const opts = {
        flags: 'w',
        encoding: 'utf8',
        fd: null,
        mode: 0o666,
        autoClose: true
      };
    const stream = fs.createWriteStream(filename, opts);
    
    let chunks = res.chunks;

    for (let i = 0; i < chunks.length; i++) {
        stream.write(chunks[i], 'utf8', function (err) {
            if (err) console.log(err);
        });
    }

    stream.on('close', function () {
        stream.end();
    })


    stream.on('error', function (err) {
        console.log(err);
    })
    stream.on('finish', () => {
        stream.close();
    })
}).catch(err => {
    console.log(err)
})

// const urlcurd = require('../db/urlcrud.js');

// urlcurd.add(['http://example.com', "https://hello.com", "http://google.com"]);

// urlcurd.query(0, 3).then(res => {
//     console.log(res);
//     process.exit();
// })

// urlcurd.del(['5ac4d01dcaf75911f080cfba']).then(res => {
//     process.exit();
// })


console.log(c.SAVEPATH);