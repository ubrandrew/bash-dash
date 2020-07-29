const inputWrapper = document.getElementById("input-wrapper");
const inputArea = document.getElementById("input-area");
const words = document.getElementById("words");
const wordsPre = document.getElementById("words-pre");
const resetBtn = document.getElementById("reset-btn");
const cursor = document.getElementById("cursor");
const preOffset = wordsPre.offsetTop;
const DURATION = 60;

const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
const wordsList = sampleText.split(" ");
let activeWordIndex = 0;
let activeLetterIndex = 0;
let inputHistory = [];
let shiftIndex = 0;
let current;
let correctChars = 0;
let incorrectChars = 0;

function createWords() {
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    console.log(i, word);
    const wordNode = createWordNode(word, i);
    wordNode.id = `word-${i}`;
    wordsPre.appendChild(wordNode);
    const space = document.createElement("span");
    space.innerText = " ";
    wordsPre.appendChild(space);
  }
}

function createWordNode(word, wordIdx) {
  const wordNode = document.createElement("span");
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const letterNode = document.createElement("span");
    letterNode.innerText = letter;
    letterNode.id = `word-${wordIdx}-letter-${i}`;
    wordNode.appendChild(letterNode);
  }
  return wordNode;
}

function start(event) {
  //start timer
  let currentWord = wordsList[activeWordIndex];
  let currentInput = inputArea.value;
  let inputLength = currentInput.length;
  if (event.code === "Enter") return;
  if (event.code === "Space") {
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

      if (checkShift()) {
        shift();
      }
      updateCursorLocation();

      return;
    }
  }
  if (activeWordIndex == 0 && activeLetterIndex == 0) startTimer(DURATION);

  const currentLetter = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );

  if (activeLetterIndex < currentWord.length) {
    if (currentWord[activeLetterIndex] === event.key) {
      currentLetter.className = "correct";
      correctChars++;
    } else {
      currentLetter.className = "incorrect";
      incorrectChars++;
    }
  } else {
    console.log("extra");
    const currentWordRef = document.getElementById(`word-${activeWordIndex}`);
    const newLetter = document.createElement("span");
    newLetter.id = `word-${activeWordIndex}-letter-${activeLetterIndex}`;
    newLetter.className = "incorrect";
    newLetter.innerText = event.key;
    currentWordRef.appendChild(newLetter);
  }
  activeLetterIndex++;
  updateCursorLocation();
}

function handleDelete(event) {
  if (event.key === "Backspace") {
    if (activeLetterIndex > 0) activeLetterIndex--;
    if (activeLetterIndex < wordsList[activeWordIndex].length) {
      document.getElementById(
        `word-${activeWordIndex}-letter-${activeLetterIndex}`
      ).className = "";
    } else {
      document
        .getElementById(`word-${activeWordIndex}-letter-${activeLetterIndex}`)
        .remove();
    }
  }
  updateCursorLocation();
}

function handleIncompleteWord(currentWord) {
  console.log(activeLetterIndex, currentWord.length);
  for (let i = activeLetterIndex; i < currentWord.length; i++) {
    document.getElementById(`word-${activeWordIndex}-letter-${i}`).className =
      "incorrect";
  }
}

function checkShift() {
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
    newLeft = node.offsetLeft + node.offsetWidth;
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

createWords();
updateCursorLocation();

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

$("#input-area")
  .focusin(function () {
    $("#cursor").show();
  })
  .focusout(function () {
    $("#cursor").hide();
  });

// necessary for safari tabbing to work (keycode 9 is tab)
// whenever tab is pressed while input-area is in focus, focus reset button
$("#input-area").on("keydown", function (e) {
  if (e.keyCode == 9) {
    resetBtn.focus();
    e.preventDefault();
    return false;
  }
});
