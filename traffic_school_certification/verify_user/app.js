const REQUIRED_NAME = "Frederick";
const ACCEPTED_RELATIONSHIP = "Concerned father";
const prefill = new URLSearchParams(location.search).get("prefill") === "1";
const levels = [...document.querySelectorAll(".level")],
  bar = document.querySelector("#progress-bar"),
  pct = document.querySelector("#progress-percent"),
  label = document.querySelector("#level-label");
let nameFails = 0,
  relFails = 0,
  escapes = 0;
function show(i) {
  levels.forEach((x, j) => x.classList.toggle("active", i === j));
  const v = [20, 40, 60, 80, 100, 100][i];
  bar.style.width = v + "%";
  pct.textContent = v + "%";
  label.textContent = i < 5 ? `Level ${i + 1} of 5` : "Preview access granted";
  scrollTo({ top: 0, behavior: "smooth" });
}
if (prefill) {
  localStorage.removeItem("returnedFromTip");
  show(1);

  const prefillClues = [
    "Name must contain at least 5 letters.",
    `Viewer identity estimate: expected name length is ${REQUIRED_NAME.length}.`,
    `Identity record begins with "${REQUIRED_NAME[0]}".`,
    `Identity record ends with "${REQUIRED_NAME.at(-1)}".`,
    `Partial match: ${REQUIRED_NAME.slice(0, 2)}${"•".repeat(
      Math.max(0, REQUIRED_NAME.length - 2),
    )}`,
    `Identity record: ${REQUIRED_NAME.slice(0, -1)}•`,
    `Required legal first name: ${REQUIRED_NAME}`,
  ];

  const nameHint = document.querySelector("#name-hint");
  const nameHintList = document.querySelector("#name-hint-list");

  prefillClues.forEach((clue) => {
    const clueItem = document.createElement("li");
    clueItem.textContent = clue;
    nameHintList.appendChild(clueItem);
  });

  nameHint.classList.remove("hidden");

  document.querySelector("#relationship-hint").textContent =
    'Previously verified answer: "Concerned father."';
  document.querySelector("#relationship-hint").classList.remove("hidden");
}
const df = document.querySelector("#documents-form"),
  cp = document.querySelector("#code-panel"),
  ce = document.querySelector("#code-error");
df.onchange = () => {
  const a = new FormData(df).get("documents");
  cp.classList.toggle("hidden", a !== "yes");
  ce.classList.add("hidden");
};
df.onsubmit = (e) => {
  e.preventDefault();
  const a = new FormData(df).get("documents");
  if (a === "yes") {
    ce.textContent =
      "No matching document submission was located. Please complete the short verification form instead.";
    ce.classList.remove("hidden");
    setTimeout(() => show(1), 1800);
  } else show(1);
};
const nf = document.querySelector("#identity-form"),
  ni = document.querySelector("#viewer-name"),
  nh = document.querySelector("#name-hint"),
  nhList = document.querySelector("#name-hint-list"),
  rs = document.querySelector("#relationship"),
  rh = document.querySelector("#relationship-hint");
nf.onsubmit = (e) => {
  e.preventDefault();
  if (ni.value.trim().toLowerCase() !== REQUIRED_NAME.toLowerCase()) {
    nameFails++;
    const n = REQUIRED_NAME,
      h = [
        "Name must contain at least 5 letters.",
        `Viewer identity estimate: expected name length is ${n.length}.`,
        `Identity record begins with "${n[0]}".`,
        `Identity record ends with "${n.at(-1)}".`,
        `Partial match: ${n.slice(0, 2)}${"•".repeat(Math.max(0, n.length - 2))}`,
        `Identity record: ${n.slice(0, -1)}•`,
        `Required legal first name: ${n}`,
      ];
    const clue = h[Math.min(nameFails - 1, h.length - 1)];

    const existingClues = [...nhList.querySelectorAll("li")]
      .map(item => item.textContent);

    if (!existingClues.includes(clue)) {
      const clueItem = document.createElement("li");
      clueItem.textContent = clue;
      nhList.appendChild(clueItem);
    }

    nh.classList.remove("hidden");
    ni.focus();
    return;
  }
  if (rs.value !== ACCEPTED_RELATIONSHIP) {
    relFails++;
    rh.textContent =
      relFails < 3
        ? "Relationship could not be confirmed. Please select a more precise description."
        : 'System confidence suggests the answer contains both "concerned" and "father."';
    rh.classList.remove("hidden");
    const o = rs.selectedOptions[0];
    if (o && o.value) o.remove();
    rs.value = "";
    return;
  }
  show(2);
};

