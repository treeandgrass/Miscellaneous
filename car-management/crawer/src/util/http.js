const https = require("https");
const fs = require('fs');
const { URL } = require('url');


function request (data, url, host, port, method) {
  
    let postData = '';
    if (!host) host = new URL(url).host;

    function createOpts (data, url, host, port, method) {
        const options = {
            hostname: host,
            port: port,
            path: url,
            method: method,
            headers: {
              'Content-Type': 'application/json',
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "gzip,deflate,sdch",
              "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
              "Cache-Control": "max-age=0",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
            }
        };

        if (data) {
            postData = Buffer.byteLength(postData);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        return options;
    }

    return new Promise((resolve, reject) => {

      const options = createOpts(data, url, host, port, method); 
      
      const req = https.request(options, (res) => {
        let chunks = []
        let headers = JSON.stringify(res.headers);
        
        res.on('data', function (chunk) {
          chunks.push(chunk);
        })

        res.on('end', async () => {
          resolve({url: url, headers: headers, chunks: chunks});
        })
      });
      
      req.on('error', (e) => {
        reject(e.message)
      });
      
      // write data to request body
      req.write(postData);
      req.end();
    })
}


module.exports = request;