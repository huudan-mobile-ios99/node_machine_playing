const VLC = require('vlc-client');

const vlc = new VLC.Client({
  ip: '127.0.0.1',
  port: 8080,
  password: '1234'
});

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

(async () => {
  // Start by looping video1
  await playLoop('file:///C:/Users/User/Documents/VIDEO/video1.mp4');

  // To switch to video2 later, just call:
  // await playLoop('file:///C:/Users/User/Documents/VIDEO/video2.mp4');
})();
