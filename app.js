const items = [
  { name: "Banana Peel", type: "organic", img: "banana.png" },
  { name: "Plastic Bottle", type: "recyclable", img: "bottle.png" },
  { name: "Battery", type: "hazardous", img: "battery.png" }
];

const itemContainer = document.querySelector('.items');
const bins = document.querySelectorAll('.bin');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
let score = 0;
let timeLeft = 60;

// Load items
items.forEach((item, index) => {
  const el = document.createElement('img');
  el.src = `assets/images/${item.img}`;
  el.classList.add('item');
  el.draggable = true;
  el.dataset.type = item.type;
  el.id = `item-${index}`;
  el.addEventListener('dragstart', dragStart);
  itemContainer.appendChild(el);
});

function dragStart(e) {
  e.dataTransfer.setData('type', e.target.dataset.type);
  e.dataTransfer.setData('elementId', e.target.id);
}

bins.forEach(bin => {
  bin.addEventListener('dragover', e => e.preventDefault());
  bin.addEventListener('drop', e => {
    const itemType = e.dataTransfer.getData('type');
    const elementId = e.dataTransfer.getData('elementId');
    const binType = bin.dataset.type;
    const itemEl = document.getElementById(elementId);

    if (itemType === binType) {
      score += 10;
      correctSound.play();
      itemEl.remove();
    } else {
      score -= 5;
      wrongSound.play();
    }
    scoreDisplay.textContent = score;
  });
});

// Timer
const timer = setInterval(() => {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert(`⏰ Time's up! Your final score is ${score}`);
    updateLeaderboard(score);
  }
}, 1000);

// Leaderboard
function updateLeaderboard(score) {
  let scores = JSON.parse(localStorage.getItem('greenbinScores')) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem('greenbinScores', JSON.stringify(scores));

  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';
  scores.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = `#${i + 1}: ${s} pts`;
    list.appendChild(li);
  });
}

// Eco Tips
fetch('data/tips.json')
  .then(res => res.json())
  .then(tips => {
    const tipEl = document.getElementById('eco-tip');
    let i = 0;
    setInterval(() => {
      tipEl.textContent = tips[i % tips.length];
      i++;
    }, 5000);
  });