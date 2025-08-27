// vlcController.js
const VLC = require('vlc-client');

const vlc = new VLC.Client({
  ip: '127.0.0.1',
  port: 8080,
  password: '1234'
});

/**
 * Plays a video in VLC, loops it indefinitely, and sets it to full-screen with proper scaling.
 * @param {string} uri - File URI in the format file:///C:/path/to/video.mp4
 */
async function playLoop(uri) {
  try {
    // Clear the playlist
    await vlc.emptyPlaylist();

    // Add the video to the playlist
    await vlc.addToPlaylist(uri);

    // Set looping to true
    await vlc.setLooping(true);

    // Play the video from the playlist
    await vlc.playFromPlaylist(0);

    // Set VLC to full-screen mode
    await vlc.setFullscreen(true);

    // Set the aspect ratio to match the screen (5200x1664 ? 3.13:1, closest standard is 16:5)
    await vlc.setAspectRation('16:5');

    console.log(`Now looping: ${uri} in full-screen mode with aspect ratio 16:5`);
  } catch (err) {
    console.error('Error controlling VLC:', err);
  }
}


async function pause() {
  try {
    await vlc.pause();
    console.log('Playlist paused');
  } catch (err) {
    console.error('Error pausing:', err);
  }
}


async function resume() {
  try {
    await vlc.play();
    console.log('Playlist resumed');
  } catch (err) {
    console.error('Error resuming:', err);
  }
}

async function playNew(uri) {
  try {
    await vlc.emptyPlaylist();
    await vlc.addToPlaylist(uri);
    await vlc.setLooping(true);
    await vlc.playFromPlaylist(0);
    await vlc.setFullscreen(true);
    await vlc.setAspectRation('16:5');

    console.log(`Now playing new video: ${uri}`);
  } catch (err) {
    console.error('Error playing new video:', err);
  }
}




async function stopVideo() {
  try {
    await vlc.stop();
    await vlc.emptyPlaylist();
    console.log('Playback stopped and playlist cleared');
  } catch (err) {
    console.error('Error stopping playback:', err);
  }
}

module.exports = { playLoop, pause, resume, playNew, stopVideo };
