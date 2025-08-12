// vlcController.js
const VLC = require('vlc-client');

const vlc = new VLC.Client({
  ip: '127.0.0.1',
  port: 8080,
  password: '1234'
});

/**
 * Plays a video in VLC and loops it indefinitely.
 * @param {string} uri - File URI in the format file:///C:/path/to/video.mp4
 */
async function playLoop(uri) {
  try {
    await vlc.emptyPlaylist();
    await vlc.addToPlaylist(uri);
    await vlc.setLooping(true);
    await vlc.playFromPlaylist(0);
    console.log(`Now looping: ${uri}`);
  } catch (err) {
    console.error('Error controlling VLC:', err);
  }
}

module.exports = { playLoop };
