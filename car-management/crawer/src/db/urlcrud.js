const mongoose = require('mongoose');
require('./urlmodel.js');
const URLModel = mongoose.model('URLModel');
const ObjectId = mongoose.Types.ObjectId;


const add = (items) => {
    if (!items) return;
    if (!Array.isArray(items)) items = [items];
    return new Promise((resolve, reject) => {
        items.forEach(ele => {
            const urlModel = new URLModel({url: ele});
            urlModel.save(function (err, doc) {
                if (err) {
                    resolve(err);
                } else {
                    reject(doc);
                }
            })
        });
    })
}

const query = (skip, limit) => {
    const query = URLModel.find({});
    return new Promise((resolve, reject) => {
        query.skip(skip).limit(limit).exec(function (err, doc) {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        })
    }).catch(err => {
        console.log(err)
    });
}


const del = (ids) => {
    if (!ids) return;
    if (!Array.isArray(ids)) ids = [ids];
    return new Promise((resolve, reject) => {
        ids.forEach(id => {
            id = ObjectId(id);
            URLModel.deleteOne({_id: id}, function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            })
        })
    })
}


module.exports = {
    add,
    query,
    del
}

