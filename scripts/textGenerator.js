function createWords() {
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    const wordNode = createWordNode(word, i);
    wordNode.id = `word-${i}`;
    // wordNode.classList.add("fade-in");

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

function generateText(length) {
  const currentMode = getTest();
  const currentLang = getLang();
  let wordBank;
  switch (currentLang) {
    case "English (normal)":
      wordBank = englishNormal;
      break;
    case "English (advanced)":
      wordBank = englishAdvanced;
      break;
    default:
      wordBank = pythonKeywords;
  }
  let lst = [];
  for (let i = 0; i < length; i++) {
    const randi = Math.floor(Math.random() * wordBank.length);
    const rand = wordBank[randi];
    lst.push(rand);
  }
  return lst;
}
