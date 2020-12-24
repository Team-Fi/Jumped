const score = location.search.match(/s=\d+/)[0].replace("s=", "");
const timer = location.search.match(/t=\d+.\d+/)[0].replace("t=", "");

document.querySelector(".score").innerHTML = score;
document.querySelector(".timer").innerHTML = timer;
document.body.style.display = "";