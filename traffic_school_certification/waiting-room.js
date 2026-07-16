const q = document.querySelector("#queue-number"),
  s = document.querySelector("#queue-status"),
  p = document.querySelector("#queue-progress"),
  e = document.querySelector("#estimate"),
  r = document.querySelector("#redirect-panel"),
  c = document.querySelector("#redirect-countdown"),
  fp = document.querySelector("#prefill-panel");
const returned = localStorage.getItem("returnedFromTip") === "true";
let current = returned ? rand(720000, 1300000) : rand(18000, 48000);
q.textContent = current.toLocaleString();
document.querySelector("#prefill-button").onclick = () =>
  (location.href = "verify_user/?prefill=1");
if (returned) {
  s.textContent = "Your prior place in line could not be restored.";
  e.textContent = "Estimated wait: approximately 3 hours, 47 minutes";
  p.style.width = "1%";
  setTimeout(() => fp.classList.remove("hidden"), 7000);
} else run();
async function run() {
  const d = rand(65000, 90000),
    start = Date.now(),
    initial = current;
  s.textContent = "Queue active. Please do not refresh this page.";
  while (Date.now() - start < d) {
    const elapsed = Date.now() - start,
      ratio = Math.min(elapsed / d, 1),
      eased = 1 - Math.pow(1 - ratio, 2.4);
    current = Math.max(
      1,
      Math.floor(initial * (1 - eased)) -
        rand(0, Math.max(2, Math.floor(initial * 0.006))),
    );
    q.textContent = current.toLocaleString();
    p.style.width = `${Math.max(2, ratio * 100)}%`;
    const left = Math.max(0, Math.ceil((d - elapsed) / 1000));
    e.textContent =
      left > 45
        ? "Estimated wait: over one minute"
        : `Estimated wait: ${left} seconds`;
    await wait(rand(700, 1600));
  }
  q.textContent = "0";
  p.style.width = "100%";
  e.textContent = "Your access window is ready.";
  s.textContent = "Preparing secure verification portal…";
  r.classList.remove("hidden");
  for (let i = 5; i >= 1; i--) {
    c.textContent = i;
    await wait(1000);
  }
  location.replace("verify_user/");
}
function wait(ms) {
  return new Promise((x) => setTimeout(x, ms));
}
function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
