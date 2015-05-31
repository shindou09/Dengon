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
    Site.find().exec().then(function (sites) {
        res.render('site/index', {sites: sites});
    }, function (err) {
        res.render('error', err);
    });
});

router.post('/create/', function (req, res) {
    var site = new Site(req.body);
    site.save().then(function (result) {
        res.json({success: result});
    }, function (err) {
        res.render('error', {error:err});
    });
});

router.get('/:siteId', function (req, res) {
    var siteId = req.params.siteId;
    Site.findById(siteId).exec().then(function (site) {
        console.log(site);
        res.render('site/site', {site: site});
    }, function (err) {
        res.render('error', err);
    });
});

router.post('/:siteId', function (req, res) {
    var siteId = req.params.siteId;
    var site = new Site(req.body);
    site._id = siteId;
    site.updateSite().then(function (r) {
        res.json({success: r});
    }, function (err) {
        res.render('error', err)
    });
});

module.exports = router;
