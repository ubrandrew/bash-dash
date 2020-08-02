//////////////////////////////////////////////////////////////////////////
// DOM references                                                       //
//////////////////////////////////////////////////////////////////////////
const inputWrapper = document.getElementById("input-wrapper");
const inputArea = document.getElementById("input-area");
const words = document.getElementById("words");
const wordsPre = document.getElementById("words-pre");
const resetBtn = document.getElementById("reset-btn");
const cursor = document.getElementById("cursor");
const results = document.getElementById("results");
const netWPM = document.getElementById("net-wpm");
const rawWPM = document.getElementById("raw-wpm");
const acc = document.getElementById("accuracy");
const liveAcc = document.getElementById("live-acc");
const liveWPM = document.getElementById("live-wpm");

//////////////////////////////////////////////////////////////////////////
// Constants                                                            //
//////////////////////////////////////////////////////////////////////////
const LINE_HEIGHT = 2;
const LINE_TO_SHIFT = 2;
const preOffset = wordsPre.offsetTop;
const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

//////////////////////////////////////////////////////////////////////////
// Test state                                                           //
//////////////////////////////////////////////////////////////////////////
let DURATION = getDuration();

const wordsList = sampleText.split(" ");
// const wordsList = generateText(500);

let activeWordIndex = 0;
let activeLetterIndex = 0;
let inputHistory = [];
let shiftIndex = 0;
let current;
let correctChars = 0;
let incorrectChars = 0;
let lastIndexOnLine = 0;
//////////////////////////////////////////////////////////////////////////
// Functions                                                            //
//////////////////////////////////////////////////////////////////////////

function createWords() {
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    const wordNode = createWordNode(word, i);
    wordNode.id = `word-${i}`;
    const space = document.createElement("span");
    space.id = `space-${i}`;
    space.innerHTML = " ";
    wordsPre.appendChild(wordNode);
    wordsPre.appendChild(space);
  }
}

function createWordNode(word, wordIdx) {
  const wordNode = document.createElement("span");
  for (let i = 0; i < word.length; i++) {
    const letterNode = document.createElement("span");
    letterNode.innerText = word[i];
    letterNode.id = `word-${wordIdx}-letter-${i}`;
    wordNode.appendChild(letterNode);
  }
  return wordNode;
}

function start(event) {
  let currentWord = wordsList[activeWordIndex];
  let currentInput = inputArea.value;
  let inputLength = currentInput.length;

  if (event.code === "Enter") return;

  cursor.className = "";
  if (event.code === "Space") {
    handleSpace(inputLength, currentWord, event);
  } else {
    handleTypedLetter(currentWord, event);
  }
}

function handleSpace(inputLength, currentWord, event) {
  if (inputLength == 0) {
    event.preventDefault();
    return;
  } else {
    if (activeLetterIndex < currentWord.length) {
      //   handleIncompleteWord();
    } else {
      // if word is completed or extra, still count space as correct
      scoreCorrectLetterTyped(); // count spaces as correct key
    }
    inputHistory.push(inputArea.value);
    if (inputArea.value === currentWord) {
      scoreWord(currentWord);
    } else {
      document.getElementById(`word-${activeWordIndex}`).className =
        "incorrect-word";
    }
    inputArea.value = "";
    activeWordIndex++;
    activeLetterIndex = 0;
    event.preventDefault();

    if (shouldShift()) {
      shift();
    }
    updateCursorLocation();
    return;
  }
}

function handleTypedLetter(currentWord, event) {
  if (isNewTest()) startTimer(DURATION);

  const currentLetter = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );

  if (activeLetterIndex < currentWord.length) {
    if (currentWord[activeLetterIndex] === event.key) {
      currentLetter.className = "correct";
      scoreCorrectLetterTyped();
    } else {
      currentLetter.className = "incorrect";
      scoreIncorrectLetterTyped();
    }
  } else {
    // extra letters typed
    if (inputArea.value.length - currentWord.length >= 10) {
      event.preventDefault();
      return;
    }
    const currentWordRef = document.getElementById(`word-${activeWordIndex}`);
    const newLetter = document.createElement("span");
    newLetter.id = `word-${activeWordIndex}-letter-${activeLetterIndex}`;
    newLetter.className = "incorrect-special";
    newLetter.innerText = event.key;
    currentWordRef.appendChild(newLetter);
    scoreIncorrectLetterTyped();
  }
  activeLetterIndex++;
  updateCursorLocation();
}

function handleDelete(event) {
  // checks if cursor to move to prev word
  if (activeLetterIndex === 0 && activeWordIndex > 0) {
    const prevWord = wordsList[activeWordIndex - 1];
    const prevInput = inputHistory[activeWordIndex - 1];
    if (prevInput !== prevWord) {
      activeWordIndex--;
      activeLetterIndex = prevInput.length;
      inputArea.value = inputHistory.pop();
      //   undoHandleIncompleteWord();
      updateCursorLocation();

      // lengths of input and words are checked because words that are incomplete do not count spaces as correct
      // we need to see if the input is complete (or in excess) to see if the space was counted or not
      if (prevInput.length >= prevWord.length) scoreCorrectLetterDeleted();
      document.getElementById(`word-${activeWordIndex}`).className = "";
      event.preventDefault();
      return;
    }
    // hcekc if prev word is correct
    // if not correct, set as active word
  } else if (activeLetterIndex > 0) {
    activeLetterIndex--;
  }
  if (activeLetterIndex < wordsList[activeWordIndex].length) {
    const prevLetter = document.getElementById(
      `word-${activeWordIndex}-letter-${activeLetterIndex}`
    );
    if (prevLetter.className === "correct") scoreCorrectLetterDeleted();
    else if (prevLetter.className === "incorrect")
      scoreIncorrectLetterDeleted();
    prevLetter.className = "";
  } else {
    document
      .getElementById(`word-${activeWordIndex}-letter-${activeLetterIndex}`)
      .remove();
    scoreIncorrectLetterDeleted();
  }
  updateCursorLocation();
}

