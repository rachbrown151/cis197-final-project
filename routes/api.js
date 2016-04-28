var jquery = require('jquery');

var express = require('express');
var router = express.Router();
var reviewsDb = require('../db/reviews');

router.get('/all', function (req, res, next) {
  reviewsDb.getAllReviews(function (err, reviews) {
    if (err) {
      next(err);
    } else {
      console.log(reviews);
      return res.json(reviews);
    }
  });
});

router.post('', function (req, res, next) {
  getSongs(req.params.song);
  /*$.ajax({
    url: 'https://api.spotify.com/v1/search',
    data: {
      q: req.params.song,
      type: 'song'
    },
      success: function (response) {
        console.log(response);
    }
  }); */
});

router.get('/search/:className', function (req, res, next) {
  reviewsDb.getReviewsByClassName(req.params.className, function (err, reviews) {
    if (err) {
      next(err);
    } else {
      return res.json(reviews);
    }
  });
});

module.exports = router;
