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

router.get('/', function (req, res) {
    var siteId = req.param.siteId;
    Site.findOne(siteId).then(function (site) {
        var obj = {
            domain: site.domain,
            siteId: site.id
        };
        res.render('message/index', obj);
    }, function (err) {
        res.render('error', err);
    });
});

router.post('/', function (req, res) {
    console.log(req.body);
    var message = new Message(req.body);
    message.save().then(function (result) {
        var tag = {success: result.insertedCount > 0};
        res.json(tag);
    }, function (err) {
        res.json({error: err});
    });
});

router.get('/list/:page', function (req, res) {
    var siteId = req.param.siteId;
    var page = req.param.page || 1;
    var selector = {"siteId": siteId};
    Message.count(selector).then(function (count) {
        if (count <= 0 ) {
            res.render('message/list', {list: null});
        } else {
            return Message.find(selector, {nowPage: page});
        }
    }).then(function (messages) {
            res.render('message/list', {list: messages, count: count});
        }, function (err) {
            res.render('error', err);
        });;
});

router.get('/replyList/:page', function (req, res) {
    var siteId = req.param.siteId;
    var page = req.param.page || 1;
    var selector = {"siteId": siteId};
    Message.count(selector).then(function (count) {
        if (count <= 0 ) {
            res.render('message/replyList', {list: null});
        } else {
            return Message.find(selector, {nowPage: page});
        }
    }).then(function (messages) {
            res.render('message/replyList', {list: messages, count: count});
        }, function (err) {
            res.render('error', err);
        });;
});

router.get('/reply/:messageId', function (req, res) {
    var siteId = req.param.siteId;
    var messageId = req.param.messageId;
    Message.findOne(messageId).then(function (message) {
        res.render('message/reply', {message: message});
    }, function (err) {
        res.render('error', err);
    });
});

router.put('/reply/:messageId', function (req, res) {
    var messageId = req.param.messageId;
    var message = new Message({_id: messageId});
    message.reply = req.body;
    message.doReply().then(function (result) {
        console.log(result);
        res.json({success: true});
    }, function (err) {
        res.json({error: err});
    });
});

module.exports = router;
