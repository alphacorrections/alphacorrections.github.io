
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

// Safety escape during testing: press Shift+R to reset progress.
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "r") {
    localStorage.removeItem("alphaCorrectionsEntered");
    localStorage.removeItem("alphaCorrectionAcknowledged");
    localStorage.removeItem("echoUnlocked");
  }
});
\n\n// Test mode: append ?test=1 to the URL to reveal a reset control.\nconst params = new URLSearchParams(window.location.search);\nconst testReset = document.querySelector("#test-reset");\nif (params.get("test") === "1" && testReset) {\n  testReset.classList.remove("hidden");\n  testReset.addEventListener("click", () => {\n    localStorage.removeItem("alphaCorrectionsEntered");\n    localStorage.removeItem("alphaCorrectionAcknowledged");\n    localStorage.removeItem("echoUnlocked");\n    window.location.href = window.location.pathname + "?test=1";\n  });\n}\n