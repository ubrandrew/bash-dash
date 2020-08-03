const t15 = document.getElementById("t-15");
const t30 = document.getElementById("t-30");
const t60 = document.getElementById("t-60");
const t120 = document.getElementById("t-120");
const t180 = document.getElementById("t-180");
const codeOpt = document.getElementById("code");
const keywordsOpt = document.getElementById("keywords");

t15.addEventListener("click", changeTime, false);
t30.addEventListener("click", changeTime, false);
t60.addEventListener("click", changeTime, false);
t120.addEventListener("click", changeTime, false);
t180.addEventListener("click", changeTime, false);
codeOpt.addEventListener("click", changeTest, false);
keywordsOpt.addEventListener("click", changeTest, false);
// tCustom.addEventListener("click", changeTime, false);

const idTimeMap = {
  "t-15": [15, t15],
  "t-30": [30, t30],
  "t-60": [60, t60],
  "t-120": [120, t120],
  "t-180": [180, t180],
};

function getTime() {
  const time = window.localStorage.getItem("time");
  return idTimeMap[time][0];
}

function setTime(time) {
  window.localStorage.setItem("time", time);
  DURATION = idTimeMap[time][0];
}

function changeTime(event) {
  setTime(event.target.id);
  underlineActiveTime();
}

function underlineActiveTime() {
  const time = window.localStorage.getItem("time");
  clearAllActiveTimes();
  idTimeMap[time][1].classList.add("active");
}

function initializeTime() {
  setTime("t-60");
  underlineActiveOption();
}

function clearAllActiveTimes() {
  t15.classList.remove("active");
  t30.classList.remove("active");
  t60.classList.remove("active");
  t120.classList.remove("active");
  t180.classList.remove("active");
}

function initializeLang() {
  setLang("Python");
}

function setLang(lang) {
  window.localStorage.setItem("lang", lang);
  displaySelectedLanguage();
}
function getLang() {
  return window.localStorage.getItem("lang");
}
function displaySelectedLanguage() {
  const item = window.localStorage.getItem("lang");
  $("#lang-select").val(item);
}

$(".time-option").click(() => {
  inputArea.focus();
});

$("#lang-select").on("change", (e) => {
  setLang(e.target.value);
  inputArea.focus();
});

function setTest(type) {
  window.localStorage.setItem("test-type", type);
}

function getTest() {
  return window.localStorage.getItem("test-type");
}

function changeTest(event) {
  setTest(event.target.innerText);
  underlineActiveTest();
}

function underlineActiveTest() {
  const type = getTest();
  clearAllActiveTestOptions();
  if (type === "code") {
    codeOpt.classList.add("active");
  } else if (type === "keywords") {
    keywordsOpt.classList.add("active");
  }
}

function clearAllActiveTestOptions() {
  codeOpt.classList.remove("active");
  keywordsOpt.classList.remove("active");
}

function initializeTestType() {
  setTest("keywords");
  underlineActiveTest();
}

$(".test-option").click(() => {
  inputArea.focus();
  if (getTest() === "code") {
    document.getElementById("eng").disabled = true;
    document.getElementById("engA").disabled = true;
    const lang = window.localStorage.getItem("lang");
    if (lang === "English (normal)" || lang === "English (advanced)") {
      setLang("Python");
      displaySelectedLanguage();
    }
  } else if (getTest() === "keywords") {
    document.getElementById("eng").disabled = false;
    document.getElementById("engA").disabled = false;
  }
});
