/*! i-play.io — Contact hero · slow conveyor (real Control Tower panels drifting in a loop)
    Calm, continuous left-drift. Self-mounts into #iplay-hero-contact.
    Derives its own image base URL from the script src (assets pinned to same commit). */
(function () {
  "use strict";
  var ME = document.currentScript;
  var BASE = ((ME && ME.src) || "").replace(/[^/]*$/, "");
  var IMG = BASE + "img/";
  var MOUNT_ID = "iplay-hero-contact";

  // panel name -> [chrome label, display width]
  var PANELS = [
    ["dash-kpis", "Control Tower · Dashboard", 320],
    ["vip-tiers", "VIP levels", 280],
    ["affil-kpis", "Affiliate · Campaign analytics", 280],
    ["pay-currency", "Payments · By currency", 260],
    ["bonus-cards", "Bonus engine", 270],
    ["dash-telemetry", "Financial telemetry", 290]
  ];

  function card(name, label, w) {
    return '<div class="iplc" style="flex:0 0 auto;width:' + w + 'px">' +
      '<div class="iplc-bar"><i></i><i></i><i></i><span>' + label + "</span></div>" +
      '<img src="' + IMG + name + '.webp" alt="" decoding="async" ' +
      'style="display:block;width:100%;height:auto;opacity:0;transition:opacity .6s" onload="this.style.opacity=1"></div>';
  }

  function start(host) {
    if (host.dataset.iplayInit) return; host.dataset.iplayInit = "1";
    var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    var st = document.createElement("style");
    st.textContent =
      "#" + MOUNT_ID + "{pointer-events:none}" +
      "#" + MOUNT_ID + " .iplc-track{position:absolute;top:50%;left:0;display:flex;gap:26px;transform:translateY(-50%);will-change:transform;opacity:.85}" +
      "#" + MOUNT_ID + " .iplc{border:1px solid #1E2A24;border-radius:10px;background:#0A0E0C;box-shadow:0 30px 80px -24px rgba(0,0,0,.85);overflow:hidden;font-family:Inter,sans-serif}" +
      "#" + MOUNT_ID + " .iplc-bar{height:26px;background:#121815;border-bottom:1px solid #1E2A24;display:flex;align-items:center;gap:5px;padding:0 10px}" +
      "#" + MOUNT_ID + " .iplc-bar i{width:7px;height:7px;border-radius:50%;background:#2c3c34}" +
      "#" + MOUNT_ID + " .iplc-bar span{margin-left:8px;font:500 10px Inter,sans-serif;color:#6B746F}";
    host.appendChild(st);

    var track = document.createElement("div");
    track.className = "iplc-track";
    // two passes for a seamless loop
    var html = "";
    PANELS.forEach(function (p) { html += card(p[0], p[1], p[2]); });
    track.innerHTML = html + html;
    host.appendChild(track);

    var raf = 0, off = 0, last = 0, running = false;
    function half() { return track.scrollWidth / 2; }
    function loop(now) {
      var dt = Math.min(.05, (now - last) / 1000); last = now;
      off -= dt * 32;
      var h = half();
      if (h && -off >= h) off += h;
      track.style.transform = "translateY(-50%) translateX(" + off.toFixed(1) + "px)";
      if (running) raf = requestAnimationFrame(loop);
    }
    function play() { if (running || RM) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    function pause() { running = false; cancelAnimationFrame(raf); }

    if (RM) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? play() : pause(); }, { threshold: 0.01 }).observe(host);
    } else play();
  }

  function boot() { var h = document.getElementById(MOUNT_ID); if (h) start(h); }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
