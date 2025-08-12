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

router.get('/home', (req, res) => {
  return res.status(200).json({
    message: "test",
    url: ''
  });
});

const axios = require('axios');
const cron = require('node-cron');
const API_URL = 'http://192.168.101.58:8090/api/machine_online_status_floor2';
let lastLogTime = null;

function getTodayDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

let statusFlag = 0;
let lastHadData = null; // null means first run

cron.schedule('*/5 * * * * *', async () => {
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
        console.log("do action 2");
      } else {
        console.log("do action 1");
      }
    }
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
  }
});
