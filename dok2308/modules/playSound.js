exports.playSound = function(path) {
  var player = require('play-sound')({player: "C:/Program Files (x86)/Windows Media Player/wmplayer.exe"})
  player.play('/data/alarm.mp3', function(err){
    if (err) throw err
  })
};