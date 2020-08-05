const themeOptions = $(".options-container");
const themeDict = {
  "8008": { main: "#333a45", secondary: "#f44c7f" },
  aether: { main: "#101820", secondary: "#eedaea" },
  bento: { main: "#2d394d", secondary: "#ff7a90" },
  bingsu: { main: "#b8a7aa", secondary: "#83616e" },
  botanical: { main: "#7b9c98", secondary: "#eaf1f3" },
  carbon: { main: "#313131", secondary: "#f66e0d" },
  cyberspace: { main: "#181c18", secondary: "#00ce7c" },
  dark: { main: "#111", secondary: "#eee" },
  deku: { main: "#058b8c", secondary: "#b63530" },
  dracula: { main: "#282a36", secondary: "#f2f2f2" },
  hammerhead: { main: "#030613", secondary: "#4fcdb9" },
  honey: { main: "#f2aa00", secondary: "#fff546" },
  ishtar: { main: "#202020", secondary: "#91170c" },
  laser: { main: "#221b44", secondary: "#009eaf" },
  luna: { main: "#221C35", secondary: "#F67599" },
  mashu: { main: "#2b2b2c", secondary: "#76689a" },
  matrix: { main: "#000000", secondary: "#15ff00" },
  menthol: { main: "#00c18c", secondary: "#ffffff" },
  metaverse: { main: "#232323", secondary: "#d82934" },
  miami: { main: "#f35588", secondary: "#05dfd7" },
  miami_nights: { main: "#18181a", secondary: "#e4609b" },
  mizu: { main: "#afcbdd", secondary: "#fcfbf6" },
  modern_dolch: { main: "#2d2e30", secondary: "#65d2cd" },
  nautilus: { main: "#132237", secondary: "#ebb723" },
  nord: { main: "#242933", secondary: "#d8dee9" },
  pulse: { main: "#181818", secondary: "#17b8bd" },
  red_samurai: { main: "#84202c", secondary: "#c79e6e" },
  retrocast: { main: "#07737a", secondary: "#88dbdf" },
  serika_dark: { main: "#323437", secondary: "#e2b714" },
  strawberry: { main: "#f37f83", secondary: "#fcfcf8" },
  striker: { main: "#124883", secondary: "#d7dcda" },
  taro: { main: "#b3baff", secondary: "#130f1a" },
  terminal: { main: "#191a1b", secondary: "#79a617" },
  terra: { main: "#0c100e", secondary: "#89c559" },
  vaporwave: { main: "#a4a7ea", secondary: "#e368da" },
};

Object.keys(themeDict).forEach((theme) => {
  const newElemContainer = document.createElement("div");
  const newElem = document.createElement("input");
  const newElemLabel = document.createElement("label");

  newElemContainer.className = "option";
  newElemContainer.style.background = themeDict[theme].main;
  newElemContainer.style.color = themeDict[theme].secondary;

  newElem.type = "radio";
  newElem.className = "radio";
  newElem.id = theme;
  newElem.name = "themes";

  newElemLabel.for = theme;
  newElemLabel.innerText = theme;
  newElemContainer.append(newElem, newElemLabel);
  themeOptions.append(newElemContainer);
});

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");

const optionsList = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
});

optionsList.forEach((o) => {
  o.addEventListener("click", () => {
    const theme = o.querySelector("label").innerHTML;
    setTheme(theme);
    setSelectActiveTheme();

    optionsContainer.classList.remove("active");
    setTheme(theme);
  });
});

function setTheme(theme) {
  window.localStorage.setItem("theme", theme);
  changeTheme(theme);
}

function getTheme() {
  return window.localStorage.getItem("theme");
}

function changeTheme(theme) {
  const style = document.getElementById("custom-style");
  style.href = `themes/${theme}.css`;
}

function setSelectActiveTheme() {
  const theme = getTheme();
  selected.innerHTML = theme;
  selected.style.color = themeDict[theme].main;
  selected.style.background = themeDict[theme].secondary;
}
