const puppeteer = require("puppeteer");
const c = require("../util/constant.js");
const random = require("../util/random.js");
const BloomFilter = new require("../util/bloomfilter.js").BloomFilter;
const request = require("../util/http.js");
const urlcrud = require('../db/urlcrud.js');


const filter = new BloomFilter(512 * 1024, 16);

// load data
filter.load("b.txt", "l.txt")

function wait () {
    setTimeout(function () {

    }, 10)
}

module.exports = function (_URL) {
    return puppeteer.launch().then( async browser => {
        const page = await browser.newPage();
    
        // count image url number
        let imgURLNumber = 0; 
    
        // identifier
        let exceptImageNumber = 0;
        let totalUrl = 0;
        // thread exit
        process.on('exit', () => {
            browser.close()
        })
    
        await page.goto(_URL)
        const frame = page.mainFrame()
    
        const parser = async () => {
            if (!frame) {
                return;
            }
            
            const urls = await frame.evaluate((totalUrl) => {
                const urls = []
                const images = document.images;
                
                const rege1 = /^(http:\/\/)|^(https:\/\/)/i;
                const rege2 = /image\.baidu\.com\/search\/index/g;
                const suffix = /(\.gif)$|(\.svg)$/i
    
                for(let i = totalUrl; i < images.length; i++) {
                    const img = images.item(i);
                    let url = img.src
                    if (rege1.test(url) && !rege2.test(url) && !suffix.test(url)) {
                        urls.push(url);
                    } 
                }
    
                return urls
    
            }, totalUrl);
            
            totalUrl += urls.length;            
            
            const postUrls = []
            urls.forEach(url => {
                if (!filter.test(url)) {
                    filter.add(url)
                    postUrls.push(url)
                }
            })

            exceptImageNumber += postUrls.length

            urlcrud.add(postUrls)

            console.log("total: " +totalUrl)
            console.log("exceptNumber: " + exceptImageNumber)

            if (exceptImageNumber < c.EXCEPTNUMBER) {
                // arrowdown key
                let keyMove = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < keyMove; i++) {
                    page.keyboard.down("ArrowDown")
                    await wait();
                }
                setTimeout(parser, random())
            }  else {
                filter.dump("b.txt", "l.txt")
            }
        }
    
        // wait for 1000ms to execute
        setTimeout(parser, 1000);
    
    }).catch(err => {
        console.log(err)
        process.exit()
    })
}