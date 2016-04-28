var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res) {
  var trackIds = [];
  request.get({url:'https://api.spotify.com/v1/search?q='+req.query.name+'&type=track'}, function(e, r, user) {
    if (user === undefined || JSON.parse(user).tracks === undefined) {
      res.render('songs', {songs: [], user: req.session.username});
    }
    else {
      var tracks = JSON.parse(user).tracks.items;
      var numTracks = Math.min(tracks.length, 5);
      for (var i = 0; i < numTracks; i++) {
        trackIds.push(tracks[i].id); 
      }
      res.render('songs', {songs: trackIds, user: req.session.username});
    }
  });
});

module.exports = router;
