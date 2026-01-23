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
  const flameCore = document.getElementById("flameCore");
  const flameInner = document.getElementById("flameInner");

  const btnStart = document.getElementById("btnStart");
  const btnFailed = document.getElementById("btnFailed");

  const btnPanic = document.getElementById("btnPanic");
  const panicModal = document.getElementById("panicModal");
  const btnClosePanic = document.getElementById("btnClosePanic");

  const diaryText = document.getElementById("diaryText");
  const btnAddEntry = document.getElementById("btnAddEntry");
  const btnClearText = document.getElementById("btnClearText");
  const btnRefreshDiary = document.getElementById("btnRefreshDiary");
  const diaryList = document.getElementById("diaryList");

  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");

  // Achievements UI (exists only after your index.html update)
  const btnAchievements = document.getElementById("btnAchievements");
  const achievementsModal = document.getElementById("achievementsModal");
  const btnCloseAchievements = document.getElementById("btnCloseAchievements");
  const achievementsBackdrop = document.getElementById("achievementsBackdrop");

  // NEW: manual save
  const btnSaveAchievements = document.getElementById("btnSaveAchievements");
  const achSaveHint = document.getElementById("achSaveHint");

  // ----- State -----
  let sessionUser = null;
  let startedAt = null;
  let timer = null;

  // Achievements state (stored in profiles)
  let achievements = {};
  let achievementsDirty = false;
  let failCount = 0;

  // Panic tracking (client side timer)
  let panicStartedAtMs = null;
  let panicCheckTimer = null;

  // ----- Helpers -----
  function showToast(msg) {
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

  function applyFlameVibe(vibe) {
    const vibes = {
      unlit: {
        glow: "bg-slate-400/10",
        core: "bg-gradient-to-br from-slate-300/30 to-slate-200/10",
        inner: "bg-gradient-to-br from-slate-200/20 to-slate-100/10",
      },
      yellow: {
        glow: "bg-yellow-300/30",
        core: "bg-gradient-to-br from-yellow-300 to-orange-400",
        inner: "bg-gradient-to-br from-yellow-200 to-yellow-400",
      },
      orange: {
        glow: "bg-orange-400/35",
        core: "bg-gradient-to-br from-orange-400 to-red-500",
        inner: "bg-gradient-to-br from-yellow-300 to-orange-500",
      },
      red: {
        glow: "bg-red-500/40",
        core: "bg-gradient-to-br from-red-500 to-purple-600",
        inner: "bg-gradient-to-br from-orange-400 to-red-600",
      },
      purple: {
        glow: "bg-purple-500/40",
        core: "bg-gradient-to-br from-purple-500 to-indigo-600",
        inner: "bg-gradient-to-br from-red-400 to-purple-600",
      },
      blue: {
        glow: "bg-cyan-400/35",
        core: "bg-gradient-to-br from-cyan-300 to-blue-500",
        inner: "bg-gradient-to-br from-sky-200 to-cyan-400",
      },
      green: {
        glow: "bg-green-500/40",
        core: "bg-gradient-to-br from-green-400 to-lime-500",
        inner: "bg-gradient-to-br from-lime-200 to-green-600",
      },
      pink: {
        glow: "bg-fuchsia-400/45",
        core: "bg-gradient-to-br from-pink-300 via-fuchsia-500 to-purple-600",
        inner: "bg-gradient-to-br from-pink-100 to-fuchsia-400",
      },
    };

    const v = vibes[vibe] || vibes.unlit;

    flameGlow.className = `absolute inset-0 rounded-full blur-2xl ${v.glow}`;
    flameCore.className =
      `absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-3xl ${v.core}`;
    flameInner.className =
      `absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-2xl ${v.inner}`;
  }

  function setView(isAuthed) {
    viewAuth.classList.toggle("hidden", isAuthed);
    viewApp.classList.toggle("hidden", !isAuthed);
    btnSignOut.classList.toggle("hidden", !isAuthed);
    userEmail.classList.toggle("hidden", !isAuthed);

    // Achievements button only when authed
    if (btnAchievements) btnAchievements.classList.toggle("hidden", !isAuthed);

    if (!isAuthed) {
      userEmail.textContent = "";
      stopTimer();
      startedAt = null;
      renderFlame();
      diaryList.innerHTML = "";
      stopPanicTracking();

      achievements = {};
      achievementsDirty = false;
      failCount = 0;

      renderAchievementsUI();
      closeAchievements();
    }
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      renderFlame();
      evaluateTimeBasedAchievements(); // keep checking streak achievements
    }, 1000);
    renderFlame();
  }

  function renderFlame() {
    if (!startedAt) {
      flameStageEl.textContent = "Unlit";
      elapsedEl.textContent = "—";
      startedAtEl.textContent = "Press Start to light it.";
      applyFlameVibe("unlit");
      return;
    }

    const ms = Date.now() - startedAt.getTime();
    const stage = stageFromMs(ms);
    flameStageEl.textContent = stage.name;
    elapsedEl.textContent = fmtDuration(ms);
    startedAtEl.textContent = `Started: ${startedAt.toLocaleString()}`;
    applyFlameVibe(stage.vibe);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ----- Achievements helpers -----
  const ACH = {
    grower: { title: "Grower" },
    self_control: { title: "Self control" },
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
    if (!document.querySelectorAll) return;

    document.querySelectorAll(".achievement").forEach((el) => {
      const key = el.getAttribute("data-key");
      const unlocked = isUnlocked(key);
      const unlockedAt = achievements?.[key]?.unlocked_at;

      el.setAttribute("data-unlocked", unlocked ? "true" : "false");

      el.classList.toggle("opacity-70", !unlocked);
      el.classList.toggle("border-orange-400/30", unlocked);
      el.classList.toggle("bg-orange-500/10", unlocked);

      // expects your HTML to have these:
      const icon = el.querySelector(".achIcon");
      if (icon) icon.textContent = unlocked ? "✅" : "🔒";

      const meta = el.querySelector(".achMeta");
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

    await ensureProfileRow();

    const { error } = await supa
      .from("profiles")
      .update({ achievements })
      .eq("id", sessionUser.id);

    if (error) throw error;

    achievementsDirty = false;
    renderAchievementsUI();
    showToast("Achievements saved ✅");
  }

  // ----- Panic tracking ("Self control") -----
  function startPanicTracking() {
    panicStartedAtMs = Date.now();

    if (panicCheckTimer) clearInterval(panicCheckTimer);

    panicCheckTimer = setInterval(async () => {
      if (!panicStartedAtMs) return;
      const elapsed = Date.now() - panicStartedAtMs;

      if (elapsed >= 30 * 60 * 1000) {
        stopPanicTracking();
        await unlockAchievement("self_control");
      }
    }, 1000);
  }

  function stopPanicTracking() {
    panicStartedAtMs = null;
    if (panicCheckTimer) clearInterval(panicCheckTimer);
    panicCheckTimer = null;
  }

  // ----- Supabase calls -----
  async function ensureProfileRow() {
    // Ensure row exists, but DON'T overwrite achievements/fail_count.
    const { error } = await supa
      .from("profiles")
      .upsert({ id: sessionUser.id }, { onConflict: "id" });

    if (error) throw error;
  }

  async function loadProfile() {
    await ensureProfileRow();

    const { data, error } = await supa
      .from("profiles")
      .select("started_at, achievements, fail_count")
      .eq("id", sessionUser.id)
      .single();

    if (error) throw error;

    startedAt = data?.started_at ? new Date(data.started_at) : null;
    achievements = data?.achievements || {};
    failCount = Number.isFinite(data?.fail_count) ? data.fail_count : 0;
    achievementsDirty = false;

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

    stopPanicTracking();

    renderFlame();
    await evaluateTimeBasedAchievements(true);
  }

  async function incrementFailCountAndSave() {
    failCount = (failCount || 0) + 1;

    const { error } = await supa
      .from("profiles")
      .update({ fail_count: failCount })
      .eq("id", sessionUser.id);

    if (error) throw error;

    if (failCount >= 1) await unlockAchievement("part_of_process");
    if (failCount >= 5) await unlockAchievement("never_back_down");
  }

  async function evaluateTimeBasedAchievements(force = false) {
    if (!sessionUser || !startedAt) return;

    const ms = Date.now() - startedAt.getTime();
    const d = ms / 86400000;
    const h = ms / 3600000;

    if (force || (!isUnlocked("grower") && h >= 12)) {
      if (h >= 12) await unlockAchievement("grower");
    }

    if (force || (!isUnlocked("month_clean") && d >= 30)) {
      if (d >= 30) await unlockAchievement("month_clean");
    }

    if (force || (!isUnlocked("stronger_than_ever") && d >= 60)) {
      if (d >= 60) await unlockAchievement("stronger_than_ever");
    }
  }

  async function loadDiary() {
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
    const { error } = await supa
      .from("diary_entries")
      .insert({ user_id: sessionUser.id, text });

    if (error) throw error;
  }

  // ----- Auth handlers -----
  async function init() {
    const { data } = await supa.auth.getSession();
    sessionUser = data?.session?.user || null;

    if (sessionUser) {
      setView(true);
      userEmail.textContent = sessionUser.email;
      await loadProfile().catch((e) => showToast(`Profile load failed: ${e.message}`));
      await loadDiary().catch((e) => showToast(`Diary load failed: ${e.message}`));
    } else {
      setView(false);
    }

    supa.auth.onAuthStateChange(async (_event, session) => {
      sessionUser = session?.user || null;

      if (sessionUser) {
        setView(true);
        userEmail.textContent = sessionUser.email;
        await loadProfile().catch((e) => showToast(`Profile load failed: ${e.message}`));
        await loadDiary().catch((e) => showToast(`Diary load failed: ${e.message}`));
      } else {
        setView(false);
      }
    });
  }

  // ----- UI events -----
  btnDemoFill.addEventListener("click", () => {
    window.location.href = "./demo.html";
  });

  btnSignup.addEventListener("click", async () => {
    try {
      setBusy(btnSignup, true);
      const email = emailEl.value.trim();
      const password = passEl.value;

      const { error } = await supa.auth.signUp({ email, password });
      if (error) throw error;

      showToast("Signed up. You can log in now.");
    } catch (e) {
      showToast(`Signup failed: ${e.message}`);
    } finally {
      setBusy(btnSignup, false);
    }
  });

  btnLogin.addEventListener("click", async () => {
    try {
      setBusy(btnLogin, true);
      const email = emailEl.value.trim();
      const password = passEl.value;

      const { error } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;

      showToast("Welcome back.");
    } catch (e) {
      showToast(`Login failed: ${e.message}`);
    } finally {
      setBusy(btnLogin, false);
    }
  });

  // ✅ SINGLE sign-out handler
  btnSignOut.addEventListener("click", async () => {
    try {
      setBusy(btnSignOut, true);
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

  btnStart.addEventListener("click", async () => {
    try {
      setBusy(btnStart, true);
      await setStartedNow();
      showToast("Flame lit.");
    } catch (e) {
      showToast(`Start failed: ${e.message}`);
    } finally {
      setBusy(btnStart, false);
    }
  });

  btnFailed.addEventListener("click", async () => {
    try {
      setBusy(btnFailed, true);

      stopPanicTracking();
      await incrementFailCountAndSave();
      await setStartedNow();

      showToast("Its ok to fail, start again :)");
    } catch (e) {
      showToast(`Reset failed: ${e.message}`);
    } finally {
      setBusy(btnFailed, false);
    }
  });

  btnPanic.addEventListener("click", () => {
    panicModal.classList.remove("hidden");
    panicModal.classList.add("flex");

    if (!panicStartedAtMs) startPanicTracking();
  });

  btnClosePanic.addEventListener("click", () => {
    panicModal.classList.add("hidden");
    panicModal.classList.remove("flex");
  });

  btnClearText.addEventListener("click", () => {
    diaryText.value = "";
    diaryText.focus();
  });

  btnAddEntry.addEventListener("click", async () => {
    const text = diaryText.value.trim();
    if (!text) return showToast("Write something first.");
    try {
      setBusy(btnAddEntry, true);
      await addDiaryEntry(text);
      diaryText.value = "";
      showToast("Entry saved.");
      await loadDiary();
    } catch (e) {
      showToast(`Save failed: ${e.message}`);
    } finally {
      setBusy(btnAddEntry, false);
    }
  });

  btnRefreshDiary.addEventListener("click", async () => {
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

  // Achievements UI wiring
  if (btnAchievements) btnAchievements.addEventListener("click", openAchievements);
  if (btnCloseAchievements) btnCloseAchievements.addEventListener("click", closeAchievements);
  if (achievementsBackdrop) achievementsBackdrop.addEventListener("click", closeAchievements);

  if (btnSaveAchievements) {
    btnSaveAchievements.addEventListener("click", async () => {
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
  }

  // go
  init();
})();