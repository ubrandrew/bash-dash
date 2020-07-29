let netCorrect = 0;
let correct = 0;
let netIncorrect = 0;
let incorrect = 0;
let netTotal = 0;
let total = 0;

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
}

function printScores() {
  console.log("netCorrect: ", netCorrect);
  console.log("netIncorrect: ", netIncorrect);

  console.log("correct: ", correct);
  console.log("incorrect: ", incorrect);

  console.log("netTotal: ", netTotal);
  console.log("total: ", total);
}
