let startTime = 0;
let elapsedTime = 0;
let interval;
let running = false;

function startTimer(duration) {
  running = true;
  startTime = Date.now();
  interval = setInterval(tick, 100);
  function tick() {
    elapsedTime = Date.now() - startTime;
    updateLiveStats();
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
