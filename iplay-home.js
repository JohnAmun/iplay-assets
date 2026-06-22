/* iplay-home.js — i-play.io Home visual-upgrade bundle (Pure Felt)
 * Self-injecting: adds its own <style> + wires interactions.
 * Home-guarded via [data-iplay="hero"] — no-ops on every other page.
 * Targets the stable [data-iplay="..."] section hooks (never Webflow auto-classes).
 */
(function () {
  "use strict";
  if (window.__iplayHome) return;
  var HERO = document.querySelector('[data-iplay="hero"]');
  if (!HERO) return;                      // not Home → no-op
  window.__iplayHome = true;

  var IMG = "https://cdn.jsdelivr.net/gh/JohnAmun/iplay-assets@main/img/";
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var sect = function (n) { return document.querySelector('[data-iplay="' + n + '"]'); };
  var prefersReduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function safe(name, fn) { try { fn(); } catch (e) { (console.warn || console.log)("[iplay-home] " + name + " failed", e); } }

  /* reveal-on-scroll helper */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("iph-in"); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }) : null;
  function reveal(el, delay) { if (!el) return; el.classList.add("iph-rev"); if (delay) el.style.transitionDelay = delay + "ms"; if (io) io.observe(el); else el.classList.add("iph-in"); }

  /* ============================ STYLES ============================ */
  var CSS = "\
:root{--ip-bg0:#000;--ip-bg1:#0A0E0C;--ip-bg2:#121815;--ip-bd:#1E2A24;--ip-br:#069C63;--ip-brh:#0AD17F;--ip-t1:#fff;--ip-t2:#A8B4AE;--ip-t3:#6B746F}\
html,body{overflow-x:clip!important}\
[data-iplay=hero] .glow{max-width:100vw}\
[data-iplay] .ipg{max-width:100%}\
.iph-rev{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}\
.iph-in{opacity:1;transform:none}\
@media (prefers-reduced-motion:reduce){.iph-rev{opacity:1;transform:none;transition:none}}\
/* ---- HERO ---- */\
[data-iplay=hero]{position:relative;overflow:hidden}\
.iph-hero-amb{position:absolute;inset:0;z-index:0;pointer-events:none}\
[data-iplay=hero] .hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:1.06fr .94fr;gap:52px;align-items:center;max-width:1320px;margin-left:auto;margin-right:auto}\
.iph-hcol-text{min-width:0}\
.iph-hcol-dev{position:relative;min-width:0;display:flex;justify-content:center;align-items:center}\
[data-iplay=hero] .hero-panel{display:none!important}\
[data-iplay=hero] .iph-hcol-dev .stack{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;inset:auto!important;transform:none!important;margin:0 auto!important;max-width:100%!important}\
[data-iplay=hero] .iph-hcol-dev .glow{opacity:.7}\
.iph-hcol-dev .iph-devwrap{position:relative!important;width:100%!important;height:auto!important;transform:none;will-change:transform;transition:transform .25s ease-out}\
@media(max-width:991px){[data-iplay=hero] .hero-inner{grid-template-columns:1fr;gap:36px}.iph-hcol-dev{margin-top:8px}}\
/* ---- STATS / engine stat cards ---- */\
.iph-statcard{background:var(--ip-bg1);border:1px solid var(--ip-bd);border-radius:8px;padding:22px 22px 20px;display:flex;flex-direction:column;gap:8px;height:100%}\
.iph-statcard .stat-num{color:var(--ip-brh)!important;font-weight:800;line-height:1;font-size:clamp(26px,3vw,40px);letter-spacing:-.02em}\
.iph-statcard .stat-label{color:var(--ip-t2)!important;margin:0;font-size:13.5px;line-height:1.45}\
/* ---- PLATFORM-CORE node diagram ---- */\
[data-iplay=platform-core] [data-viz=ecosystem]{position:relative}\
[data-iplay=platform-core] [data-viz=ecosystem] svg{overflow:visible}\
[data-iplay=platform-core] [data-viz=ecosystem] text{font-size:15px!important;fill:var(--ip-t1)!important;font-weight:600}\
[data-iplay=platform-core] [data-viz=ecosystem] .iph-flow{stroke:var(--ip-brh);stroke-width:1.6;fill:none;opacity:.55;stroke-dasharray:5 9;animation:iph-dash 1.1s linear infinite}\
@keyframes iph-dash{to{stroke-dashoffset:-28}}\
[data-iplay=platform-core] .iph-core-pulse{transform-box:fill-box;transform-origin:center;animation:iph-pulse 2.4s ease-in-out infinite}\
@keyframes iph-pulse{0%,100%{opacity:.25;r:38}50%{opacity:.05;r:54}}\
/* ---- YOU-BRING tiles ---- */\
[data-iplay=platform-core] .card{background:transparent!important;border:0!important;padding:0!important}\
.iph-bring-head{display:block;color:var(--ip-t1);font-weight:700;font-size:clamp(17px,2vw,20px);margin:6px 0 16px;letter-spacing:-.01em}\
.iph-bring-head .iph-bh-sub{display:block;color:var(--ip-t3);font-weight:400;font-size:13px;margin-top:4px}\
.iph-bring-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}\
.iph-bring-tile{background:var(--ip-bg1);border:1px solid var(--ip-bd);border-radius:8px;padding:18px 16px;transition:border-color .3s,transform .3s}\
.iph-bring-tile:hover{border-color:var(--ip-br);transform:translateY(-3px)}\
.iph-bring-tile .bring-item{color:var(--ip-t1)!important;font-weight:650;font-size:15px}\
.iph-bring-tile .iph-tsub{color:var(--ip-t2);font-size:12.5px;margin-top:6px;line-height:1.4}\
@media(max-width:767px){.iph-bring-grid{grid-template-columns:repeat(2,1fr)}}\
/* ---- SCREENS ---- */\
[data-iplay=screens] .chip{cursor:pointer;transition:color .2s,border-color .2s,background .2s}\
[data-iplay=screens] .iph-shotframe{position:relative;overflow:hidden;border-radius:10px;border:1px solid var(--ip-bd);background:var(--ip-bg2)}\
[data-iplay=screens] .iph-shotscroll{display:block;width:100%;transition:transform .12s linear,opacity .35s ease}\
[data-iplay=screens] .iph-hint{position:absolute;right:10px;bottom:9px;font-size:11px;color:var(--ip-t3);background:rgba(0,0,0,.55);border:1px solid var(--ip-bd);border-radius:6px;padding:3px 8px;opacity:0;transition:opacity .25s;pointer-events:none}\
[data-iplay=screens] .iph-shotframe:hover .iph-hint{opacity:1}\
.iph-screens-stage{display:grid;grid-template-columns:1fr 230px;gap:26px;align-items:end}\
.iph-mobile-peer{border:1px solid var(--ip-bd);border-radius:18px;overflow:hidden;background:var(--ip-bg2);box-shadow:0 24px 60px rgba(0,0,0,.5)}\
.iph-mobile-peer img{display:block;width:100%}\
@media(max-width:767px){.iph-screens-stage{grid-template-columns:1fr}.iph-mobile-peer{display:none}}\
/* ---- PREDICTIONS floating crops ---- */\
[data-iplay=predictions] .col:last-child{position:relative}\
.iph-float{position:absolute;border:1px solid var(--ip-bd);border-radius:10px;overflow:hidden;box-shadow:0 18px 44px rgba(0,0,0,.55);background:var(--ip-bg2);z-index:3}\
.iph-float img{display:block}\
.iph-float.iph-rev{transform:translateY(26px) scale(.96)}\
.iph-float.iph-in{transform:none}\
@media(max-width:767px){.iph-float,.iph-tree{display:none!important}}\
/* ---- CHAPTER unify (predictions + engine) ---- */\
[data-iplay-chapter=predictions]{background:var(--ip-bg1)!important;border-top:0!important;position:relative}\
[data-iplay=predictions]{padding-bottom:30px!important}\
[data-iplay=engine]{padding-top:26px!important}\
.iph-spine{position:absolute;left:50%;transform:translateX(-50%);width:2px;background:linear-gradient(var(--ip-br),rgba(10,209,127,.12));z-index:1}\
.iph-spine-dot{position:absolute;left:50%;transform:translate(-50%,-50%);width:9px;height:9px;border-radius:50%;background:var(--ip-brh);box-shadow:0 0 0 5px rgba(10,209,127,.12)}\
/* ---- AFFILIATE downline ---- */\
[data-iplay=affiliate] .col:first-child{position:relative}\
.iph-tree{position:absolute;right:-6px;bottom:-6px;width:190px;height:150px;z-index:3;pointer-events:none}\
.iph-tree path,.iph-tree line{stroke:var(--ip-brh);stroke-width:1.5;fill:none;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);transition:stroke-dashoffset 1.3s ease}\
.iph-tree.iph-in path,.iph-tree.iph-in line{stroke-dashoffset:0}\
.iph-tree circle{fill:var(--ip-bg2);stroke:var(--ip-br);stroke-width:1.5;opacity:0;transition:opacity .5s ease}\
.iph-tree.iph-in circle{opacity:1}\
/* ---- LIFECYCLE pinned journey ---- */\
.iph-life-wrap{position:relative;display:grid;grid-template-columns:300px 1fr;gap:48px;margin-top:18px}\
.iph-life-rail{position:sticky;top:96px;align-self:start;height:max-content}\
.iph-rail-stage{display:flex;gap:14px;align-items:flex-start;padding:14px 0;opacity:.4;transition:opacity .4s}\
.iph-rail-stage.on{opacity:1}\
.iph-rail-num{flex:0 0 auto;width:34px;height:34px;border-radius:50%;border:1px solid var(--ip-bd);display:flex;align-items:center;justify-content:center;color:var(--ip-t2);font-weight:700;font-size:14px;transition:all .4s}\
.iph-rail-stage.on .iph-rail-num{background:var(--ip-br);border-color:var(--ip-br);color:#fff}\
.iph-rail-line{position:absolute;left:16px;top:8px;bottom:8px;width:2px;background:var(--ip-bd);z-index:0}\
.iph-rail-fill{position:absolute;left:16px;top:8px;width:2px;background:var(--ip-brh);height:0;z-index:1;transition:height .3s ease}\
.iph-rail-mock{margin-top:22px;border:1px solid var(--ip-bd);border-radius:10px;overflow:hidden;background:var(--ip-bg2);aspect-ratio:16/10;position:relative}\
.iph-rail-mock img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;opacity:0;transition:opacity .5s ease}\
.iph-rail-mock img.on{opacity:1}\
.iph-life-stages{display:flex;flex-direction:column;gap:26px;position:relative}\
.iph-life-stages .col{width:100%!important}\
.iph-life-stages .card{transition:border-color .4s,transform .4s}\
.iph-life-stages .col.on .card{border-color:var(--ip-br)}\
@media(max-width:991px){.iph-life-wrap{grid-template-columns:1fr;gap:24px}.iph-life-rail{position:relative;top:0}.iph-rail-mock{max-width:420px}}\
";

  safe("style", function () {
    var s = document.createElement("style");
    s.id = "iplay-home-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  });

  /* ============================ 1. HERO ============================ */
  safe("hero", function () {
    var inner = q(".hero-inner", HERO);
    if (!inner || inner.__iph) return; inner.__iph = true;

    var textCol = document.createElement("div"); textCol.className = "iph-hcol-text";
    [".eyebrow", ".hero-h1", ".hero-sub", ".hero-cta"].forEach(function (sel) {
      var el = q(sel, inner); if (el) textCol.appendChild(el);
    });

    // device cluster lives in a sibling .w-embed ( div > .glow + .stack )
    var stack = q(".stack", HERO);
    var devWrap = stack ? stack.parentElement : null;
    var devCol = document.createElement("div"); devCol.className = "iph-hcol-dev";
    if (devWrap) { devWrap.classList.add("iph-devwrap"); devCol.appendChild(devWrap); }

    // ghost duplicate = the placeholder .hero-panel (hidden via CSS) + ensure no stray dup
    inner.insertBefore(textCol, inner.firstChild);
    inner.appendChild(devCol);

    // ambient felt/particle background (black + subtle green)
    var amb = document.createElement("canvas"); amb.className = "iph-hero-amb";
    HERO.insertBefore(amb, HERO.firstChild);
    var ctx = amb.getContext("2d"), W, H, pts = [];
    function rs() { W = amb.width = HERO.offsetWidth; H = amb.height = HERO.offsetHeight; }
    rs(); window.addEventListener("resize", rs);
    for (var i = 0; i < 46; i++) pts.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .4, s: Math.random() * .00018 + .00004 });
    (function loop() {
      if (prefersReduce) return;
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < pts.length; j++) { var p = pts[j]; p.y -= p.s; if (p.y < -.02) p.y = 1.02;
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 6.28);
        ctx.fillStyle = "rgba(10,209,127," + (.10 + p.r * .06) + ")"; ctx.fill(); }
      requestAnimationFrame(loop);
    })();

    // parallax on device
    if (!prefersReduce && devWrap) {
      HERO.addEventListener("mousemove", function (e) {
        var r = HERO.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
        devWrap.style.transform = "translate3d(" + (dx * 14) + "px," + (dy * 12) + "px,0)";
      });
      HERO.addEventListener("mouseleave", function () { devWrap.style.transform = ""; });
    }
  });

  /* ============================ 2. STATS (count-up cards) ============================ */
  function makeStatCards(scope) {
    qa(".col", scope).forEach(function (col) {
      if (col.__iph) return; col.__iph = true;
      var inner = col.querySelector(".stat-num") ? col : col;
      col.classList.add("iph-statcard"); // styling handled; col is the card
    });
  }
  function countUp(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/([^\d]*)(\d[\d,]*\.?\d*)(.*)$/);
    if (!m) { return; }
    var pre = m[1], num = parseFloat(m[2].replace(/,/g, "")), post = m[3];
    if (!isFinite(num) || num === 0) return;
    var dur = 1100, t0 = null;
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur);
      var v = Math.round((1 - Math.pow(1 - k, 3)) * num);
      el.textContent = pre + v + post; if (k < 1) requestAnimationFrame(step); else el.textContent = raw; }
    el.textContent = pre + "0" + post; requestAnimationFrame(step);
  }
  function wireStatCountup(scope) {
    qa(".stat-num", scope).forEach(function (n) {
      if (n.__iphc) return; n.__iphc = true;
      reveal(n.closest(".col") || n);
      if (io) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp(n); o.unobserve(n); } }); }, { threshold: .6 }); o.observe(n); }
    });
  }
  safe("stats", function () {
    var st = sect("stats"); if (!st) return;
    makeStatCards(q(".row", st) || st);
    wireStatCountup(st);
    qa(".col", st).forEach(function (c, i) { reveal(c, i * 90); });
  });

  /* ============================ 3. PLATFORM-CORE ============================ */
  safe("platform-core-nodes", function () {
    var pc = sect("platform-core"); if (!pc) return;
    var eco = q("[data-viz=ecosystem]", pc); if (!eco) return;
    // wait for iplayviz to render the svg, then enhance
    var tries = 0;
    (function enhance() {
      var svg = eco.querySelector("svg");
      if (!svg && tries++ < 40) return setTimeout(enhance, 150);
      if (!svg) return;
      // flowing dashes on connector lines/paths
      qa("line,path", svg).forEach(function (ln) {
        var isConn = ln.tagName.toLowerCase() === "line" ||
          (ln.getAttribute("stroke") && ln.getAttribute("fill") === "none");
        if (isConn) ln.classList.add("iph-flow");
      });
      // glow pulse around the core node: find central circle (largest near center)
      var cx = svg.viewBox.baseVal ? svg.viewBox.baseVal.width / 2 : 0;
      var circles = qa("circle", svg);
      if (circles.length) {
        var core = circles.reduce(function (a, b) {
          return (parseFloat(b.getAttribute("r") || 0) > parseFloat(a.getAttribute("r") || 0)) ? b : a;
        });
        var pulse = core.cloneNode(false); pulse.classList.add("iph-core-pulse");
        pulse.setAttribute("fill", "rgba(10,209,127,.18)"); pulse.removeAttribute("stroke");
        core.parentNode.insertBefore(pulse, core);
      }
    })();
  });

  safe("platform-core-tiles", function () {
    var pc = sect("platform-core"); if (!pc) return;
    var card = q(".card", pc); if (!card || card.__iph) return; card.__iph = true;
    var title = q(".card-title", card);
    if (title) { title.classList.add("iph-bring-head");
      var sub = document.createElement("span"); sub.className = "iph-bh-sub";
      sub.textContent = "Everything else — the platform — is ours."; title.appendChild(sub); }
    var row = q(".row", card); if (!row) return;
    var tiles = qa(".col", row);
    // add 4th tile ("Your payouts") by cloning for class parity
    if (tiles.length === 3) {
      var clone = tiles[0].cloneNode(true);
      var bi = q(".bring-item", clone); if (bi) bi.textContent = "Your payouts";
      row.appendChild(clone); tiles = qa(".col", row);
    }
    // desired order + sublines
    var order = ["Your brand", "Your marketing", "Your support", "Your payouts"];
    var subs = { "Your brand": "name, look, domain", "Your marketing": "campaigns & growth",
      "Your support": "player care", "Your payouts": "you approve withdrawals, you hold the float" };
    var byName = {};
    tiles.forEach(function (t) { var bi = q(".bring-item", t); if (bi) byName[bi.textContent.trim()] = t; });
    row.classList.add("iph-bring-grid");
    order.forEach(function (nm, i) {
      var t = byName[nm]; if (!t) return;
      t.classList.add("iph-bring-tile");
      if (!q(".iph-tsub", t) && subs[nm]) { var s = document.createElement("div"); s.className = "iph-tsub"; s.textContent = subs[nm]; t.appendChild(s); }
      row.appendChild(t); // reorder
      reveal(t, i * 90);
    });
  });

  /* ============================ 4. SCREENS (tabs + hover-scroll) ============================ */
  safe("screens", function () {
    var sc = sect("screens"); if (!sc || sc.__iph) return;
    var tries = 0;
    (function waitImg() {
      var panel0 = q(".panel", sc);
      var img0 = panel0 ? panel0.querySelector("img") : null;     // built async by iplayshotfillv2
      if ((!panel0 || !img0) && tries++ < 60) return setTimeout(waitImg, 150);
      if (!panel0 || !img0) return;
      sc.__iph = true;
      try { initScreens(sc); } catch (e) { (console.warn || console.log)("[iplay-home] screens failed", e); }
    })();
  });

  function initScreens(sc) {
    var chips = qa(".chip, .chip-active", sc);
    var panel = q(".panel", sc); if (!panel) return;

    var MAP = {
      "Classic Frontend": IMG + "casino.png",
      "Premium Frontend": IMG + "home.png",
      "Your Custom Frontend": IMG + "custom.png",
      "Admin Control Tower": IMG + "admin.png"
    };
    // primary desktop screenshot inside the existing frame
    var bigImg = panel.querySelector("img");
    var frame = bigImg ? bigImg.closest(".ipb") || bigImg.parentElement : panel;
    if (frame) frame.classList.add("iph-shotframe");
    if (bigImg) bigImg.classList.add("iph-shotscroll");

    // mobile peer (enlarge) — build alongside, using home-m
    var stage = panel.closest(".stack") || panel.parentElement;
    if (bigImg && frame && !q(".iph-screens-stage", sc)) {
      var wrap = document.createElement("div"); wrap.className = "iph-screens-stage";
      panel.parentNode.insertBefore(wrap, panel);
      wrap.appendChild(panel);
      var peer = document.createElement("div"); peer.className = "iph-mobile-peer";
      var mimg = document.createElement("img"); mimg.src = IMG + "home-m.png"; mimg.alt = "mobile frontend"; mimg.loading = "lazy";
      peer.appendChild(mimg); wrap.appendChild(peer);
      sc.__peer = mimg;
      var sfMobile = panel.querySelector(".iph"); if (sfMobile) sfMobile.style.display = "none"; // hide shotfill inline mobile; enlarged peer is the mobile
    }

    // hover-scroll inside frame, release at bounds
    if (bigImg && frame) {
      var off = 0;
      function maxOff() { return Math.max(0, bigImg.scrollHeight - frame.clientHeight); }
      frame.addEventListener("wheel", function (e) {
        var mx = maxOff(); if (mx <= 0) return;
        var nxt = off + e.deltaY;
        if ((e.deltaY > 0 && off < mx) || (e.deltaY < 0 && off > 0)) {
          off = Math.max(0, Math.min(mx, nxt)); bigImg.style.transform = "translateY(" + (-off) + "px)"; e.preventDefault();
        } // else: at top/bottom → let page scroll (no preventDefault) → never traps
      }, { passive: false });
      var hint = document.createElement("div"); hint.className = "iph-hint"; hint.textContent = "Scroll to explore"; frame.appendChild(hint);
    }

    function activate(label) {
      chips.forEach(function (c) {
        var on = c.textContent.trim() === label;
        c.classList.toggle("chip-active", on); c.classList.toggle("chip", !on);
      });
      if (bigImg && MAP[label]) { bigImg.style.opacity = 0; off = 0; bigImg.style.transform = "";
        var nu = MAP[label]; var pre = new Image(); pre.onload = function () { bigImg.src = nu; bigImg.style.opacity = 1; }; pre.src = nu; }
      if (sc.__peer) sc.__peer.closest(".iph-mobile-peer").style.display = (label === "Admin Control Tower") ? "none" : "";
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function (e) { e.preventDefault(); activate(c.textContent.trim()); });
    });
    // initialize to first/active
    var act = qa(".chip-active", sc)[0] || chips[0];
    if (act) activate(act.textContent.trim());
  }

  /* ============================ 5. PREDICTIONS (layered crops) ============================ */
  safe("predictions", function () {
    var pr = sect("predictions"); if (!pr || pr.__iph) return; pr.__iph = true;
    var host = qa(".col", pr).pop(); if (!host) return; // the mockup col
    function float(src, css, w, delay) {
      var d = document.createElement("div"); d.className = "iph-float";
      for (var k in css) d.style[k] = css[k];
      var im = document.createElement("img"); im.src = src; im.loading = "lazy"; im.style.width = w + "px"; im.alt = "";
      d.appendChild(im); host.appendChild(d); reveal(d, delay); return d;
    }
    float(IMG + "betslip.png", { right: "-26px", top: "8%", width: "168px" }, 168, 120);
    float(IMG + "market.png", { left: "-30px", bottom: "10%", width: "210px" }, 210, 240);
  });

  /* ============================ 6. CHAPTER SPINE (predictions + engine) ============================ */
  safe("chapter", function () {
    var pr = sect("predictions"), en = sect("engine"); if (!pr || !en) return;
    var spine = document.createElement("div"); spine.className = "iph-spine";
    en.appendChild(spine);
    function place() {
      var prB = pr.getBoundingClientRect(), enB = en.getBoundingClientRect();
      // spine sits at the seam between the two sections, vertical
      var top = (pr.offsetTop + pr.offsetHeight - 60);
      spine.style.top = "-46px"; spine.style.height = "92px";
      spine.style.left = "50%";
    }
    place(); window.addEventListener("resize", place);
    var dot = document.createElement("div"); dot.className = "iph-spine-dot"; dot.style.top = "0"; spine.appendChild(dot);
    var dot2 = document.createElement("div"); dot2.className = "iph-spine-dot"; dot2.style.top = "100%"; spine.appendChild(dot2);

    // box engine stats as cards + count-up
    var enRow = q(".stack > .row", en);
    if (!enRow) { enRow = qa(".row", en).filter(function (r) { return q(".stat-num", r); })[0] || null; }
    if (enRow && q(".stat-num", enRow)) { makeStatCards(enRow); wireStatCountup(enRow); qa(".col", enRow).forEach(function (c, i) { reveal(c, i * 80); }); }
  });

  /* ============================ 7. AFFILIATE (downline tree) ============================ */
  safe("affiliate", function () {
    var af = sect("affiliate"); if (!af || af.__iph) return; af.__iph = true;
    var host = q(".col", af); if (!host) return; // first col = screenshot
    // 5-level downline tree SVG that draws in
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "iph-tree"); svg.setAttribute("viewBox", "0 0 190 150");
    var levels = [[95], [55, 135], [35, 75, 115, 155], [25, 50, 75, 100, 125, 150, 170], []];
    var ys = [16, 48, 80, 112];
    function node(x, y) { var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 4); svg.appendChild(c); }
    for (var L = 0; L < 4; L++) { var xs = levels[L]; for (var i = 0; i < xs.length; i++) node(xs[i], ys[L]); }
    function link(x1, y1, x2, y2) { var p = document.createElementNS(NS, "line"); p.setAttribute("x1", x1); p.setAttribute("y1", y1); p.setAttribute("x2", x2); p.setAttribute("y2", y2);
      var len = Math.hypot(x2 - x1, y2 - y1); p.style.setProperty("--l", len.toFixed(1)); svg.appendChild(p); }
    // connect each level to next (fan)
    link(95, 16, 55, 48); link(95, 16, 135, 48);
    link(55, 48, 35, 80); link(55, 48, 75, 80); link(135, 48, 115, 80); link(135, 48, 155, 80);
    [[35, 25], [35, 50], [75, 75], [115, 100], [155, 125], [155, 150], [115, 170]].forEach(function (pr) { link(pr[0], 80, pr[1], 112); });
    host.appendChild(svg); if (io) io.observe(svg); else svg.classList.add("iph-in");
    svg.classList.add("iph-rev"); // for observer; uses .iph-in to draw

    // a config crop (commission matrix / vip levels) floating
    var crop = document.createElement("div"); crop.className = "iph-float";
    crop.style.right = "-22px"; crop.style.top = "-18px"; crop.style.width = "200px";
    var im = document.createElement("img"); im.src = IMG + "viplevels.png"; im.style.width = "200px"; im.loading = "lazy"; im.alt = "";
    crop.appendChild(im); host.appendChild(crop); reveal(crop, 180);
  });

  /* ============================ 8. LIFECYCLE (pinned journey) ============================ */
  safe("lifecycle", function () {
    var lc = sect("lifecycle"); if (!lc || lc.__iph) return; lc.__iph = true;
    var row = q(".row", lc); if (!row) return;
    var cols = qa(".col", row);
    if (cols.length < 3) return;

    var wrap = document.createElement("div"); wrap.className = "iph-life-wrap";
    // rail (left, sticky)
    var rail = document.createElement("div"); rail.className = "iph-life-rail";
    rail.innerHTML =
      '<div style="position:relative;padding-left:0">' +
      '<div class="iph-rail-line"></div><div class="iph-rail-fill"></div>' +
      '<div class="iph-rail-stage" data-s="0"><div class="iph-rail-num">1</div><div><div style="color:#fff;font-weight:650;font-size:15px">Acquire</div><div style="color:#6B746F;font-size:12.5px">campaigns · attribution · affiliates</div></div></div>' +
      '<div class="iph-rail-stage" data-s="1"><div class="iph-rail-num">2</div><div><div style="color:#fff;font-weight:650;font-size:15px">Convert</div><div style="color:#6B746F;font-size:12.5px">cashier · bonuses · promos</div></div></div>' +
      '<div class="iph-rail-stage" data-s="2"><div class="iph-rail-num">3</div><div><div style="color:#fff;font-weight:650;font-size:15px">Retain</div><div style="color:#6B746F;font-size:12.5px">VIP · rebates · retention</div></div></div>' +
      '</div>' +
      '<div class="iph-rail-mock">' +
      '<img data-s="0" src="' + IMG + 'admin.png" alt="acquire">' +
      '<img data-s="1" src="' + IMG + 'cashier.png" alt="convert">' +
      '<img data-s="2" src="' + IMG + 'vip.png" alt="retain"></div>';
    // stages (right)
    var stages = document.createElement("div"); stages.className = "iph-life-stages";
    cols.forEach(function (c) { stages.appendChild(c); });

    row.parentNode.insertBefore(wrap, row); wrap.appendChild(rail); wrap.appendChild(stages); row.remove();

    var railStages = qa(".iph-rail-stage", rail), mocks = qa(".iph-rail-mock img", rail), fill = q(".iph-rail-fill", rail);
    function setActive(idx) {
      railStages.forEach(function (s, i) { s.classList.toggle("on", i === idx); });
      mocks.forEach(function (m, i) { m.classList.toggle("on", i === idx); });
      cols.forEach(function (c, i) { c.classList.toggle("on", i === idx); });
      fill.style.height = ((idx) / (cols.length - 1) * 100) + "%";
    }
    setActive(0);
    if (io) {
      var lo = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var i = cols.indexOf(e.target); if (i >= 0) setActive(i); } });
      }, { threshold: .55, rootMargin: "-20% 0px -35% 0px" });
      cols.forEach(function (c) { lo.observe(c); reveal(c); });
    } else cols.forEach(function (c, i) { reveal(c, i * 100); });
  });

})();
