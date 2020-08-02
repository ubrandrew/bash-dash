const t15 = document.getElementById("t-15");
const t30 = document.getElementById("t-30");
const t60 = document.getElementById("t-60");
const t120 = document.getElementById("t-120");
const t180 = document.getElementById("t-180");
const t300 = document.getElementById("t-300");

t15.addEventListener("click", changeTime, false);
t30.addEventListener("click", changeTime, false);
t60.addEventListener("click", changeTime, false);
t120.addEventListener("click", changeTime, false);
t180.addEventListener("click", changeTime, false);
t300.addEventListener("click", changeTime, false);

// tCustom.addEventListener("click", changeTime, false);

const idTimeMap = {
  "t-15": [15, t15],
  "t-30": [30, t30],
  "t-60": [60, t60],
  "t-120": [120, t120],
  "t-180": [180, t180],
  "t-300": [300, t300],
};

function changeTime(event) {
  window.localStorage.setItem("time", event.target.id);
  DURATION = idTimeMap[event.target.id][0];
  underlineActiveOption();
}

function clearAllActiveTimes() {
  t15.classList.remove("active");
  t30.classList.remove("active");
  t60.classList.remove("active");
  t120.classList.remove("active");
  t180.classList.remove("active");
  t300.classList.remove("active");
}

function initializeTime() {
  window.localStorage.setItem("time", "t-60");
  DURATION = idTimeMap["t-60"][0];
  underlineActiveOption();
}

function underlineActiveOption() {
  const time = window.localStorage.getItem("time");
  clearAllActiveTimes();
  idTimeMap[time][1].classList.add("active");
}

function getDuration() {
  const time = window.localStorage.getItem("time");
  return idTimeMap[time][0];
}

$(".time-option").click(() => {
  inputArea.focus();
});

$(".lang-option").select(() => {
  inputArea.focus();
});
