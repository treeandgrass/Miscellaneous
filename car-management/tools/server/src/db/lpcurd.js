const mongoose = require('mongoose');
const LPModel = mongoose.model('LPModel');
const ObjectId = mongoose.Types.ObjectId;

// 保存多条
const save = (items) => {
    LPModel.insertMany(items, function (err) {
        if (err) console.log(err);
    })
}

//条件查询
const query = (item) => {

    let limit = item.limit, 
        index = item.index;
    
    delete item.limit;
    delete item.index;
    
    let query = LPModel.find(item);

    return new Promise((resolve, reject) => {
        query.skip(index).limit(limit).exec(function (err, doc) {
            if (err) reject(err)
            else {
                LPModel.count({}, function (err, count) {
                    if (err) reject(err)
                    else {
                        resolve({total: count, result: doc})
                    }                       
                })
            }
        })
    })
}

// 查询所有
const count = (item) => {
    return new Promise((resolve, reject) => {
        LPModel.find(item, function (err, doc) {
            if (err) reject(err)
            else  resolve(doc)                  
        })
    })
}



// 删除数据
const del = (item) => {
    return new Promise((resolve, reject) => {
        let id = ObjectId(item.id)
        LPModel.deleteOne({_id: id}, function (err, doc) {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        })
    })
}


// condition query
const queryLPByCondition = ({limit, order}) => {
    const query = LPModel.find({});
    return new Promise((resolve, reject) => {
        query.sort({ count: -1}).limit(limit).exec(function (err, doc) {
            if (err) reject(doc);
            else resolve(doc);
        })
    })
}

// update 
const update = (body) => {
    LPModel.update({lpcode: body.lpcode}, {count: body.count, time: body.time}, function (err, doc) {
        if (err) console.log(err);
    })
}

module.exports = {
    save,
    query,
    del,
    queryLPByCondition,
    update,
    count
}