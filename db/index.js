/**
 * Created by Administrator on 15-5-26.
 */

var Promise = require('promise');
var config = require('../config');
var MongoClient = require('mongodb').MongoClient;
var DB = {
    connect: function () {
        return Promise.denodeify(MongoClient.connect)(config.DB_url);
    }
};
module.exports = DB;
