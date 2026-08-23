// i18n.js — NeverFap multi-language runtime.
//
// Plain global script, no build step. Load it in <head> BEFORE any other
// script so the cloak (see below) can hide the page until the strings are
// swapped — otherwise a non-English visitor sees a flash of English.
//
// Markup contract:
//   data-i18n="key"                     -> element.textContent
//   data-i18n-html="key"                -> element.innerHTML (string carries markup)
//   data-i18n-attr="placeholder:key;title:key2"  -> attributes
//   data-nf-lang                        -> empty element; the picker is mounted into it
//
// JS side: NF_I18N.t(key, params), .duration(ms), .dateTime(d), .onChange(fn).
(function () {
  var LANGS = [
    { code: "en", label: "English",  locale: undefined },
    { code: "de", label: "Deutsch",  locale: "de-DE" },
    { code: "es", label: "Español",  locale: "es-ES" },
    { code: "fr", label: "Français", locale: "fr-FR" },
    { code: "hu", label: "Magyar",   locale: "hu-HU" }
  ];

  var STORAGE_KEY = "nf_lang";
  var DICT = {};

  // ============================== ENGLISH ==============================
  DICT.en = {
    "lang.aria": "Language",

    // ---- Loading screen ----
    "load.init": "Initializing system",
    "load.skip": "Skip",
    "load.processors": "Loading Alpha Processors {n}/84",
    "load.tip1.label": "Panic Mode",
    "load.tip1.text": "Hit PANIC when an urge lands. Guided breathing, timed challenges and quick fixes are all in there.",
    "load.tip2.label": "The Diary",
    "load.tip2.text": "Write the urge out. Naming what set it off is how you spot the pattern later.",
    "load.tip3.label": "Restarting Is Fine",
    "load.tip3.text": "A reset is not a failure. Everyone starts over. What counts is that you start again.",

    // ---- Crash gag ----
    "crash.title": "NeverFap has crashed.",
    "crash.sub": "Please reload.",
    "crash.reload": "Reload",

    // ---- Header ----
    "header.tagline": "Be healthier, never fap.",
    "header.achievements": "Achievements",
    "header.signout": "Sign out",
    "header.clawdTitle": "Who's this little guy?",

    // ---- Auth ----
    "auth.title": "Log in",
    "auth.sub": "Your data is secured.",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.login": "Log in",
    "auth.signup": "Sign up",
    "auth.delete": "Delete my account",
    "auth.forgot": "Forgot password?",
    "auth.demo": "Fill demo",
    "auth.note": "All information kept is fully secure, nobody can view it. Not even administrators.",

    // ---- Flame card ----
    "flame.title": "Your Flame",
    "flame.infoAria": "Flame stages info",
    "flame.infoTitle": "Flame stages",
    "flame.sub": "Your little buddy who grows with time!",
    "flame.elapsedLabel": "Time since start",
    "flame.start": "Start",
    "flame.failed": "I failed",
    "flame.panic": "PANIC",
    "flame.pressStart": "Press Start to light it.",
    "flame.startedAt": "Started: {date}",

    // ---- Stages ----
    "stage.unlit": "Unlit",
    "stage.spark": "Spark",
    "stage.growing": "Growing",
    "stage.ruby": "Ruby Flame",
    "stage.amethyst": "Amethyst Flame",
    "stage.diamond": "Diamond Flame",
    "stage.emerald": "Emerald Flame",
    "stage.platinum": "Platinum Flame",
    "range.unlit": "Before Start",
    "range.spark": "0–12 hours",
    "range.growing": "12–48 hours",
    "range.ruby": "2–7 days",
    "range.amethyst": "7–21 days",
    "range.diamond": "21–30 days",
    "range.emerald": "30–60 days",
    "range.platinum": "60+ days",

    "flameInfo.title": "Flame stages",
    "flameInfo.sub": "Here's how your flame evolves over time.",
    "flameInfo.footer": "Your current stage is based on the time since you pressed Start.",
    "flameInfo.current": "(current)",
    "flameInfo.best": "(best)",
    "flameInfo.close": "Close",

    // ---- Duration units ----
    "dur.d": "d",
    "dur.h": "h",
    "dur.m": "m",
    "dur.s": "s",

    // ---- Diary ----
    "diary.title": "Diary",
    "diary.sub": "Private notes. Short is fine.",
    "diary.refresh": "Refresh",
    "diary.placeholder": "What's going on right now?",
    "diary.add": "Add entry",
    "diary.clear": "Clear",
    "diary.recent": "Recent",
    "diary.empty": "No entries yet.",
    "diary.delete": "Delete",

    "ios.cta": "Get NeverFap on iOS",

    // ---- Achievements ----
    "ach.title": "Achievements",
    "ach.sub": "Earn achievements by using the app.",
    "ach.close": "Close",
    "ach.save": "Save achievements",
    "ach.saved": "Saved ✓",
    "ach.hint": "Manual save to prevent bugs.",
    "ach.hintDone": "All set.",
    "ach.tip": "Tip: Achievements do not save automatically, press save to ensure your progress being saved!",
    "ach.unlockedAt": "Unlocked: {date}",
    "ach.grower.title": "Grower",
    "ach.grower.desc": "Grow your flame once (Spark → Growing).",
    "ach.self_control.title": "You can stop this",
    "ach.self_control.desc": "You pressed PANIC and interrupted the urge.",
    "ach.part_of_process.title": "It's a part of the process",
    "ach.part_of_process.desc": "Fail your streak once.",
    "ach.never_back_down.title": "Never back down never what?",
    "ach.never_back_down.desc": "Fail 5 times.",
    "ach.month_clean.title": "A month clean",
    "ach.month_clean.desc": "Reach the Emerald Flame (30 days).",
    "ach.stronger_than_ever.title": "Stronger than ever",
    "ach.stronger_than_ever.desc": "Reach the Platinum Flame (60 days).",

    // ---- Panic mode ----
    "panic.title": "Panic Mode",
    "panic.sub": "Stay with it. The urge passes.",
    "panic.close": "Close",
    "panic.tab.breathe": "BREATHE",
    "panic.tab.challenge": "CHALLENGE",
    "panic.tab.hits": "QUICK FIXES",

    "breath.ready": "Ready",
    "breath.help": "Box breathing. Follow the circle: in 4, hold 4, out 4, hold 4.",
    "breath.cycles": "Cycles completed: {n}",
    "breath.start": "Start breathing",
    "breath.stop": "Stop",
    "breath.in": "Breathe in",
    "breath.hold": "Hold",
    "breath.out": "Breathe out",

    "chal.pick": "Pick one. Do it now, not later.",
    "chal.remaining": "remaining",
    "chal.giveup": "Give up",
    "chal.beat": "You beat it.",
    "chal.beatSub": "The urge lost. Your flame is still burning.",
    "chal.again": "Another one",
    "chal.pushups": "20 pushups",
    "chal.plank": "1 minute plank",
    "chal.sprint": "2 minute sprint in place",
    "chal.cold": "30 seconds cold water",
    "chal.squats": "40 squats",
    "chal.still": "Sit still, do nothing",

    "hits.help": "Cheap dopamine that costs you nothing. Tap to mark done, tap again to undo.",
    "hits.sugar": "Spoon of sugar or honey",
    "hits.cold": "Cold water on your face",
    "hits.song": "Play your loudest song",
    "hits.walk": "Walk to another room",
    "hits.drink": "Make a hot drink, slowly",
    "hits.window": "Open a window, breathe outside air",
    "hits.tidy": "Tidy one small thing",
    "hits.text": "Text someone you like",
    "hits.nothingTitle": "If nothing works:",
    "hits.n1": "Leave the room. Go outside, even for 60 seconds.",
    "hits.n2": "Put your phone in another room, screen down.",
    "hits.n3": "Open the diary and write the urge out in full.",
    "hits.n4": "Message someone. Anyone. Break the isolation.",

    // ---- Confirm reset ----
    "fail.title": "Reset your streak?",
    "fail.body": "This will clear your current flame and add a fail to your count. This can't be undone.",
    "fail.yes": "Yes, I failed",
    "fail.cancel": "Cancel",

    // ---- Global popup ----
    "popup.defaultTitle": "Maintenance",
    "popup.defaultMsg": "Maintenance break soon!",
    "popup.notice": "Notice",
    "popup.close": "Close",

    // ---- Forgot password ----
    "forgot.line1": "Please send an email to",
    "forgot.line2": "With the email you signed up with. Responses range up to 72 hours.",
    "forgot.close": "Close",

    // ---- Bug report ----
    "bug.title": "Did someone say... bugs?",
    "bug.sub": "To report bugs, press the button below",
    "bug.cta": "Report bugs",
    "bug.close": "Close",

    // ---- Footer ----
    "footer.lastSavedEmpty": "Last saved --:--:--",
    "footer.lastSaved": "Last saved {time}",
    "footer.built": "Built by Tomm for a healthier world.",
    "footer.bugLink": "Report bugs by clicking me!",

    // ---- Clawd ----
    "clawd.title": "Meet Clawd!",
    "clawd.p1": "Clawd is the tiny mascot of <span class='font-semibold text-white/90'>Claude Code</span>, who helps build and maintain NeverFap behind the scenes.",
    "clawd.p2": "He's running around celebrating <span class='font-semibold text-orange-300'>Fable 5</span>'s return after 19 days. Fable 5 is Claude's strongest AI model, so strong that the government banned him. He returned a few days ago. Yay!",
    "clawd.close": "Neat 🧡",

    // ---- Toasts ----
    "toast.achUnlocked": "Achievement unlocked: {title} (remember to save)",
    "toast.saved": "Saved ✅",
    "toast.signedUp": "Signed up. You can log in now.",
    "toast.signupFailed": "Signup failed: {msg}",
    "toast.welcome": "Welcome back.",
    "toast.loginFailed": "Login failed: {msg}",
    "toast.signedOut": "Signed out.",
    "toast.signOutFailed": "Sign out failed: {msg}",
    "toast.flameLit": "Flame lit.",
    "toast.startFailed": "Start failed: {msg}",
    "toast.failOk": "It's ok to fail. Press Start when you're ready.",
    "toast.resetFailed": "Reset failed: {msg}",
    "toast.profileLoadFailed": "Profile load failed: {msg}",
    "toast.diaryLoadFailed": "Diary load failed: {msg}",
    "toast.entryDeleted": "Entry deleted.",
    "toast.deleteFailed": "Delete failed: {msg}",
    "toast.writeFirst": "Write something first.",
    "toast.clawdBack": "Clawd scuttles back! 🦀",
    "toast.entrySaved": "Entry saved.",
    "toast.saveFailed": "Save failed: {msg}",
    "toast.diaryRefreshed": "Diary refreshed.",
    "toast.refreshFailed": "Refresh failed: {msg}",
    "toast.challengeDone": "Challenge complete. Urge beaten. 🔥",

    // ---- Delete account page ----
    "del.pageTitle": "Delete Account • NeverFap",
    "del.back": "← Back",
    "del.title": "Delete Account",
    "del.sub": "Confirm your credentials to generate your deletion code.",
    "del.formTitle": "Re-enter your credentials",
    "del.confirm": "Confirm",
    "del.okTitle": "Correct credentials!",
    "del.okSub": "To delete your account, please send the following 6 digit code to",
    "del.errMissing": "Enter email and password.",
    "del.errInvalid": "Invalid credentials.",
    "del.errCode": "Could not retrieve deletion code.",

    // ---- iOS page ----
    "iosp.pageTitle": "NeverFap on iOS",
    "iosp.title": "NeverFap on iOS",
    "iosp.sub": "Use NeverFap on iPhone via Safari — no App Store required.",
    "iosp.s1": "Search for NeverFap in Safari",
    "iosp.s2": "Click the three-dots menu",
    "iosp.s2alt": "Open Safari menu",
    "iosp.s3": "Select Share",
    "iosp.s3alt": "Tap Share",
    "iosp.s4": "Select “Add to Home Screen”",
    "iosp.s4alt": "Add to Home Screen",
    "iosp.s5": "Confirm and add",
    "iosp.s5alt": "Confirm adding to Home Screen",
    "iosp.s6": "Launch from your Home Screen",
    "iosp.s6alt": "Launch NeverFap",
    "iosp.footer": "iOS support via Progressive Web App (PWA)",

    // ---- Maintenance page ----
    "maint.pageTitle": "NeverFap • Maintenance",
    "maint.title": "Maintenance Break!",
    "maint.sub": "NeverFap is offline while there are changes being made that may break the website. We will be back online soon!",
    "maint.note": "I will be back soon!",
    "maint.button": "Refresh",
    "maint.footer": "Thanks for your patience ❤️",
    "maint.adminTitle": "Admin access",
    "maint.adminSub": "Sign in to bypass the maintenance break.",
    "maint.enter": "Enter",
    "maint.cancel": "Cancel",
    "maint.inTitle": "You're in ✅",
    "maint.inSub": "Maintenance bypass active. Where do you want to go?",
    "maint.notAdmin": "Not an admin account.",
    "maint.authUnavailable": "Auth unavailable. Try again.",
    "maint.invalid": "Invalid credentials.",
    "maint.checking": "Checking…",

    // ---- Demo page ----
    "demo.readonly": "Demo is read-only",
    "demo.stageCalm": "Calm Control",
    "demo.rangeCalm": "14–21 days",
    "demo.elapsed": "14d 13h 33m",
    "demo.startedAt": "Started: 1/4/2026, 16:53:14",
    "demo.diaryText": "Hello! This is the Demo account which cannot be modified. To get your own account, press sign out and log into your own account!",
    "demo.diaryEmpty": "Demo account — entries are disabled.",
    "demo.achSub": "Demo preview (read-only).",
    "demo.achNote": "This is a demo preview. Achievements are shown only — they can't be changed here.",
    "demo.unlocked1": "Unlocked: 1/5/2026, 08:21",
    "demo.unlocked2": "Unlocked: 1/7/2026, 19:02",
    "demo.flameSub": "How your flame evolves over time.",
    "demo.flameNote": "Demo preview — real stages update live in your account.",
    "demo.footer": "Built by Tomm for a healthier world. Any bugs can be DM-ed to me on tiktok @tommfr38"
  };

  // ============================== DEUTSCH ==============================
  DICT.de = {
    "lang.aria": "Sprache",

    "load.init": "System wird initialisiert",
    "load.skip": "Überspringen",
    "load.processors": "Alpha-Prozessoren werden geladen {n}/84",
    "load.tip1.label": "Panikmodus",
    "load.tip1.text": "Drück PANIK, wenn dich ein Drang überkommt. Geführte Atemübungen, Challenges mit Timer und schnelle Ablenkungen findest du alle dort.",
    "load.tip2.label": "Das Tagebuch",
    "load.tip2.text": "Schreib den Drang auf. Wer benennt, was ihn ausgelöst hat, erkennt später das Muster.",
    "load.tip3.label": "Neu anfangen ist okay",
    "load.tip3.text": "Ein Reset ist kein Scheitern. Jeder fängt mal von vorn an. Wichtig ist nur, dass du wieder anfängst.",

    "crash.title": "NeverFap ist abgestürzt.",
    "crash.sub": "Bitte lade die Seite neu.",
    "crash.reload": "Neu laden",

    "header.tagline": "Lebe gesünder, hör auf zu fappen.",
    "header.achievements": "Erfolge",
    "header.signout": "Abmelden",
    "header.clawdTitle": "Wer ist der kleine Kerl?",

    "auth.title": "Anmelden",
    "auth.sub": "Deine Daten sind sicher.",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.login": "Anmelden",
    "auth.signup": "Registrieren",
    "auth.delete": "Mein Konto löschen",
    "auth.forgot": "Passwort vergessen?",
    "auth.demo": "Demo ansehen",
    "auth.note": "Alle gespeicherten Daten sind vollständig sicher, niemand kann sie einsehen. Nicht einmal Administratoren.",

    "flame.title": "Deine Flamme",
    "flame.infoAria": "Infos zu den Flammenstufen",
    "flame.infoTitle": "Flammenstufen",
    "flame.sub": "Dein kleiner Begleiter, der mit der Zeit wächst!",
    "flame.elapsedLabel": "Zeit seit dem Start",
    "flame.start": "Start",
    "flame.failed": "Ich bin rückfällig",
    "flame.panic": "PANIK",
    "flame.pressStart": "Drück auf Start, um sie zu entzünden.",
    "flame.startedAt": "Start: {date}",

    "stage.unlit": "Erloschen",
    "stage.spark": "Funke",
    "stage.growing": "Wächst",
    "stage.ruby": "Rubinflamme",
    "stage.amethyst": "Amethystflamme",
    "stage.diamond": "Diamantflamme",
    "stage.emerald": "Smaragdflamme",
    "stage.platinum": "Platinflamme",
    "range.unlit": "Vor dem Start",
    "range.spark": "0–12 Stunden",
    "range.growing": "12–48 Stunden",
    "range.ruby": "2–7 Tage",
    "range.amethyst": "7–21 Tage",
    "range.diamond": "21–30 Tage",
    "range.emerald": "30–60 Tage",
    "range.platinum": "60+ Tage",

    "flameInfo.title": "Flammenstufen",
    "flameInfo.sub": "So entwickelt sich deine Flamme mit der Zeit.",
    "flameInfo.footer": "Deine aktuelle Stufe richtet sich nach der Zeit seit deinem Start.",
    "flameInfo.current": "(aktuell)",
    "flameInfo.best": "(Bestwert)",
    "flameInfo.close": "Schließen",

    "dur.d": " T",
    "dur.h": " Std",
    "dur.m": " Min",
    "dur.s": " Sek",

    "diary.title": "Tagebuch",
    "diary.sub": "Private Notizen. Kurz reicht völlig.",
    "diary.refresh": "Aktualisieren",
    "diary.placeholder": "Was geht gerade in dir vor?",
    "diary.add": "Eintrag hinzufügen",
    "diary.clear": "Leeren",
    "diary.recent": "Letzte Einträge",
    "diary.empty": "Noch keine Einträge.",
    "diary.delete": "Löschen",

    "ios.cta": "NeverFap auf iOS holen",

    "ach.title": "Erfolge",
    "ach.sub": "Schalte Erfolge frei, indem du die App nutzt.",
    "ach.close": "Schließen",
    "ach.save": "Erfolge speichern",
    "ach.saved": "Gespeichert ✓",
    "ach.hint": "Manuelles Speichern, um Fehler zu vermeiden.",
    "ach.hintDone": "Alles gespeichert.",
    "ach.tip": "Tipp: Erfolge werden nicht automatisch gespeichert – drück auf Speichern, damit dein Fortschritt sicher erhalten bleibt!",
    "ach.unlockedAt": "Freigeschaltet: {date}",
    "ach.grower.title": "Gewachsen",
    "ach.grower.desc": "Lass deine Flamme einmal wachsen (Funke → Wächst).",
    "ach.self_control.title": "Du kannst das stoppen",
    "ach.self_control.desc": "Du hast PANIK gedrückt und den Drang unterbrochen.",
    "ach.part_of_process.title": "Das gehört zum Prozess",
    "ach.part_of_process.desc": "Werde einmal rückfällig.",
    "ach.never_back_down.title": "Niemals zurückweichen, niemals was?",
    "ach.never_back_down.desc": "Werde 5-mal rückfällig.",
    "ach.month_clean.title": "Einen Monat clean",
    "ach.month_clean.desc": "Erreiche die Smaragdflamme (30 Tage).",
    "ach.stronger_than_ever.title": "Stärker als je zuvor",
    "ach.stronger_than_ever.desc": "Erreiche die Platinflamme (60 Tage).",

    "panic.title": "Panikmodus",
    "panic.sub": "Bleib dran. Der Drang geht vorbei.",
    "panic.close": "Schließen",
    "panic.tab.breathe": "ATMEN",
    "panic.tab.challenge": "CHALLENGE",
    "panic.tab.hits": "SOFORTHILFE",

    "breath.ready": "Bereit",
    "breath.help": "Box-Atmung. Folge dem Kreis: 4 ein, 4 halten, 4 aus, 4 halten.",
    "breath.cycles": "Abgeschlossene Zyklen: {n}",
    "breath.start": "Atmung starten",
    "breath.stop": "Stopp",
    "breath.in": "Einatmen",
    "breath.hold": "Halten",
    "breath.out": "Ausatmen",

    "chal.pick": "Wähl eine aus. Mach sie jetzt, nicht später.",
    "chal.remaining": "verbleibend",
    "chal.giveup": "Aufgeben",
    "chal.beat": "Du hast ihn besiegt.",
    "chal.beatSub": "Der Drang hat verloren. Deine Flamme brennt weiter.",
    "chal.again": "Noch eine",
    "chal.pushups": "20 Liegestütze",
    "chal.plank": "1 Minute Planke",
    "chal.sprint": "2 Minuten Sprint auf der Stelle",
    "chal.cold": "30 Sekunden kaltes Wasser",
    "chal.squats": "40 Kniebeugen",
    "chal.still": "Still sitzen, nichts tun",

    "hits.help": "Billiges Dopamin, das dich nichts kostet. Tippen zum Abhaken, nochmal tippen zum Rückgängigmachen.",
    "hits.sugar": "Ein Löffel Zucker oder Honig",
    "hits.cold": "Kaltes Wasser ins Gesicht",
    "hits.song": "Spiel deinen lautesten Song",
    "hits.walk": "Geh in einen anderen Raum",
    "hits.drink": "Mach dir langsam ein heißes Getränk",
    "hits.window": "Mach ein Fenster auf, atme frische Luft",
    "hits.tidy": "Räum eine Kleinigkeit auf",
    "hits.text": "Schreib jemandem, den du magst",
    "hits.nothingTitle": "Wenn nichts hilft:",
    "hits.n1": "Verlass den Raum. Geh raus, und sei es nur für 60 Sekunden.",
    "hits.n2": "Leg dein Handy in einen anderen Raum, Display nach unten.",
    "hits.n3": "Öffne das Tagebuch und schreib den Drang komplett auf.",
    "hits.n4": "Schreib jemandem. Egal wem. Durchbrich die Isolation.",

    "fail.title": "Serie zurücksetzen?",
    "fail.body": "Damit wird deine aktuelle Flamme gelöscht und dein Rückfall-Zähler erhöht. Das lässt sich nicht rückgängig machen.",
    "fail.yes": "Ja, ich bin rückfällig",
    "fail.cancel": "Abbrechen",

    "popup.defaultTitle": "Wartung",
    "popup.defaultMsg": "Bald gibt es eine Wartungspause!",
    "popup.notice": "Hinweis",
    "popup.close": "Schließen",

    "forgot.line1": "Bitte schreib eine E-Mail an",
    "forgot.line2": "Mit der E-Mail-Adresse, mit der du dich registriert hast. Eine Antwort kann bis zu 72 Stunden dauern.",
    "forgot.close": "Schließen",

    "bug.title": "Hat da jemand … Bugs gesagt?",
    "bug.sub": "Um Bugs zu melden, drück auf den Button unten",
    "bug.cta": "Bugs melden",
    "bug.close": "Schließen",

    "footer.lastSavedEmpty": "Zuletzt gespeichert --:--:--",
    "footer.lastSaved": "Zuletzt gespeichert {time}",
    "footer.built": "Von Tomm gebaut, für eine gesündere Welt.",
    "footer.bugLink": "Klick mich, um Bugs zu melden!",

    "clawd.title": "Das ist Clawd!",
    "clawd.p1": "Clawd ist das kleine Maskottchen von <span class='font-semibold text-white/90'>Claude Code</span>, das im Hintergrund dabei hilft, NeverFap zu bauen und zu pflegen.",
    "clawd.p2": "Er läuft herum und feiert die Rückkehr von <span class='font-semibold text-orange-300'>Fable 5</span> nach 19 Tagen. Fable 5 ist Claudes stärkstes KI-Modell – so stark, dass die Regierung es verboten hat. Vor ein paar Tagen ist es zurückgekommen. Juhu!",
    "clawd.close": "Cool 🧡",

    "toast.achUnlocked": "Erfolg freigeschaltet: {title} (denk ans Speichern)",
    "toast.saved": "Gespeichert ✅",
    "toast.signedUp": "Registriert. Du kannst dich jetzt anmelden.",
    "toast.signupFailed": "Registrierung fehlgeschlagen: {msg}",
    "toast.welcome": "Willkommen zurück.",
    "toast.loginFailed": "Anmeldung fehlgeschlagen: {msg}",
    "toast.signedOut": "Abgemeldet.",
    "toast.signOutFailed": "Abmelden fehlgeschlagen: {msg}",
    "toast.flameLit": "Flamme entzündet.",
    "toast.startFailed": "Start fehlgeschlagen: {msg}",
    "toast.failOk": "Rückfälle passieren. Drück auf Start, wenn du bereit bist.",
    "toast.resetFailed": "Zurücksetzen fehlgeschlagen: {msg}",
    "toast.profileLoadFailed": "Profil konnte nicht geladen werden: {msg}",
    "toast.diaryLoadFailed": "Tagebuch konnte nicht geladen werden: {msg}",
    "toast.entryDeleted": "Eintrag gelöscht.",
    "toast.deleteFailed": "Löschen fehlgeschlagen: {msg}",
    "toast.writeFirst": "Schreib erst etwas.",
    "toast.clawdBack": "Clawd krabbelt zurück! 🦀",
    "toast.entrySaved": "Eintrag gespeichert.",
    "toast.saveFailed": "Speichern fehlgeschlagen: {msg}",
    "toast.diaryRefreshed": "Tagebuch aktualisiert.",
    "toast.refreshFailed": "Aktualisieren fehlgeschlagen: {msg}",
    "toast.challengeDone": "Challenge geschafft. Drang besiegt. 🔥",

    "del.pageTitle": "Konto löschen • NeverFap",
    "del.back": "← Zurück",
    "del.title": "Konto löschen",
    "del.sub": "Bestätige deine Zugangsdaten, um deinen Löschcode zu erhalten.",
    "del.formTitle": "Gib deine Zugangsdaten erneut ein",
    "del.confirm": "Bestätigen",
    "del.okTitle": "Zugangsdaten korrekt!",
    "del.okSub": "Um dein Konto zu löschen, schick bitte den folgenden 6-stelligen Code an",
    "del.errMissing": "Gib E-Mail und Passwort ein.",
    "del.errInvalid": "Ungültige Zugangsdaten.",
    "del.errCode": "Löschcode konnte nicht abgerufen werden.",

    "iosp.pageTitle": "NeverFap auf iOS",
    "iosp.title": "NeverFap auf iOS",
    "iosp.sub": "Nutze NeverFap auf dem iPhone über Safari – ganz ohne App Store.",
    "iosp.s1": "Suche in Safari nach NeverFap",
    "iosp.s2": "Tippe auf das Drei-Punkte-Menü",
    "iosp.s2alt": "Safari-Menü öffnen",
    "iosp.s3": "Wähle „Teilen“",
    "iosp.s3alt": "Auf „Teilen“ tippen",
    "iosp.s4": "Wähle „Zum Home-Bildschirm“",
    "iosp.s4alt": "Zum Home-Bildschirm hinzufügen",
    "iosp.s5": "Bestätigen und hinzufügen",
    "iosp.s5alt": "Hinzufügen zum Home-Bildschirm bestätigen",
    "iosp.s6": "Starte die App vom Home-Bildschirm",
    "iosp.s6alt": "NeverFap starten",
    "iosp.footer": "iOS-Unterstützung über Progressive Web App (PWA)",

    "maint.pageTitle": "NeverFap • Wartung",
    "maint.title": "Wartungspause!",
    "maint.sub": "NeverFap ist offline, während Änderungen vorgenommen werden, die die Website beeinträchtigen könnten. Wir sind bald wieder da!",
    "maint.note": "Ich bin bald zurück!",
    "maint.button": "Aktualisieren",
    "maint.footer": "Danke für deine Geduld ❤️",
    "maint.adminTitle": "Admin-Zugang",
    "maint.adminSub": "Melde dich an, um die Wartungspause zu umgehen.",
    "maint.enter": "Weiter",
    "maint.cancel": "Abbrechen",
    "maint.inTitle": "Du bist drin ✅",
    "maint.inSub": "Wartungs-Bypass aktiv. Wohin möchtest du?",
    "maint.notAdmin": "Kein Admin-Konto.",
    "maint.authUnavailable": "Anmeldung nicht verfügbar. Versuch es erneut.",
    "maint.invalid": "Ungültige Zugangsdaten.",
    "maint.checking": "Wird geprüft …",

    "demo.readonly": "Die Demo ist schreibgeschützt",
    "demo.stageCalm": "Ruhige Kontrolle",
    "demo.rangeCalm": "14–21 Tage",
    "demo.elapsed": "14 T 13 Std 33 Min",
    "demo.startedAt": "Start: 04.01.2026, 16:53:14",
    "demo.diaryText": "Hallo! Das hier ist das Demo-Konto, das nicht verändert werden kann. Für dein eigenes Konto meld dich ab und log dich mit deinem eigenen Konto ein!",
    "demo.diaryEmpty": "Demo-Konto – Einträge sind deaktiviert.",
    "demo.achSub": "Demo-Vorschau (schreibgeschützt).",
    "demo.achNote": "Das ist eine Demo-Vorschau. Die Erfolge werden nur angezeigt – hier lassen sie sich nicht ändern.",
    "demo.unlocked1": "Freigeschaltet: 05.01.2026, 08:21",
    "demo.unlocked2": "Freigeschaltet: 07.01.2026, 19:02",
    "demo.flameSub": "So entwickelt sich deine Flamme mit der Zeit.",
    "demo.flameNote": "Demo-Vorschau – in deinem Konto werden die echten Stufen live aktualisiert.",
    "demo.footer": "Von Tomm gebaut, für eine gesündere Welt. Bugs kannst du mir auf TikTok per DM schicken: @tommfr38"
  };

  // ============================== ESPAÑOL ==============================
  DICT.es = {
    "lang.aria": "Idioma",

    "load.init": "Iniciando el sistema",
    "load.skip": "Saltar",
    "load.processors": "Cargando procesadores Alpha {n}/84",
    "load.tip1.label": "Modo pánico",
    "load.tip1.text": "Pulsa PÁNICO cuando te venga un impulso. Ahí dentro tienes respiración guiada, retos con temporizador y alivios rápidos.",
    "load.tip2.label": "El diario",
    "load.tip2.text": "Escribe el impulso. Poner nombre a lo que lo desencadenó es lo que te permite ver el patrón más adelante.",
    "load.tip3.label": "Volver a empezar está bien",
    "load.tip3.text": "Reiniciar no es fracasar. Todo el mundo empieza de cero alguna vez. Lo que cuenta es que vuelvas a empezar.",

    "crash.title": "NeverFap se ha bloqueado.",
    "crash.sub": "Vuelve a cargar la página.",
    "crash.reload": "Recargar",

    "header.tagline": "Vive más sano, deja de masturbarte.",
    "header.achievements": "Logros",
    "header.signout": "Cerrar sesión",
    "header.clawdTitle": "¿Quién es este pequeñín?",

    "auth.title": "Iniciar sesión",
    "auth.sub": "Tus datos están protegidos.",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.login": "Iniciar sesión",
    "auth.signup": "Crear cuenta",
    "auth.delete": "Eliminar mi cuenta",
    "auth.forgot": "¿Olvidaste tu contraseña?",
    "auth.demo": "Ver la demo",
    "auth.note": "Toda la información guardada es totalmente segura y nadie puede verla. Ni siquiera los administradores.",

    "flame.title": "Tu llama",
    "flame.infoAria": "Información sobre las etapas de la llama",
    "flame.infoTitle": "Etapas de la llama",
    "flame.sub": "¡Tu pequeño compañero que crece con el tiempo!",
    "flame.elapsedLabel": "Tiempo desde el inicio",
    "flame.start": "Empezar",
    "flame.failed": "Recaí",
    "flame.panic": "PÁNICO",
    "flame.pressStart": "Pulsa Empezar para encenderla.",
    "flame.startedAt": "Inicio: {date}",

    "stage.unlit": "Apagada",
    "stage.spark": "Chispa",
    "stage.growing": "Creciendo",
    "stage.ruby": "Llama de rubí",
    "stage.amethyst": "Llama de amatista",
    "stage.diamond": "Llama de diamante",
    "stage.emerald": "Llama de esmeralda",
    "stage.platinum": "Llama de platino",
    "range.unlit": "Antes de empezar",
    "range.spark": "0–12 horas",
    "range.growing": "12–48 horas",
    "range.ruby": "2–7 días",
    "range.amethyst": "7–21 días",
    "range.diamond": "21–30 días",
    "range.emerald": "30–60 días",
    "range.platinum": "60+ días",

    "flameInfo.title": "Etapas de la llama",
    "flameInfo.sub": "Así evoluciona tu llama con el tiempo.",
    "flameInfo.footer": "Tu etapa actual depende del tiempo transcurrido desde que pulsaste Empezar.",
    "flameInfo.current": "(actual)",
    "flameInfo.best": "(mejor)",
    "flameInfo.close": "Cerrar",

    "dur.d": " d",
    "dur.h": " h",
    "dur.m": " min",
    "dur.s": " s",

    "diary.title": "Diario",
    "diary.sub": "Notas privadas. Corto está bien.",
    "diary.refresh": "Actualizar",
    "diary.placeholder": "¿Qué te está pasando ahora mismo?",
    "diary.add": "Añadir entrada",
    "diary.clear": "Borrar",
    "diary.recent": "Recientes",
    "diary.empty": "Aún no hay entradas.",
    "diary.delete": "Eliminar",

    "ios.cta": "Consigue NeverFap en iOS",

    "ach.title": "Logros",
    "ach.sub": "Consigue logros usando la app.",
    "ach.close": "Cerrar",
    "ach.save": "Guardar logros",
    "ach.saved": "Guardado ✓",
    "ach.hint": "Guardado manual para evitar errores.",
    "ach.hintDone": "Todo guardado.",
    "ach.tip": "Consejo: los logros no se guardan solos. ¡Pulsa Guardar para asegurarte de que tu progreso queda registrado!",
    "ach.unlockedAt": "Desbloqueado: {date}",
    "ach.grower.title": "Crecimiento",
    "ach.grower.desc": "Haz crecer tu llama una vez (Chispa → Creciendo).",
    "ach.self_control.title": "Puedes parar esto",
    "ach.self_control.desc": "Pulsaste PÁNICO e interrumpiste el impulso.",
    "ach.part_of_process.title": "Es parte del proceso",
    "ach.part_of_process.desc": "Recae una vez.",
    "ach.never_back_down.title": "Nunca te rindas, ¿nunca qué?",
    "ach.never_back_down.desc": "Recae 5 veces.",
    "ach.month_clean.title": "Un mes limpio",
    "ach.month_clean.desc": "Alcanza la Llama de esmeralda (30 días).",
    "ach.stronger_than_ever.title": "Más fuerte que nunca",
    "ach.stronger_than_ever.desc": "Alcanza la Llama de platino (60 días).",

    "panic.title": "Modo pánico",
    "panic.sub": "Aguanta. El impulso pasa.",
    "panic.close": "Cerrar",
    "panic.tab.breathe": "RESPIRAR",
    "panic.tab.challenge": "RETO",
    "panic.tab.hits": "ALIVIO RÁPIDO",

    "breath.ready": "Listo",
    "breath.help": "Respiración cuadrada. Sigue el círculo: inspira 4, aguanta 4, espira 4, aguanta 4.",
    "breath.cycles": "Ciclos completados: {n}",
    "breath.start": "Empezar a respirar",
    "breath.stop": "Parar",
    "breath.in": "Inspira",
    "breath.hold": "Aguanta",
    "breath.out": "Espira",

    "chal.pick": "Elige uno. Hazlo ahora, no luego.",
    "chal.remaining": "restante",
    "chal.giveup": "Rendirse",
    "chal.beat": "Lo has vencido.",
    "chal.beatSub": "El impulso ha perdido. Tu llama sigue ardiendo.",
    "chal.again": "Otro más",
    "chal.pushups": "20 flexiones",
    "chal.plank": "1 minuto de plancha",
    "chal.sprint": "2 minutos corriendo en el sitio",
    "chal.cold": "30 segundos de agua fría",
    "chal.squats": "40 sentadillas",
    "chal.still": "Quédate quieto, no hagas nada",

    "hits.help": "Dopamina barata que no te cuesta nada. Toca para marcar como hecho y toca otra vez para deshacer.",
    "hits.sugar": "Una cucharada de azúcar o miel",
    "hits.cold": "Agua fría en la cara",
    "hits.song": "Pon tu canción más ruidosa",
    "hits.walk": "Vete a otra habitación",
    "hits.drink": "Prepárate una bebida caliente, sin prisa",
    "hits.window": "Abre una ventana y respira aire de fuera",
    "hits.tidy": "Ordena una cosa pequeña",
    "hits.text": "Escríbele a alguien que te caiga bien",
    "hits.nothingTitle": "Si nada funciona:",
    "hits.n1": "Sal de la habitación. Sal a la calle, aunque sean 60 segundos.",
    "hits.n2": "Deja el móvil en otra habitación, con la pantalla hacia abajo.",
    "hits.n3": "Abre el diario y escribe el impulso entero.",
    "hits.n4": "Escríbele a alguien. A quien sea. Rompe el aislamiento.",

    "fail.title": "¿Reiniciar tu racha?",
    "fail.body": "Esto apagará tu llama actual y sumará una recaída a tu contador. No se puede deshacer.",
    "fail.yes": "Sí, recaí",
    "fail.cancel": "Cancelar",

    "popup.defaultTitle": "Mantenimiento",
    "popup.defaultMsg": "¡Pronto habrá una pausa por mantenimiento!",
    "popup.notice": "Aviso",
    "popup.close": "Cerrar",

    "forgot.line1": "Envía un correo a",
    "forgot.line2": "Desde el correo con el que te registraste. La respuesta puede tardar hasta 72 horas.",
    "forgot.close": "Cerrar",

    "bug.title": "¿Alguien ha dicho... bugs?",
    "bug.sub": "Para informar de errores, pulsa el botón de abajo",
    "bug.cta": "Informar de errores",
    "bug.close": "Cerrar",

    "footer.lastSavedEmpty": "Guardado por última vez --:--:--",
    "footer.lastSaved": "Guardado por última vez {time}",
    "footer.built": "Creado por Tomm para un mundo más sano.",
    "footer.bugLink": "¡Haz clic aquí para informar de errores!",

    "clawd.title": "¡Te presento a Clawd!",
    "clawd.p1": "Clawd es la pequeña mascota de <span class='font-semibold text-white/90'>Claude Code</span>, que ayuda a crear y mantener NeverFap entre bastidores.",
    "clawd.p2": "Anda corriendo por ahí celebrando el regreso de <span class='font-semibold text-orange-300'>Fable 5</span> después de 19 días. Fable 5 es el modelo de IA más potente de Claude, tan potente que el gobierno lo prohibió. Volvió hace unos días. ¡Bien!",
    "clawd.close": "Genial 🧡",

    "toast.achUnlocked": "Logro desbloqueado: {title} (acuérdate de guardar)",
    "toast.saved": "Guardado ✅",
    "toast.signedUp": "Cuenta creada. Ya puedes iniciar sesión.",
    "toast.signupFailed": "No se pudo crear la cuenta: {msg}",
    "toast.welcome": "Bienvenido de nuevo.",
    "toast.loginFailed": "No se pudo iniciar sesión: {msg}",
    "toast.signedOut": "Sesión cerrada.",
    "toast.signOutFailed": "No se pudo cerrar la sesión: {msg}",
    "toast.flameLit": "Llama encendida.",
    "toast.startFailed": "No se pudo empezar: {msg}",
    "toast.failOk": "No pasa nada por recaer. Pulsa Empezar cuando estés listo.",
    "toast.resetFailed": "No se pudo reiniciar: {msg}",
    "toast.profileLoadFailed": "No se pudo cargar el perfil: {msg}",
    "toast.diaryLoadFailed": "No se pudo cargar el diario: {msg}",
    "toast.entryDeleted": "Entrada eliminada.",
    "toast.deleteFailed": "No se pudo eliminar: {msg}",
    "toast.writeFirst": "Escribe algo primero.",
    "toast.clawdBack": "¡Clawd vuelve correteando! 🦀",
    "toast.entrySaved": "Entrada guardada.",
    "toast.saveFailed": "No se pudo guardar: {msg}",
    "toast.diaryRefreshed": "Diario actualizado.",
    "toast.refreshFailed": "No se pudo actualizar: {msg}",
    "toast.challengeDone": "Reto completado. Impulso vencido. 🔥",

    "del.pageTitle": "Eliminar cuenta • NeverFap",
    "del.back": "← Volver",
    "del.title": "Eliminar cuenta",
    "del.sub": "Confirma tus credenciales para generar tu código de eliminación.",
    "del.formTitle": "Vuelve a introducir tus credenciales",
    "del.confirm": "Confirmar",
    "del.okTitle": "¡Credenciales correctas!",
    "del.okSub": "Para eliminar tu cuenta, envía el siguiente código de 6 dígitos a",
    "del.errMissing": "Introduce el correo y la contraseña.",
    "del.errInvalid": "Credenciales no válidas.",
    "del.errCode": "No se ha podido obtener el código de eliminación.",

    "iosp.pageTitle": "NeverFap en iOS",
    "iosp.title": "NeverFap en iOS",
    "iosp.sub": "Usa NeverFap en el iPhone desde Safari, sin necesidad de la App Store.",
    "iosp.s1": "Busca NeverFap en Safari",
    "iosp.s2": "Toca el menú de los tres puntos",
    "iosp.s2alt": "Abrir el menú de Safari",
    "iosp.s3": "Selecciona Compartir",
    "iosp.s3alt": "Tocar Compartir",
    "iosp.s4": "Selecciona «Añadir a inicio»",
    "iosp.s4alt": "Añadir a la pantalla de inicio",
    "iosp.s5": "Confirma y añade",
    "iosp.s5alt": "Confirmar que se añade a la pantalla de inicio",
    "iosp.s6": "Ábrela desde tu pantalla de inicio",
    "iosp.s6alt": "Abrir NeverFap",
    "iosp.footer": "Compatibilidad con iOS mediante Progressive Web App (PWA)",

    "maint.pageTitle": "NeverFap • Mantenimiento",
    "maint.title": "¡Pausa por mantenimiento!",
    "maint.sub": "NeverFap está desconectado mientras se hacen cambios que podrían romper la web. ¡Volveremos pronto!",
    "maint.note": "¡Vuelvo enseguida!",
    "maint.button": "Actualizar",
    "maint.footer": "Gracias por tu paciencia ❤️",
    "maint.adminTitle": "Acceso de administrador",
    "maint.adminSub": "Inicia sesión para saltarte la pausa por mantenimiento.",
    "maint.enter": "Entrar",
    "maint.cancel": "Cancelar",
    "maint.inTitle": "Ya estás dentro ✅",
    "maint.inSub": "Acceso de mantenimiento activo. ¿Adónde quieres ir?",
    "maint.notAdmin": "No es una cuenta de administrador.",
    "maint.authUnavailable": "Autenticación no disponible. Inténtalo de nuevo.",
    "maint.invalid": "Credenciales no válidas.",
    "maint.checking": "Comprobando…",

    "demo.readonly": "La demo es de solo lectura",
    "demo.stageCalm": "Control sereno",
    "demo.rangeCalm": "14–21 días",
    "demo.elapsed": "14 d 13 h 33 min",
    "demo.startedAt": "Inicio: 4/1/2026, 16:53:14",
    "demo.diaryText": "¡Hola! Esta es la cuenta de demostración y no se puede modificar. Para tener tu propia cuenta, cierra sesión e inicia sesión con la tuya.",
    "demo.diaryEmpty": "Cuenta de demostración: las entradas están desactivadas.",
    "demo.achSub": "Vista previa de la demo (solo lectura).",
    "demo.achNote": "Esto es una vista previa de la demo. Los logros solo se muestran; aquí no se pueden cambiar.",
    "demo.unlocked1": "Desbloqueado: 5/1/2026, 08:21",
    "demo.unlocked2": "Desbloqueado: 7/1/2026, 19:02",
    "demo.flameSub": "Así evoluciona tu llama con el tiempo.",
    "demo.flameNote": "Vista previa de la demo: en tu cuenta las etapas reales se actualizan en vivo.",
    "demo.footer": "Creado por Tomm para un mundo más sano. Puedes enviarme los errores por mensaje directo en TikTok: @tommfr38"
  };

  // ============================== FRANÇAIS ==============================
  // Les valeurs fr utilisent U+00A0 (espace insecable) avant ? ! : ; comme le veut la typographie francaise.
  DICT.fr = {
    "lang.aria": "Langue",

    "load.init": "Initialisation du système",
    "load.skip": "Passer",
    "load.processors": "Chargement des processeurs Alpha {n}/84",
    "load.tip1.label": "Mode panique",
    "load.tip1.text": "Appuie sur PANIQUE quand une envie arrive. Respiration guidée, défis chronométrés et astuces rapides sont tous là-dedans.",
    "load.tip2.label": "Le journal",
    "load.tip2.text": "Écris l'envie noir sur blanc. C'est en nommant ce qui l'a déclenchée que tu repéreras le schéma plus tard.",
    "load.tip3.label": "Recommencer, c'est normal",
    "load.tip3.text": "Une remise à zéro n'est pas un échec. Tout le monde repart de zéro un jour. Ce qui compte, c'est que tu recommences.",

    "crash.title": "NeverFap a planté.",
    "crash.sub": "Recharge la page.",
    "crash.reload": "Recharger",

    "header.tagline": "Vis plus sainement, arrête la masturbation.",
    "header.achievements": "Succès",
    "header.signout": "Se déconnecter",
    "header.clawdTitle": "C'est qui, ce petit bonhomme ?",

    "auth.title": "Connexion",
    "auth.sub": "Tes données sont protégées.",
    "auth.email": "E-mail",
    "auth.password": "Mot de passe",
    "auth.login": "Se connecter",
    "auth.signup": "Créer un compte",
    "auth.delete": "Supprimer mon compte",
    "auth.forgot": "Mot de passe oublié ?",
    "auth.demo": "Voir la démo",
    "auth.note": "Toutes les informations conservées sont parfaitement sécurisées, personne ne peut les consulter. Pas même les administrateurs.",

    "flame.title": "Ta flamme",
    "flame.infoAria": "Infos sur les paliers de la flamme",
    "flame.infoTitle": "Paliers de la flamme",
    "flame.sub": "Ton petit compagnon qui grandit avec le temps !",
    "flame.elapsedLabel": "Temps depuis le début",
    "flame.start": "Démarrer",
    "flame.failed": "J'ai rechuté",
    "flame.panic": "PANIQUE",
    "flame.pressStart": "Appuie sur Démarrer pour l'allumer.",
    "flame.startedAt": "Début : {date}",

    "stage.unlit": "Éteinte",
    "stage.spark": "Étincelle",
    "stage.growing": "En croissance",
    "stage.ruby": "Flamme de rubis",
    "stage.amethyst": "Flamme d'améthyste",
    "stage.diamond": "Flamme de diamant",
    "stage.emerald": "Flamme d'émeraude",
    "stage.platinum": "Flamme de platine",
    "range.unlit": "Avant le début",
    "range.spark": "0–12 heures",
    "range.growing": "12–48 heures",
    "range.ruby": "2–7 jours",
    "range.amethyst": "7–21 jours",
    "range.diamond": "21–30 jours",
    "range.emerald": "30–60 jours",
    "range.platinum": "60+ jours",

    "flameInfo.title": "Paliers de la flamme",
    "flameInfo.sub": "Voici comment ta flamme évolue avec le temps.",
    "flameInfo.footer": "Ton palier actuel dépend du temps écoulé depuis que tu as appuyé sur Démarrer.",
    "flameInfo.current": "(actuel)",
    "flameInfo.best": "(record)",
    "flameInfo.close": "Fermer",

    "dur.d": " j",
    "dur.h": " h",
    "dur.m": " min",
    "dur.s": " s",

    "diary.title": "Journal",
    "diary.sub": "Notes privées. Court, c'est très bien.",
    "diary.refresh": "Actualiser",
    "diary.placeholder": "Qu'est-ce qui se passe en toi, là, maintenant ?",
    "diary.add": "Ajouter une entrée",
    "diary.clear": "Effacer",
    "diary.recent": "Récentes",
    "diary.empty": "Aucune entrée pour l'instant.",
    "diary.delete": "Supprimer",

    "ios.cta": "Installer NeverFap sur iOS",

    "ach.title": "Succès",
    "ach.sub": "Débloque des succès en utilisant l'appli.",
    "ach.close": "Fermer",
    "ach.save": "Enregistrer les succès",
    "ach.saved": "Enregistré ✓",
    "ach.hint": "Enregistrement manuel pour éviter les bugs.",
    "ach.hintDone": "Tout est enregistré.",
    "ach.tip": "Astuce : les succès ne s'enregistrent pas tout seuls, appuie sur Enregistrer pour être sûr de ne rien perdre !",
    "ach.unlockedAt": "Débloqué : {date}",
    "ach.grower.title": "Ça pousse",
    "ach.grower.desc": "Fais grandir ta flamme une fois (Étincelle → En croissance).",
    "ach.self_control.title": "Tu peux arrêter ça",
    "ach.self_control.desc": "Tu as appuyé sur PANIQUE et coupé court à l'envie.",
    "ach.part_of_process.title": "Ça fait partie du processus",
    "ach.part_of_process.desc": "Rechute une fois.",
    "ach.never_back_down.title": "N'abandonne jamais, jamais quoi ?",
    "ach.never_back_down.desc": "Rechute 5 fois.",
    "ach.month_clean.title": "Un mois clean",
    "ach.month_clean.desc": "Atteins la Flamme d'émeraude (30 jours).",
    "ach.stronger_than_ever.title": "Plus fort que jamais",
    "ach.stronger_than_ever.desc": "Atteins la Flamme de platine (60 jours).",

    "panic.title": "Mode panique",
    "panic.sub": "Tiens bon. L'envie finit par passer.",
    "panic.close": "Fermer",
    "panic.tab.breathe": "RESPIRER",
    "panic.tab.challenge": "DÉFI",
    "panic.tab.hits": "ASTUCES RAPIDES",

    "breath.ready": "Prêt",
    "breath.help": "Respiration carrée. Suis le cercle : inspire 4, retiens 4, expire 4, retiens 4.",
    "breath.cycles": "Cycles terminés : {n}",
    "breath.start": "Commencer à respirer",
    "breath.stop": "Arrêter",
    "breath.in": "Inspire",
    "breath.hold": "Retiens",
    "breath.out": "Expire",

    "chal.pick": "Choisis-en un. Fais-le maintenant, pas plus tard.",
    "chal.remaining": "restant",
    "chal.giveup": "Abandonner",
    "chal.beat": "Tu l'as vaincue.",
    "chal.beatSub": "L'envie a perdu. Ta flamme brûle toujours.",
    "chal.again": "Encore un",
    "chal.pushups": "20 pompes",
    "chal.plank": "1 minute de gainage",
    "chal.sprint": "2 minutes de course sur place",
    "chal.cold": "30 secondes d'eau froide",
    "chal.squats": "40 squats",
    "chal.still": "Reste assis, ne fais rien",

    "hits.help": "De la dopamine gratuite qui ne te coûte rien. Touche pour cocher, touche à nouveau pour annuler.",
    "hits.sugar": "Une cuillère de sucre ou de miel",
    "hits.cold": "De l'eau froide sur le visage",
    "hits.song": "Mets ta chanson la plus forte",
    "hits.walk": "Va dans une autre pièce",
    "hits.drink": "Prépare-toi une boisson chaude, lentement",
    "hits.window": "Ouvre une fenêtre, respire l'air du dehors",
    "hits.tidy": "Range une petite chose",
    "hits.text": "Écris à quelqu'un que tu apprécies",
    "hits.nothingTitle": "Si rien ne marche :",
    "hits.n1": "Quitte la pièce. Sors dehors, ne serait-ce que 60 secondes.",
    "hits.n2": "Pose ton téléphone dans une autre pièce, écran vers le bas.",
    "hits.n3": "Ouvre le journal et écris l'envie en entier.",
    "hits.n4": "Écris à quelqu'un. À n'importe qui. Brise l'isolement.",

    "fail.title": "Remettre ta série à zéro ?",
    "fail.body": "Cela éteindra ta flamme actuelle et ajoutera une rechute à ton compteur. C'est irréversible.",
    "fail.yes": "Oui, j'ai rechuté",
    "fail.cancel": "Annuler",

    "popup.defaultTitle": "Maintenance",
    "popup.defaultMsg": "Une pause de maintenance est prévue bientôt !",
    "popup.notice": "Avis",
    "popup.close": "Fermer",

    "forgot.line1": "Merci d'envoyer un e-mail à",
    "forgot.line2": "Depuis l'adresse e-mail avec laquelle tu t'es inscrit. La réponse peut prendre jusqu'à 72 heures.",
    "forgot.close": "Fermer",

    "bug.title": "Quelqu'un a dit... des bugs ?",
    "bug.sub": "Pour signaler des bugs, appuie sur le bouton ci-dessous",
    "bug.cta": "Signaler des bugs",
    "bug.close": "Fermer",

    "footer.lastSavedEmpty": "Dernier enregistrement --:--:--",
    "footer.lastSaved": "Dernier enregistrement {time}",
    "footer.built": "Créé par Tomm pour un monde en meilleure santé.",
    "footer.bugLink": "Clique ici pour signaler des bugs !",

    "clawd.title": "Voici Clawd !",
    "clawd.p1": "Clawd est la petite mascotte de <span class='font-semibold text-white/90'>Claude Code</span>, qui aide à construire et à entretenir NeverFap en coulisses.",
    "clawd.p2": "Il court partout pour fêter le retour de <span class='font-semibold text-orange-300'>Fable 5</span> après 19 jours. Fable 5 est le modèle d'IA le plus puissant de Claude, si puissant que le gouvernement l'a interdit. Il est revenu il y a quelques jours. Youpi !",
    "clawd.close": "Sympa 🧡",

    "toast.achUnlocked": "Succès débloqué : {title} (pense à enregistrer)",
    "toast.saved": "Enregistré ✅",
    "toast.signedUp": "Compte créé. Tu peux te connecter.",
    "toast.signupFailed": "Échec de la création du compte : {msg}",
    "toast.welcome": "Content de te revoir.",
    "toast.loginFailed": "Échec de la connexion : {msg}",
    "toast.signedOut": "Déconnecté.",
    "toast.signOutFailed": "Échec de la déconnexion : {msg}",
    "toast.flameLit": "Flamme allumée.",
    "toast.startFailed": "Échec du démarrage : {msg}",
    "toast.failOk": "Rechuter, ça arrive. Appuie sur Démarrer quand tu es prêt.",
    "toast.resetFailed": "Échec de la remise à zéro : {msg}",
    "toast.profileLoadFailed": "Échec du chargement du profil : {msg}",
    "toast.diaryLoadFailed": "Échec du chargement du journal : {msg}",
    "toast.entryDeleted": "Entrée supprimée.",
    "toast.deleteFailed": "Échec de la suppression : {msg}",
    "toast.writeFirst": "Écris d'abord quelque chose.",
    "toast.clawdBack": "Clawd revient en trottinant ! 🦀",
    "toast.entrySaved": "Entrée enregistrée.",
    "toast.saveFailed": "Échec de l'enregistrement : {msg}",
    "toast.diaryRefreshed": "Journal actualisé.",
    "toast.refreshFailed": "Échec de l'actualisation : {msg}",
    "toast.challengeDone": "Défi terminé. Envie vaincue. 🔥",

    "del.pageTitle": "Supprimer le compte • NeverFap",
    "del.back": "← Retour",
    "del.title": "Supprimer le compte",
    "del.sub": "Confirme tes identifiants pour générer ton code de suppression.",
    "del.formTitle": "Saisis à nouveau tes identifiants",
    "del.confirm": "Confirmer",
    "del.okTitle": "Identifiants corrects !",
    "del.okSub": "Pour supprimer ton compte, envoie le code à 6 chiffres suivant à",
    "del.errMissing": "Saisis ton e-mail et ton mot de passe.",
    "del.errInvalid": "Identifiants invalides.",
    "del.errCode": "Impossible de récupérer le code de suppression.",

    "iosp.pageTitle": "NeverFap sur iOS",
    "iosp.title": "NeverFap sur iOS",
    "iosp.sub": "Utilise NeverFap sur iPhone via Safari — sans passer par l'App Store.",
    "iosp.s1": "Cherche NeverFap dans Safari",
    "iosp.s2": "Appuie sur le menu à trois points",
    "iosp.s2alt": "Ouvrir le menu de Safari",
    "iosp.s3": "Choisis Partager",
    "iosp.s3alt": "Appuyer sur Partager",
    "iosp.s4": "Choisis « Sur l'écran d'accueil »",
    "iosp.s4alt": "Ajouter à l'écran d'accueil",
    "iosp.s5": "Confirme et ajoute",
    "iosp.s5alt": "Confirmer l'ajout à l'écran d'accueil",
    "iosp.s6": "Lance l'appli depuis ton écran d'accueil",
    "iosp.s6alt": "Lancer NeverFap",
    "iosp.footer": "Prise en charge d'iOS via Progressive Web App (PWA)",

    "maint.pageTitle": "NeverFap • Maintenance",
    "maint.title": "Pause de maintenance !",
    "maint.sub": "NeverFap est hors ligne pendant que des modifications susceptibles de casser le site sont en cours. On revient très vite !",
    "maint.note": "Je reviens vite !",
    "maint.button": "Actualiser",
    "maint.footer": "Merci de ta patience ❤️",
    "maint.adminTitle": "Accès administrateur",
    "maint.adminSub": "Connecte-toi pour contourner la pause de maintenance.",
    "maint.enter": "Entrer",
    "maint.cancel": "Annuler",
    "maint.inTitle": "Tu es entré ✅",
    "maint.inSub": "Contournement de la maintenance actif. Où veux-tu aller ?",
    "maint.notAdmin": "Ce n'est pas un compte administrateur.",
    "maint.authUnavailable": "Authentification indisponible. Réessaie.",
    "maint.invalid": "Identifiants invalides.",
    "maint.checking": "Vérification…",

    "demo.readonly": "La démo est en lecture seule",
    "demo.stageCalm": "Contrôle tranquille",
    "demo.rangeCalm": "14–21 jours",
    "demo.elapsed": "14 j 13 h 33 min",
    "demo.startedAt": "Début : 04/01/2026, 16:53:14",
    "demo.diaryText": "Salut ! Ceci est le compte de démonstration, il ne peut pas être modifié. Pour avoir ton propre compte, déconnecte-toi et connecte-toi avec le tien !",
    "demo.diaryEmpty": "Compte de démonstration — les entrées sont désactivées.",
    "demo.achSub": "Aperçu de la démo (lecture seule).",
    "demo.achNote": "Ceci est un aperçu de la démo. Les succès sont seulement affichés — ils ne peuvent pas être modifiés ici.",
    "demo.unlocked1": "Débloqué : 05/01/2026, 08:21",
    "demo.unlocked2": "Débloqué : 07/01/2026, 19:02",
    "demo.flameSub": "Comment ta flamme évolue avec le temps.",
    "demo.flameNote": "Aperçu de la démo — dans ton compte, les vrais paliers se mettent à jour en direct.",
    "demo.footer": "Créé par Tomm pour un monde en meilleure santé. Tu peux me signaler les bugs en DM sur TikTok : @tommfr38"
  };

  // ============================== MAGYAR ==============================
  DICT.hu = {
    "lang.aria": "Nyelv",

    "load.init": "Rendszer inicializálása",
    "load.skip": "Kihagyás",
    "load.processors": "Alpha processzorok betöltése {n}/84",
    "load.tip1.label": "Pánik mód",
    "load.tip1.text": "Nyomd meg a PÁNIK gombot, ha rád tör a késztetés. Vezetett légzés, időzített kihívások és gyors segítségek – mind ott vannak.",
    "load.tip2.label": "A napló",
    "load.tip2.text": "Írd ki magadból a késztetést. Ha megnevezed, mi váltotta ki, később felismered a mintát.",
    "load.tip3.label": "Újrakezdeni nem szégyen",
    "load.tip3.text": "A nullázás nem kudarc. Mindenki kezdi újra valamikor. Csak az számít, hogy újra elindulj.",

    "crash.title": "A NeverFap összeomlott.",
    "crash.sub": "Töltsd újra az oldalt.",
    "crash.reload": "Újratöltés",

    "header.tagline": "Élj egészségesebben, hagyd abba a maszturbálást.",
    "header.achievements": "Teljesítmények",
    "header.signout": "Kijelentkezés",
    "header.clawdTitle": "Ki ez a kis fickó?",

    "auth.title": "Bejelentkezés",
    "auth.sub": "Az adataid biztonságban vannak.",
    "auth.email": "E-mail-cím",
    "auth.password": "Jelszó",
    "auth.login": "Bejelentkezés",
    "auth.signup": "Regisztráció",
    "auth.delete": "Fiókom törlése",
    "auth.forgot": "Elfelejtetted a jelszavad?",
    "auth.demo": "Demó megtekintése",
    "auth.note": "Minden tárolt adat teljesen biztonságban van, senki sem láthatja. Még az adminisztrátorok sem.",

    "flame.title": "A lángod",
    "flame.infoAria": "Információ a láng szakaszairól",
    "flame.infoTitle": "A láng szakaszai",
    "flame.sub": "A kis társad, aki az idővel együtt nő!",
    "flame.elapsedLabel": "Eltelt idő az indítás óta",
    "flame.start": "Indítás",
    "flame.failed": "Visszaestem",
    "flame.panic": "PÁNIK",
    "flame.pressStart": "Nyomd meg az Indítást, hogy meggyújtsd.",
    "flame.startedAt": "Indítás: {date}",

    "stage.unlit": "Kialudt",
    "stage.spark": "Szikra",
    "stage.growing": "Növekszik",
    "stage.ruby": "Rubinláng",
    "stage.amethyst": "Ametisztláng",
    "stage.diamond": "Gyémántláng",
    "stage.emerald": "Smaragdláng",
    "stage.platinum": "Platinaláng",
    "range.unlit": "Indítás előtt",
    "range.spark": "0–12 óra",
    "range.growing": "12–48 óra",
    "range.ruby": "2–7 nap",
    "range.amethyst": "7–21 nap",
    "range.diamond": "21–30 nap",
    "range.emerald": "30–60 nap",
    "range.platinum": "60+ nap",

    "flameInfo.title": "A láng szakaszai",
    "flameInfo.sub": "Így fejlődik a lángod az idő múlásával.",
    "flameInfo.footer": "A jelenlegi szakaszodat az határozza meg, mennyi idő telt el az Indítás óta.",
    "flameInfo.current": "(jelenlegi)",
    "flameInfo.best": "(legjobb)",
    "flameInfo.close": "Bezárás",

    "dur.d": " nap",
    "dur.h": " óra",
    "dur.m": " perc",
    "dur.s": " mp",

    "diary.title": "Napló",
    "diary.sub": "Privát jegyzetek. A rövid is tökéletes.",
    "diary.refresh": "Frissítés",
    "diary.placeholder": "Mi zajlik benned most?",
    "diary.add": "Bejegyzés hozzáadása",
    "diary.clear": "Ürítés",
    "diary.recent": "Legutóbbiak",
    "diary.empty": "Még nincsenek bejegyzések.",
    "diary.delete": "Törlés",

    "ios.cta": "NeverFap letöltése iOS-re",

    "ach.title": "Teljesítmények",
    "ach.sub": "Szerezz teljesítményeket az app használatával.",
    "ach.close": "Bezárás",
    "ach.save": "Teljesítmények mentése",
    "ach.saved": "Mentve ✓",
    "ach.hint": "Kézi mentés, hogy elkerüld a hibákat.",
    "ach.hintDone": "Minden mentve.",
    "ach.tip": "Tipp: a teljesítmények nem mentődnek automatikusan – nyomd meg a mentést, hogy a haladásod biztosan megmaradjon!",
    "ach.unlockedAt": "Feloldva: {date}",
    "ach.grower.title": "Növekedés",
    "ach.grower.desc": "Növeszd meg egyszer a lángod (Szikra → Növekszik).",
    "ach.self_control.title": "Meg tudod állítani",
    "ach.self_control.desc": "Megnyomtad a PÁNIK gombot, és megszakítottad a késztetést.",
    "ach.part_of_process.title": "Ez is a folyamat része",
    "ach.part_of_process.desc": "Ess vissza egyszer.",
    "ach.never_back_down.title": "Soha ne add fel, soha mit?",
    "ach.never_back_down.desc": "Ess vissza 5-ször.",
    "ach.month_clean.title": "Egy hónap tisztán",
    "ach.month_clean.desc": "Érd el a Smaragdlángot (30 nap).",
    "ach.stronger_than_ever.title": "Erősebb, mint valaha",
    "ach.stronger_than_ever.desc": "Érd el a Platinalángot (60 nap).",

    "panic.title": "Pánik mód",
    "panic.sub": "Tarts ki. A késztetés elmúlik.",
    "panic.close": "Bezárás",
    "panic.tab.breathe": "LÉLEGZÉS",
    "panic.tab.challenge": "KIHÍVÁS",
    "panic.tab.hits": "GYORS SEGÍTSÉG",

    "breath.ready": "Kész",
    "breath.help": "Négyszöglégzés. Kövesd a kört: 4 be, 4 tartás, 4 ki, 4 tartás.",
    "breath.cycles": "Teljesített ciklusok: {n}",
    "breath.start": "Légzés indítása",
    "breath.stop": "Leállítás",
    "breath.in": "Belégzés",
    "breath.hold": "Tartás",
    "breath.out": "Kilégzés",

    "chal.pick": "Válassz egyet. Most csináld, ne később.",
    "chal.remaining": "van hátra",
    "chal.giveup": "Feladom",
    "chal.beat": "Legyőzted.",
    "chal.beatSub": "A késztetés veszített. A lángod még mindig ég.",
    "chal.again": "Még egyet",
    "chal.pushups": "20 fekvőtámasz",
    "chal.plank": "1 perc plank",
    "chal.sprint": "2 perc helyben futás",
    "chal.cold": "30 másodperc hideg víz",
    "chal.squats": "40 guggolás",
    "chal.still": "Ülj mozdulatlanul, ne csinálj semmit",

    "hits.help": "Olcsó dopamin, ami semmibe sem kerül. Koppints a kipipáláshoz, koppints újra a visszavonáshoz.",
    "hits.sugar": "Egy kanál cukor vagy méz",
    "hits.cold": "Hideg víz az arcodra",
    "hits.song": "Tedd fel a leghangosabb számodat",
    "hits.walk": "Menj át egy másik szobába",
    "hits.drink": "Készíts egy forró italt, lassan",
    "hits.window": "Nyiss ablakot, szívj friss levegőt",
    "hits.tidy": "Pakolj el egy apróságot",
    "hits.text": "Írj valakinek, akit kedvelsz",
    "hits.nothingTitle": "Ha semmi sem segít:",
    "hits.n1": "Hagyd el a szobát. Menj ki, akár csak 60 másodpercre.",
    "hits.n2": "Tedd a telefonod egy másik szobába, kijelzővel lefelé.",
    "hits.n3": "Nyisd meg a naplót, és írd ki magadból a késztetést.",
    "hits.n4": "Írj valakinek. Bárkinek. Törd meg az elszigeteltséget.",

    "fail.title": "Nullázod a sorozatod?",
    "fail.body": "Ezzel kialszik a jelenlegi lángod, és a visszaeséseid száma eggyel nő. Ez nem vonható vissza.",
    "fail.yes": "Igen, visszaestem",
    "fail.cancel": "Mégse",

    "popup.defaultTitle": "Karbantartás",
    "popup.defaultMsg": "Hamarosan karbantartási szünet!",
    "popup.notice": "Értesítés",
    "popup.close": "Bezárás",

    "forgot.line1": "Kérlek, írj egy e-mailt a következő címre",
    "forgot.line2": "Arról az e-mail-címről, amivel regisztráltál. A válasz akár 72 órát is igénybe vehet.",
    "forgot.close": "Bezárás",

    "bug.title": "Mondta valaki, hogy... hibák?",
    "bug.sub": "Hibák jelentéséhez nyomd meg az alábbi gombot",
    "bug.cta": "Hibák jelentése",
    "bug.close": "Bezárás",

    "footer.lastSavedEmpty": "Utolsó mentés --:--:--",
    "footer.lastSaved": "Utolsó mentés {time}",
    "footer.built": "Tomm készítette egy egészségesebb világért.",
    "footer.bugLink": "Kattints rám hibák jelentéséhez!",

    "clawd.title": "Ismerd meg Clawdot!",
    "clawd.p1": "Clawd a <span class='font-semibold text-white/90'>Claude Code</span> apró kabalája, aki a háttérben segít megépíteni és karbantartani a NeverFapet.",
    "clawd.p2": "Épp azt ünnepli, hogy a <span class='font-semibold text-orange-300'>Fable 5</span> 19 nap után visszatért. A Fable 5 a Claude legerősebb MI-modellje – annyira erős, hogy a kormány betiltotta. Néhány napja visszatért. Hurrá!",
    "clawd.close": "Menő 🧡",

    "toast.achUnlocked": "Teljesítmény feloldva: {title} (ne felejtsd el elmenteni)",
    "toast.saved": "Mentve ✅",
    "toast.signedUp": "Sikeres regisztráció. Most már bejelentkezhetsz.",
    "toast.signupFailed": "Sikertelen regisztráció: {msg}",
    "toast.welcome": "Üdv újra itt.",
    "toast.loginFailed": "Sikertelen bejelentkezés: {msg}",
    "toast.signedOut": "Kijelentkeztél.",
    "toast.signOutFailed": "Sikertelen kijelentkezés: {msg}",
    "toast.flameLit": "A láng meggyulladt.",
    "toast.startFailed": "Sikertelen indítás: {msg}",
    "toast.failOk": "A visszaesés belefér. Nyomd meg az Indítást, ha készen állsz.",
    "toast.resetFailed": "Sikertelen nullázás: {msg}",
    "toast.profileLoadFailed": "A profil betöltése nem sikerült: {msg}",
    "toast.diaryLoadFailed": "A napló betöltése nem sikerült: {msg}",
    "toast.entryDeleted": "Bejegyzés törölve.",
    "toast.deleteFailed": "A törlés nem sikerült: {msg}",
    "toast.writeFirst": "Írj előbb valamit.",
    "toast.clawdBack": "Clawd visszaszaladt! 🦀",
    "toast.entrySaved": "Bejegyzés mentve.",
    "toast.saveFailed": "A mentés nem sikerült: {msg}",
    "toast.diaryRefreshed": "A napló frissítve.",
    "toast.refreshFailed": "A frissítés nem sikerült: {msg}",
    "toast.challengeDone": "Kihívás teljesítve. Késztetés legyőzve. 🔥",

    "del.pageTitle": "Fiók törlése • NeverFap",
    "del.back": "← Vissza",
    "del.title": "Fiók törlése",
    "del.sub": "Erősítsd meg a belépési adataidat a törlési kódod létrehozásához.",
    "del.formTitle": "Add meg újra a belépési adataidat",
    "del.confirm": "Megerősítés",
    "del.okTitle": "Helyes belépési adatok!",
    "del.okSub": "A fiókod törléséhez küldd el az alábbi 6 jegyű kódot ide:",
    "del.errMissing": "Add meg az e-mail-címet és a jelszót.",
    "del.errInvalid": "Érvénytelen belépési adatok.",
    "del.errCode": "A törlési kódot nem sikerült lekérni.",

    "iosp.pageTitle": "NeverFap iOS-en",
    "iosp.title": "NeverFap iOS-en",
    "iosp.sub": "Használd a NeverFapet iPhone-on a Safarin keresztül – App Store nélkül.",
    "iosp.s1": "Keress rá a NeverFapre a Safariban",
    "iosp.s2": "Koppints a hárompontos menüre",
    "iosp.s2alt": "A Safari menüjének megnyitása",
    "iosp.s3": "Válaszd a Megosztás lehetőséget",
    "iosp.s3alt": "Koppints a Megosztásra",
    "iosp.s4": "Válaszd a „Főképernyőhöz adás” lehetőséget",
    "iosp.s4alt": "Hozzáadás a főképernyőhöz",
    "iosp.s5": "Erősítsd meg és add hozzá",
    "iosp.s5alt": "A főképernyőhöz adás megerősítése",
    "iosp.s6": "Indítsd el a főképernyőről",
    "iosp.s6alt": "A NeverFap indítása",
    "iosp.footer": "iOS-támogatás progresszív webalkalmazásként (PWA)",

    "maint.pageTitle": "NeverFap • Karbantartás",
    "maint.title": "Karbantartási szünet!",
    "maint.sub": "A NeverFap offline, amíg olyan változtatások zajlanak, amelyek elronthatják az oldalt. Hamarosan újra elérhető lesz!",
    "maint.note": "Nemsokára visszatérek!",
    "maint.button": "Frissítés",
    "maint.footer": "Köszönjük a türelmed ❤️",
    "maint.adminTitle": "Admin hozzáférés",
    "maint.adminSub": "Jelentkezz be a karbantartási szünet megkerüléséhez.",
    "maint.enter": "Belépés",
    "maint.cancel": "Mégse",
    "maint.inTitle": "Bent vagy ✅",
    "maint.inSub": "A karbantartás megkerülése aktív. Hová szeretnél menni?",
    "maint.notAdmin": "Ez nem admin fiók.",
    "maint.authUnavailable": "A bejelentkezés nem érhető el. Próbáld újra.",
    "maint.invalid": "Érvénytelen belépési adatok.",
    "maint.checking": "Ellenőrzés…",

    "demo.readonly": "A demó csak olvasható",
    "demo.stageCalm": "Nyugodt kontroll",
    "demo.rangeCalm": "14–21 nap",
    "demo.elapsed": "14 nap 13 óra 33 perc",
    "demo.startedAt": "Indítás: 2026. 01. 04. 16:53:14",
    "demo.diaryText": "Szia! Ez a demó fiók, amit nem lehet módosítani. Ha saját fiókot szeretnél, jelentkezz ki, és lépj be a sajátoddal!",
    "demo.diaryEmpty": "Demó fiók – a bejegyzések ki vannak kapcsolva.",
    "demo.achSub": "Demó előnézet (csak olvasható).",
    "demo.achNote": "Ez egy demó előnézet. A teljesítmények csak megjelennek – itt nem módosíthatók.",
    "demo.unlocked1": "Feloldva: 2026. 01. 05. 08:21",
    "demo.unlocked2": "Feloldva: 2026. 01. 07. 19:02",
    "demo.flameSub": "Így fejlődik a lángod az idő múlásával.",
    "demo.flameNote": "Demó előnézet – a saját fiókodban a valódi szakaszok élőben frissülnek.",
    "demo.footer": "Tomm készítette egy egészségesebb világért. A hibákat TikTokon DM-ben jelezheted: @tommfr38"
  };

  // ============================== RUNTIME ==============================

  function isSupported(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return true;
    return false;
  }

  function detect() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isSupported(saved)) return saved;
    } catch (e) {}

    var prefs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || "en"];

    for (var i = 0; i < prefs.length; i++) {
      var base = String(prefs[i] || "").toLowerCase().split("-")[0];
      if (isSupported(base)) return base;
    }
    return "en";
  }

  var current = detect();
  var listeners = [];

  function t(key, params) {
    var table = DICT[current] || DICT.en;
    var s = table[key];
    if (s === undefined) s = DICT.en[key];
    if (s === undefined) return key;
    if (params) {
      for (var k in params) {
        if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
        s = s.split("{" + k + "}").join(String(params[k]));
      }
    }
    return s;
  }

  function localeTag() {
    for (var i = 0; i < LANGS.length; i++) {
      // en deliberately maps to undefined so English keeps the browser's own
      // date format instead of being forced to one region's convention.
      if (LANGS[i].code === current) return LANGS[i].locale;
    }
    return undefined;
  }

  function dateTime(value, options) {
    var d = value instanceof Date ? value : new Date(value);
    try {
      return d.toLocaleString(localeTag(), options);
    } catch (e) {
      return d.toLocaleString();
    }
  }

  // Elapsed-time readout: "3d 4h 5m" / "3 T 4 Std 5 Min" / "3 nap 4 óra 5 perc".
  function duration(ms) {
    if (!(ms > 0)) ms = 0;
    var s = Math.floor(ms / 1000);
    var days = Math.floor(s / 86400);
    var hrs = Math.floor((s % 86400) / 3600);
    var mins = Math.floor((s % 3600) / 60);
    var secs = s % 60;

    if (days > 0) return days + t("dur.d") + " " + hrs + t("dur.h") + " " + mins + t("dur.m");
    if (hrs > 0) return hrs + t("dur.h") + " " + mins + t("dur.m") + " " + secs + t("dur.s");
    return mins + t("dur.m") + " " + secs + t("dur.s");
  }

  // ---- Cloak: hide the document until the first swap so a non-English
  // visitor never sees a frame of English. Removed by apply(), with a
  // failsafe timer in case DOMContentLoaded never lands.
  var cloak = null;

  function addCloak() {
    if (current === "en" || cloak) return;
    cloak = document.createElement("style");
    cloak.id = "nf-i18n-cloak";
    cloak.textContent = "html{visibility:hidden!important}";
    (document.head || document.documentElement).appendChild(cloak);
    setTimeout(removeCloak, 4000);
  }

  function removeCloak() {
    if (cloak && cloak.parentNode) cloak.parentNode.removeChild(cloak);
    cloak = null;
  }

  function applyAttrSpec(el, spec) {
    var parts = spec.split(";");
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i];
      var sep = pair.indexOf(":");
      if (sep < 0) continue;
      var attr = pair.slice(0, sep).trim();
      var key = pair.slice(sep + 1).trim();
      if (attr && key) el.setAttribute(attr, t(key));
    }
  }

  function apply(root) {
    var scope = root || document;

    var textNodes = scope.querySelectorAll("[data-i18n]");
    for (var i = 0; i < textNodes.length; i++) {
      textNodes[i].textContent = t(textNodes[i].getAttribute("data-i18n"));
    }

    var htmlNodes = scope.querySelectorAll("[data-i18n-html]");
    for (var j = 0; j < htmlNodes.length; j++) {
      htmlNodes[j].innerHTML = t(htmlNodes[j].getAttribute("data-i18n-html"));
    }

    var attrNodes = scope.querySelectorAll("[data-i18n-attr]");
    for (var k = 0; k < attrNodes.length; k++) {
      applyAttrSpec(attrNodes[k], attrNodes[k].getAttribute("data-i18n-attr"));
    }

    document.documentElement.setAttribute("lang", current);
    removeCloak();
  }

  // ---- Language picker ----
  var PICKER_CLASS =
    "cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 " +
    "px-3 py-2 text-sm font-semibold text-white/80 outline-none transition " +
    "hover:bg-white/10 focus:border-orange-400/40";

  function mountPickers(root) {
    var hosts = (root || document).querySelectorAll("[data-nf-lang]");
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      if (host.getAttribute("data-nf-lang-ready") === "1") continue;
      host.setAttribute("data-nf-lang-ready", "1");

      var sel = document.createElement("select");
      sel.className = host.getAttribute("data-nf-lang-class") || PICKER_CLASS;
      sel.setAttribute("aria-label", t("lang.aria"));
      sel.setAttribute("data-nf-lang-select", "1");

      for (var j = 0; j < LANGS.length; j++) {
        var opt = document.createElement("option");
        opt.value = LANGS[j].code;
        opt.textContent = LANGS[j].label;
        // Native option lists render on the OS surface, which is light by
        // default — force the dark palette so they match the app.
        opt.className = "bg-slate-950 text-white";
        opt.style.backgroundColor = "#020617";
        opt.style.color = "#ffffff";
        if (LANGS[j].code === current) opt.selected = true;
        sel.appendChild(opt);
      }

      sel.addEventListener("change", function (e) {
        setLang(e.target.value);
      });

      host.appendChild(sel);
    }
  }

  function syncPickers() {
    var sels = document.querySelectorAll("[data-nf-lang-select]");
    for (var i = 0; i < sels.length; i++) {
      sels[i].value = current;
      sels[i].setAttribute("aria-label", t("lang.aria"));
    }
  }

  function setLang(code) {
    if (!isSupported(code) || code === current) return;
    current = code;
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}

    apply();
    syncPickers();

    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](current); } catch (e) { console.error(e); }
    }
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  addCloak();

  function boot() {
    apply();
    mountPickers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.NF_I18N = {
    t: t,
    lang: function () { return current; },
    langs: LANGS.slice(),
    setLang: setLang,
    onChange: onChange,
    apply: apply,
    mountPickers: mountPickers,
    duration: duration,
    dateTime: dateTime,
    locale: localeTag
  };
})();
