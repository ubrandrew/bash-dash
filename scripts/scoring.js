let netCorrect = 0;
let correct = 0;
let netIncorrect = 0;
let incorrect = 0;
let netTotal = 0;
let total = 0;
let wpmChars = 0;

function scoreCorrectTyped() {
  netCorrect++;
  correct++;
  netTotal++;
  total++;
}

function scoreIncorrectTyped() {
  netIncorrect++;
  incorrect++;
  netTotal++;
  total++;
}

function scoreIncorrectDeleted() {
  incorrect--;
  total--;
}

function scoreCorrectDeleted() {
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
  return Math.round((netTotal / 5 / DURATION) * 60);
}

function calculateAccuracy() {
  return 100 * (netCorrect / netTotal);
}

function printScores() {
  console.log(calculateNetWPM());
  console.log(calculateRawWPM());
  console.log(calculateAccuracy());
}
