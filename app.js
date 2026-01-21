// app.js
(function () {
  // ----- Config sanity -----
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (!url || !key || String(url).includes("PASTE_") || String(key).includes("PASTE_")) {
    alert("Set SUPABASE_URL and SUPABASE_ANON_KEY in config.js first.");
    return;
  }

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

  // ----- State -----
  let sessionUser = null;
  let startedAt = null;
  let timer = null;

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
  if (d < 7) return { name: "Strong", vibe: "red" };
  if (d < 21) return { name: "Focused", vibe: "purple" };
  return { name: "Calm Control", vibe: "blue" };
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

    if (!isAuthed) {
      userEmail.textContent = "";
      stopTimer();
      startedAt = null;
      renderFlame();
      diaryList.innerHTML = "";
    }
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(renderFlame, 1000);
    renderFlame();
  }

  function renderFlame() {
    if (!startedAt) {
      flameStageEl.textContent = "Unlit";
      elapsedEl.textContent = "—";
      startedAtEl.textContent = "Press Start to light it.";
      applyFlameVibe("cool");
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

  // ----- Supabase calls -----
  async function ensureProfileRow() {
    // ensures a profile exists for user (important!)
    const { error } = await supa.from("profiles").upsert({ id: sessionUser.id }, { onConflict: "id" });
    if (error) throw error;
  }

  async function loadProfile() {
    await ensureProfileRow();

    const { data, error } = await supa
      .from("profiles")
      .select("started_at")
      .eq("id", sessionUser.id)
      .single();

    if (error) throw error;

    startedAt = data?.started_at ? new Date(data.started_at) : null;
    startTimer();
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
    renderFlame();
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

    // delete buttons
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
    emailEl.value = "demo@example.com";
    passEl.value = "password123";
    showToast("Demo filled (change it).");
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

  btnSignOut.addEventListener("click", async () => {
    try {
      setBusy(btnSignOut, true);
      await supa.auth.signOut();
      showToast("Signed out.");
    } catch (e) {
      showToast(`Sign out failed: ${e.message}`);
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

  // go
  init();
})();