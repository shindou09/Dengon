/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-28
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */

var express = require('express');
var router = express.Router();
var Site = require('../models/site');

router.get('/', function (req, res) {
    Site.find().then(function (sites) {
        res.render('site/index', sites);
    }, function (err) {
        res.render('error', err);
    });
});

router.post('/', function (req, res) {
    var site = new Site(req.body);
    site.save().then(function (result) {
        res.json({success: result.insertedCount > 0});
    }, function (err) {
        res.render('error', err);
    });
});

router.get('/:siteId', function (req, res) {
    var siteId = req.param.siteId;
    Site.findOne(siteId).then(function (site) {
        res.render('site/site', site);
    }, function (err) {
        res.render('error', err);
    });
});

router.put('/:siteId', function (req, res) {
    var siteId = req.param.siteId;
    var site = new Site(req.body);
    site.id = siteId;
    site.update().then(function (r) {
        res.json({success:true});
    }, function (err) {
        res.render('error', err)
    });
});

module.exports = router;
