/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-26
 * Time: 下午3:49
 * To change this template use File | Settings | File Templates.
 */

var Promise = require('promise');
var Site = function () {};

Site.__promise__ = require('../db').connect();

Site.prototype.constructor = function (o) {
    this._site = o || {};
};

Object.defineProperties(Site.prototype, {
    "id": {
        writable: false,
        enumerable: true,
        get: function () {return this._site._id;}
    },
    "domain": {
        writable: true,
        enumerable: true,
        get: function () {return this._site.domain;},
        set: function (domain) {this._site.domain = domain;}
    }
});

Site.prototype.save = function () {
    var self = this;
    return Site__promise__.then(function (db) {
        var siteCollection = db.collection('site');
        var insertOne = Promise.denodeify(siteCollection.insertOne);
        return insertOne(self._site).then(function (result) {
            db.close();
            return result;
        }, function (err) {throw err;});
    });
};

module.exports = Site;
