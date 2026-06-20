const INSTAGRAM_HANDLE = "honestly__isaac";

const screens = {
  intro: document.getElementById("screen-intro"),
  letter: document.getElementById("screen-letter"),
  question: document.getElementById("screen-question"),
  yes: document.getElementById("screen-yes"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

document.getElementById("btn-open").addEventListener("click", () => showScreen("letter"));
document.getElementById("btn-ask").addEventListener("click", () => showScreen("question"));

/* Floating hearts */
const heartsContainer = document.querySelector(".hearts");
const heartChars = ["💗", "💛", "💕", "✨"];

for (let i = 0; i < 18; i++) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = heartChars[i % heartChars.length];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${8 + Math.random() * 10}s`;
  heart.style.animationDelay = `${Math.random() * 8}s`;
  heart.style.fontSize = `${0.7 + Math.random() * 1.2}rem`;
  heartsContainer.appendChild(heart);
}

/* Playful "No" button */
const btnNo = document.getElementById("btn-no");
const btnYes = document.getElementById("btn-yes");
const messages = [
  "Are you sure? 🥺",
  "Pretty please?",
  "Think again 💛",
  "I'll make it special!",
  "One more chance?",
  "Yes is right there →",
];

let msgIndex = 0;

function moveNoButton() {
  const maxX = window.innerWidth - btnNo.offsetWidth - 20;
  const maxY = window.innerHeight - btnNo.offsetHeight - 20;
  const x = 20 + Math.random() * Math.max(0, maxX - 40);
  const y = 20 + Math.random() * Math.max(0, maxY - 40);

  btnNo.style.position = "fixed";
  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;
  btnNo.style.zIndex = "50";

  btnNo.textContent = messages[msgIndex % messages.length];
  msgIndex++;

  btnYes.style.transform = `scale(${1 + msgIndex * 0.04})`;
}

btnNo.addEventListener("mouseenter", moveNoButton);
btnNo.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

btnYes.addEventListener("click", () => {
  showScreen("yes");
  startConfetti();
});

/* Her wish form */
const wishForm = document.getElementById("wish-form");
const formError = document.getElementById("form-error");
const summaryCard = document.getElementById("summary-card");
const inputWhen = document.getElementById("input-when");
const inputWhere = document.getElementById("input-where");
const inputWhat = document.getElementById("input-what");

let lastMessage = "";

function buildMessage(when, where, what) {
  let msg = `I said yes! 💛💗 (@${INSTAGRAM_HANDLE})\n\n`;
  if (when) msg += `When: ${when}\n`;
  if (where) msg += `Where: ${where}\n`;
  if (what) msg += `What I'd love: ${what}\n`;
  return msg.trim();
}

wishForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const when = inputWhen.value.trim();
  const where = inputWhere.value.trim();
  const what = inputWhat.value.trim();

  if (!when && !where && !what) {
    formError.hidden = false;
    return;
  }

  formError.hidden = true;
  lastMessage = buildMessage(when, where, what);

  document.getElementById("summary-when").textContent = when || "You tell me 💛";
  document.getElementById("summary-where").textContent = where || "Anywhere with you 💗";

  const whatRow = document.getElementById("summary-what-row");
  if (what) {
    document.getElementById("summary-what").textContent = what;
    whatRow.hidden = false;
  } else {
    whatRow.hidden = true;
  }

  wishForm.hidden = true;
  summaryCard.hidden = false;
  document.querySelector("#screen-yes .sub").textContent = "Perfect — here's what you picked:";

  startConfetti();
});

document.getElementById("btn-copy").addEventListener("click", async () => {
  const toast = document.getElementById("copy-toast");
  try {
    await navigator.clipboard.writeText(lastMessage);
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
  } catch {
    toast.textContent = "Select and copy the message above 💛";
    toast.hidden = false;
  }
});

/* Confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let animating = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const colors = ["#ff6b9d", "#ffd54f", "#ffb3c6", "#fff176", "#ff8fab", "#ffffff"];

function startConfetti() {
  particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 4,
      drift: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      spin: -4 + Math.random() * 8,
    });
  }
  if (!animating) {
    animating = true;
    tick();
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let alive = 0;
  particles.forEach((p) => {
    p.y += p.speed;
    p.x += p.drift;
    p.rotation += p.spin;

    if (p.y < canvas.height + 20) alive++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (alive > 0) {
    requestAnimationFrame(tick);
  } else {
    animating = false;
  }
}
