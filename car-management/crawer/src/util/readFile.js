var fs = require('fs')
const path = require('path')

var dirs = null

// read dir file
function readFile (d) {
    if (!fs.existsSync(d)) {
        console.log('path not exits!')
        return
    }
    var stat = fs.statSync(d)

    if (stat.isFile()) {
        if (/\.js$/.test(d)) {
            dirs.push(d)
        }
    } else {
        fs.readdirSync(d).forEach(function (dir) {
            readFile(path.join(d, dir))
        })
    }
}


// require all file
var Service = null

function load () {
    dirs.forEach(function(dir) {
        var fileName  = path.win32.basename(dir, '.js')
        Service[fileName] = require(dir)
    })
}


// interface
async function getServiceJsObject (dir) {
    dirs = []
    Service = {}
    return  await new Promise( (resolve, reject) => {
        async function _ () {
            try {
                await readFile(path.join(__dirname, dir))
                console.log(dirs)
                await load()
                resolve(Service)
            } catch (err) {
                reject(JSON.stringify(err))
            }
        }

        _()
   })
}


function getServiceJsObjectSync (dir) {
    dirs = []
    Service = {}
    readFile(path.join(__dirname,dir))
    load()
    return Service
}


// test
// var f = '../service'
/* readFile(f)
    load()
*/


module.exports = {
    getServiceJsObject,
    getServiceJsObjectSync
}