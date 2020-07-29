let startTime = 0;
let interval;

function startTimer(duration, callback) {
  console.log("started");
  startTime = Date.now();
  interval = setInterval(tick, 100);
  function tick() {
    var delta = Date.now() - startTime;
    console.log(delta);
    if (delta >= duration * 1000) stopTimer();
  }
  console.log("!@!@#!");
}

function stopTimer(callback) {
  clearInterval(interval);
  callback();
}

// var start = Date.now();
// setInterval(function () {
//   var delta = Date.now() - start; // milliseconds elapsed since start

//   output(Math.floor(delta / 1000)); // in seconds
//   // alternatively just show wall clock time:
//   output(new Date().toUTCString());
// }, 1000); // update about every second
