/*! i-play.io — Platform hero · product collage (real Control Tower panels + IP-safe player mocks)
    Independent fade-in/out choreography. Self-mounts into #iplay-hero-platform.
    Derives its own image base URL from the script src, so assets stay pinned to the same commit. */
(function () {
  "use strict";
  var ME = document.currentScript;
  var BASE = ((ME && ME.src) || "").replace(/[^/]*$/, "");
  var IMG = BASE + "img/";
  var MOUNT_ID = "iplay-hero-platform";

  function chrome(label) {
    return '<div class="iplp-bar"><i></i><i></i><i></i><span>' + label + "</span></div>";
  }
  // real admin image panel (browser chrome + screenshot)
  function imgPanel(name, label) {
    return chrome(label) +
      '<img src="' + IMG + name + '.webp" alt="" decoding="async" ' +
      'style="display:block;width:100%;height:auto;opacity:0;transition:opacity .6s" ' +
      'onload="this.style.opacity=1">';
  }
  // IP-safe player mocks (generic, no third-party art/names)
  function casinoMock() {
    var t = "";
    for (var i = 0; i < 6; i++) {
      t += '<div style="aspect-ratio:1.1;border-radius:6px;border:1px solid #1E2A24;background:linear-gradient(135deg,' +
        (i % 2 ? "#0a2a1c" : "#13231b") + "," + (i % 3 ? "#06231a" : "#0d1a14") + ')"></div>';
    }
    return chrome("Casino lobby") +
      '<div style="padding:10px"><div style="font:700 10px Inter,sans-serif;color:#fff;margin-bottom:8px">Lobby</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' + t + "</div></div>";
  }
  function marketMock() {
    return chrome("Prediction markets") +
      '<div style="padding:13px"><div style="font:600 11px Inter,sans-serif;color:#fff;margin-bottom:10px">Resolve by Q3?</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:10px">' +
      '<div style="flex:1;background:rgba(10,209,127,.1);border:1px solid rgba(10,209,127,.3);border-radius:6px;padding:8px;text-align:center"><div style="font:700 14px Inter,sans-serif;color:#0AD17F">62¢</div><div style="font:600 8px Inter,sans-serif;color:#6B746F">YES</div></div>' +
      '<div style="flex:1;background:#121815;border:1px solid #1E2A24;border-radius:6px;padding:8px;text-align:center"><div style="font:700 14px Inter,sans-serif;color:#A8B4AE">38¢</div><div style="font:600 8px Inter,sans-serif;color:#6B746F">NO</div></div></div>' +
      '<svg viewBox="0 0 220 40" style="width:100%;height:34px"><polyline fill="none" stroke="#0AD17F" stroke-width="1.6" points="0,30 30,28 60,22 90,25 120,16 150,18 180,10 220,12"/></svg></div>';
  }

  // x,y in %, w px, en=enter dir, d=depth, mo=max opacity, dur(s), ph=phase, sm=hide on mobile
  var LAYOUT = [
    { html: imgPanel("dash-kpis", "Control Tower · Dashboard"), x: 33, y: 17, w: 350, en: "up", d: .5, mo: .96, dur: 13, ph: .00 },
    { html: imgPanel("vip-tiers", "VIP levels"), x: 71, y: 7, w: 300, en: "right", d: .9, mo: .95, dur: 9.5, ph: .42, sm: 1 },
    { html: imgPanel("affil-kpis", "Affiliate · Campaign analytics"), x: 74, y: 52, w: 295, en: "down", d: .6, mo: .92, dur: 11, ph: .18 },
    { html: imgPanel("pay-currency", "Payments · By currency"), x: 28, y: 55, w: 270, en: "left", d: .7, mo: .9, dur: 12, ph: .66 },
    { html: imgPanel("bonus-cards", "Bonus engine"), x: 55, y: 29, w: 285, en: "scale", d: .45, mo: .9, dur: 10, ph: .30, sm: 1 },
    { html: imgPanel("dash-telemetry", "Financial telemetry"), x: 87, y: 25, w: 300, en: "right", d: .8, mo: .85, dur: 14, ph: .80, sm: 1 },
    { html: casinoMock(), x: 9, y: 60, w: 175, en: "left", d: .6, mo: .55, dur: 11, ph: .10, sm: 1 },
    { html: marketMock(), x: 60, y: 65, w: 230, en: "up", d: 1, mo: .9, dur: 8, ph: .55 },
    { html: imgPanel("pred-kpis", "Predictions"), x: 50, y: 73, w: 250, en: "down", d: .7, mo: .9, dur: 9, ph: .85, sm: 1 },
    { html: imgPanel("pay-flow", "Crypto flow"), x: 40, y: 11, w: 250, en: "up", d: .45, mo: .8, dur: 12, ph: .38, sm: 1 }
  ];
  var ENTER = { up: [0, 38], down: [0, -38], left: [-50, 0], right: [50, 0], scale: [0, 0] };

  function start(host) {
    if (host.dataset.iplayInit) return; host.dataset.iplayInit = "1";
    var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

    var st = document.createElement("style");
    st.textContent =
      "#" + MOUNT_ID + "{pointer-events:none}" +
      "#" + MOUNT_ID + " .iplp{position:absolute;border:1px solid #1E2A24;border-radius:10px;background:#0A0E0C;" +
      "box-shadow:0 34px 90px -24px rgba(0,0,0,.85);overflow:hidden;will-change:transform,opacity;font-family:Inter,sans-serif;opacity:0}" +
      "#" + MOUNT_ID + " .iplp-bar{height:26px;background:#121815;border-bottom:1px solid #1E2A24;display:flex;align-items:center;gap:5px;padding:0 10px}" +
      "#" + MOUNT_ID + " .iplp-bar i{width:7px;height:7px;border-radius:50%;background:#2c3c34}" +
      "#" + MOUNT_ID + " .iplp-bar span{margin-left:8px;font:500 10px Inter,sans-serif;color:#6B746F}" +
      "@media(max-width:880px){#" + MOUNT_ID + " .iplp.sm{display:none}}";
    host.appendChild(st);

    var els = LAYOUT.map(function (L) {
      var d = document.createElement("div");
      d.className = "iplp" + (L.sm ? " sm" : "");
      d.style.left = L.x + "%"; d.style.top = L.y + "%"; d.style.width = L.w + "px";
      d.innerHTML = L.html; host.appendChild(d); return d;
    });

    var mx = 0, my = 0, raf = 0, running = false, t0 = 0;
    function move(e) { var r = host.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * 2; my = ((e.clientY - r.top) / r.height - .5) * 2; }
    host.addEventListener("pointermove", move);

    function envelope(t, vis) {
      var fin = .11, fout = .13;
      if (t < fin) { var a = ease(t / fin); return { o: a, k: 1 - a, out: false }; }
      if (t < vis) return { o: 1, k: 0, out: false };
      if (t < vis + fout) { var e = ease((t - vis) / fout); return { o: 1 - e, k: e, out: true }; }
      return { o: 0, k: 1, out: false };
    }
    function loop(now) {
      var ts = (now - t0) / 1000;
      for (var i = 0; i < LAYOUT.length; i++) {
        var L = LAYOUT[i], vis = .50;
        var t = ((ts / L.dur + L.ph) % 1 + 1) % 1;
        var e = envelope(t, vis), ev = ENTER[L.en], dx, dy;
        if (e.out) { dx = -ev[0] * e.k; dy = -ev[1] * e.k; } else { dx = ev[0] * e.k; dy = ev[1] * e.k; }
        var fy = Math.sin(ts * .5 + i) * 5;
        var px = -mx * L.d * 18, py = -my * L.d * 11;
        var sc = (L.en === "scale") ? (1 - .07 * e.k) : (1 - .03 * e.k);
        els[i].style.opacity = (e.o * L.mo).toFixed(3);
        els[i].style.transform = "translate3d(" + (dx + px).toFixed(1) + "px," + (dy + fy + py).toFixed(1) + "px,0) scale(" + sc.toFixed(3) + ")";
      }
      if (running) raf = requestAnimationFrame(loop);
    }
    function play() { if (running || RM) return; running = true; t0 = performance.now(); raf = requestAnimationFrame(loop); }
    function pause() { running = false; cancelAnimationFrame(raf); }

    if (RM) { els.forEach(function (el, i) { el.style.opacity = (.9 * LAYOUT[i].mo).toFixed(2); }); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? play() : pause(); }, { threshold: 0.01 }).observe(host);
    } else play();
  }

  function boot() { var h = document.getElementById(MOUNT_ID); if (h) start(h); }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