let concernFailures = 0;

document.querySelector("#concern-form").onsubmit = async (e) => {
  e.preventDefault();

  const frequency = document.querySelector("#frequency").value;
  const deadline = document.querySelector("#deadline").value;
  const priority = document.querySelector("#priority").value;
  const concernError = document.querySelector("#concern-error");

  const correctFrequency = "Every opportunity that presented itself";
  const correctDeadline = "In over two weeks";
  const correctPriority = "All of the above";

  const incorrectAnswers = [];

  if (frequency !== correctFrequency) {
    incorrectAnswers.push("asking frequency");
  }

  if (deadline !== correctDeadline) {
    incorrectAnswers.push("deadline awareness");
  }

  if (priority !== correctPriority) {
    incorrectAnswers.push("competing priorities");
  }

  if (incorrectAnswers.length > 0) {
    concernFailures++;

    const messages = [
      `Concern calibration failed. Please reconsider: ${incorrectAnswers.join(", ")}.`,
      "Your answers appear to significantly understate the documented level of parental concern.",
      "System warning: self-report does not match observed nagging frequency.",
      "Concern analysis cannot continue until historical accuracy improves.",
      "Please select the answers that most closely resemble what actually happened.",
    ];

    concernError.textContent =
      messages[Math.min(concernFailures - 1, messages.length - 1)];

    concernError.classList.remove("hidden");
    concernError.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    return;
  }

  concernError.classList.add("hidden");

  const panel = document.querySelector("#analysis-panel");
  const loader = document.querySelector("#fake-loader-bar");
  const status = document.querySelector("#analysis-status");
  const log = document.querySelector("#analysis-log");

  panel.classList.remove("hidden");
  panel.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  log.innerHTML = "";
  loader.style.width = "0%";

  for (const [message, progress] of [
    ["Checking DMV records…", 22],
    ["Reviewing call and text frequency…", 47],
    ["Comparing concern level against national dad averages…", 72],
    ["Confirming course was not remotely close to due…", 96],
    ["Applying common-sense adjustment…", 100],
  ]) {
    await wait(700);
    loader.style.width = progress + "%";

    const item = document.createElement("li");
    item.textContent = message;
    log.appendChild(item);
  }

  await wait(650);

  status.innerHTML =
    "<strong>Concern Level: 98/100.</strong><br>" +
    "Official recommendation: Trust the process.";

  await wait(2500);

  show(prefill ? 4 : 3);
};

const nt = document.querySelector("#no-tip-button"),
  tb = document.querySelector(".tip-box"),
  ps = document.querySelector("#payment-scare"),
  rb = document.querySelector("#return-waiting-room");
function scare() {
  ps.classList.remove("hidden");
  ps.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => rb.classList.remove("hidden"), 7000);
}
function evade(e) {
  e.preventDefault();

  escapes++;

  if (escapes >= 6) {
    scare();
    return;
  }

  const b = tb.getBoundingClientRect();

  const maxLeft = Math.max(10, b.width - nt.offsetWidth - 20);
  const maxTop = Math.max(90, b.height - nt.offsetHeight - 20);

  nt.style.left = rand(10, maxLeft) + "px";
  nt.style.top = rand(90, maxTop) + "px";
  nt.style.bottom = "auto";
  nt.style.transform = "none";

  // Optional progressively more desperate text
  const messages = [
    "No tip",
    "Are you sure?",
    "Really?",
    "Come on...",
    "Last chance!",
    "Fine."
  ];

  nt.textContent = messages[Math.min(escapes, messages.length - 1)];
}
nt.onclick = evade;
document.querySelectorAll(".tip-option").forEach((x) => (x.onclick = scare));
rb.onclick = () => {
  localStorage.setItem("returnedFromTip", "true");
  location.href = "../";
};
document.querySelector("#release-form").onsubmit = async (e) => {
  e.preventDefault();
  await wait(1700);
  document.querySelector("#final-queue-number").textContent = rand(
    700000,
    1300000,
  ).toLocaleString();
  show(5);
  confetti();
};
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function confetti() {
  const c = document.querySelector("#confetti-container"),
    colors = ["#155eef", "#f4b400", "#d93025", "#188038", "#9334e6"];
  for (let i = 0; i < 120; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw";
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    p.style.animationDelay = Math.random() * 0.8 + "s";
    c.appendChild(p);
    setTimeout(() => p.remove(), 6500);
  }
}
