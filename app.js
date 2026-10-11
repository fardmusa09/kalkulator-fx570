/**
 * Casio fx-570 Calculator Application UI Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const engine = window.mathEngine;

  // DOM Elements
  const screenInput = document.getElementById("screen-input");
  const screenResult = document.getElementById("screen-result");

  const indShift = document.getElementById("ind-shift");
  const indAlpha = document.getElementById("ind-alpha");
  const indAngle = document.getElementById("ind-angle");
  const indMode = document.getElementById("ind-mode");

  const modalOverlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  const btnHist = document.getElementById("btn-hist");
  const btnConstMenu = document.getElementById("btn-const-menu");
  const btnConvMenu = document.getElementById("btn-conv-menu");
  const btnReset = document.getElementById("btn-reset");

  let inputBuffer = "";
  let isShiftActive = false;
  let isAlphaActive = false;

  // Touch Haptic Feedback
  function triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(12);
    }
  }

  // Update Indicator Status
  function updateIndicators() {
    indShift.classList.toggle("active", isShiftActive);
    indAlpha.classList.toggle("active", isAlphaActive);
    indAngle.textContent = engine.angleMode;
    indMode.textContent = engine.calcMode;
  }

  // Update Display Screen
  function updateScreen(resText = null) {
    screenInput.textContent = inputBuffer || "0";
    if (resText !== null) {
      screenResult.textContent = resText;
    }
  }

  // Handle Button Press
  function handleKeyPress(code, mainVal, shiftVal, alphaVal) {
    triggerHaptic();

    let targetVal = mainVal;
    if (isShiftActive && shiftVal) {
      targetVal = shiftVal;
      isShiftActive = false;
    } else if (isAlphaActive && alphaVal) {
      targetVal = alphaVal;
      isAlphaActive = false;
    } else {
      isShiftActive = false;
      isAlphaActive = false;
    }
    updateIndicators();

    // Key routing
    switch (targetVal) {
      case "shift":
        isShiftActive = !isShiftActive;
        isAlphaActive = false;
        updateIndicators();
        return;
      case "alpha":
        isAlphaActive = !isAlphaActive;
        isShiftActive = false;
        updateIndicators();
        return;
      case "ac":
        inputBuffer = "";
        updateScreen("0");
        return;
      case "del":
        inputBuffer = inputBuffer.slice(0, -1);
        updateScreen();
        return;
      case "equals":
        if (!inputBuffer) return;
        const res = engine.evaluateExpression(inputBuffer);
        updateScreen(res);
        return;
      case "mode":
        openModeMenu();
        return;
      case "on":
        inputBuffer = "";
        updateScreen("0");
        return;

      // Specials & Menus
      case "CONST":
        openConstantsMenu();
        return;
      case "CONV":
        openConversionsMenu();
        return;
      case "STAT_MENU":
        openStatMenu();
        return;

      // Function insertions
      case "SQRT": inputBuffer += "√("; break;
      case "SQR": inputBuffer += "^2"; break;
      case "POWER": inputBuffer += "^"; break;
      case "SIN": inputBuffer += "sin("; break;
      case "COS": inputBuffer += "cos("; break;
      case "TAN": inputBuffer += "tan("; break;
      case "ASIN": inputBuffer += "asin("; break;
      case "ACOS": inputBuffer += "acos("; break;
      case "ATAN": inputBuffer += "atan("; break;
      case "LOG10": inputBuffer += "log("; break;
      case "LN": inputBuffer += "ln("; break;
      case "EXP10": inputBuffer += "*10^"; break;
      case "ANS": inputBuffer += "Ans"; break;
      case "PI": inputBuffer += "π"; break;
      case "E_CONST": inputBuffer += "e"; break;
      case "ABS": inputBuffer += "abs("; break;
      case "FACT": inputBuffer += "!"; break;

      default:
        if (targetVal) {
          inputBuffer += targetVal;
        }
        break;
    }
    updateScreen();
  }

  // Attach Event Listeners to Keypad
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code || btn.dataset.action || btn.dataset.val || btn.dataset.op;
      const mainVal = btn.dataset.val || btn.dataset.op || btn.dataset.action || btn.querySelector(".main-label")?.textContent;
      const shiftVal = btn.dataset.shift;
      const alphaVal = btn.dataset.alpha;

      handleKeyPress(code, mainVal, shiftVal, alphaVal);
    });
  });

  // Modals & Menu Management
  function showModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modalOverlay.classList.remove("hidden");
  }

  function closeModal() {
    modalOverlay.classList.add("hidden");
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Mode Selection Menu
  function openModeMenu() {
    const html = `
      <div class="menu-item" data-mode="COMP"><span class="key-num">1</span> COMP (Kalkulasi Asas)</div>
      <div class="menu-item" data-mode="CMPLX"><span class="key-num">2</span> CMPLX (Nombor Kompleks)</div>
      <div class="menu-item" data-mode="STAT"><span class="key-num">3</span> STAT (Statistik)</div>
      <div class="menu-item" data-mode="BASE_N"><span class="key-num">4</span> BASE-N (Asas Nombor)</div>
      <div class="menu-item" data-mode="EQN"><span class="key-num">5</span> EQN (Persamaan)</div>
      <div class="menu-item" data-mode="MATRIX"><span class="key-num">6</span> MATRIX (Matriks)</div>
      <div class="menu-item" data-mode="TABLE"><span class="key-num">7</span> TABLE (Jadual Fungsi)</div>
      <div class="menu-item" data-angle="TOGGLE"><span class="key-num">8</span> Tukar Sudut (${engine.angleMode === 'DEG' ? 'Ke RAD' : engine.angleMode === 'RAD' ? 'Ke GRAD' : 'Ke DEG'})</div>
    `;
    showModal("Pilih Mod Kalkulator", html);

    document.querySelectorAll(".modal-body .menu-item").forEach(item => {
      item.addEventListener("click", () => {
        const selectedMode = item.dataset.mode;
        const toggleAngle = item.dataset.angle;

        if (selectedMode) {
          engine.calcMode = selectedMode;
          closeModal();
          updateIndicators();
          alert(`Mod bertukar ke: ${selectedMode}`);
        } else if (toggleAngle) {
          engine.angleMode = engine.angleMode === 'DEG' ? 'RAD' : engine.angleMode === 'RAD' ? 'GRAD' : 'DEG';
          closeModal();
          updateIndicators();
        }
      });
    });
  }

  // Scientific Constants Menu
  function openConstantsMenu() {
    let html = "";
    engine.constants.forEach(c => {
      html += `
        <div class="menu-item" data-val="${c.value}">
          <span><span class="key-num">${c.id < 10 ? '0' + c.id : c.id}</span> ${c.name}</span>
          <span style="color:#facc15; font-size:0.75rem;">${c.symbol}</span>
        </div>
      `;
    });
    showModal("Pemalar Sains (40 Scientific Constants)", html);

    document.querySelectorAll(".modal-body .menu-item").forEach(item => {
      item.addEventListener("click", () => {
        const val = item.dataset.val;
        inputBuffer += val;
        closeModal();
        updateScreen();
      });
    });
  }

  // Unit Conversions Menu
  function openConversionsMenu() {
    let html = "";
    engine.conversions.forEach(c => {
      html += `
        <div class="menu-item" data-conv-id="${c.id}">
          <span><span class="key-num">${c.id < 10 ? '0' + c.id : c.id}</span> ${c.name}</span>
        </div>
      `;
    });
    showModal("Penukaran Unit (40 Metric Conversions)", html);

    document.querySelectorAll(".modal-body .menu-item").forEach(item => {
      item.addEventListener("click", () => {
        const convId = parseInt(item.dataset.convId);
        const conv = engine.conversions.find(x => x.id === convId);
        if (conv && inputBuffer) {
          try {
            const rawVal = parseFloat(screenResult.textContent) || parseFloat(inputBuffer);
            const converted = conv.convert(rawVal);
            screenResult.textContent = converted;
            engine.history.push({ expr: `${conv.name}(${rawVal})`, result: converted });
          } catch (e) {
            screenResult.textContent = "Conversion ERROR";
          }
        }
        closeModal();
      });
    });
  }

  // Statistics Menu
  function openStatMenu() {
    const summary = engine.getStatSummary();
    let html = `
      <div style="font-size:0.85rem; color:#e2e8f0; display:flex; flex-direction:column; gap:8px;">
        <p><b>Data Terkumpul:</b> ${summary ? summary.n : 0} item</p>
        ${summary ? `
          <p><b>Min (x̄):</b> ${summary.mean.toFixed(4)}</p>
          <p><b>Jumlah (Σx):</b> ${summary.sumX}</p>
          <p><b>Jumlah Kuasa Dua (Σx²):</b> ${summary.sumX2}</p>
          <p><b>Sisihan Piawai (σx):</b> ${summary.popStdDev.toFixed(4)}</p>
        ` : '<p style="color:#94a3b8;">Tiada data statistik dimasukkan lagi.</p>'}
        <button id="btn-add-stat" style="background:#0284c7; color:#fff; padding:8px; border:none; border-radius:6px; margin-top:8px; font-weight:bold; cursor:pointer;">+ Tambah Data Statistik</button>
        <button id="btn-clear-stat" style="background:#dc2626; color:#fff; padding:8px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Padam Data STAT</button>
      </div>
    `;
    showModal("Ringkasan Statistik (STAT Mode)", html);

    document.getElementById("btn-add-stat")?.addEventListener("click", () => {
      const val = prompt("Masukkan nilai data (x):");
      if (val !== null && !isNaN(parseFloat(val))) {
        engine.addStatData(parseFloat(val));
        alert("Data berjaya ditambah!");
        openStatMenu();
      }
    });

    document.getElementById("btn-clear-stat")?.addEventListener("click", () => {
      engine.clearStatData();
      alert("Data statistik telah dipadam.");
      openStatMenu();
    });
  }

  // History Viewer
  btnHist.addEventListener("click", () => {
    let html = "";
    if (engine.history.length === 0) {
      html = `<p style="color:#94a3b8; text-align:center;">Tiada sejarah rekod kiraan.</p>`;
    } else {
      engine.history.slice(-15).reverse().forEach((item, idx) => {
        html += `
          <div style="background:#0f172a; padding:8px 12px; border-radius:6px; margin-bottom:6px;">
            <div style="font-size:0.75rem; color:#94a3b8;">${item.expr}</div>
            <div style="font-size:1.1rem; font-weight:bold; color:#38bdf8; text-align:right;">= ${item.result}</div>
          </div>
        `;
      });
    }
    showModal("Sejarah Pengiraan (History)", html);
  });

  // Quick Utilities Listeners
  btnConstMenu.addEventListener("click", openConstantsMenu);
  btnConvMenu.addEventListener("click", openConversionsMenu);
  btnReset.addEventListener("click", () => {
    if (confirm("Adakah anda pasti mahu meriset kalkulator ke tetapan asal?")) {
      inputBuffer = "";
      engine.angleMode = 'DEG';
      engine.calcMode = 'COMP';
      engine.clearStatData();
      engine.history = [];
      updateIndicators();
      updateScreen("0");
      alert("Kalkulator berjaya di-reset!");
    }
  });

  // Initialize Screen
  updateIndicators();
  updateScreen("0");
});
