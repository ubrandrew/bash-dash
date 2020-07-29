let startTime = 0;
let elapsedTime = 0;
let interval;

function startTimer(duration) {
  console.log("started");
  startTime = Date.now();
  interval = setInterval(tick, 100);
  function tick() {
    elapsedTime = Date.now() - startTime;
    console.log(elapsedTime);
    if (elapsedTime >= duration * 1000) stopTimer();
  }
}

function stopTimer() {
  clearInterval(interval);
}
