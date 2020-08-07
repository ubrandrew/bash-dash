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

//////////////////////////////////////////////////////////////////////////
// Test state                                                           //
//////////////////////////////////////////////////////////////////////////
let DURATION = 0;

let wordsList = null;

let activeWordIndex = 0;
let activeLetterIndex = 0;
let inputHistory = [];
let shiftIndex = 0;
let lastIndexOnLine = 0;

//////////////////////////////////////////////////////////////////////////
// Initialization (called on start)                                     //
//////////////////////////////////////////////////////////////////////////
window.addEventListener("load", (event) => {
  if (localStorage.getItem("theme") === null) {
    setTheme("8008");
    setSelectActiveTheme();
  } else {
    setTheme(getTheme());
    setSelectActiveTheme();
  }
});

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

$(".time-option").click(() => {
  inputArea.focus();
});

$("#lang-select").on("change", (e) => {
  setLang(e.target.value);
  reset();
});

$(".test-option").on("click", (e) => {
  reset();
});

//////////////////////////////////////////////////////////////////////////
// Functions                                                            //
//////////////////////////////////////////////////////////////////////////

function createNewTest() {
  wordsList = generateText(500);
  createWords();
}

function start(event) {
  let currentWord = wordsList[activeWordIndex];
  let currentInput = inputArea.value;
  let inputLength = currentInput.length;
  switch (event.code) {
    case "Enter":
      break;
    case "Space":
      handleSpace(inputLength, currentWord, event);
      break;
    default:
      cursor.className = "";
      handleTypedLetter(currentWord, event);
  }
}

function handleSpace(inputLength, currentWord, event) {
  if (inputLength == 0) {
    event.preventDefault();
    return;
  } else {
    if (activeLetterIndex >= currentWord.length) {
      // if word is completed or extra, still count space as correct
      scoreCorrectLetterTyped(); // count spaces as correct key
    }

    inputHistory.push(inputArea.value);
    if (inputArea.value === currentWord) {
      scoreWord(currentWord);
    } else {
      document
        .getElementById(`word-${activeWordIndex}`)
        .classList.add("incorrect-word");
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
  if (isNewTest()) {
    startTimer(DURATION);
    $(".test-hide").animate({ opacity: 0 });
  }

  const currentLetter = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );

  if (activeLetterIndex < currentWord.length) {
    if (currentWord[activeLetterIndex] === event.key) {
      currentLetter.classList.add("correct");
      scoreCorrectLetterTyped();
    } else {
      currentLetter.classList.add("incorrect");
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
    handleDeleteSpace();
    return;
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

function handleDeleteSpace() {
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
    // else scoreIncorrectLetterDeleted();
    document
      .getElementById(`word-${activeWordIndex}`)
      .classList.remove("incorrect-word", "correct");
    event.preventDefault();
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

  if (!node) {
    node = document.getElementById(`space-${activeWordIndex}`);
    if (!node) {
      return;
    }
  }

  let newLeft = node.offsetLeft - 1;
  let newTop = node.offsetTop;

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

function reset() {
  stopTimer();
  wordsPre.innerHTML = "";
  inputArea.value = "";
  createNewTest();
  inputHistory = [];
  activeWordIndex = 0;
  activeLetterIndex = 0;
  shiftIndex = 0;
  $(".test-hide").animate({ opacity: 1 });

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
  $("#progress-bar").hide();
  toggleEnglishOptions();

  if (localStorage.getItem("time") === null) {
    initializeTime();
  } else {
    DURATION = getTime();
    underlineActiveTime();
  }

  if (localStorage.getItem("test-type") === null) {
    initializeTestType();
  } else {
    underlineActiveTest();
  }

  if (localStorage.getItem("lang") === null) {
    initializeLang();
  } else {
    displaySelectedLanguage();
  }
  createNewTest();
  updateCursorLocation();
  inputArea.onpaste = (e) => e.preventDefault();
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
  inputArea.focus();
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

function showCursor() {
  $("#cursor").show();
}

function hideCursor() {
  $("#cursor").hide();
}
