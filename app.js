const express = require('express')
const app = express();
const path = require('path')
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
    message:"test",
    url: '' });
})



