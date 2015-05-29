/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-28
 * Time: 下午1:33
 * To change this template use File | Settings | File Templates.
 */

var Promise = require('promise');
function Message(o) {
    this._message = o || {};
}

Message.__promise__ = require('../db').connect();

Object.defineProperties(Message.prototype, {
    "id": {
        enumerable: true,
        get: function () {return this._message._id;},
        set: function (_id) {this._message._id = _id;}
    },
    "name": {
        enumerable: true,
        get: function () {return this._message.name;},
        set: function (name) {return this._message.name = name;}
    },
    "phone": {
        enumerable: true,
        get: function () {return this._message.phone;},
        set: function (phone) {this._message.phone = phone;}
    },
    "email": {
        enumerable: true,
        get: function () {return this._message.email;},
        set: function (email) {return this._message.email = email;}
    },
    "title": {
        enumerable: true,
        get: function () {return this._message.title;},
        set: function (title) {this._message.title = title;}
    },
    "date": {
        enumerable: true,
        get: function () {return this._message.date;},
        set: function (date) {this._message.date = date;}
    },
    "contents": {
        enumerable: true,
        get: function () {return this._message.contents;},
        set: function (contents) {this._message.contents = contents;}
    },
    "isReply": {
        enumerable: true,
        get: function () {return this._message.isReply;},
        set: function (isReply) {this._message.isReply = isReply;}
    },
    "reply" : {
        enumerable: true,
        get: function () {return this._message.reply;},
        set: function (reply) {this._message.reply = reply}
    },
    "site": {
        enumerable: true,
        get: function () {return this._message.site;},
        set: function (site) {this._message.site = site;}
    },
    "siteId": {
        enumerable: true,
        get: function () {return this._message.siteId;},
        set: function (siteId) {this._message.siteId = siteId;}
    }
});

Message.prototype.save = function () {
    var self = this;
    return Message.__promise__.then(function (db) {
        var messageCollection = db.collection('message');
        var insertOne = Promise.denodeify(messageCollection.insertOne);
        return insertOne.apply(messageCollection, [self._message, {w: 1}]).then(function (r) {
            db.close();
            return r;
        }, function (err) {db.close();throw new Error("留言插入错误!");});
    }, function (err) {
        throw new Error("数据库连接失败!");
    });
};

Message.prototype.doReply = function () {
    var self = this;
    return Message.__promise__.then(function (db) {
        var messageCollection = db.collection('message');
        var updateOne = messageCollection.updateOne;
        return updateOne.apply(messageCollection, [{"_id": self._message._id}, {$set: {"isReply":true, "reply": self._message.reply}}]).then(function (result) {
            db.close();
            return result;
        }, function (err) {db.close();throw new Error('留言更新错误');});
    }, function (err) {throw new Error('数据库连接错误!')});
};

Message.find = function (selector,options) {
    options = options || {sort: [['date',-1]],nowPage:1,pageSize:10};
    var sort = options.sort;
    var skip = (options.nowPage -1) * options.pageSize;
    var limit = options.pageSize;
    return Message.__promise__.then(function (db) {
        var messageCollection = db.collection('message');
        var cursor = messageCollection.find(selector).skip(skip).limit(limit).sort(sort);
        var toArray = Promise.denodeify(cursor.toArray);
        return toArray.apply(cursor).then(function (docs) {
            db.close();
            var messages = docs.map(function (doc) {
                return new Message(doc);
            });
            return messages;
        }, function (err) {db.close();throw new Error('查询错误!');});
    }, function (err) {throw new Error('数据库连接错误!');});
};

Message.count = function (selector) {
    return Message.__promise__.then(function (db) {
        var messageCollection = db.collection('message');
        var count = Promise.denodeify(messageCollection.count);
        return count.apply(messageCollection).then(function (count) {
            db.close();
            return count;
        }, function (err) {throw new Error('查询错误!');});
    }, function (err) {throw new Error('数据库连接错误!');});
};

Message.findOne = function (_id) {
    return Site.__promise__.then(function (db) {
        var messageCollection = db.collection('message');
        var findOne = Promise.denodeify(messageCollection.findOne);
        return findOne.apply(messageCollection, [{"_id": _id}]).then(function (doc) {
            db.close();
            return new Message(doc);
        }, function (err) {db.close();throw new Error('查询错误!');});
    }, function (err) {throw new Error('数据库连接错误!');});
};

