let netCorrect = 0;
let correct = 0;
let netIncorrect = 0;
let incorrect = 0;
let netTotal = 0;
let total = 0;
let wpmChars = 0;

function scoreCorrectLetterTyped() {
  netCorrect++;
  correct++;
  netTotal++;
  total++;
}

function scoreIncorrectLetterTyped() {
  netIncorrect++;
  incorrect++;
  netTotal++;
  total++;
}

function scoreIncorrectLetterDeleted() {
  incorrect--;
  total--;
}

function scoreCorrectLetterDeleted() {
  correct--;
  total--;
}

function resetScores() {
  netCorrect = 0;
  correct = 0;
  netIncorrect = 0;
  incorrect = 0;
  netTotal = 0;
  total = 0;
  wpmChars = 0;
}

function scoreWord(word) {
  // +1 is for space
  wpmChars += word.length + 1;
}

function scoreLastWord(input, lastWord) {
  if (input.length > lastWord.length) return;

  let tempCount = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== lastWord[i]) return;
    else tempCount++;
  }
  wpmChars += tempCount;
}

function calculateNetWPM() {
  return Math.round((wpmChars / 5 / DURATION) * 60);
}

function calculateRawWPM() {
  return Math.round((total / 5 / DURATION) * 60);
}

function calculateAccuracy() {
  return 100 * (netCorrect / netTotal);
}

function calculateLiveWPM() {
  if (elapsedTime === 0) return 0;
  console.log(elapsedTime / 1000);
  return Math.round((wpmChars / 5 / (elapsedTime / 1000)) * 60);
}

function calculateLiveAcc() {
  if (elapsedTime === 0) return 100;
  return calculateAccuracy();
}
function printScores() {
  console.log(calculateNetWPM());
  console.log(calculateRawWPM());
  console.log(calculateAccuracy());
}
