
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const accessScreen = $("#access-screen");
const dashboard = $("#dashboard");

$("#enter-system").addEventListener("click", () => {
  accessScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");
  localStorage.setItem("alphaCorrectionsEntered", "1");
});

if (localStorage.getItem("alphaCorrectionsEntered") === "1") {
  accessScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");
}

$$("[data-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = document.getElementById(btn.dataset.modal);
    modal.classList.remove("hidden");
  });
});

$$(".close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").classList.add("hidden");
  });
});

$$(".modal").forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});

const ackBoxes = $$(".ack");
const ackButton = $("#acknowledge-btn");
const ackResult = $("#ack-result");

function updateAckButton() {
  ackButton.disabled = !ackBoxes.every(cb => cb.checked);
}

ackBoxes.forEach(cb => cb.addEventListener("change", updateAckButton));

if (localStorage.getItem("alphaCorrectionAcknowledged") === "1") {
  ackBoxes.forEach(cb => cb.checked = true);
  ackButton.disabled = false;
  ackResult.classList.remove("hidden");
  $("#correction-status").textContent = "CORRECTION: ACKNOWLEDGED";
}

ackButton.addEventListener("click", () => {
  localStorage.setItem("alphaCorrectionAcknowledged", "1");
  ackResult.classList.remove("hidden");
  $("#correction-status").textContent = "CORRECTION: ACKNOWLEDGED";
});

$("#archive-submit").addEventListener("click", () => {
  const symbol = $("#cred-symbol").value.trim().toUpperCase();
  const id = $("#cred-id").value.trim();
  const keyword = $("#cred-keyword").value.trim().toUpperCase();

  const symbolOK = ["Δ", "DELTA"].includes(symbol);
  const idOK = id === "29";
  const keywordOK = keyword === "ORIGIN";

  if (symbolOK && idOK && keywordOK) {
    $("#archive-error").classList.add("hidden");
    $("#archive-modal").classList.add("hidden");
    const echoModal = $("#echo-modal");
    echoModal.classList.remove("hidden");
    localStorage.setItem("echoUnlocked", "1");

    setTimeout(() => {
      $("#echo-message").classList.remove("hidden");
    }, 2500);
  } else {
    $("#archive-error").classList.remove("hidden");
  }
});

if (localStorage.getItem("echoUnlocked") === "1") {
  $("#echo-message").classList.remove("hidden");
}

function resetAlphaCorrectionsProgress() {
  localStorage.removeItem("alphaCorrectionsEntered");
  localStorage.removeItem("alphaCorrectionAcknowledged");
  localStorage.removeItem("echoUnlocked");
}

// Safety escape during testing: Shift+R resets and immediately reloads.
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    resetAlphaCorrectionsProgress();
    window.location.reload();
  }
});

// Test utilities:
//   ?test=1  -> show a visible RESET TEST MODE button
//   ?reset=1 -> reset immediately, then return to ?test=1
const params = new URLSearchParams(window.location.search);

if (params.get("reset") === "1") {
  resetAlphaCorrectionsProgress();
  window.location.replace(window.location.pathname + "?test=1");
}

const testReset = document.querySelector("#test-reset");
if (params.get("test") === "1" && testReset) {
  testReset.classList.remove("hidden");
  testReset.addEventListener("click", () => {
    resetAlphaCorrectionsProgress();
    window.location.replace(window.location.pathname + "?test=1");
  });
}

const crowSubmit = document.getElementById("crow-submit");
if (crowSubmit) {
  crowSubmit.addEventListener("click", () => {
    const code = (document.getElementById("crow-code").value || "").trim().toUpperCase();
    if (code === "BLACKBIRD") {
      document.getElementById("crow-error").classList.add("hidden");
      document.getElementById("crow-lock").classList.add("hidden");
      document.getElementById("crow-letter").classList.remove("hidden");
      localStorage.setItem("crowUnlocked", "1");
    } else {
      document.getElementById("crow-error").classList.remove("hidden");
    }
  });
}
if (localStorage.getItem("crowUnlocked") === "1") {
  const cl = document.getElementById("crow-lock");
  const letter = document.getElementById("crow-letter");
  if (cl && letter) { cl.classList.add("hidden"); letter.classList.remove("hidden"); }
}


// Crow epilogue is intentionally hidden during the main investigation.
// Opening the special AFTER_CONTINUITY link enables the external relay.
const pageParams = new URLSearchParams(window.location.search);
if (pageParams.get("crow") === "1") {
  localStorage.setItem("crowRelayAvailable", "1");
}
if (localStorage.getItem("crowRelayAvailable") === "1") {
  const crowCard = document.getElementById("crow-card");
  if (crowCard) crowCard.classList.remove("hidden");
}
