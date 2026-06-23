/*! i-play.io — Home hero · three-lane (casino slots+roulette · sportsbook · predictions)
    Self-mounts into #iplay-hero-home. Hosted via jsDelivr, injected through Webflow. */
(function () {
  "use strict";
  var MOUNT_ID = "iplay-hero-home";

  function start(host) {
    if (host.dataset.iplayInit) return;
    host.dataset.iplayInit = "1";

    var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

    var c = document.createElement("canvas");
    c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
    host.appendChild(c);
    var x = c.getContext("2d");
    function W() { return host.clientWidth; }
    function H() { return host.clientHeight; }
    function fit() {
      var w = W(), h = H(), d = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
    }
    function rr(a, b, w, h, r) {
      x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r);
      x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
    }

    var SYM = ["7", "★", "◆", "♣", "7", "◆", "★", "▲"];
    var reels = [0, 1, 2].map(function (i) {
      return { off: Math.random() * 8, vel: 0, state: "spin", target: 0, ci: -1, stopAt: 1.5 + i * .5 };
    });
    var candles = [], candleSeed = 0, wheel = 0, ball = 0;
    var t0 = performance.now(), last = t0, raf = 0, running = false;

    function casinoLane(cx, h, k, dt) {
      var rowH = Math.min(36, h * 0.05), reelW = Math.min(48, h * 0.06), gap = 8;
      var reelsN = 3, frameW = reelsN * reelW + (reelsN - 1) * gap + 22, frameH = rowH * 3 + 22;
      var fx = cx - frameW / 2, fy = h * 0.30 - frameH / 2 + Math.sin(k * .6) * 4;
      x.fillStyle = "rgba(10,14,12,.7)"; x.strokeStyle = "rgba(30,42,36,1)"; x.lineWidth = 1;
      rr(fx, fy, frameW, frameH, 10); x.fill(); x.stroke();
      x.strokeStyle = "rgba(10,209,127,.25)"; x.beginPath();
      x.moveTo(fx + 8, fy + frameH / 2); x.lineTo(fx + frameW - 8, fy + frameH / 2); x.stroke();
      var tc = 4.6, ci = Math.floor(k / tc), lt = k - ci * tc;
      reels.forEach(function (r, i) {
        if (r.ci !== ci) { r.ci = ci; r.state = "spin"; r.vel = 20 + Math.random() * 6; }
        if (r.state === "spin") { r.off += r.vel * dt; if (lt > r.stopAt) { r.state = "settle"; r.target = Math.round(r.off) + 3; } }
        else if (r.state === "settle") { r.off = lerp(r.off, r.target, 1 - Math.pow(0.0008, dt)); if (Math.abs(r.off - r.target) < .012) { r.off = r.target; r.state = "done"; } }
        var rx = fx + 11 + i * (reelW + gap);
        x.save(); rr(rx, fy + 11, reelW, rowH * 3, 6); x.clip();
        x.fillStyle = "rgba(18,24,21,.6)"; x.fillRect(rx, fy + 11, reelW, rowH * 3);
        x.textAlign = "center"; x.textBaseline = "middle";
        var base = Math.floor(r.off), frac = r.off - base;
        for (var row = -1; row < 4; row++) {
          var sym = SYM[(((base + row) % SYM.length) + SYM.length) % SYM.length];
          var yy = fy + 11 + rowH * 1.5 + (row - frac) * rowH * -1 + rowH;
          var mid = Math.abs(yy - (fy + 11 + rowH * 1.5)) / rowH;
          x.globalAlpha = Math.max(.25, 1 - mid * .5);
          x.fillStyle = (sym === "7" || sym === "◆") ? "#0AD17F" : "#A8B4AE";
          x.font = (sym === "7") ? "800 22px Inter,sans-serif" : "700 20px Inter,sans-serif";
          x.fillText(sym, rx + reelW / 2, yy);
        }
        x.globalAlpha = 1; x.restore();
      });
      x.textBaseline = "alphabetic";
      var wy = h * 0.66, R = Math.min(70, h * 0.1);
      wheel += dt * 0.5; ball -= dt * 1.7;
      var segs = 16;
      for (var s = 0; s < segs; s++) {
        var a0 = wheel + s / segs * 6.283, a1 = wheel + (s + 1) / segs * 6.283;
        x.beginPath(); x.moveTo(cx, wy); x.arc(cx, wy, R, a0, a1); x.closePath();
        x.fillStyle = (s % 2) ? "#0a140e" : "#13231b"; if (s % 5 === 0) x.fillStyle = "#069C63"; x.fill();
      }
      x.strokeStyle = "rgba(30,42,36,1)"; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, wy, R, 0, 7); x.stroke();
      x.strokeStyle = "rgba(10,209,127,.3)"; x.beginPath(); x.arc(cx, wy, R * 0.62, 0, 7); x.stroke();
      x.fillStyle = "#16201a"; x.beginPath(); x.arc(cx, wy, R * 0.3, 0, 7); x.fill();
      x.strokeStyle = "rgba(10,209,127,.4)"; x.stroke();
      var bx = cx + Math.cos(ball) * R * 0.82, by = wy + Math.sin(ball) * R * 0.82;
      x.fillStyle = "#fff"; x.beginPath(); x.arc(bx, by, 3, 0, 7); x.fill();
    }

    function sportLane(cx, lw, h, k) {
      var off = (k * 24) % 46; x.textAlign = "left";
      for (var r = -1; r < Math.ceil(h / 46) + 1; r++) {
        var yy = h - r * 46 + off, pw = Math.min(lw - 30, 210), px = cx - pw / 2;
        x.globalAlpha = Math.max(0, Math.min(1, (h - yy) / h * 1.4)) * 0.9;
        x.fillStyle = "rgba(18,24,21,.55)"; x.strokeStyle = "rgba(30,42,36,.8)"; x.lineWidth = 1;
        rr(px, yy - 16, pw, 28, 6); x.fill(); x.stroke();
        x.fillStyle = "#A8B4AE"; x.font = "500 11px Inter,sans-serif"; x.fillText("Match " + ((r + 9) % 9 + 1), px + 12, yy + 3);
        var o1 = (1.3 + ((r * 7) % 26) / 10).toFixed(2), o2 = (2.1 + ((r * 5) % 30) / 10).toFixed(2);
        [o1, o2].forEach(function (v, j) {
          var ox = px + pw - 78 + j * 38; x.fillStyle = "rgba(10,209,127,.1)"; rr(ox, yy - 10, 32, 18, 4); x.fill();
          x.fillStyle = "#0AD17F"; x.font = "700 11px Inter,sans-serif"; x.textAlign = "center"; x.fillText(v, ox + 16, yy + 3); x.textAlign = "left";
        });
      }
      x.globalAlpha = 1;
    }

    function predictLane(cx, lw, h, k, dt) {
      var pw = Math.min(lw - 30, 200), px = cx - pw / 2, py = h * 0.2;
      x.globalAlpha = .9; x.fillStyle = "rgba(18,24,21,.55)"; x.strokeStyle = "rgba(30,42,36,.8)";
      rr(px, py, pw, 46, 8); x.fill(); x.stroke();
      var yes = 0.5 + 0.12 * Math.sin(k * 0.6);
      x.fillStyle = "rgba(10,209,127,.16)"; rr(px + 8, py + 8, (pw - 16) * yes, 14, 4); x.fill();
      x.fillStyle = "#0AD17F"; x.font = "700 11px Inter,sans-serif"; x.textAlign = "left"; x.fillText("YES " + Math.round(yes * 100) + "¢", px + 10, py + 34);
      x.fillStyle = "#A8B4AE"; x.textAlign = "right"; x.fillText("NO " + Math.round((1 - yes) * 100) + "¢", px + pw - 10, py + 34); x.textAlign = "left";
      var n = 14; candleSeed += dt;
      if (candleSeed > 0.4) { candleSeed = 0; if (candles.length >= n) candles.length = 0; candles.push({ up: Math.random() > .42, bh: 10 + Math.random() * 30, y: h * 0.42 + Math.random() * (h * 0.34) }); }
      var cw = pw / n;
      candles.forEach(function (cc, i) {
        var ccx = px + i * cw + cw / 2; x.globalAlpha = .85; x.fillStyle = cc.up ? "#0AD17F" : "#2c3c34";
        rr(ccx - 3, cc.y, 6, cc.bh, 1); x.fill();
        x.strokeStyle = x.fillStyle; x.lineWidth = 1; x.beginPath(); x.moveTo(ccx, cc.y - 5); x.lineTo(ccx, cc.y + cc.bh + 5); x.stroke();
      });
      x.globalAlpha = 1;
    }

    function frame(now) {
      var w = W(), h = H(), k = (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;
      x.clearRect(0, 0, w, h);
      var x0 = w * .35, lw = (w - x0) / 3, intro = ease(Math.min(1, k / 1));
      x.strokeStyle = "rgba(30,42,36,.6)"; x.lineWidth = 1;
      [1, 2].forEach(function (i) { x.beginPath(); x.moveTo(x0 + lw * i, 0); x.lineTo(x0 + lw * i, h); x.stroke(); });
      [0, 1, 2].forEach(function (i) {
        var cx = x0 + lw * (i + .5), g = x.createRadialGradient(cx, h * .45, 10, cx, h * .45, lw * .7);
        g.addColorStop(0, "rgba(6,156,99,.06)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(x0 + lw * i, 0, lw, h);
      });
      x.globalAlpha = intro;
      casinoLane(w * .18, h, k, dt);
      sportLane(x0 + lw * 1.5, lw, h, k);
      predictLane(x0 + lw * 2.5, lw, h, k, dt);
      x.globalAlpha = intro * .6; x.font = "700 11px Inter,sans-serif"; x.fillStyle = "#6B746F"; x.textAlign = "center";
      [["CASINO", "slots · roulette · table"], ["SPORTSBOOK", "fixed-odds"], ["PREDICTIONS", "markets"]].forEach(function (p, i) {
        var lx = i === 0 ? w * .18 : x0 + lw * (i + .5);
        x.fillText(p[0], lx, h - 22); x.font = "500 9px Inter,sans-serif"; x.fillText(p[1], lx, h - 10); x.font = "700 11px Inter,sans-serif";
      });
      x.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    }

    function play() { if (running || RM) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function pause() { running = false; cancelAnimationFrame(raf); }

    fit();
    window.addEventListener("resize", fit);
    if (RM) { frame(performance.now()); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? play() : pause(); }, { threshold: 0.01 }).observe(host);
    } else { play(); }
  }

  function boot() {
    var host = document.getElementById(MOUNT_ID);
    if (host) start(host);
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
