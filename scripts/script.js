//////////////////////////////////////////////////////////////////////////
// DOM references                                                       //
//////////////////////////////////////////////////////////////////////////
const inputWrapper = document.getElementById("input-wrapper");
const inputArea = document.getElementById("input-area");
const words = document.getElementById("words");
const wordsPre = document.getElementById("words-pre");
const resetBtn = document.getElementById("reset-btn");
const cursor = document.getElementById("cursor");

//////////////////////////////////////////////////////////////////////////
// Constants                                                            //
//////////////////////////////////////////////////////////////////////////
const preOffset = wordsPre.offsetTop;
const DURATION = 5;
const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

//////////////////////////////////////////////////////////////////////////
// Test state                                                           //
//////////////////////////////////////////////////////////////////////////
const wordsList = sampleText.split(" ");
let activeWordIndex = 0;
let activeLetterIndex = 0;
let inputHistory = [];
let shiftIndex = 0;
let current;
let correctChars = 0;
let incorrectChars = 0;

//////////////////////////////////////////////////////////////////////////
// Functions                                                            //
//////////////////////////////////////////////////////////////////////////

function createWords() {
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    const wordNode = createWordNode(word, i);
    wordNode.id = `word-${i}`;
    const space = document.createElement("span");
    space.innerText = " ";
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

  if (event.code === "Space") {
    handleSpace(inputLength, currentWord, event);
    return;
  }

  handleTypedLetter(currentWord, event.key);
  return;
}

function handleSpace(inputLength, currentWord, event) {
  if (inputLength == 0) {
    event.preventDefault();
    return;
  } else {
    if (activeLetterIndex < currentWord.length) {
      handleIncompleteWord(currentWord);
    }
    inputHistory.push(inputArea.value);
    event.preventDefault();
    inputArea.value = "";
    activeWordIndex++;
    activeLetterIndex = 0;

    if (shouldShift()) {
      shift();
    }
    updateCursorLocation();
    return;
  }
}

function handleTypedLetter(currentWord, key) {
  if (isNewTest()) startTimer(DURATION);

  const currentLetter = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );

  if (activeLetterIndex < currentWord.length) {
    if (currentWord[activeLetterIndex] === key) {
      currentLetter.className = "correct";
      scoreCorrectTyped();
    } else {
      currentLetter.className = "incorrect";
      scoreIncorrectTyped();
    }
  } else {
    // extra letters typed
    const currentWordRef = document.getElementById(`word-${activeWordIndex}`);
    const newLetter = document.createElement("span");
    newLetter.id = `word-${activeWordIndex}-letter-${activeLetterIndex}`;
    newLetter.className = "incorrect";
    newLetter.innerText = key;
    currentWordRef.appendChild(newLetter);
    scoreIncorrectTyped();
  }
  activeLetterIndex++;
  updateCursorLocation();
}

function handleDelete(event) {
  if (event.key === "Backspace") {
    if (activeLetterIndex > 0) activeLetterIndex--;
    if (activeLetterIndex < wordsList[activeWordIndex].length) {
      const prevLetter = document.getElementById(
        `word-${activeWordIndex}-letter-${activeLetterIndex}`
      );
      if (prevLetter.className === "correct") scoreCorrectDeleted();
      else if (prevLetter.className === "incorrect") scoreIncorrectDeleted();
      prevLetter.className = "";
    } else {
      document
        .getElementById(`word-${activeWordIndex}-letter-${activeLetterIndex}`)
        .remove();
      scoreIncorrectDeleted();
    }
    updateCursorLocation();
  }
}

function handleIncompleteWord(currentWord) {
  console.log(activeLetterIndex, currentWord.length);
  for (let i = activeLetterIndex; i < currentWord.length; i++) {
    document.getElementById(`word-${activeWordIndex}-letter-${i}`).className =
      "incorrect";
  }
}

function shouldShift() {
  const wordOffset = document.getElementById(`word-${activeWordIndex}`)
    .offsetTop;
  const fontSize = $("#words-pre").css("font-size");
  const lineHeight = parseFloat(fontSize.replace("px", "")) * 1.5;
  console.log(wordOffset, fontSize, lineHeight);
  if (wordOffset - preOffset >= 2 * lineHeight) {
    console.log("SHIFT!");
    return true;
  } else {
    return false;
  }
}

function shift() {
  let children = wordsPre.children;
  console.log(children, activeWordIndex);
  for (let i = shiftIndex; i < 2 * activeWordIndex; i++) {
    children[0].remove();
  }
  shiftIndex = 2 * activeWordIndex;
}

function reset(e) {
  //reset timer
  console.log(inputHistory);
  wordsPre.innerHTML = "";
  inputArea.value = "";
  createWords();
  inputHistory = [];
  activeWordIndex = 0;
  activeLetterIndex = 0;
  shiftIndex = 0;
  updateCursorLocation();
  stopTimer();
  inputArea.focus();
}

function updateCursorLocation() {
  let node = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );
  let newLeft;
  let newTop;
  if (!node) {
    node = document.getElementById(
      `word-${activeWordIndex}-letter-${activeLetterIndex - 1}`
    );
    newLeft = node.offsetLeft + node.offsetWidth - 1;
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
  return activeWordIndex == 0 && activeLetterIndex == 0;
}

function initialize() {
  createWords();
  updateCursorLocation();
  inputArea.focus();
  inputArea.addEventListener("keypress", start, false);
  inputArea.addEventListener("keydown", handleDelete, false);
  resetBtn.addEventListener("click", reset, false);
  words.addEventListener(
    "click",
    () => {
      inputArea.focus();
    },
    false
  );
}

function showCursor() {
  $("#cursor").show();
}

function hideCursor() {
  $("#cursor").hide();
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
