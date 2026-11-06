(() => {
  const $ = (id) => document.getElementById(id);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- alphabet ----------------
     id, upper, lower, spoken name, example word ([..] = the letter inside it), picture */
  const LETTERS = [
    ["a", "A", "a", "a", "[A]ri", "🐝"],
    ["b", "B", "b", "be", "[B]aliq", "🐟"],
    ["d", "D", "d", "de", "[D]araxt", "🌳"],
    ["e", "E", "e", "e", "[E]chki", "🐐"],
    ["f", "F", "f", "ef", "[F]il", "🐘"],
    ["g", "G", "g", "ge", "[G]ul", "🌷"],
    ["h", "H", "h", "he", "[H]ilol", "🌙"],
    ["i", "I", "i", "i", "[I]lon", "🐍"],
    ["j", "J", "j", "je", "[J]o‘ja", "🐥"],
    ["k", "K", "k", "ke", "[K]alit", "🔑"],
    ["l", "L", "l", "el", "[L]imon", "🍋"],
    ["m", "M", "m", "em", "[M]ushuk", "🐱"],
    ["n", "N", "n", "en", "[N]ok", "🍐"],
    ["o", "O", "o", "o", "[O]lma", "🍎"],
    ["p", "P", "p", "pe", "[P]oyezd", "🚂"],
    ["q", "Q", "q", "qe", "[Q]uyon", "🐰"],
    ["r", "R", "r", "er", "[R]aketa", "🚀"],
    ["s", "S", "s", "es", "[S]abzi", "🥕"],
    ["t", "T", "t", "te", "[T]ulki", "🦊"],
    ["u", "U", "u", "u", "[U]y", "🏠"],
    ["v", "V", "v", "ve", "[V]ertolyot", "🚁"],
    ["x", "X", "x", "xe", "[X]o‘roz", "🐓"],
    ["y", "Y", "y", "ye", "[Y]o‘lbars", "🐯"],
    ["z", "Z", "z", "ze", "[Z]ebra", "🦓"],
    ["oo", "O‘", "o‘", "o‘", "[O‘]rdak", "🦆"],
    ["gg", "G‘", "g‘", "g‘e", "[G‘]isht", "🧱"],
    ["sh", "Sh", "sh", "she", "[Sh]ar", "🎈"],
    ["ch", "Ch", "ch", "che", "[Ch]umoli", "🐜"],
    ["ng", "Ng", "ng", "nge", "To[ng]", "🌅"],
  ].map(([id, up, lo, name, word, pic]) => ({ id, up, lo, name, word, plain: word.replace(/[[\]]/g, ""), pic }));
  const L = Object.fromEntries(LETTERS.map((l) => [l.id, l]));
  // lessons: the alphabet in order, five letters at a time, then one section with every letter
  const LESSON_ICONS = ["🐣", "🐥", "🐰", "🦊", "🐯", "🦁"];
  const POOLS = {};
  for (let i = 0; i * 5 < LETTERS.length; i++) {
    const ids = LETTERS.slice(i * 5, i * 5 + 5).map((l) => l.id);
    POOLS[String(i + 1)] = { n: Math.min(4, ids.length), ids, title: `${i + 1}-dars`, ico: LESSON_ICONS[i] || "⭐" };
  }
  POOLS.all = { n: 6, ids: LETTERS.map((l) => l.id), title: "Hammasi", ico: "🦖" };
  // letters that are easy to mix up: offered together on the hardest level
  const LOOKALIKE = {
    o: ["oo", "u"], oo: ["o", "u"], g: ["gg", "q"], gg: ["g"], s: ["sh", "z"], sh: ["s", "ch"], ch: ["sh"],
    n: ["ng", "m"], ng: ["n", "g"], b: ["d", "p"], d: ["b"], p: ["b", "q"], q: ["p", "g"], m: ["n"],
    u: ["oo", "v"], x: ["h"], h: ["x"], e: ["f"], i: ["l", "j"], j: ["i"], l: ["i"], v: ["u"], z: ["s"],
  };

  /* ---------------- gifts ---------------- */
  const FAVS = [
    ["gepard", "🐆", "Gepard"], ["yolbars", "🐯", "Yo‘lbars"], ["sher", "🦁", "Sher"],
    ["poyga", "🏎️", "Qizil poyga mashinasi"], ["dino", "🦖", "Dinozavr"],
    ["otochir", "🚒", "O‘t o‘chirish mashinasi"], ["kamaz", "🚛", "Kamaz"], ["politsiya", "🚓", "Politsiya mashinasi"],
  ];
  const MORE = [
    ["diplodok", "🦕", "Uzun bo‘yin dinozavr"], ["fil", "🐘", "Fil"], ["ayiq", "🐻", "Ayiq"], ["bori", "🐺", "Bo‘ri"],
    ["timsoh", "🐊", "Timsoh"], ["akula", "🦈", "Akula"], ["burgut", "🦅", "Burgut"], ["gorilla", "🦍", "Gorilla"],
    ["karkidon", "🦏", "Karkidon"], ["jirafa", "🦒", "Jirafa"], ["zebra", "🦓", "Zebra"], ["ot", "🐎", "Ot"],
    ["tezyordam", "🚑", "Tez yordam mashinasi"], ["politsiya2", "🚔", "Politsiya patrul mashinasi"], ["traktor", "🚜", "Traktor"],
    ["yuk", "🛻", "Yuk mashinasi"], ["jip", "🚙", "Jip"], ["avtobus", "🚌", "Avtobus"], ["motosikl", "🏍️", "Motosikl"],
    ["kran", "🏗️", "Ko‘tarma kran"], ["poyezd", "🚂", "Poyezd"], ["vertolyot", "🚁", "Vertolyot"], ["samolyot", "✈️", "Samolyot"],
    ["raketa", "🚀", "Raketa"], ["kema", "🚢", "Kema"],
  ];
  const GIFTS = [...FAVS, ...MORE].map(([id, e, name]) => ({ id, e, name }));
  const G = Object.fromEntries(GIFTS.map((g) => [g.id, g]));
  const EVERY = 7;

  /* ---------------- phrases (all recordable) ---------------- */
  const P = {
    salom: ["p-salom", "Keling, harflarni topamiz!"],
    top: ["p-top", "Qani, top!"],
    bu: ["p-bu", "Bu"],
    yana: ["p-yana", "Yana urinib ko‘r!"],
    dalda: [["p-hechqisi", "Hechqisi yo‘q!"], ["p-uddalaysan", "Sen uddalaysan!"], ["p-yaqin", "Yaqin qolding!"]],
    keyingi: ["p-keyingi", "Keyingi harfga o‘tamiz!"],
    praise: [["p-barakalla", "Barakalla!"], ["p-ofarin", "Ofarin!"], ["p-zor", "Zo‘r!"], ["p-qoyil", "Qoyil!"]],
    sovga: ["p-sovga", "Voy! Yettita to‘g‘ri javob! Sovg‘ani och!"],
    tanla: ["p-tanla", "Qaysi sovg‘ani yutmoqchisan?"],
    ura: ["p-ura", "Ura! Bu sening sovg‘ang:"],
    mana: ["p-sovgalar", "Mana sening sovg‘alaring!"],
    yoq: ["p-yoq", "Hali sovg‘a yo‘q."],
  };
  const it = ([k, t]) => ({ k, t });
  const letterItem = (l) => ({ k: "h-" + l.id, t: l.name + "." });
  const wordItem = (l) => ({ k: "s-" + l.id, t: l.plain + "!" });
  const giftItem = (g) => ({ k: "g-" + g.id, t: g.name + "!" });

  /* ---------------- audio ---------------- */
  let ac = null;
  function audio() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ac.state === "suspended") ac.resume().catch(() => {});
    return ac;
  }
  let soundOn = true;
  try { soundOn = localStorage.getItem("harflar-sound") !== "off"; } catch (e) {}

  function tone(freq, dur, type = "sine", vol = 0.18, when = 0, slideTo = null) {
    if (!soundOn) return;
    const a = audio(); if (!a) return;
    const t0 = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  const sfx = {
    tap: () => tone(620, 0.08, "triangle", 0.14),
    good: () => [523, 659, 784, 1047].forEach((f, i) => { tone(f, 0.22, "triangle", 0.18, i * 0.09); tone(f * 1.5, 0.15, "sine", 0.05, i * 0.09); }),
    bad: () => { tone(440, 0.22, "sine", 0.1, 0, 392); tone(392, 0.32, "sine", 0.09, 0.2, 349); },
    clap: (dur = 2.2) => {
      if (!soundOn) return; const a = audio(); if (!a) return;
      if (!sfx._noise) { const n = a.createBuffer(1, a.sampleRate * 0.2, a.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; sfx._noise = n; }
      const t0 = a.currentTime + 0.05, claps = Math.round(dur * 26);
      for (let i = 0; i < claps; i++) {
        const t = t0 + Math.random() * dur * (0.4 + 0.6 * Math.random());
        const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
        src.buffer = sfx._noise; f.type = "bandpass"; f.frequency.value = 900 + Math.random() * 1800; f.Q.value = 1.2;
        const fade = Math.max(0.15, 1 - (t - t0) / dur), v = 0.35 * fade * (0.5 + Math.random() * 0.5);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07 + Math.random() * 0.05);
        src.connect(f).connect(g).connect(a.destination); src.start(t, Math.random() * 0.1, 0.13);
      }
    },
    pop: () => tone(300, 0.08, "sine", 0.12, 0, 700),
    del: () => tone(420, 0.12, "triangle", 0.14, 0, 260),
    win: () => [523, 659, 784, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i === 6 ? 0.6 : 0.18, "triangle", 0.18, i * 0.12)),
  };

  /* recorded clips: key -> trimmed, level-matched AudioBuffer */
  const EMBEDDED = window.HARF_OVOZLAR || {}; // voice clips come from ovozlar.js
  const clips = new Map();
  let decodeCtx = null;
  function dctx() {
    if (ac) return ac;
    if (!decodeCtx) { try { decodeCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    return decodeCtx;
  }
  function decodeArr(arr) {
    const c = dctx(); if (!c) return Promise.reject(new Error("no audio"));
    return new Promise((res, rej) => {
      const p = c.decodeAudioData(arr, res, rej);
      if (p && p.then) p.then(res, rej);
    }).then(trimBuffer);
  }
  function trimBuffer(buf) {
    const c = dctx(), ch0 = buf.getChannelData(0), sr = buf.sampleRate;
    let peak = 0;
    for (let i = 0; i < ch0.length; i++) { const v = Math.abs(ch0[i]); if (v > peak) peak = v; }
    if (peak < 0.005) return buf;
    const th = Math.max(0.012, peak * 0.07);
    let s = 0, e = ch0.length - 1;
    while (s < e && Math.abs(ch0[s]) < th) s++;
    while (e > s && Math.abs(ch0[e]) < th) e--;
    s = Math.max(0, s - Math.round(sr * 0.05)); e = Math.min(ch0.length - 1, e + Math.round(sr * 0.14));
    const gain = Math.min(4, 0.9 / peak), len = e - s + 1;
    const out = c.createBuffer(buf.numberOfChannels, len, sr);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      const src = buf.getChannelData(ch), dst = out.getChannelData(ch);
      for (let i = 0; i < len; i++) dst[i] = src[s + i] * gain;
      const fade = Math.min(len, Math.round(sr * 0.03));
      for (let i = 0; i < fade; i++) dst[len - 1 - i] *= i / fade;
    }
    return out;
  }

  /* IndexedDB: parent's own recordings, kept on this device */
  let dbp = null;
  function idb() {
    if (!dbp) dbp = new Promise((res, rej) => {
      try {
        const r = indexedDB.open("harflar-ovoz", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("clips");
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
    return dbp;
  }
  async function idbTx(mode, fn) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("clips", mode), st = tx.objectStore("clips");
      const out = fn(st);
      tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      tx.onerror = () => rej(tx.error);
    });
  }
  async function idbAll() {
    const db = await idb();
    return new Promise((res, rej) => {
      const found = [], tx = db.transaction("clips", "readonly");
      const cur = tx.objectStore("clips").openCursor();
      cur.onsuccess = () => { const c = cur.result; if (c) { found.push([c.key, c.value]); c.continue(); } };
      tx.oncomplete = () => res(found); tx.onerror = () => rej(tx.error);
    });
  }
  const ownKeys = new Set();
  async function loadClips() {
    for (const [k, b64] of Object.entries(EMBEDDED)) {
      try { const bin = atob(b64.split(",").pop()); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); clips.set(k, await decodeArr(u.buffer)); } catch (e) {}
    }
    try {
      for (const [k, blob] of await idbAll()) {
        try { clips.set(k, await decodeArr(await blob.arrayBuffer())); ownKeys.add(k); } catch (e) {}
      }
    } catch (e) {}
    updateVoiceNote();
  }

  /* browser voice as fallback */
  const hasSpeech = "speechSynthesis" in window;
  let voice = null, voiceLang = "uz";
  function chooseVoice() {
    if (!hasSpeech) { updateVoiceNote(); return; }
    const vs = speechSynthesis.getVoices();
    voice = null;
    for (const p of ["uz", "tr", "az", "kk"]) {
      const v = vs.find((v) => v.lang && v.lang.toLowerCase().replace("_", "-").startsWith(p));
      if (v) { voice = v; voiceLang = p; break; }
    }
    updateVoiceNote();
  }
  function updateVoiceNote() {
    const n = clips.size, names = { uz: "o‘zbekcha", tr: "turkcha", az: "ozarbayjoncha", kk: "qozoqcha" };
    let t = "";
    if (n) t = `Ota-onaning ovozi: ${n} ta yozuv 🎙️. Qolganlarini brauzer aytadi. `;
    if (!hasSpeech) t += "Bu brauzerda ovozli aytish yo‘q.";
    else if (voice && voiceLang === "uz") t += "Brauzer ovozi: o‘zbekcha.";
    else if (voice) t += `Brauzer ovozi: ${names[voiceLang]}, shuning uchun talaffuzda urg‘u bor. Toza o‘zbekcha uchun «Ota-ona: ovoz yozish» orqali o‘z ovozingizni yozing.`;
    else if (speechSynthesis.getVoices().length) t += "O‘zbekcha brauzer ovozi topilmadi. Toza o‘zbekcha uchun «Ota-ona: ovoz yozish» orqali o‘z ovozingizni yozing.";
    $("voiceNote").textContent = t;
  }
  if (hasSpeech) { chooseVoice(); speechSynthesis.addEventListener?.("voiceschanged", chooseVoice); } else chooseVoice();

  function forVoice(text) {
    let t = text.replace(/[‘’ʻʼ`]/g, "'");
    if (voiceLang === "tr" || voiceLang === "az") {
      t = t.replace(/o'/gi, "o").replace(/g'/gi, "ğ").replace(/ch/gi, "ç").replace(/sh/gi, "ş").replace(/j/gi, "c");
      if (voiceLang === "tr") t = t.replace(/q/gi, "k").replace(/x/gi, "h");
    }
    return t;
  }
  function tts(text) {
    return new Promise((res) => {
      if (!hasSpeech) return res();
      let done = false; const fin = () => { if (!done) { done = true; res(); } };
      try {
        const u = new SpeechSynthesisUtterance(forVoice(text));
        if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "uz-UZ";
        u.rate = 0.85; u.pitch = 1.1;
        u.onend = fin; u.onerror = fin;
        try { speechSynthesis.resume(); } catch (e) {}
        speechSynthesis.speak(u);
      } catch (e) { fin(); }
      setTimeout(fin, 1500 + text.length * 110);
    });
  }
  let curSrc = null, speakTok = 0;
  function playBuf(buf) {
    return new Promise((res) => {
      const a = audio(); if (!a) return res();
      try {
        const s = a.createBufferSource(); s.buffer = buf; s.connect(a.destination);
        s.onended = () => { if (curSrc === s) curSrc = null; res(); };
        curSrc = s; s.start();
        setTimeout(res, buf.duration * 1000 + 400);
      } catch (e) { res(); }
    });
  }
  function stopSpeech() {
    speakTok++;
    try { curSrc?.stop(); } catch (e) {}
    curSrc = null;
    let cut = false;
    if (hasSpeech) try { if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); cut = true; } } catch (e) {}
    $("speakBtn").classList.remove("talking");
    return cut;
  }
  // items: [{k, t}] — each plays the parent's recording when there is one, else the browser voice
  async function speak(items, force = false) {
    const cut = stopSpeech();
    if (!soundOn && !force) return;
    const tok = speakTok;
    // Chrome on Android drops an utterance spoken right after cancel()
    if (cut) { await wait(120); if (tok !== speakTok) return; }
    const groups = [];
    for (const x of items) {
      const buf = clips.get(x.k);
      const last = groups[groups.length - 1];
      if (buf) groups.push({ buf });
      else if (last && last.text != null) last.text += " " + x.t;
      else groups.push({ text: x.t });
    }
    $("speakBtn").classList.add("talking");
    for (const g of groups) {
      if (tok !== speakTok) return;
      if (g.buf) await playBuf(g.buf); else await tts(g.text);
      if (tok !== speakTok) return;
      await wait(110);
    }
    if (tok === speakTok) $("speakBtn").classList.remove("talking");
  }

  /* ---------------- confetti ---------------- */
  const cv = $("confetti"), cx = cv.getContext("2d");
  let parts = [], raf = 0;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function confetti(amount = 110) {
    if (reduceMotion) return;
    const st = getComputedStyle(document.documentElement);
    const cols = ["--sun", "--sky", "--pink", "--grass", "--coral", "--berry"].map((v) => st.getPropertyValue(v).trim());
    cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio;
    for (let i = 0; i < amount; i++) parts.push({
      x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .5, y: innerHeight * .45,
      vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 5, r: Math.random() * 6 + 5,
      a: Math.random() * 6, va: (Math.random() - .5) * .4, c: pick(cols), life: 0, round: Math.random() < .4
    });
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    const d = devicePixelRatio;
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.life < 120 && p.y < innerHeight + 40);
    for (const p of parts) {
      p.life++; p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      cx.save(); cx.translate(p.x * d, p.y * d); cx.rotate(p.a); cx.fillStyle = p.c;
      cx.globalAlpha = Math.max(0, 1 - p.life / 120);
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.r * d * .6, 0, 7); cx.fill(); }
      else cx.fillRect(-p.r * d / 2, -p.r * d / 4, p.r * d, p.r * d / 2);
      cx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
  }

  /* ---------------- game ---------------- */
  const S = { level: 1, target: null, options: [], tries: 0, busy: false, bag: [], last: null, timers: [], round: 0, correctTotal: 0 };
  const later = (fn, ms) => { const t = setTimeout(fn, ms); S.timers.push(t); return t; };
  const clearTimers = () => { S.timers.forEach(clearTimeout); S.timers = []; };
  const setBubble = (t) => { $("bubble").textContent = t; };

  function nextTarget() {
    // ask only letters that have a recording, so a missing browser voice never leaves a silent question
    const all = POOLS[S.level].ids, rec = all.filter((id) => clips.has("h-" + id));
    const ids = rec.length >= POOLS[S.level].n ? rec : all;
    S.bag = S.bag.filter((id) => ids.includes(id));
    if (!S.bag.length) S.bag = shuffle(ids);
    let id = S.bag.shift();
    if (id === S.last && S.bag.length) { S.bag.push(id); id = S.bag.shift(); }
    S.last = id;
    return L[id];
  }
  function chooseOptions(t) {
    const pool = POOLS[S.level], picks = [t.id];
    if (S.level === "all" && LOOKALIKE[t.id] && Math.random() < .75) {
      const look = LOOKALIKE[t.id].filter((x) => pool.ids.includes(x));
      if (look.length) picks.push(pick(look));
    }
    for (const id of shuffle(pool.ids)) { if (picks.length >= pool.n) break; if (!picks.includes(id)) picks.push(id); }
    return shuffle(picks).map((id) => L[id]);
  }
  const promptItems = () => [it(P.top), letterItem(S.target)];

  function renderCards() {
    const box = $("cards");
    box.dataset.n = S.options.length; box.innerHTML = "";
    const colors = shuffle([0, 1, 2, 3, 4, 5]);
    S.options.forEach((l, i) => {
      const b = document.createElement("button");
      b.className = `toy lcard k${colors[i]}` + (l.up.length > 1 ? " wide" : "");
      b.dataset.id = l.id;
      b.style.animationDelay = (i * 160) + "ms";
      b.setAttribute("aria-label", l.up + " harfi");
      b.innerHTML = `<span class="glyph">${esc(l.up)}<small>${esc(l.lo)}</small></span>`;
      b.addEventListener("click", () => tapCard(b, l));
      box.appendChild(b);
    });
  }
  function renderReveal(l) {
    const r = $("reveal");
    if (!l) { r.innerHTML = `<span class="wait">👂 Gepardni eshit va harfni top</span>`; return; }
    r.innerHTML = `<span class="cheer">👏</span><span class="pic">${l.pic}</span><span class="word">${esc(l.word).replace(/\[(.+?)\]/, "<b>$1</b>")}</span>`;
  }
  function showNext(go) {
    const b = document.createElement("button");
    b.className = "toy next-btn"; b.textContent = "Keyingi harf ▶";
    const row = document.createElement("div"); row.className = "next-row"; row.appendChild(b);
    b.addEventListener("click", () => { audio(); sfx.pop(); row.remove(); go(); }, { once: true });
    $("reveal").appendChild(row);
  }
  // say the letter again if the child has not tapped for a while
  function nudge(round) {
    later(() => {
      if (round !== S.round || S.busy || $("gameScreen").hidden || !$("pickScreen").hidden || !$("giftScreen").hidden) return;
      $("guide").classList.remove("nod"); void $("guide").offsetWidth; $("guide").classList.add("nod");
      speak(promptItems());
      nudge(round);
    }, 9000);
  }

  function newRound() {
    clearTimers();
    S.round++;
    S.target = nextTarget(); S.options = chooseOptions(S.target);
    S.tries = 0; S.busy = false;
    $("guide").classList.remove("happy");
    renderCards(); renderReveal(null);
    setBubble("Qani, top! 👂");
    const round = S.round;
    later(() => { if (round === S.round) speak(promptItems()); }, 700);
    nudge(round);
  }

  function tapCard(b, l) {
    audio();
    if (S.busy || b.classList.contains("wrong")) return;
    if (l.id === S.target.id) {
      S.busy = true;
      const round = S.round;
      b.classList.remove("hint"); b.classList.add("right");
      document.querySelectorAll("#cards .lcard").forEach((c) => { if (c !== b) c.classList.add("faded"); });
      $("guide").classList.add("happy");
      sfx.good(); later(() => sfx.clap(), 350); confetti(); later(() => confetti(80), 900);
      const pr = pick(P.praise);
      setBubble(`${pr[1]} Bu — ${l.up}!`);
      renderReveal(l);
      S.correctTotal++; saveProgress(); renderPips(); renderGoal();
      lessonScore[S.level] = (lessonScore[S.level] || 0) + 1; saveLessons();
      const talk = speak([it(pr), letterItem(l), wordItem(l)]);
      Promise.race([talk, wait(6500)]).then(() => wait(900)).then(() => {
        if (round !== S.round || $("gameScreen").hidden) return;
        if (S.correctTotal % EVERY === 0) { wait(600).then(() => { if (round === S.round) showGift(newRound); }); return; }
        showNext(() => { if (round === S.round) newRound(); });
      });
    } else {
      S.tries++;
      b.classList.add("wrong");
      sfx.bad();
      // the missed letter comes back soon
      S.bag.splice(Math.min(2, S.bag.length), 0, S.target.id);
      const d = pick(P.dalda);
      setBubble(`${d[1]} Yana urinib ko‘r 💪`);
      $("guide").classList.remove("nod"); void $("guide").offsetWidth; $("guide").classList.add("nod");
      if (S.tries >= 2) document.querySelector(`#cards [data-id="${S.target.id}"]`)?.classList.add("hint");
      S.busy = true;
      const round = S.round;
      speak([it(d), it(P.yana), letterItem(S.target)]);
      later(() => { if (round === S.round) S.busy = false; }, 900);
    }
  }

  /* ---------------- lessons ---------------- */
  let lessonScore = {};
  try { lessonScore = JSON.parse(localStorage.getItem("harflar-lessons") || "{}") || {}; } catch (e) { lessonScore = {}; }
  function saveLessons() { try { localStorage.setItem("harflar-lessons", JSON.stringify(lessonScore)); } catch (e) {} }
  function renderLessons() {
    $("lessons").innerHTML = Object.entries(POOLS).map(([k, p], i) => {
      const n = lessonScore[k] || 0;
      const letters = p.ids.map((id) => L[id].up).join(" ");
      if (k === "all") return `<button class="toy level all" data-level="all"><span class="ico">${p.ico}</span><span class="rng">Hammasi</span><span class="nm">29 ta harfdan savol${n ? ` · ⭐ ${n}` : ""}</span></button>`;
      return `<button class="toy level lesson c${i % 6}" data-level="${k}">${n ? `<span class="done">⭐ ${n}</span>` : ""}<span class="ico">${p.ico}</span><span class="rng">${letters}</span><span class="nm">${p.title}</span></button>`;
    }).join("");
  }
  $("lessons").addEventListener("click", (e) => { const b = e.target.closest(".level"); if (!b) return; audio(); sfx.pop(); startGame(b.dataset.level); });

  function showLearn() {
    const ids = POOLS[S.level].ids;
    $("learnBubble").textContent = "Keling, tanishamiz! Har bir harfni bosib eshit 👆";
    $("learnGrid").innerHTML = ids.map((id, i) => {
      const l = L[id];
      return `<button class="toy lt k${i % 6}${l.up.length > 1 ? " wide" : ""}" data-id="${id}" style="animation-delay:${i * 120}ms"><span class="glyph">${esc(l.up)}<small>${esc(l.lo)}</small></span><span class="e">${l.pic}</span><span class="w">${esc(l.plain)}</span></button>`;
    }).join("");
    $("learnBoard").hidden = false; $("playBoard").hidden = true;
    // introduce each letter in turn, then let the child tap them
    const round = S.round;
    const intro = async () => {
      await wait(600);
      for (const id of ids) {
        if (round !== S.round || $("learnBoard").hidden || S.learnTapped) return;
        const card = document.querySelector(`#learnGrid [data-id="${id}"]`);
        card.classList.remove("say"); void card.offsetWidth; card.classList.add("say", "heard");
        await Promise.race([speak([letterItem(L[id]), wordItem(L[id])]), wait(4000)]);
        await wait(700);
      }
      if (round === S.round && !$("learnBoard").hidden) $("learnBubble").textContent = "Endi o‘ynaymiz! Yashil tugmani bos 👇";
    };
    S.learnTapped = false;
    intro();
  }
  $("learnGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".lt"); if (!b) return;
    audio(); S.learnTapped = true;
    const l = L[b.dataset.id];
    b.classList.remove("say"); void b.offsetWidth; b.classList.add("say", "heard");
    speak([letterItem(l), wordItem(l)]);
  });
  $("playBtn").addEventListener("click", () => { audio(); sfx.pop(); beginPlay(); });
  function beginPlay() {
    stopSpeech(); S.round++;
    $("learnBoard").hidden = true; $("playBoard").hidden = false;
    if (!G[S.goal]) { S.target = null; $("cards").innerHTML = ""; renderReveal(null); openPicker(() => { newRound(); }); return; }
    newRound();
  }
  function startGame(level) {
    S.level = level; S.bag = []; S.last = null; S.target = null;
    ["startScreen", "giftScreen", "collScreen", "recScreen"].forEach((id) => { $(id).hidden = true; });
    $("gameScreen").hidden = false;
    renderPips(); renderGoal();
    scrollTo({ top: 0 });
    if (level === "all") { $("learnBoard").hidden = true; beginPlay(); } else showLearn();
  }
  function goHome() {
    clearTimers(); S.busy = false; S.round++;
    stopSpeech();
    $("gameScreen").hidden = true; $("giftScreen").hidden = true; $("pickScreen").hidden = true; $("startScreen").hidden = false;
    renderShelf(); renderLessons();
  }

  /* ---------------- gifts & shelf ---------------- */
  let collection = [];
  try { collection = JSON.parse(localStorage.getItem("harflar-gifts") || "[]"); if (!Array.isArray(collection)) collection = []; collection = collection.filter((id) => G[id]); } catch (e) { collection = []; }
  try { S.correctTotal = +(localStorage.getItem("harflar-correct") || 0) || 0; } catch (e) { S.correctTotal = 0; }
  function saveProgress() {
    try { localStorage.setItem("harflar-correct", String(S.correctTotal)); localStorage.setItem("harflar-gifts", JSON.stringify(collection)); } catch (e) {}
  }
  function renderPips() {
    const have = S.correctTotal % EVERY;
    $("pips").innerHTML = Array.from({ length: EVERY }, (_, i) => `<span class="pip${i < have ? " on" : ""}"></span>`).join("");
    $("giftMeter").classList.toggle("near", have === EVERY - 1);
    $("giftMeter").setAttribute("aria-label", `Sovg‘agacha yana ${EVERY - have} ta to‘g‘ri javob. Sovg‘alarimni ko‘rish`);
  }
  try { S.goal = localStorage.getItem("harflar-goal") || null; } catch (e) { S.goal = null; }
  function saveGoal() { try { if (S.goal) localStorage.setItem("harflar-goal", S.goal); else localStorage.removeItem("harflar-goal"); } catch (e) {} }
  function renderGoal() {
    const g = G[S.goal], left = EVERY - S.correctTotal % EVERY;
    $("goalEmoji").textContent = g ? g.e : "🎁";
    $("goalName").innerHTML = g ? `${esc(g.name)}<small>yana ${left} ta harf</small>` : "Sovg‘a tanla";
    $("goalBtn").classList.toggle("near", left === 1);
  }
  let pickAfter = null;
  function openPicker(after) {
    pickAfter = after;
    const counts = new Map();
    collection.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
    const favIds = FAVS.map((f) => f[0]);
    // gifts already won live only in the collection; deleting one there brings it back here
    let left = GIFTS.filter((g) => !counts.has(g.id));
    const allWon = !left.length;
    if (allWon) left = GIFTS;
    $("pickNote").textContent = allWon ? "Barcha sovg‘alarni yutding! 🏆 Istalganini yana tanla." : "7 ta harfni topsang, shu sovg‘a seniki bo‘ladi!";
    $("pickGrid").innerHTML = left.map((g, i) => `<button class="toy pick" data-id="${g.id}" style="animation-delay:${Math.min(i, 30) * 15}ms"><span class="e">${g.e}</span><span class="nm">${esc(g.name)}</span></button>`).join("");
    $("pickScreen").hidden = false;
    $("pickScreen").querySelector(".pick-card").scrollTop = 0;
    speak([it(P.tanla)]);
  }
  $("pickGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".pick"); if (!b || !pickAfter) return;
    audio(); sfx.good();
    const g = G[b.dataset.id];
    S.goal = g.id; saveGoal(); renderGoal();
    b.classList.add("chosen");
    const after = pickAfter; pickAfter = null;
    speak([giftItem(g)]);
    setTimeout(() => { $("pickScreen").hidden = true; if (!$("gameScreen").hidden) after(); }, 1100);
  });
  $("goalBtn").addEventListener("click", () => {
    if (S.busy) return;
    audio(); sfx.pop();
    openPicker(() => { if (S.target) speak(promptItems()); else newRound(); });
  });
  function renderShelf() {
    $("shelfCount").textContent = collection.length ? `(${collection.length})` : "";
    $("shelfItems").innerHTML = collection.length
      ? collection.map((id, i) => `<span style="animation-delay:${Math.min(i, 20) * 30}ms">${G[id].e}</span>`).join("")
      : '<span class="empty">Hali sovg‘a yo‘q. Sovg‘a tanla va 7 ta harfni top!</span>';
  }
  function choosePrize() {
    if (G[S.goal]) return G[S.goal];
    const freshFav = GIFTS.slice(0, FAVS.length).filter((g) => !collection.includes(g.id));
    if (freshFav.length) return pick(freshFav);
    const fresh = GIFTS.filter((g) => !collection.includes(g.id));
    return pick(fresh.length ? fresh : GIFTS);
  }
  const giftBoxEl = $("giftBox");
  function showGift(next) {
    const prize = choosePrize(), stage = $("giftStage");
    stage.classList.remove("open"); stage.innerHTML = ""; stage.appendChild(giftBoxEl);
    $("giftName").textContent = ""; $("giftTitle").textContent = "Sovg‘a!";
    $("giftText").textContent = "7 ta to‘g‘ri javob! Qutini och 👇";
    $("giftNext").hidden = true; $("giftScreen").hidden = false;
    sfx.win();
    speak([it(P.sovga)]);
    giftBoxEl.onclick = () => {
      audio(); giftBoxEl.onclick = null;
      collection.push(prize.id); saveProgress();
      stage.innerHTML = `<div class="gift-prize">${prize.e}</div>`;
      stage.classList.add("open");
      $("giftTitle").textContent = "Ura!"; $("giftText").textContent = "Senga sovg‘a:";
      $("giftName").textContent = prize.name + "!";
      sfx.good(); confetti(160);
      speak([it(P.ura), giftItem(prize)]);
      S.goal = null; saveGoal(); renderGoal();
      $("giftNext").hidden = false; $("giftNext").focus();
      $("giftNext").onclick = () => { $("giftNext").onclick = null; $("giftScreen").hidden = true; sfx.pop(); openPicker(next); };
    };
    giftBoxEl.focus();
  }
  function openCollection() {
    audio(); sfx.pop();
    const counts = new Map();
    collection.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
    $("collText").textContent = collection.length ? `Jami ${counts.size} ta sovg‘a yutding!` : "";
    const won = GIFTS.filter((g) => counts.has(g.id));
    $("collGrid").innerHTML = won.length ? won.map((g, i) => {
      const c = counts.get(g.id);
      return `<div class="coll-item" style="animation-delay:${Math.min(i, 30) * 20}ms"><button class="rm" data-id="${g.id}" aria-label="${esc(g.name)} sovg‘asini o‘chirish">✕</button><span class="e">${g.e}</span><span class="nm">${esc(g.name)}</span>${c > 1 ? `<span class="x">×${c}</span>` : ""}</div>`;
    }).join("") : '<p class="coll-empty">Hali sovg‘a yo‘q. Sovg‘a tanla va 7 ta harfni top!</p>';
    clearTarget = null;
    $("collClear").hidden = !collection.length; $("clearConfirm").hidden = true;
    $("collScreen").hidden = false;
    speak([it(collection.length ? P.mana : P.yoq)]);
    $("collClose").focus();
  }
  function closeCollection() { $("collScreen").hidden = true; sfx.pop(); }
  $("giftMeter").addEventListener("click", openCollection);
  $("shelfOpen").addEventListener("click", openCollection);
  $("shelfItems").addEventListener("click", openCollection);
  $("collClose").addEventListener("click", closeCollection);
  let clearTarget = null; // null = all gifts, otherwise one gift id
  $("collClear").addEventListener("click", () => { sfx.pop(); clearTarget = null; $("clearMsg").textContent = "Barcha sovg‘alar o‘chib ketadi va yana tanlash oynasiga qaytadi. Rostdan ham o‘chirasizmi?"; $("clearConfirm").hidden = false; $("clearNo").focus(); });
  $("collGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".rm"); if (!b) return;
    sfx.pop(); clearTarget = b.dataset.id;
    $("clearMsg").textContent = `«${G[clearTarget].name}» o‘chirilsinmi? U yana tanlash oynasiga qaytadi.`;
    $("clearConfirm").hidden = false; $("clearConfirm").scrollIntoView({ block: "nearest" }); $("clearNo").focus();
  });
  $("clearNo").addEventListener("click", () => { sfx.pop(); $("clearConfirm").hidden = true; });
  $("clearYes").addEventListener("click", () => {
    if (clearTarget) { const id = clearTarget; collection = collection.filter((x) => x !== id); }
    else { collection = []; S.correctTotal = 0; }
    saveProgress();
    renderShelf(); if (!$("gameScreen").hidden) { renderPips(); renderGoal(); }
    sfx.del(); openCollection();
  });
  $("collScreen").addEventListener("click", (e) => { if (e.target.id === "collScreen") closeCollection(); });

  /* ---------------- parents: recordings ---------------- */
  const SECTIONS = [
    { title: "Harflar", items: LETTERS.map((l) => ({ k: "h-" + l.id, say: l.name.charAt(0).toUpperCase() + l.name.slice(1), what: `${l.up} harfining nomi`, t: l.name + "." })) },
    { title: "So‘zlar", items: LETTERS.map((l) => ({ k: "s-" + l.id, say: l.plain, what: `${l.up} harfi uchun so‘z ${l.pic}`, t: l.plain + "!" })) },
    { title: "Gaplar", items: [P.salom, P.tanla, P.top, P.bu, P.yana, ...P.dalda, P.keyingi, ...P.praise, P.sovga, P.ura, P.mana, P.yoq].map(([k, t]) => ({ k, say: t, what: "gap", t })) },
    { title: "Sovg‘alar", items: GIFTS.map((g) => ({ k: "g-" + g.id, say: g.name, what: `sovg‘a ${g.e}`, t: g.name + "!" })) },
  ];
  const ITEM = Object.fromEntries(SECTIONS.flatMap((s) => s.items).map((x) => [x.k, x]));

  function renderRecList() {
    $("recList").innerHTML = SECTIONS.map((s, si) => {
      const done = s.items.filter((x) => clips.has(x.k)).length;
      return `<div class="rec-sec"><h3>${s.title} <span class="cnt">${done} / ${s.items.length} yozildi</span></h3>` +
        s.items.map((x) => {
          const has = clips.has(x.k);
          return `<div class="rec-row${has ? " has" : ""}" data-k="${x.k}">
            <div class="txt"><span class="say">${esc(x.say)}</span><span class="meta">${has ? '<span class="ok">✓ yozilgan</span> · ' : ""}${esc(x.what)} · ${x.k}</span></div>
            <button class="toy play" aria-label="Eshitish">▶</button>
            <label class="toy" aria-label="Ovoz yozish">🎙️<input class="vis" type="file" accept="audio/*,.wav,.mp3,.m4a,.ogg,.aac,.webm"></label>
            <button class="toy del" aria-label="O‘chirish"${ownKeys.has(x.k) ? "" : " disabled"}>🗑</button>
          </div>`;
        }).join("") + `</div>`;
    }).join("");
  }
  async function saveClip(k, blob) {
    const buf = await decodeArr(await blob.arrayBuffer());
    try { await idbTx("readwrite", (st) => st.put(blob, k)); } catch (e) { toast("Bu brauzer ovozni saqlay olmadi, faqat hozircha ishlaydi."); }
    clips.set(k, buf); ownKeys.add(k);
    return buf;
  }
  $("recList").addEventListener("click", (e) => {
    const row = e.target.closest(".rec-row"); if (!row) return;
    const x = ITEM[row.dataset.k];
    if (e.target.closest(".play")) { audio(); speak([x], true); }
    else if (e.target.closest(".del")) {
      stopSpeech();
      idbTx("readwrite", (st) => st.delete(x.k)).catch(() => {});
      clips.delete(x.k); ownKeys.delete(x.k);
      if (EMBEDDED[x.k]) loadClips().then(renderRecList); else renderRecList();
      updateVoiceNote(); toast("O‘chirildi");
    }
  });
  $("recList").addEventListener("change", async (e) => {
    const inp = e.target; if (!inp.files || !inp.files[0]) return;
    const row = inp.closest(".rec-row"), k = row.dataset.k;
    audio();
    try { const buf = await saveClip(k, inp.files[0]); renderRecList(); updateVoiceNote(); playBuf(buf); toast("Saqlandi ✓"); }
    catch (err) { toast("Bu audio faylni o‘qib bo‘lmadi. Boshqa formatda yozib ko‘ring."); }
  });
  $("bulkInput").addEventListener("change", async (e) => {
    const files = [...e.target.files]; let ok = 0, skip = [];
    audio();
    for (const f of files) {
      const k = f.name.replace(/\.[^.]+$/, "").trim().toLowerCase().replace(/_/g, "-");
      if (!ITEM[k]) { skip.push(f.name); continue; }
      try { await saveClip(k, f); ok++; } catch (err) { skip.push(f.name); }
    }
    e.target.value = "";
    renderRecList(); updateVoiceNote();
    toast(`${ok} ta ovoz saqlandi` + (skip.length ? `. Tushunilmadi: ${skip.slice(0, 3).join(", ")}${skip.length > 3 ? "…" : ""}` : ""));
  });
  function openRec() {
    audio(); sfx.pop();
    const a = 6 + Math.floor(Math.random() * 4), b = 4 + Math.floor(Math.random() * 5), sum = a + b;
    $("gateQ").textContent = `${a} + ${b} = ?`;
    $("gateOpts").innerHTML = shuffle([sum, sum + 2, sum - 3]).map((v) => `<button class="toy" data-v="${v}">${v}</button>`).join("");
    $("gateOpts").onclick = (e) => {
      const btn = e.target.closest("button"); if (!btn) return;
      if (+btn.dataset.v === sum) { $("gate").hidden = true; $("recBody").hidden = false; renderRecList(); }
      else { sfx.bad(); openRec(); }
    };
    $("gate").hidden = false; $("recBody").hidden = true; $("recScreen").hidden = false;
  }
  const closeRec = () => { stopSpeech(); $("recScreen").hidden = true; sfx.pop(); };
  $("recOpen").addEventListener("click", openRec);
  $("recClose").addEventListener("click", closeRec);
  $("gateClose").addEventListener("click", closeRec);

  /* ---------------- fullscreen ---------------- */
  const root = document.documentElement;
  const fsEnabled = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  function toast(t) {
    const el = $("toast"); el.textContent = t; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 3400);
  }
  async function toggleFullscreen() {
    audio();
    try {
      if (fsElement()) await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else await (root.requestFullscreen || root.webkitRequestFullscreen).call(root, { navigationUI: "hide" });
    } catch (e) { toast("Bu qurilmada to‘liq ekran ishlamadi. Brauzer menyusidan foydalaning."); }
  }
  function syncFs() {
    const on = !!fsElement();
    $("fsBtn").textContent = on ? "✕" : "⛶";
    $("fsBtn").setAttribute("aria-label", on ? "To‘liq ekrandan chiqish" : "To‘liq ekran");
    $("fsStart").textContent = on ? "✕ To‘liq ekrandan chiqish" : "⛶ To‘liq ekranda o‘ynash";
  }
  document.querySelectorAll(".fs-btn").forEach((b) => { b.hidden = !fsEnabled; b.addEventListener("click", toggleFullscreen); });
  document.addEventListener("fullscreenchange", syncFs);
  document.addEventListener("webkitfullscreenchange", syncFs);

  /* ---------------- wiring ---------------- */
  function setSound(on) {
    soundOn = on;
    $("soundBtn").textContent = on ? "🔊" : "🔇";
    if (!on) stopSpeech();
    try { localStorage.setItem("harflar-sound", on ? "on" : "off"); } catch (e) {}
  }
  $("homeBtn").addEventListener("click", goHome);
  $("soundBtn").addEventListener("click", () => { setSound(!soundOn); audio(); if (soundOn) sfx.pop(); });
  $("speakBtn").addEventListener("click", () => { audio(); if (S.target) speak(promptItems()); });
  document.addEventListener("keydown", (e) => {
    if ($("gameScreen").hidden || !$("giftScreen").hidden || !$("collScreen").hidden || !$("pickScreen").hidden) return;
    if (e.key === " ") { e.preventDefault(); $("speakBtn").click(); return; }
    const n = +e.key;
    if (n >= 1 && n <= S.options.length) document.querySelectorAll("#cards .lcard")[n - 1]?.click();
  });
  setSound(soundOn);
  renderShelf();
  renderLessons();
  loadClips();
})();
