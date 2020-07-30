let startTime = 0;
let elapsedTime = 0;
let interval;
let running = false;
function startTimer(duration) {
  running = true;
  startTime = Date.now();
  interval = setInterval(tick, 1000);
  function tick() {
    console.log(calculateLiveWPM());
    elapsedTime = Date.now() - startTime;
    if (elapsedTime >= duration * 1000) stopTimer();
  }
}

function stopTimer() {
  clearInterval(interval);
  scoreLastWord(inputArea.value, wordsList[activeWordIndex]);
  running = false;
  stopTest();
  printScores();
}
