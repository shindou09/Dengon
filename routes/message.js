/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-29
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
*/

var express = require('express');
var router = express.Router();
var Site = require('../models/site');
var Message = require('../models/message');
var moment = require('moment');

router.get('/site/:siteId', function (req, res) {
    var siteId = req.params.siteId;
    Site.findById(siteId).exec().then(function (site) {
        var obj = {
            domain: site.domain,
            siteId: site.id
        };
        res.render('message/index', obj);
    }, function (err) {
        res.render('error', err);
    });
});

router.post('/site/:siteId', function (req, res) {
    var message = new Message(req.body);
    message.siteId = req.params.siteId;
    message.save().then(function (result) {
        var tag = {success: result};
        res.json(tag);
    }, function (err) {
        res.json({error: err});
    });
});

router.get('/site/:siteId/list/:page', function (req, res) {
    var siteId = req.params.siteId;
    var page = req.params.page || 1;
    var pageSize = 10;
    var skip = (page - 1) * pageSize;
    var selector = {"siteId": siteId};
    Message.count(selector).exec().then(function (count) {
        if (count <= 0 ) {
            res.render('message/list', {list: null});
        } else {
            Message.find(selector, null, {skip: skip, limit: pageSize, sort: {"date": -1}}).exec().then(function (messages) {
                var pageNumber = Math.ceil(count / pageSize);
                res.render('message/list', {"siteId": siteId, list: messages, isNextPage: page < pageNumber, isPrePage: page > pageNumber, currentPage: page});
            });
        }
    });
});

router.get('/site/:siteId/replyList/:page', function (req, res) {
    var siteId = req.params.siteId;
    var page = req.params.page || 1;
    var pageSize = 10;
    var skip = (page - 1) * pageSize;
    var selector = {"siteId": siteId};
    Message.count(selector).exec().then(function (count) {
        console.log(count);
        if (count <= 0 ) {
            res.render('message/replyList', {list: null});
        } else {
            return Message.find(selector, null, {skip: skip, limit: pageSize, sort: {"date": -1}}).exec().then(function(messages) {
                var pageNumber = Math.ceil(count / pageSize);
                res.render('message/replyList', {siteId: siteId, list: messages, isNextPage: page < pageNumber, isPrePage: page > pageNumber,currentPage: page});
            });
        }
    });
});

router.get('/site/:siteId/reply/:messageId', function (req, res) {
    var siteId = req.params.siteId;
    var messageId = req.params.messageId;
    Message.findById(messageId).exec().then(function (message) {
        res.render('message/reply', {message: message, siteId: siteId});
    }, function (err) {
        res.render('error', err);
    });
});

router.post('/site/:siteId/reply/:messageId', function (req, res) {
    var messageId = req.params.messageId;
    var message = new Message({_id: messageId});
    console.log(req.body);
    message.isReply=true;
    message.reply =req.body;
//    message.reply.contents = req.body.contents;
//    message.reply.date = moment(req.body.date, 'YYYY-MM-DD HH:mm:ss');
    message.doReply().then(function (result) {
        res.json({success: result});
    }, function (err) {
        res.json({error: err});
    });
});

module.exports = router;
