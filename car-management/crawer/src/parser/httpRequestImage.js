const c = require("../util/constant.js");
const request = require('../util/http.js');
const urlcrud = require('../db/urlcrud.js');
const fs = require('fs');

// start parse url
// require('./parser/httpRequestURL.js')(c.URL);

let skip = 0, limit = 1;

let flags = true;

let getImage = () => {
    return new Promise((resolve, reject) => {
        urlcrud.query(skip, limit).then(urls => {

            if (urls.length == 0) process.exit();
           
            urls.forEach(item => {
                console.log(item.url)
                request(null, item.url, null, 443, 'GET').then(res => {
                    urlcrud.del([item.id])
                    const imageSuffix = res.url.split('/').pop();
                    var formats = [".png", ".jpg", ".jpeg"];
                    var format = formats.filter(f => imageSuffix.includes(f)).join('');
                    format = format ? format : '.jpg';
                    const filename = c.SAVEPATH + '/' + Date.now() + format ;
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
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    
                    resolve();

                }).catch(err => {
                    console.log(err)
                    reject(err);
                })
            })
        }).catch(err => {
            console.log(err);
            process.exit();
        })
    })
}

module.exports = () => {
  let delay = 10000 + Math.random() * 10000; 
  let delayFn = async () => {
      delay = 10000 + Math.random() * 10000;
      getImage().then(() => {
          setTimeout(delayFn, delay);
      }).catch( err => {
          console.log(err);
      });
  } 
  setTimeout(delayFn, delay)
}






