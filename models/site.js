/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-26
 * Time: 下午3:49
 * To change this template use File | Settings | File Templates.
 */

var Promise = require('promise');
function Site(o) {
    this._site = o || {};
}

Site.__promise__ = require('../db').connect();

Object.defineProperties(Site.prototype, {
    "id": {
        enumerable: true,
        get: function () {return this._site._id;},
        set: function (_id) {this._site._id = _id;}
    },
    "domain": {
        enumerable: true,
        get: function () {return this._site.domain;},
        set: function (domain) {this._site.domain = domain;}
    }
});

Site.prototype.save = function () {
    var self = this;
    return Site.__promise__.then(function (db) {
        var siteCollection = db.collection('site');
        var insertOne = Promise.denodeify(siteCollection.insertOne);
        return insertOne.apply(siteCollection, [self._site]).then(function (result) {
            db.close();
            return result;
        }, function (err) {db.close();throw new Error('数据保存错误');});
    },function (err) {throw new Error('数据库连接错误!');});
};

Site.prototype.update = function () {
    var self = this;
    if (!this._site._id) {
        return new Promise(function () {}).then(null, function () {throw new Error('_id为空');});
    }
    return Site.__promise__.then(function (db) {
        var siteCollection = db.collection('site');
        var update = Promise.denodeify(siteCollection.updateOne);
        return update.apply(siteCollection, [{"_id": self._site._id}, {$set: {"domain": self.domain}}, {w: 1}]).then(function (result) {
            db.close();
            return result;
        },function(err){db.close();throw new Error('更新数据错误!');});
    });
};

module.exports = Site;
