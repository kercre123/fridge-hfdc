const VL53L0X = require('vl53l0x')
const args = [1, 0x29]
const humiditySensor = require("node-dht-sensor");
const request = require('request-promise');
const Stopwatch = require('statman-stopwatch');
const stopwatch = new Stopwatch();
const { exec } = require("child_process");
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const doAsync = require('doasync');
const fridgeFile = './fridgeOpenssave'
const ON_DEATH = require('death')({uncaughtException: true});
date_ob = new Date();
date = ("0" + date_ob.getDate()).slice(-2);
month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
year = date_ob.getFullYear();
executedGet = "false"
beenOpen = "false"
waitSec = "false"
swStarted = "false"
tempF = 0
if (fs.existsSync(__dirname + "/fridgeOpenssave")) {
fs.readFile(__dirname + "/fridgeOpenssave", (error, data) => {
    if(error) {
        throw error;
    }
    fridgeOpenTimes = parseInt(`${data.toString()}`)
});
} else {
  fridgeOpenTimes = 0
};
const Gpio = require('onoff').Gpio;
const LED = new Gpio(24, 'out');
LED.writeSync(1);
fridgeOpenTimes1 = "false"

ON_DEATH(function(signal, err) {
  LED.writeSync(0);
  console.log(`${signal}`)
  console.log(`${err}`)
  process.exit(2)
})

function msConvert(ms) {
  var seconds;
  seconds = parseInt(Math.floor(ms / 1000));
  return seconds;
};

VL53L0X(...args).then(async (vl53l0x) => {
  while(true) {
    date_ob = new Date();
    date = ("0" + date_ob.getDate()).slice(-2);
    month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    year = date_ob.getFullYear();
    hours = date_ob.getHours();
    minutes = date_ob.getMinutes();
    seconds = date_ob.getSeconds();
    if (`${minutes}` < 10) {
     rightMinutes = "0" + minutes
 } else {
     rightMinutes = minutes
 }
 if (`${hours}` < 10) {
     rightHours = "0" + hours
 } else {
     rightHours = hours
 }
 fullDate = year + "-" + month + "-" + date + " " + rightHours + ":" + rightMinutes
 distance = await vl53l0x.measure()
 humiditySensor.read(11, 4, function(err, temperature, humidity) {
   tempF = temperature * 9 / 5 + 32;
   humidityG = humidity
});
 if (`${distance}` > 100) {
     beenOpen = "true"
     if (`${swStarted}` == "false") {
         stopwatch.start();
         swStarted = "true"
     }
} else {
 if (`${beenOpen}` == "true") {
    fridgeOpenTimes = fridgeOpenTimes + 1
}
beenOpen = "false"
if (`${swStarted}` == "true" && `${waitSec}` == "true") {
  stopwatch.stop();
  if (tempF) {
   tempFinished = `${tempF}`
   humidityFinished = `${humidityG}`
} else {
   tempFinished = "Unreadable"
   humidityFinished = "Unreadable"
}
//console.log("Executing")
//console.log("./fridgeTrack.sh " + `${msConvert(stopwatch.read())} ` + `${fullDate} ` + ` ${tempFinished} ` + `${humidityFinished}`)
if ( `${tempFinished}` !== "Unreadable" ) {
exec("./fridgeTrack.sh " + `${fridgeOpenTimes} ` + `${msConvert(stopwatch.read())} ` + `${fullDate} ` + ` ${tempFinished} ` + `${humidityFinished} ` + `${waitSec}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
});
};
stopwatch.reset()
swStarted = "false"
}
}
if (`${waitSec}` == "false" && `${distance}` > 8000) {
  fridgeOpenTimes = fridgeOpenTimes - 1
  waitSec = "true"
}
await new Promise(r => setTimeout(r, 100));
}
})


app.get('/', (req, res) => {
  res.send(`Fridge opens: ${fridgeOpenTimes}, Temp: ${tempF}, Humidity: ${humidityG}, ToF: ${distance}` )
})

todayFile = `${month}-${date}-${year}`

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
