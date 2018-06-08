const fastify = require('fastify')();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const concat = require('concat-stream')
const pump = require('pump')
const uuidv1 = require('uuid/v1');

fastify.register(require('fastify-multipart'))




// init db connection
require('mongoose').connect('mongodb://localhost/car-management').catch(err => {
    console.log(err);
});

require('./db/lpmodel.js');
// load db method
LPCURD = require('./db/lpcurd.js');


// middleware
fastify.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}));

// static resource
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  })



let sourceDir, targetDir;


let checkRootPath = (reply) => {
    if (sourceDir == undefined || targetDir == undefined) reply.code(500).send({results: 'error', redirect: 'http://localhost:3000'});
}



// 设置目标地址和源地址
fastify.get('/path', function (request, reply) {
    sourceDir = request.query.sourceDir;
    targetDir = request.query.targetDir;
    try {
        let sourceStat = fs.statSync(sourceDir);
        let targetStat = fs.statSync(targetDir);
    } catch(err) {
        reply.code(500).send({msg: 'this is not dircoty'});
        return;
    }

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
    reply.send();

});

// 获取给定目录下所有文件路径
fastify.get('/getallpath', (request, reply) => {
    
    checkRootPath(reply);
    
    const results = [];

    if (!fs.existsSync(sourceDir)) {
        reply.send();
        return;
    }

    fs.readdir(sourceDir, (err, files) => {
        files.forEach(file => {
            let filePath = path.join(sourceDir, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) results.push(filePath);
        })

        reply.send(JSON.stringify({results: results}));
    })
})

// 保存图片
fastify.get('/save', function (request, reply) {
    checkRootPath(reply);
    
    const newName = request.query.newName;
    const oldName = request.query.oldName;
    const suffix = oldName.split('.').pop();

    const targetPath = targetDir + '/' + [newName, '.', suffix].join('');
    let sourcePath;
    if (!/:/.test(oldName)) sourcePath = sourceDir + '/' + oldName;
    else sourcePath = oldName;

    fs.copyFile(sourcePath, targetPath, function (err) {
        if (err) console.log(err);
        else fs.unlink(sourcePath);
        reply.send(); 
    });

})

// 查询图片
fastify.get('/query', function (request, reply) {
    checkRootPath(reply);

    const name = request.query.name;
    const sourcePath = name;

    fs.readFile(sourcePath, function (err, data) {
        reply.send(data);
    });
})

// 删除图片数据
fastify.get('/delete', function (request, reply) {
    const filePath =  request.query.name;
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
            reply.send(JSON.stringify(err));
            return;
        } else {
            reply.send();
        }
    })
})


// 数据采集
fastify.route({
    method: 'POST',
    url: '/uploadcameraimage',
    handler: (request, reply) =>{

        const mp = request.multipart(handler, function (err) {
            reply.code(200).send()
          })
        
          
        
          mp.on('field', function (key, value) {
            let base64Data = value.replace(/^data:image\/jpeg;base64,/, "");
            let uuid = uuidv1();
            let dircoty = './images/'
            if (!fs.existsSync(dircoty)) fs.mkdir(dircoty)
            let imagefilename = dircoty + uuid + '.jpg'
            fs.writeFile(imagefilename, base64Data, 'base64', function(err) {
                if (err) console.log(err)
            });
          })
        
          function handler (field, file, filename, encoding, mimetype) {
                pump(file, fs.createWriteStream('../images'))
          }
    }
})


// 数据保存车牌号
fastify.route({
    url: '/savelpcode',
    method: 'POST',
    handler: (request, reply) => {
        try {
            let queryItems = {lpcode: request.body.lpcode}
            LPCURD.count(queryItems).then(doc => {
                if (doc.length > 0) {
                    let item = doc.pop();
                    console.log(doc)
                    let body = JSON.parse(JSON.stringify(request.body));
                    body.count = item.count + 1;
                    LPCURD.update(body)
                } else {
                    LPCURD.save([request.body]);
                }
                reply.code(200).send();
            }).catch(err => {
                console.log(err)
                reply.code(500).send();
            })
        } catch (err) {
            console.log(err);
            reply.code(500).send();
        }
    }
})


// 车牌号查询
fastify.route({
    url: '/lprsearch',
    method: 'POST',
    handler: (request, reply) => {
        LPCURD.query(request.body).then((doc) => {
            reply.send(JSON.stringify(doc))
        }).catch(err => {
            reply.code(500).send();
        });
    }
})




// 车牌删除
fastify.route({
    url: '/lpdelete',
    method: 'POST',
    handler: (request, reply) => {
        LPCURD.del(request.body).then((doc) => {
            reply.code(200).send()
        }).catch(err => {
            console.log(err)
            reply.code(500).send();
        });
    }
})


// 前十车牌查询
fastify.route({
    url: '/querylpbycondition',
    method: 'POST',
    handler: function (request, reply) {
        LPCURD.queryLPByCondition(request.body).then(doc => {
            reply.send(JSON.stringify(doc));
        }).catch (err => {
            console.log(err);
        })
    }
})

// 启动程序
const start = async () => {
    fastify.listen(9000, err => {
        if (err) {
            console.log(err);
            process.exit(1);
        } 
    })
}





start();


