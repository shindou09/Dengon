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
        }, function (err) {console.error(err);});
    });
};

module.exports = Site;
