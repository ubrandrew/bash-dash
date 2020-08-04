let startTime = 0;
let elapsedTime = 0;
let interval;
let running = false;

function startTimer(duration) {
  // show progress bar
  $("#progress-bar").show();
  running = true;
  startTime = Date.now();
  interval = setInterval(tick, 50);
  function tick() {
    elapsedTime = Date.now() - startTime;
    // updateLiveStats();
    let pctTime = 1 - elapsedTime / (duration * 1000);
    $("#progress-bar").animate(
      {
        width: `${pctTime * 100}%`,
      },
      25
    );
    if (elapsedTime >= duration * 1000) {
      stopTimer();
      stopTest();
    }
  }
}

function stopTimer() {
  // hide progress bar
  $("#progress-bar").fadeOut();
  clearInterval(interval);
  scoreLastWord(inputArea.value, wordsList[activeWordIndex]);
  running = false;
  printScores();
}
