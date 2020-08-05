function generateText(length) {
  const currentMode = getTest();
  const currentLang = getLang();
  let wordBank, symbolBank;
  switch (currentLang) {
    case "Python":
      wordBank = pythonKeywords;
      symbolBank = pythonSymbols;
      break;
    case "JavaScript":
      wordBank = javascriptKeywords;
      symbolBank = javascriptSymbols;

      break;
    case "C":
      wordBank = cKeywords;
      symbolBank = cSymbols;

      break;
    case "Go":
      wordBank = goKeywords;
      symbolBank = goSymbols;

      break;
    case "Java":
      wordBank = javaKeywords;
      symbolBank = javaSymbols;
      break;
    case "English (normal)":
      wordBank = englishNormal;
      break;
    case "English (advanced)":
      wordBank = englishAdvanced;
      break;
    default:
      wordBank = pythonKeywords;
      symbolBank = pythonSymbols;
  }

  let lst = [];
  for (let i = 0; i < length; i++) {
    let randi, rand;
    if (
      currentLang === "English (normal)" ||
      currentLang === "English (advanced)"
    ) {
      randi = Math.floor(Math.random() * wordBank.length);
      rand = wordBank[randi];
    } else {
      const randNum = Math.random();
      if (randNum >= 0.4) {
        randi = Math.floor(Math.random() * wordBank.length);
        rand = wordBank[randi];
      } else {
        randi = Math.floor(Math.random() * symbolBank.length);
        rand = symbolBank[randi];
      }
    }
    lst.push(rand);
  }
  return lst;
}

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
