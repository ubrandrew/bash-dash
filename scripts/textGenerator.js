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

function generateText(length) {
  let lst = [];
  for (let i = 0; i < length; i++) {
    const randi = Math.floor(Math.random() * pythonKeywords.length);
    const rand = pythonKeywords[randi];
    lst.push(rand);
  }

  return lst;
}
