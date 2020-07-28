const inputWrapper = document.getElementById("input-wrapper");
const inputArea = document.getElementById("input-area");
const words = document.getElementById("words");
const wordsPre = document.getElementById("words-pre");
const resetBtn = document.getElementById("reset-btn");

const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
const wordsList = sampleText.split(" ");

let activeWordIndex = 0;
let activeLetterIndex = 0;
let inputHistory = [];

function createWords() {
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    console.log(i, word);
    const wordNode = createWordNode(word, i);
    if (i === 0) wordNode.className = "active-word";
    wordNode.id = `word-${i}`;
    wordsPre.appendChild(wordNode);
    wordsPre.innerHTML += " ";
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

// document.getElementById("words-pre").innerText = sampleText;

function start(event) {
  //start timer
  console.log(activeWordIndex, wordsList[activeWordIndex]);
  let currentWord = wordsList[activeWordIndex];
  let currentInput = inputArea.value;
  let inputLength = currentInput.length;

  if (event.code === "Space") {
    if (inputLength == 0) {
      event.preventDefault();
      return;
    } else {
      inputHistory.push(inputArea.value);
      event.preventDefault();
      inputArea.value = "";
      activeWordIndex += 1;
      activeLetterIndex = 0;
      return;
    }
  }

  const currentLetter = document.getElementById(
    `word-${activeWordIndex}-letter-${activeLetterIndex}`
  );

  if (currentWord[activeLetterIndex] === event.key) {
    currentLetter.className = "correct";
  } else {
    currentLetter.className = "incorrect";
  }
  activeLetterIndex++;
}

function handleDelete(event) {
  if (event.key === "Backspace") {
    if (activeLetterIndex > 0) activeLetterIndex--;
    document.getElementById(
      `word-${activeWordIndex}-letter-${activeLetterIndex}`
    ).className = "";
  }
}
function reset(e) {
  //reset timer
  console.log(inputHistory);
  inputHistory = [];
  activeWordIndex = 0;
}

createWords();
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
