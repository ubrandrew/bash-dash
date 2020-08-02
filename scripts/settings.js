const t15 = document.getElementById("t-15");
const t30 = document.getElementById("t-30");
const t60 = document.getElementById("t-60");
const t120 = document.getElementById("t-120");
const tCustom = document.getElementById("t-custom");

t15.addEventListener("click", changeTime, false);
t30.addEventListener("click", changeTime, false);
t60.addEventListener("click", changeTime, false);
t120.addEventListener("click", changeTime, false);
// tCustom.addEventListener("click", changeTime, false);

const idTimeMap = {
  "t-15": [15, t15],
  "t-30": [30, t30],
  "t-60": [60, t60],
  "t-120": [120, t120],
};

function changeTime(event) {
  clearAllActiveTimes();
  DURATION = idTimeMap[event.target.id][0];
  event.target.classList.add("active");
}

function clearAllActiveTimes() {
  t15.classList.remove("active");
  t30.classList.remove("active");
  t60.classList.remove("active");
  t120.classList.remove("active");
  tCustom.classList.remove("active");
}
