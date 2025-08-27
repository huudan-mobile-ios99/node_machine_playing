const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*'
}));

app.use('/', router);

const port = process.env.PORT || 8070;
app.listen(port);
console.log('APP NODE MACHINE PLAYING: ' + port);
const axios = require('axios');
const cron = require('node-cron');
const API_URL = 'http://192.168.101.58:8090/api/machine_online_status_floor2';
let lastLogTime = null;
const { playLoop, pause, resume, playNew, stopVideo,getInitSettings,setInitSettings } = require('./vlcControl');


router.get('/home', (req, res) => {
  return res.status(200).json({
    message: "test",
    url: ''
  });
});


// Pause current playlist
router.post('/vlc/pause', async (req, res) => {
  try {
    await pause();
    res.json({ success: true, message: 'Playlist paused' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Stop playback and clear playlist
router.post('/vlc/stop', async (req, res) => {
  try {
    await stopVideo();
    res.json({ success: true, message: 'Playback stopped and playlist cleared' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Play new video in playlist
router.post('/vlc/play', async (req, res) => {
  try {
    const { uri } = req.body;
    if (!uri) {
      return res.status(400).json({ success: false, error: 'Missing uri in body' });
    }
    await playNew(uri);
    res.json({ success: true, message: `Now playing new video: ${uri}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// Resume current playlist
router.post('/vlc/resume', async (req, res) => {
  try {
    await resume();
    res.json({ success: true, message: 'Playlist resumed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});





// Get init settings
router.get('/vlc/initsettings', (req, res) => {
  try {
    res.json({ success: true, settings: getInitSettings() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update init settings
router.post('/vlc/initsettings', (req, res) => {
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings)) {
      return res.status(400).json({ success: false, error: 'settings must be an array' });
    }
    const updated = setInitSettings(settings);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



function getTodayDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

let statusFlag = 0;
let lastHadData = null; // null means first run

cron.schedule('*/25 * * * * *', async () => {
  try {
    const today = getTodayDate();
    const currentTime = new Date();
    let diffSeconds = lastLogTime
      ? ((currentTime - lastLogTime) / 1000).toFixed(3)
      : 'N/A';
    lastLogTime = currentTime;
    const response = await axios.post(API_URL, { date: today }, {
      headers: { 'Content-Type': 'application/json' }
    });

    let data = response.data;
    let hasData = Array.isArray(data) && data.length > 0;

    // Detect state change
    if (lastHadData === null || hasData !== lastHadData) {
      // First time or state changed → reset to 0
      statusFlag = 0;
    } else {
      // Same state as before → stay at 1
      statusFlag = 1;
    }

    lastHadData = hasData;
    console.log(`[${currentTime.toLocaleTimeString()}] (+${diffSeconds}s) Data:`, {
      data,
      status: statusFlag
    });

    // Perform actions only on state change (when statusFlag === 0)
    if (statusFlag === 0) {
      if (hasData) {
        console.log("do action 2 - Has DATA");
        playLoop('file:///Users/thomas.dan/Downloads/video2.mpg');
      } else {
        console.log("do action 1 - No DATA");
        playLoop('file:///Users/thomas.dan/Downloads/video1.mpg');
      }
    }
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
  }
});
