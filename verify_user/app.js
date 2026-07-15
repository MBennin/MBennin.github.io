const levels = [
  document.querySelector("#level-1"),
  document.querySelector("#level-2"),
  document.querySelector("#level-3"),
  document.querySelector("#certificate-reveal"),
];

const progressBar = document.querySelector("#progress-bar");
const progressPercent = document.querySelector("#progress-percent");
const levelLabel = document.querySelector("#level-label");

function showLevel(index) {
  levels.forEach((level, levelIndex) => {
    level.classList.toggle("active", levelIndex === index);
  });

  const progressValues = [33, 66, 100, 100];
  progressBar.style.width = `${progressValues[index]}%`;

  if (index < 3) {
    levelLabel.textContent = `Level ${index + 1} of 3`;
    progressPercent.textContent = `${progressValues[index]}%`;
  } else {
    levelLabel.textContent = "Verification Complete";
    progressPercent.textContent = "100%";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Level 1
document.querySelector("#auth-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const relationship = new FormData(event.currentTarget).get("relationship");

  if (relationship !== "Concerned Dad") {
    alert(
      'Verification failed. Our records strongly suggest the correct answer is "Concerned Dad."'
    );
    return;
  }

  showLevel(1);
});

// Level 2
document.querySelector("#concern-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button");
  const panel = document.querySelector("#analysis-panel");
  const loader = document.querySelector("#fake-loader-bar");
  const status = document.querySelector("#analysis-status");
  const log = document.querySelector("#analysis-log");

  submitButton.disabled = true;
  panel.classList.remove("hidden");
  log.innerHTML = "";
  loader.style.width = "0%";

  const steps = [
    ["Checking DMV records...", 22],
    ["Reviewing call and text frequency...", 47],
    ["Comparing concern level against national dad averages...", 72],
    ["Confirming course was not remotely close to due...", 96],
    ["Applying common-sense adjustment...", 100],
  ];

  for (const [message, progress] of steps) {
    await wait(700);
    loader.style.width = `${progress}%`;

    const item = document.createElement("li");
    item.textContent = message;
    log.appendChild(item);
  }

  await wait(700);
  status.innerHTML =
    "<strong>Concern Level: 98/100.</strong><br>Official recommendation: Trust the process.";

  await wait(1300);
  showLevel(2);
  submitButton.disabled = false;
});

// Level 3
document.querySelector("#release-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  button.textContent = "Locating certificate...";

  await wait(1400);
  button.textContent = "Verifying parental acknowledgement...";

  await wait(1400);
  showLevel(3);
  launchConfetti();
});

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function launchConfetti() {
  const container = document.querySelector("#confetti-container");
  const colors = ["#155eef", "#f4b400", "#d93025", "#188038", "#9334e6"];

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);

    setTimeout(() => piece.remove(), 6000);
  }
}