// marks incompletely typed words as incorrect (should make a subset for extra and untryped words)
function handleIncompleteWord() {
  for (let i = activeLetterIndex; i < wordsList[activeWordIndex].length; i++) {
    document.getElementById(`word-${activeWordIndex}-letter-${i}`).className =
      "incorrect-special";
  }
}

function undoHandleIncompleteWord() {
  for (let i = activeLetterIndex; i < wordsList[activeWordIndex].length; i++) {
    document.getElementById(`word-${activeWordIndex}-letter-${i}`).className =
      "";
  }
}

// checks if words list should shift
function shouldShift() {
  const wordOffset = document.getElementById(`word-${activeWordIndex}`)
    .offsetTop;
  const fontSize = $("#words-pre").css("font-size");
  const lineHeight = parseFloat(fontSize.replace("px", "")) * LINE_HEIGHT;
  if (wordOffset - preOffset >= LINE_TO_SHIFT * lineHeight) {
    return true;
  } else {
    if (wordOffset - preOffset >= lineHeight) {
      const prevWordOffset = document.getElementById(
        `word-${activeWordIndex - 1}`
      ).offsetTop;
      if (prevWordOffset != wordOffset) {
        lastIndexOnLine = activeWordIndex;
      }
    }
    return false;
  }
}

// seems to work, just review it tommorrow
function shift() {
  let children = wordsPre.children;
  for (let i = shiftIndex; i < 2 * lastIndexOnLine; i++) {
    children[0].remove();
  }
  shiftIndex = 2 * lastIndexOnLine;
  lastIndexOnLine = activeWordIndex;
}

function updateCursorLocation() {
  let node = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );
  let newLeft;
  let newTop;
  if (!node) {
    node = document.getElementById(`space-${activeWordIndex}`);
    newLeft = node.offsetLeft - 1;
    newTop = node.offsetTop;
  } else {
    newLeft = node.offsetLeft - 1;
    newTop = node.offsetTop;
  }
  $("#cursor").stop(true, true).animate(
    {
      top: newTop,
      left: newLeft,
    },
    100
  );
}

function isNewTest() {
  return activeWordIndex == 0 && activeLetterIndex == 0 && !running;
}

function reset(e) {
  //reset timer
  stopTimer();
  console.log(inputHistory);
  wordsPre.innerHTML = "";
  inputArea.value = "";
  createWords();
  inputHistory = [];
  activeWordIndex = 0;
  activeLetterIndex = 0;
  shiftIndex = 0;
  resetScores();
  //   resetLiveStats();
  refreshTest();
  updateCursorLocation();
  inputArea.focus();
  cursor.className = "run-animation";
}

function stopTest() {
  words.style["display"] = "none";
  showResults();
  inputArea.disabled = true;
}

function refreshTest() {
  words.style["display"] = "";
  hideResults();
  inputArea.disabled = false;
  cursor.className = "";
}

function handleKeyDown(event) {
  if (event.key === "Backspace") {
    handleDelete(event);
  }
}

function initialize() {
  if (localStorage.getItem("time") === null) {
    console.log("initializing");
    initializeTime();
  } else {
    underlineActiveOption();
  }
  createWords();
  updateCursorLocation();
  inputArea.focus();
  inputArea.addEventListener("keypress", start, false);
  inputArea.addEventListener("keydown", handleKeyDown, false);
  resetBtn.addEventListener("click", reset, false);
  wordsPre.addEventListener(
    "click",
    () => {
      inputArea.focus();
    },
    false
  );
  cursor.className = "run-animation";
}

function showCursor() {
  $("#cursor").show();
}

function hideCursor() {
  $("#cursor").hide();
}

function showResults() {
  netWPM.innerText = calculateNetWPM();
  rawWPM.innerText = calculateRawWPM();
  acc.innerText = `${Math.round(calculateAccuracy())}%`;
  $("#results").show();
}

function updateLiveStats() {
  liveWPM.innerText = calculateLiveWPM();
  liveAcc.innerText = `${Math.round(calculateLiveAcc())}%`;
}

function resetLiveStats() {
  liveWPM.innerText = "--";
  liveAcc.innerText = "--";
}

function hideResults() {
  $("#results").hide();
}

//////////////////////////////////////////////////////////////////////////
// Initialization (called on start)                                     //
//////////////////////////////////////////////////////////////////////////

initialize();

//////////////////////////////////////////////////////////////////////////
// misc handlers                                                        //
//////////////////////////////////////////////////////////////////////////

$("#input-area")
  .focusin(function () {
    showCursor();
  })
  .focusout(function () {
    hideCursor();
  });

// necessary for safari tabbing to work (keycode 9 = tab)
// whenever tab is pressed while input-area is in focus, focus reset button
$("#input-area").on("keydown", function (e) {
  if (e.keyCode == 9) {
    resetBtn.focus();
    e.preventDefault();
    return false;
  }
});
