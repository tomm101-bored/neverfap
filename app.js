// app.js
(() => {
  // ----- Config sanity -----
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (!url || !key || String(url).includes("PASTE_") || String(key).includes("PASTE_")) {
    alert("Set SUPABASE_URL and SUPABASE_ANON_KEY in config.js first.");
    return;
  }

  // ✅ Create Supabase client (CDN build)
  const supa = window.supabase.createClient(url, key);

  // Debug helpers
  window.supa = supa;
  window.supaClient = supa;

  // ----- Elements -----
  const viewAuth = document.getElementById("viewAuth");
  const viewApp = document.getElementById("viewApp");
  const userEmail = document.getElementById("userEmail");
  const btnSignOut = document.getElementById("btnSignOut");

  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const btnLogin = document.getElementById("btnLogin");
  const btnSignup = document.getElementById("btnSignup");
  const btnDemoFill = document.getElementById("btnDemoFill");

  const flameStageEl = document.getElementById("flameStage");
  const elapsedEl = document.getElementById("elapsed");
  const startedAtEl = document.getElementById("startedAt");
  const flameGlow = document.getElementById("flameGlow");
  const flameSvg = document.getElementById("flameSvg");
  const outerStop1 = document.getElementById("outerStop1");
  const outerStop2 = document.getElementById("outerStop2");
  const innerStop1 = document.getElementById("innerStop1");
  const innerStop2 = document.getElementById("innerStop2");

  // Flame info modal
  const btnFlameInfo = document.getElementById("btnFlameInfo");
  const flameInfoModal = document.getElementById("flameInfoModal");
  const flameInfoBackdrop = document.getElementById("flameInfoBackdrop");
  const btnCloseFlameInfo = document.getElementById("btnCloseFlameInfo");
  const flameInfoList = document.getElementById("flameInfoList");

  const btnStart = document.getElementById("btnStart");
  const btnFailed = document.getElementById("btnFailed");

  const btnPanic = document.getElementById("btnPanic");
  const panicModal = document.getElementById("panicModal");
  const btnClosePanic = document.getElementById("btnClosePanic");

  const confirmFailedModal = document.getElementById("confirmFailedModal");
  const confirmFailedBackdrop = document.getElementById("confirmFailedBackdrop");
  const btnConfirmFailed = document.getElementById("btnConfirmFailed");
  const btnCancelFailed = document.getElementById("btnCancelFailed");

  const diaryText = document.getElementById("diaryText");
  const btnAddEntry = document.getElementById("btnAddEntry");
  const btnClearText = document.getElementById("btnClearText");
  const btnRefreshDiary = document.getElementById("btnRefreshDiary");
  const diaryList = document.getElementById("diaryList");

  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");
  const lastSavedText = document.getElementById("lastSavedText");

  // Achievements UI
  const btnAchievements = document.getElementById("btnAchievements");
  const achievementsModal = document.getElementById("achievementsModal");
  const btnCloseAchievements = document.getElementById("btnCloseAchievements");
  const achievementsBackdrop = document.getElementById("achievementsBackdrop");

  // Manual save
  const btnSaveAchievements = document.getElementById("btnSaveAchievements");
  const achSaveHint = document.getElementById("achSaveHint");

  // Forgot password modal
  const btnForgotPassword = document.getElementById("btnForgotPassword");
  const forgotModal = document.getElementById("forgotModal");
  const forgotBackdrop = document.getElementById("forgotBackdrop");
  const btnCloseForgot = document.getElementById("btnCloseForgot");

  // Bug report modal
  const btnBugReport = document.getElementById("btnBugReport");
  const bugReportModal = document.getElementById("bugReportModal");
  const bugReportBackdrop = document.getElementById("bugReportBackdrop");
  const btnCloseBugReport = document.getElementById("btnCloseBugReport");

  // Global popup modal
  const globalPopupModal = document.getElementById("globalPopupModal");
  const globalPopupBackdrop = document.getElementById("globalPopupBackdrop");
  const globalPopupTitle = document.getElementById("globalPopupTitle");
  const globalPopupMessage = document.getElementById("globalPopupMessage");
  const btnCloseGlobalPopup = document.getElementById("btnCloseGlobalPopup");

  // ----- State -----
  let sessionUser = null;
  let startedAt = null;
  let timer = null;
  let autosaveTimer = null;
  let globalPopupTimer = null;
  let dismissedGlobalPopupKey = null;

  // Achievements state (stored in profiles)
  let achievements = {};
  let achievementsDirty = false;
  let failCount = 0;
  let bestStageName = "Unlit";

  // ----- Helpers -----
  const on = (el, evt, fn) => {
    if (!el) return;
    el.addEventListener(evt, fn);
  };

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add("hidden"), 2500);
  }

  function setBusy(btn, isBusy) {
    if (!btn) return;
    btn.disabled = isBusy;
    btn.classList.toggle("opacity-60", isBusy);
    btn.classList.toggle("cursor-not-allowed", isBusy);
  }

  function updateLastSavedText(date = null) {
    if (!lastSavedText) return;
    if (!date) {
      lastSavedText.textContent = "Last saved --:--:--";
      return;
    }

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    lastSavedText.textContent = `Last saved ${hh}:${mm}:${ss}`;
  }

  function stopAutosave() {
    if (autosaveTimer) clearInterval(autosaveTimer);
    autosaveTimer = null;
  }

  async function saveAllNow(showSavedTime = true) {
    if (!sessionUser) return;

    await ensureProfileRow();

    const payload = {
      started_at: startedAt ? startedAt.toISOString() : null,
      achievements,
      fail_count: failCount,
      best_stage: bestStageName,
    };

    const { error } = await supa
      .from("profiles")
      .update(payload)
      .eq("id", sessionUser.id);

    if (error) throw error;

    achievementsDirty = false;
    renderAchievementsUI();

    if (showSavedTime) {
      updateLastSavedText(new Date());
    }
  }

  function startAutosave() {
    stopAutosave();
    autosaveTimer = setInterval(async () => {
      try {
        await saveAllNow(true);
      } catch (e) {
        console.error("Autosave failed:", e);
      }
    }, 5000);
  }

  function fmtDuration(ms) {
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hrs = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    if (days > 0) return `${days}d ${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  }

  function stageFromMs(ms) {
    const h = ms / 3600000;
    const d = ms / 86400000;

    if (!startedAt) return { name: "Unlit", vibe: "unlit" };
    if (h < 12) return { name: "Spark", vibe: "yellow" };
    if (h < 48) return { name: "Growing", vibe: "orange" };
    if (d < 7) return { name: "Ruby Flame", vibe: "red" };
    if (d < 21) return { name: "Amethyst Flame", vibe: "purple" };
    if (d < 30) return { name: "Diamond Flame", vibe: "blue" };
    if (d < 60) return { name: "Emerald Flame", vibe: "green" };
    return { name: "Rose Flame", vibe: "pink" };
  }

function getStageInfoRows() {
  return [
    { name: "Unlit", range: "Before Start", order: 0 },
    { name: "Spark", range: "0–12 hours", order: 1 },
    { name: "Growing", range: "12–48 hours", order: 2 },
    { name: "Ruby Flame", range: "2–7 days", order: 3 },
    { name: "Amethyst Flame", range: "7–21 days", order: 4 },
    { name: "Diamond Flame", range: "21–30 days", order: 5 },
    { name: "Emerald Flame", range: "30–60 days", order: 6 },
    { name: "Rose Flame", range: "60+ days", order: 7 },
  ];
}
  function renderFlameInfo() {
    if (!flameInfoList) return;

    const rows = getStageInfoRows();

    const currentStageName = startedAt
      ? stageFromMs(Date.now() - startedAt.getTime()).name
      : "Unlit";

    const currentOrder =
      rows.find((r) => r.name === currentStageName)?.order ?? 0;

    const bestOrder =
      rows.find((r) => r.name === bestStageName)?.order ?? 0;

    flameInfoList.innerHTML = rows
      .map((r) => {
        const isCurrent = r.name === currentStageName;
        const isBest = r.name === bestStageName;

        return `
          <div class="rounded-2xl border border-white/10 ${
            isCurrent ? "bg-white/10" : "bg-white/5"
          } p-3">
            <div class="flex items-center justify-between gap-3">
              <div class="font-bold ${
                isCurrent ? "text-white" : "text-white/90"
              }">
                ${r.name}
                ${
                  isCurrent
                    ? ' <span class="text-xs text-orange-300/90">(current)</span>'
                    : ""
                }
                ${
                  isBest
                    ? ' <span class="text-xs text-pink-300/90">(best)</span>'
                    : ""
                }
              </div>
              <div class="text-xs text-white/60">${r.range}</div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function openFlameInfo() {
    if (!flameInfoModal) return;
    renderFlameInfo();
    flameInfoModal.classList.remove("hidden");
    flameInfoModal.classList.add("flex");
  }

  function closeFlameInfo() {
    if (!flameInfoModal) return;
    flameInfoModal.classList.add("hidden");
    flameInfoModal.classList.remove("flex");
  }

  function openConfirmFailed() {
    if (!confirmFailedModal) return;
    confirmFailedModal.classList.remove("hidden");
    confirmFailedModal.classList.add("flex");
  }

  function closeConfirmFailed() {
    if (!confirmFailedModal) return;
    confirmFailedModal.classList.add("hidden");
    confirmFailedModal.classList.remove("flex");
  }

  function openForgotModal() {
    if (!forgotModal) return;
    forgotModal.classList.remove("hidden");
    forgotModal.classList.add("flex");
  }

  function closeForgotModal() {
    if (!forgotModal) return;
    forgotModal.classList.add("hidden");
    forgotModal.classList.remove("flex");
  }

  function openBugReportModal() {
    if (!bugReportModal) return;
    bugReportModal.classList.remove("hidden");
    bugReportModal.classList.add("flex");
  }

  function closeBugReportModal() {
    if (!bugReportModal) return;
    bugReportModal.classList.add("hidden");
    bugReportModal.classList.remove("flex");
  }

  function openGlobalPopup(title, message) {
    if (!globalPopupModal) return;
    if (globalPopupTitle) globalPopupTitle.textContent = title || "Notice";
    if (globalPopupMessage) globalPopupMessage.textContent = message || "";
    globalPopupModal.classList.remove("hidden");
    globalPopupModal.classList.add("flex");
  }

  function closeGlobalPopup(rememberDismiss = false) {
    if (!globalPopupModal) return;

    if (rememberDismiss) {
      const currentTitle = globalPopupTitle?.textContent || "";
      const currentMessage = globalPopupMessage?.textContent || "";
      dismissedGlobalPopupKey = `${currentTitle}||${currentMessage}`;
    }

    globalPopupModal.classList.add("hidden");
    globalPopupModal.classList.remove("flex");
  }

  function stopGlobalPopupChecks() {
    if (globalPopupTimer) clearInterval(globalPopupTimer);
    globalPopupTimer = null;
  }

  async function checkGlobalPopup() {
    try {
      const { data, error } = await supa
        .from("global_popup")
        .select("is_active, title, message")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        dismissedGlobalPopupKey = null;
        closeGlobalPopup();
        return;
      }

      const popupKey = `${data.title || ""}||${data.message || ""}`;

      if (!data.is_active) {
        dismissedGlobalPopupKey = null;
        closeGlobalPopup();
        return;
      }

      if (dismissedGlobalPopupKey === popupKey) {
        return;
      }

      openGlobalPopup(data.title, data.message);
    } catch (e) {
      console.error("Global popup check failed:", e);
    }
  }

  function startGlobalPopupChecks() {
    stopGlobalPopupChecks();
    checkGlobalPopup();
    globalPopupTimer = setInterval(checkGlobalPopup, 10000);
  }

  function applyFlameVibe(vibe) {
    if (!flameGlow || !outerStop1) return;

    const vibes = {
      unlit:  { glow: "bg-slate-400/10",    outer: ["#475569", "#64748b"], inner: ["#94a3b8", "#cbd5e1"], lit: false },
      yellow: { glow: "bg-yellow-300/30",   outer: ["#f97316", "#fbbf24"], inner: ["#fde047", "#fef9c3"], lit: true },
      orange: { glow: "bg-orange-400/35",   outer: ["#dc2626", "#f97316"], inner: ["#fb923c", "#fde047"], lit: true },
      red:    { glow: "bg-red-500/40",      outer: ["#9333ea", "#ef4444"], inner: ["#f87171", "#fca5a5"], lit: true },
      purple: { glow: "bg-purple-500/40",   outer: ["#6366f1", "#a855f7"], inner: ["#c084fc", "#e9d5ff"], lit: true },
      blue:   { glow: "bg-cyan-400/35",     outer: ["#2563eb", "#06b6d4"], inner: ["#67e8f9", "#cffafe"], lit: true },
      green:  { glow: "bg-green-500/40",    outer: ["#16a34a", "#84cc16"], inner: ["#86efac", "#d9f99d"], lit: true },
      pink:   { glow: "bg-fuchsia-400/45",  outer: ["#a855f7", "#ec4899"], inner: ["#f9a8d4", "#fce7f3"], lit: true },
    };

    const v = vibes[vibe] || vibes.unlit;

    // Update glow div background class
    [...flameGlow.classList].forEach((c) => {
      if (c.startsWith("bg-")) flameGlow.classList.remove(c);
    });
    v.glow.split(/\s+/).filter(Boolean).forEach((c) => flameGlow.classList.add(c));

    // Update SVG gradient stop colors
    outerStop1.setAttribute("stop-color", v.outer[0]);
    outerStop2.setAttribute("stop-color", v.outer[1]);
    innerStop1.setAttribute("stop-color", v.inner[0]);
    innerStop2.setAttribute("stop-color", v.inner[1]);

    // Flicker animation only when lit
    if (flameSvg) flameSvg.classList.toggle("flame-flicker", v.lit);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
    stopAutosave();
    stopGlobalPopupChecks();
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      renderFlame();
      evaluateTimeBasedAchievements().catch(() => {});
    }, 1000);
    renderFlame();
    startAutosave();
    startGlobalPopupChecks();
  }

  function renderFlame() {
    // If flame UI isn't on the page, don't crash
    if (!flameStageEl || !elapsedEl || !startedAtEl) return;

    // Grey out Start when flame is already running; grey out Failed when unlit
    if (btnStart) {
      const isLit = !!startedAt;
      btnStart.disabled = isLit;
      btnStart.classList.toggle("opacity-40", isLit);
      btnStart.classList.toggle("cursor-not-allowed", isLit);
    }
    if (btnFailed) {
      const isUnlit = !startedAt;
      btnFailed.disabled = isUnlit;
      btnFailed.classList.toggle("opacity-40", isUnlit);
      btnFailed.classList.toggle("cursor-not-allowed", isUnlit);
    }

    if (!startedAt) {
      flameStageEl.textContent = "Unlit";
      elapsedEl.textContent = "—";
      startedAtEl.textContent = "Press Start to light it.";
      applyFlameVibe("unlit");
      return;
    }

    const ms = Date.now() - startedAt.getTime();
    const stage = stageFromMs(ms);

    // Update best stage automatically (Rose is highest)
    const rows = getStageInfoRows();
    const currentOrder =
      rows.find((r) => r.name === stage.name)?.order ?? 0;
    const bestOrder =
      rows.find((r) => r.name === bestStageName)?.order ?? 0;

    if (currentOrder > bestOrder) {
      bestStageName = stage.name;
    }

    flameStageEl.textContent = stage.name;
    elapsedEl.textContent = fmtDuration(ms);
    startedAtEl.textContent = `Started: ${startedAt.toLocaleString()}`;
    applyFlameVibe(stage.vibe);

    if (flameInfoModal && !flameInfoModal.classList.contains("hidden")) {
      renderFlameInfo();
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setView(isAuthed) {
    if (viewAuth) viewAuth.classList.toggle("hidden", isAuthed);
    if (viewApp) viewApp.classList.toggle("hidden", !isAuthed);
    if (btnSignOut) btnSignOut.classList.toggle("hidden", !isAuthed);
    if (userEmail) userEmail.classList.toggle("hidden", !isAuthed);
    if (btnAchievements) btnAchievements.classList.toggle("hidden", !isAuthed);

    if (!isAuthed) {
      if (userEmail) userEmail.textContent = "";
      stopTimer();
      startedAt = null;
      renderFlame();

      if (diaryList) diaryList.innerHTML = "";

      achievements = {};
      achievementsDirty = false;
      failCount = 0;
      bestStageName = "Unlit";
      dismissedGlobalPopupKey = null;
      updateLastSavedText(null);

      renderAchievementsUI();
      closeAchievements();
      closeFlameInfo();
      closeConfirmFailed();
      closeForgotModal();
      closeBugReportModal();
      closeGlobalPopup();
    }
  }

  // ----- Achievements helpers -----
  const ACH = {
    grower: { title: "Grower" },
    self_control: { title: "You can stop this" },
    part_of_process: { title: "It’s a part of the process" },
    never_back_down: { title: "Never back down never what?" },
    month_clean: { title: "A month clean" },
    stronger_than_ever: { title: "Stronger than ever" },
  };

  function isUnlocked(key) {
    return !!achievements?.[key]?.unlocked;
  }

  async function unlockAchievement(key) {
    if (!sessionUser) return;
    if (!ACH[key]) return;
    if (isUnlocked(key)) return;

    achievements = achievements || {};
    achievements[key] = {
      unlocked: true,
      unlocked_at: new Date().toISOString(),
    };

    achievementsDirty = true;
    renderAchievementsUI();
    showToast(`Achievement unlocked: ${ACH[key].title} (remember to save)`);
  }

  function renderAchievementsUI() {
    const nodes = document.querySelectorAll?.(".achievement");
    if (!nodes) return;

    nodes.forEach((el) => {
      const key = el.getAttribute("data-key");
      const unlocked = isUnlocked(key);
      const unlockedAt = achievements?.[key]?.unlocked_at;

      el.setAttribute("data-unlocked", unlocked ? "true" : "false");

      el.classList.toggle("opacity-70", !unlocked);
      el.classList.toggle("border-orange-400/30", unlocked);
      el.classList.toggle("bg-orange-500/10", unlocked);

      const icon =
        el.querySelector(".achIcon") ||
        el.querySelector("[data-ach-icon]") ||
        el.querySelector(".text-xs");

      if (icon) icon.textContent = unlocked ? "✅" : "🔒";

      const meta = el.querySelector(".achMeta") || el.querySelector("[data-ach-meta]");
      if (meta) meta.textContent = unlockedAt ? `Unlocked: ${new Date(unlockedAt).toLocaleString()}` : "";
    });

    if (btnSaveAchievements) {
      btnSaveAchievements.disabled = !achievementsDirty;
      btnSaveAchievements.classList.toggle("opacity-60", !achievementsDirty);
      btnSaveAchievements.classList.toggle("cursor-not-allowed", !achievementsDirty);
      btnSaveAchievements.textContent = achievementsDirty ? "Save achievements" : "Saved ✓";
    }

    if (achSaveHint) {
      achSaveHint.textContent = achievementsDirty ? "Manual save to prevent bugs." : "All set.";
    }
  }

  function openAchievements() {
    if (!achievementsModal) return;
    achievementsModal.classList.remove("hidden");
    achievementsModal.classList.add("flex");
    renderAchievementsUI();
  }

  function closeAchievements() {
    if (!achievementsModal) return;
    achievementsModal.classList.add("hidden");
    achievementsModal.classList.remove("flex");
  }

  async function saveAchievementsNow() {
    if (!sessionUser) return;
    await saveAllNow(true);
    showToast("Saved ✅");
  }

  // ----- Supabase calls -----
  async function ensureProfileRow() {
    if (!sessionUser) return;
    const { error } = await supa.from("profiles").upsert({ id: sessionUser.id }, { onConflict: "id" });
    if (error) throw error;
  }

  async function loadProfile() {
    await ensureProfileRow();

    const { data, error } = await supa
      .from("profiles")
      .select("started_at, achievements, fail_count, best_stage")
      .eq("id", sessionUser.id)
      .single();

    if (error) throw error;

    startedAt = data?.started_at ? new Date(data.started_at) : null;
    achievements = data?.achievements || {};
    failCount = Number.isFinite(data?.fail_count) ? data.fail_count : 0;
    bestStageName = data?.best_stage || "Unlit";
    achievementsDirty = false;
    updateLastSavedText(null);

    renderAchievementsUI();
    startTimer();
    await evaluateTimeBasedAchievements(true);
  }

  async function setStartedNow() {
    await ensureProfileRow();

    const { data, error } = await supa
      .from("profiles")
      .update({ started_at: new Date().toISOString() })
      .eq("id", sessionUser.id)
      .select("started_at")
      .single();

    if (error) throw error;

    startedAt = data?.started_at ? new Date(data.started_at) : null;
    updateLastSavedText(new Date());
    renderFlame();
    await evaluateTimeBasedAchievements(true);
  }

  async function clearStartedAt() {
    await ensureProfileRow();

    const { error } = await supa
      .from("profiles")
      .update({ started_at: null })
      .eq("id", sessionUser.id);

    if (error) throw error;

    startedAt = null;
    updateLastSavedText(new Date());
    renderFlame();
  }

  async function incrementFailCountAndSave() {
    failCount = (failCount || 0) + 1;

    const { error } = await supa.from("profiles").update({ fail_count: failCount }).eq("id", sessionUser.id);
    if (error) throw error;

    if (failCount >= 1) await unlockAchievement("part_of_process");
    if (failCount >= 5) await unlockAchievement("never_back_down");
  }

  async function evaluateTimeBasedAchievements(force = false) {
    if (!sessionUser || !startedAt) return;

    const ms = Date.now() - startedAt.getTime();
    const d = ms / 86400000;
    const h = ms / 3600000;

    if ((force || !isUnlocked("grower")) && h >= 12) await unlockAchievement("grower");
    if ((force || !isUnlocked("month_clean")) && d >= 30) await unlockAchievement("month_clean");
    if ((force || !isUnlocked("stronger_than_ever")) && d >= 60) await unlockAchievement("stronger_than_ever");
  }

  async function loadDiary() {
    if (!diaryList) return;

    const { data, error } = await supa
      .from("diary_entries")
      .select("id, created_at, text")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    diaryList.innerHTML = "";
    if (!data || data.length === 0) {
      diaryList.innerHTML =
        `<div class="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/60">No entries yet.</div>`;
      return;
    }

    for (const entry of data) {
      const wrap = document.createElement("div");
      wrap.className =
        "rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";

      const when = new Date(entry.created_at).toLocaleString();

      wrap.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="text-xs text-white/50">${when}</div>
          <button data-id="${entry.id}"
            class="btnDel rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60 transition hover:bg-white/10 active:scale-[0.98]">
            Delete
          </button>
        </div>
        <div class="mt-2 whitespace-pre-wrap text-sm text-white/85">${escapeHtml(entry.text)}</div>
      `;

      diaryList.appendChild(wrap);
    }

    document.querySelectorAll(".btnDel").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          setBusy(btn, true);
          const id = btn.getAttribute("data-id");
          const { error } = await supa.from("diary_entries").delete().eq("id", id);
          if (error) throw error;
          showToast("Entry deleted.");
          await loadDiary();
        } catch (e) {
          showToast(`Delete failed: ${e.message}`);
        } finally {
          setBusy(btn, false);
        }
      });
    });
  }

  async function addDiaryEntry(text) {
    const { error } = await supa.from("diary_entries").insert({ user_id: sessionUser.id, text });
    if (error) throw error;
  }

  // ----- Auth handlers -----
  async function init() {
    const { data } = await supa.auth.getSession();
    sessionUser = data?.session?.user || null;

    if (sessionUser) {
      setView(true);
      updateLastSavedText(null);
      if (userEmail) userEmail.textContent = sessionUser.email;
      await loadProfile().catch((e) => showToast(`Profile load failed: ${e.message}`));
      await loadDiary().catch((e) => showToast(`Diary load failed: ${e.message}`));
      await checkGlobalPopup();
    } else {
      setView(false);
    }

    supa.auth.onAuthStateChange(async (_event, session) => {
      sessionUser = session?.user || null;

      if (sessionUser) {
        setView(true);
        updateLastSavedText(null);
        if (userEmail) userEmail.textContent = sessionUser.email;
        await loadProfile().catch((e) => showToast(`Profile load failed: ${e.message}`));
        await loadDiary().catch((e) => showToast(`Diary load failed: ${e.message}`));
        await checkGlobalPopup();
      } else {
        setView(false);
      }
    });
  }

  // ----- UI events -----
  on(btnDemoFill, "click", () => (window.location.href = "./demo.html"));

  on(btnSignup, "click", async () => {
    try {
      setBusy(btnSignup, true);
      const email = (emailEl?.value || "").trim();
      const password = passEl?.value || "";
      const { error } = await supa.auth.signUp({ email, password });
      if (error) throw error;
      showToast("Signed up. You can log in now.");
    } catch (e) {
      showToast(`Signup failed: ${e.message}`);
    } finally {
      setBusy(btnSignup, false);
    }
  });

  on(btnLogin, "click", async () => {
    try {
      setBusy(btnLogin, true);
      const email = (emailEl?.value || "").trim();
      const password = passEl?.value || "";
      const { error } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast("Welcome back.");
    } catch (e) {
      showToast(`Login failed: ${e.message}`);
    } finally {
      setBusy(btnLogin, false);
    }
  });

  on(btnSignOut, "click", async () => {
    try {
      setBusy(btnSignOut, true);
      stopAutosave();
      const { error } = await supa.auth.signOut();
      if (error) throw error;
      showToast("Signed out.");
    } catch (e) {
      showToast(`Sign out failed: ${e.message}`);
      console.error(e);
    } finally {
      setBusy(btnSignOut, false);
    }
  });

  on(btnStart, "click", async () => {
    try {
      setBusy(btnStart, true);
      await setStartedNow();
      showToast("Flame lit.");
    } catch (e) {
      showToast(`Start failed: ${e.message}`);
    } finally {
      renderFlame();
    }
  });

  on(btnFailed, "click", () => openConfirmFailed());

  on(btnConfirmFailed, "click", async () => {
    closeConfirmFailed();
    try {
      setBusy(btnFailed, true);
      await incrementFailCountAndSave();
      await clearStartedAt();
      showToast("It's ok to fail. Press Start when you're ready.");
    } catch (e) {
      showToast(`Reset failed: ${e.message}`);
    } finally {
      setBusy(btnFailed, false);
    }
  });

  on(btnCancelFailed, "click", closeConfirmFailed);
  on(confirmFailedBackdrop, "click", closeConfirmFailed);

  on(btnPanic, "click", async () => {
    if (panicModal) {
      panicModal.classList.remove("hidden");
      panicModal.classList.add("flex");
    }
    try {
      await unlockAchievement("self_control");
    } catch (e) {
      console.error(e);
    }
  });

  on(btnClosePanic, "click", () => {
    if (!panicModal) return;
    panicModal.classList.add("hidden");
    panicModal.classList.remove("flex");
  });

  on(btnClearText, "click", () => {
    if (!diaryText) return;
    diaryText.value = "";
    diaryText.focus();
  });

  on(btnAddEntry, "click", async () => {
    const text = (diaryText?.value || "").trim();
    if (!text) return showToast("Write something first.");
    try {
      setBusy(btnAddEntry, true);
      await addDiaryEntry(text);
      if (diaryText) diaryText.value = "";
      showToast("Entry saved.");
      await loadDiary();
    } catch (e) {
      showToast(`Save failed: ${e.message}`);
    } finally {
      setBusy(btnAddEntry, false);
    }
  });

  on(btnRefreshDiary, "click", async () => {
    try {
      setBusy(btnRefreshDiary, true);
      await loadDiary();
      showToast("Diary refreshed.");
    } catch (e) {
      showToast(`Refresh failed: ${e.message}`);
    } finally {
      setBusy(btnRefreshDiary, false);
    }
  });

  // Achievements wiring
  on(btnAchievements, "click", openAchievements);
  on(btnCloseAchievements, "click", closeAchievements);
  on(achievementsBackdrop, "click", closeAchievements);

  // Flame info wiring
  on(btnFlameInfo, "click", openFlameInfo);
  on(btnCloseFlameInfo, "click", closeFlameInfo);
  on(flameInfoBackdrop, "click", closeFlameInfo);

  // Forgot password wiring
  on(btnForgotPassword, "click", openForgotModal);
  on(btnCloseForgot, "click", closeForgotModal);
  on(forgotBackdrop, "click", closeForgotModal);

  // Bug report wiring
  on(btnBugReport, "click", openBugReportModal);
  on(btnCloseBugReport, "click", closeBugReportModal);
  on(bugReportBackdrop, "click", closeBugReportModal);

  // Global popup wiring
  on(btnCloseGlobalPopup, "click", () => closeGlobalPopup(true));
  on(globalPopupBackdrop, "click", () => closeGlobalPopup(true));

  // ESC closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeFlameInfo();
    closeAchievements();
    closeConfirmFailed();
    closeForgotModal();
    closeBugReportModal();
    closeGlobalPopup(true);
    if (panicModal && !panicModal.classList.contains("hidden")) {
      panicModal.classList.add("hidden");
      panicModal.classList.remove("flex");
    }
  });

  on(btnSaveAchievements, "click", async () => {
    try {
      setBusy(btnSaveAchievements, true);
      await saveAchievementsNow();
    } catch (e) {
      showToast(`Save failed: ${e.message}`);
      console.error(e);
    } finally {
      setBusy(btnSaveAchievements, false);
    }
  });

  // Save immediately when the tab becomes visible again (counters browser throttling of intervals)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && sessionUser) {
      saveAllNow(true).catch((e) => console.error("Visibility save failed:", e));
    }
  });

  // go
  init();
})();
