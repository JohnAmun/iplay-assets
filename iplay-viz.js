/* i-play.io — Bucket B visualization bundle
 * Injects animated visuals into any element carrying a [data-viz] attribute:
 *   routing | stress | ecosystem | routing-mini | downline | split | steps
 * Pure Felt palette. Illustrative motion only — no live data, no thresholds.
 * Content-card panels (with a .card-body) keep their copy; the visual is appended below.
 * Pure-slot panels are replaced by the visual.
 */
(function () {
  if (window.__ipvLoaded) return;
  window.__ipvLoaded = true;

  /* ---------- shared styles ---------- */
  var CSS = `
  .panel[data-viz]{height:auto!important;min-height:0!important;display:block!important;text-align:left;overflow:hidden}
  .panel[data-viz] .panel-label{display:block;position:static;background:none;border:0;padding:0;margin:0 0 6px;
    font:600 12px/1.2 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#0AD17F}
  .panel[data-viz] .card-body{color:#A8B4AE;font:400 14px/1.5 Inter,system-ui,sans-serif;margin:0 0 18px;max-width:64ch}
  .ipv{position:relative;font-family:Inter,system-ui,sans-serif}
  .ipv *{box-sizing:border-box}
  /* routing + teaser */
  .ipv .stage{position:relative;height:230px;border-radius:12px;background:#000;border:1px solid #1E2A24;overflow:hidden}
  .ipv .stage.mini{height:150px}
  .ipv .guide{position:absolute;left:50%;height:1px;width:38%;z-index:1;background:linear-gradient(90deg,rgba(30,42,36,.9),transparent)}
  .ipv .g-h{top:26%}.ipv .g-x{top:70%}.ipv .stage.mini .g-h{top:24%}
  .ipv .engine{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:78px;height:78px;border-radius:16px;z-index:2;
    background:linear-gradient(160deg,#0d1a14,#0a120e);border:1px solid #214034;box-shadow:0 0 40px rgba(10,209,127,.18);
    display:flex;align-items:center;justify-content:center}
  .ipv .stage.mini .engine{width:62px;height:62px}
  .ipv .engine b{font:600 10px/1.25 Inter;color:#0AD17F;text-align:center;letter-spacing:.02em}
  .ipv .engine::before{content:"";position:absolute;inset:-6px;border-radius:20px;border:1px solid rgba(10,209,127,.18);animation:ipvPulse 3s cubic-bezier(.16,1,.3,1) infinite}
  @keyframes ipvPulse{0%{transform:scale(.96);opacity:.7}70%{transform:scale(1.12);opacity:0}100%{opacity:0}}
  .ipv .ll{position:absolute;font:600 11px/1 Inter;letter-spacing:.05em;text-transform:uppercase;z-index:3;right:16px}
  .ipv .ll span{display:block;font:500 10px/1.2 Inter;color:#6B746F;text-transform:none;letter-spacing:0;margin-top:2px}
  .ipv .ll-h{top:24%;color:#0AD17F;text-align:right}.ipv .ll-x{top:68%;color:#A8B4AE;text-align:right}
  .ipv .ll-in{left:14px;top:50%;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;color:#6B746F}
  .ipv .chip{position:absolute;border-radius:50%;z-index:2;will-change:transform,opacity;transition:transform 1.15s cubic-bezier(.16,1,.3,1),opacity .4s linear}
  .ipv .chip.s{width:10px;height:10px}.ipv .chip.m{width:15px;height:15px}.ipv .chip.l{width:22px;height:22px}
  .ipv .chip.house{background:#0AD17F;box-shadow:0 0 10px rgba(10,209,127,.6)}
  .ipv .chip.hedge{background:transparent;border:2px solid #A8B4AE;box-shadow:0 0 8px rgba(168,180,174,.25)}
  .ipv .chip.flag::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:1px dashed #0AD17F;opacity:.8}
  .ipv .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
  .ipv .metric{background:#0A0E0C;border:1px solid #1E2A24;border-radius:11px;padding:12px 14px}
  .ipv .metric .k{font-size:11px;color:#6B746F;margin-bottom:5px}
  .ipv .metric .v{font:600 21px/1 Inter;letter-spacing:-.02em;font-variant-numeric:tabular-nums;color:#fff}
  .ipv .metric.house .v{color:#0AD17F}
  .ipv .bankrolls{display:flex;gap:22px;margin-top:14px;flex-wrap:wrap}
  .ipv .bk{flex:1;min-width:200px}
  .ipv .bk .k{font-size:11px;color:#6B746F;margin-bottom:6px;display:flex;justify-content:space-between}
  .ipv .bk .track{height:9px;border-radius:99px;background:#10160f;border:1px solid #1E2A24;overflow:hidden}
  .ipv .bk .fill{height:100%;border-radius:99px;transition:width .5s cubic-bezier(.16,1,.3,1)}
  .ipv .bk.prot .fill{background:linear-gradient(90deg,#069C63,#0AD17F)}
  .ipv .bk.unprot .fill{background:linear-gradient(90deg,#5a2420,#f0746a)}
  .ipv .foot{margin-top:14px;font-size:11px;color:#6B746F}
  .ipv .cta{margin-top:14px;font-size:13px;color:#A8B4AE}
  .ipv .cta b{color:#fff}.ipv .cta a{color:#0AD17F;text-decoration:none;font-weight:600}
  /* stress */
  .ipv .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  .ipv .stat{background:#0A0E0C;border:1px solid #1E2A24;border-radius:12px;padding:16px;position:relative;overflow:hidden}
  .ipv .stat .big{font:700 30px/1 Inter;letter-spacing:-.03em;color:#0AD17F;font-variant-numeric:tabular-nums}
  .ipv .stat .lbl{font-size:12px;color:#A8B4AE;margin-top:8px;line-height:1.4}
  .ipv .stat .sub{font-size:10.5px;color:#6B746F;margin-top:6px}
  .ipv .stat.s2{grid-column:span 2}
  .ipv .dd{display:flex;align-items:flex-end;gap:18px;height:96px;margin-top:6px}
  .ipv .dd .col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
  .ipv .dd .bar{width:46px;border-radius:7px 7px 0 0;height:0;transition:height 1.1s cubic-bezier(.16,1,.3,1)}
  .ipv .dd .bar.u{background:linear-gradient(180deg,#f0746a,#5a2420)}
  .ipv .dd .bar.e{background:linear-gradient(180deg,#0AD17F,#069C63)}
  .ipv .dd .cl{font-size:10.5px;color:#6B746F;margin-top:7px}
  .ipv .ribbon{margin-top:14px;display:flex;gap:10px;font-size:13px;color:#A8B4AE;background:#0A0E0C;border:1px solid #1E2A24;border-left:2px solid #0AD17F;border-radius:8px;padding:11px 14px}
  .ipv .ribbon b{color:#fff}
  .ipv .prov{margin-top:12px;font-size:11px;color:#6B746F;text-align:center}
  /* ecosystem */
  .ipv .eco{position:relative;height:300px;border:1px solid #1E2A24;border-radius:12px;background:#000;overflow:hidden}
  .ipv .eco svg{position:absolute;inset:0;width:100%;height:100%}
  .ipv .eco .core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;width:150px;height:60px;border-radius:13px;
    background:linear-gradient(160deg,#0e1b15,#0a120e);border:1px solid #224237;box-shadow:0 0 36px rgba(10,209,127,.2);
    display:flex;flex-direction:column;align-items:center;justify-content:center}
  .ipv .eco .core b{font:600 13px Inter;color:#fff}
  .ipv .eco .core span{font:600 9.5px Inter;color:#0AD17F;letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
  .ipv .node{position:absolute;z-index:2;transform:translate(-50%,-50%) scale(.6);opacity:0;background:#0A0E0C;border:1px solid #1E2A24;border-radius:10px;
    padding:8px 12px;font:500 12px Inter;color:#A8B4AE;white-space:nowrap;transition:transform .6s cubic-bezier(.16,1,.3,1),opacity .6s}
  .ipv .node.on{transform:translate(-50%,-50%) scale(1);opacity:1}
  .ipv .node i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#0AD17F;margin-right:7px;vertical-align:middle;box-shadow:0 0 7px rgba(10,209,127,.7)}
  .ipv .eco path{stroke:#1c2c24;stroke-width:1.5;fill:none}
  .ipv .eco path.live{stroke:url(#ipvEg);stroke-dasharray:5 7;animation:ipvFlow 1.1s linear infinite}
  @keyframes ipvFlow{to{stroke-dashoffset:-24}}
  /* downline */
  .ipv .tree{position:relative;height:330px;border:1px solid #1E2A24;border-radius:12px;background:#000;overflow:hidden;padding-top:12px}
  .ipv .trunk{position:absolute;left:50%;top:42px;bottom:14px;width:2px;transform:translateX(-50%);background:linear-gradient(180deg,rgba(10,209,127,.5),rgba(10,209,127,.05));z-index:1}
  .ipv .you{position:absolute;left:50%;top:14px;transform:translateX(-50%);z-index:4;background:linear-gradient(160deg,#069C63,#0AD17F);color:#04130c;font:700 12px Inter;padding:7px 16px;border-radius:99px;box-shadow:0 0 24px rgba(10,209,127,.4)}
  .ipv .lvl{position:absolute;left:0;right:0;display:flex;justify-content:center;gap:16px;z-index:2;opacity:0;transform:translateY(8px);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)}
  .ipv .lvl.on{opacity:1;transform:none}
  .ipv .dot{width:14px;height:14px;border-radius:50%;background:#0A0E0C;border:1px solid #069C63;box-shadow:0 0 0 3px rgba(6,156,99,.08)}
  .ipv .tag{position:absolute;left:14px;font:600 10px Inter;color:#6B746F;letter-spacing:.05em;z-index:3}
  .ipv .rise{position:absolute;left:50%;width:7px;height:7px;border-radius:50%;background:#0AD17F;transform:translateX(-50%);z-index:3;box-shadow:0 0 8px rgba(10,209,127,.8);pointer-events:none}
  .ipv .tfoot{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
  .ipv .tfoot .k{font-size:11px;color:#6B746F}
  .ipv .tfoot .v{font:600 18px Inter;color:#0AD17F;font-variant-numeric:tabular-nums}
  .ipv .models{font-size:10.5px;color:#6B746F;margin-top:4px}
  @media(max-width:720px){.ipv .metrics{grid-template-columns:1fr}.ipv .stats{grid-template-columns:repeat(2,1fr)}}
  
  /* ---- split (responsibility division) ---- */
  [data-viz="split"] .ipv-split{display:grid;grid-template-columns:1fr 1fr;position:relative;background:#0A0E0C;border:1px solid #1E2A24;border-radius:14px;overflow:hidden;margin-top:6px}
  [data-viz="split"] .ipv-split .sd{padding:30px 32px}
  [data-viz="split"] .ipv-split .sd+.sd{border-left:1px solid #1E2A24}
  [data-viz="split"] .ipv-split .cap{display:flex;align-items:center;gap:9px;font:600 11px/1 Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;margin:0 0 15px}
  [data-viz="split"] .ipv-split .we .cap{color:#0AD17F}
  [data-viz="split"] .ipv-split .you .cap{color:#fff}
  [data-viz="split"] .ipv-split .cap i{width:7px;height:7px;border-radius:50%;display:inline-block;flex:0 0 auto}
  [data-viz="split"] .ipv-split .we .cap i{background:#0AD17F;box-shadow:0 0 10px #0AD17F}
  [data-viz="split"] .ipv-split .you .cap i{background:#6B746F}
  [data-viz="split"] .ipv-split .bd{font:400 15px/1.55 Inter,system-ui,sans-serif;color:#A8B4AE;margin:0;max-width:42ch;opacity:0;transform:translateX(var(--fx));transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
  [data-viz="split"] .ipv-split .we .bd{--fx:-16px}
  [data-viz="split"] .ipv-split .you .bd{--fx:16px}
  [data-viz="split"] .ipv-split.in .bd{opacity:1;transform:translateX(0)}
  [data-viz="split"] .ipv-seam{position:absolute;left:50%;top:0;bottom:0;width:1px;transform:translateX(-.5px);z-index:2;background:linear-gradient(180deg,transparent,#1E2A24 12%,#1E2A24 88%,transparent)}
  [data-viz="split"] .ipv-seam::after{content:"";position:absolute;left:0;top:-38px;width:1px;height:38px;background:linear-gradient(180deg,transparent,#0AD17F,transparent);animation:ipvRun 3.4s linear infinite}
  @keyframes ipvRun{0%{top:-38px}100%{top:100%}}
  [data-viz="split"] .ipv-node{position:absolute;left:50%;top:50%;width:34px;height:34px;transform:translate(-50%,-50%);border-radius:50%;background:#121815;border:1px solid #1E2A24;z-index:3;display:flex;align-items:center;justify-content:center;font:600 13px Inter;color:#6B746F}
  @media(max-width:760px){[data-viz="split"] .ipv-split{grid-template-columns:1fr}[data-viz="split"] .ipv-split .sd+.sd{border-left:0;border-top:1px solid #1E2A24}[data-viz="split"] .ipv-seam,[data-viz="split"] .ipv-node{display:none}[data-viz="split"] .ipv-split .bd{--fx:0;max-width:none}}
  /* ---- step-card icons ---- */
  [data-viz="steps"] .ipv-ic{width:46px;height:46px;border-radius:11px;background:#121815;border:1px solid #1E2A24;display:flex;align-items:center;justify-content:center;color:#069C63;margin:0 0 16px;opacity:0;transform:translateY(8px);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)}
  [data-viz="steps"] .ipv-ic.in{opacity:1;transform:translateY(0)}
  [data-viz="steps"] .ipv-ic svg{width:24px;height:24px;stroke:currentColor;stroke-width:1.7;fill:none;stroke-linecap:round;stroke-linejoin:round}`;

  function injectCSS() {
    if (document.getElementById('ipv-css')) return;
    var s = document.createElement('style'); s.id = 'ipv-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* mount a built node: keep copy on content cards, replace on pure slots */
  function mount(panel, node) {
    if (panel.querySelector('.card-body')) panel.appendChild(node);
    else { panel.innerHTML = ''; panel.appendChild(node); }
  }
  function whenSeen(el, cb) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { cb(); io.disconnect(); } });
    }, { threshold: .25 });
    io.observe(el);
  }
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n; }

  /* ---------- routing (full + mini) ---------- */
  function routing(panel, mini) {
    var v = document.createElement('div'); v.className = 'ipv';
    v.innerHTML =
      '<div class="stage' + (mini ? ' mini' : '') + '">' +
      '<div class="guide g-h"></div><div class="guide g-x"></div>' +
      (mini ? '' : '<div class="ll ll-in">Bets in</div>') +
      '<div class="engine"><b>Decision<br>Engine</b></div>' +
      '<div class="ll ll-h">House book' + (mini ? '' : '<span>kept in-house</span>') + '</div>' +
      '<div class="ll ll-x">' + (mini ? 'Hedge' : 'Prediction exchange<span>hedged · margin kept</span>') + '</div>' +
      '</div>' +
      (mini
        ? '<p class="cta"><b>Keeps the safe flow, hedges the risky flow</b> — and earns your margin on both. <a href="/decision-engine">See how it works →</a></p>'
        : '<div class="metrics">' +
          '<div class="metric house"><div class="k">Held in-house</div><div class="v" data-h>0</div></div>' +
          '<div class="metric"><div class="k">Hedged</div><div class="v" data-x>0</div></div>' +
          '<div class="metric"><div class="k">Margin earned (illustrative)</div><div class="v" data-m>$0</div></div>' +
          '</div>' +
          '<div class="bankrolls">' +
          '<div class="bk prot"><div class="k"><span>Bankroll · with engine</span><span>healthy</span></div><div class="track"><div class="fill" data-fp style="width:88%"></div></div></div>' +
          '<div class="bk unprot"><div class="k"><span>Bankroll · unprotected</span><span data-bu>exposed</span></div><div class="track"><div class="fill" data-fu style="width:88%"></div></div></div>' +
          '</div>' +
          '<p class="foot">A large win on the unprotected book is paid from its own cash; on the engine-routed book it is paid by the exchange — your margin is kept either way.</p>');
    mount(panel, v);

    var stage = v.querySelector('.stage');
    var house = 0, hedge = 0, margin = 0, pB = 88, uB = 88;
    var eH = v.querySelector('[data-h]'), eX = v.querySelector('[data-x]'), eM = v.querySelector('[data-m]');
    var fP = v.querySelector('[data-fp]'), fU = v.querySelector('[data-fu]'), bU = v.querySelector('[data-bu]');
    function spawn() {
      var r = Math.random(), size = r < .7 ? 's' : (r < .92 ? 'm' : 'l'), big = size === 'l';
      var flag = !big && Math.random() < .07;
      var hedged = big || flag || (size === 'm' && Math.random() < .25);
      var c = document.createElement('div');
      c.className = 'chip ' + size + ' ' + (hedged ? 'hedge' : 'house') + (flag ? ' flag' : '');
      var y = 46 + Math.random() * 8; c.style.left = '2%'; c.style.top = y + '%'; c.style.transform = 'translate(0,0)';
      stage.appendChild(c);
      requestAnimationFrame(function () {
        var w = stage.clientWidth, h = stage.clientHeight;
        c.style.transform = 'translate(' + (w * .5 - w * .02) + 'px,' + ((h * .5) - (y / 100 * h)) + 'px)';
        setTimeout(function () {
          var ly = hedged ? .70 : .26;
          c.style.transform = 'translate(' + (w * .92 - w * .02) + 'px,' + ((ly * h) - (y / 100 * h)) + 'px)'; c.style.opacity = '0';
          if (!mini) {
            margin += big ? 9 : (size === 'm' ? 4 : 1);
            if (hedged) hedge++; else house++;
            if (big) { uB = Math.max(18, uB - (14 + Math.random() * 16)); fU.style.width = uB + '%'; bU.textContent = uB < 45 ? 'drawdown' : 'exposed'; setTimeout(function () { uB = Math.min(88, uB + 10); fU.style.width = uB + '%'; }, 900); }
            pB = Math.min(92, pB + .4); fP.style.width = pB + '%';
            eH.textContent = fmt(house); eX.textContent = fmt(hedge); eM.textContent = '$' + fmt(margin);
          }
          setTimeout(function () { c.remove(); }, 500);
        }, mini ? 1020 : 1180);
      });
    }
    whenSeen(stage, function () { spawn(); setInterval(spawn, mini ? 560 : 520); });
  }

  /* ---------- stress ---------- */
  function stress(panel) {
    var v = document.createElement('div'); v.className = 'ipv';
    v.innerHTML =
      '<div class="stats">' +
      '<div class="stat"><div class="big" data-c="200000" data-suf="+">0</div><div class="lbl">simulated casino-years</div><div class="sub">3 bankroll sizes · 6 stress scenarios</div></div>' +
      '<div class="stat"><div class="big" data-c="93" data-pre="~" data-suf="%">0</div><div class="lbl">up to — lower worst-case drawdown vs an unhedged book</div></div>' +
      '<div class="stat s2"><div class="lbl" style="margin:0 0 8px">Worst-case drawdown · illustrative</div><div class="dd"><div class="col"><div class="bar u" data-bh="92"></div><div class="cl">Unhedged</div></div><div class="col"><div class="bar e" data-bh="14"></div><div class="cl">With engine</div></div></div></div>' +
      '<div class="stat"><div class="big">2%&nbsp;&rarr;&nbsp;0%</div><div class="lbl">bankruptcy risk for a newly-capitalized operator</div></div>' +
      '<div class="stat"><div class="big"><span data-c="93">0</span>&ndash;<span data-c="98" data-suf="%">0</span></div><div class="lbl">of unhedged profit kept — bankruptcy risk removed</div></div>' +
      '<div class="stat"><div class="big" data-c="4" data-pre="up to ~" data-suf="%">0</div><div class="lbl">more profit than hedging everything</div></div>' +
      '<div class="stat"><div class="big" style="font-size:19px;line-height:1.25">Most profitable<br>zero-ruin strategy</div><div class="lbl">among every strategy tested that never went bust</div></div>' +
      '</div>' +
      '<div class="ribbon">✓&nbsp;<span><b>Held through every stress scenario</b> — including a tripled skilled-bettor population and a year of volume compressed into its five worst days.</span></div>' +
      '<p class="prov">12 months of real prediction-market history · 23,000+ markets · 12M+ real trades</p>';
    mount(panel, v);
    whenSeen(v, function () {
      v.querySelectorAll('[data-c]').forEach(function (el) {
        var t = +el.getAttribute('data-c'), suf = el.getAttribute('data-suf') || '', pre = el.getAttribute('data-pre') || '', t0 = null;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1100), e = 1 - Math.pow(1 - p, 3), val = Math.round(t * e);
          el.textContent = pre + (t >= 1000 ? val.toLocaleString() : val) + suf; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
      v.querySelectorAll('.dd .bar').forEach(function (b) { setTimeout(function () { b.style.height = b.getAttribute('data-bh') + '%'; }, 80); });
    });
  }

  /* ---------- ecosystem ---------- */
  function ecosystem(panel) {
    var v = document.createElement('div'); v.className = 'ipv';
    v.innerHTML = '<div class="eco"><svg viewBox="0 0 1000 300" preserveAspectRatio="none"><defs><linearGradient id="ipvEg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0AD17F" stop-opacity="0"/><stop offset="1" stop-color="#0AD17F" stop-opacity=".9"/></linearGradient></defs><g data-links></g></svg><div class="core"><b>i-play.io</b><span>Platform core</span></div></div>';
    mount(panel, v);
    var eco = v.querySelector('.eco'), links = v.querySelector('[data-links]');
    var mods = [['Frontends', 16, 26], ['Admin Control Tower', 84, 24], ['Payments', 12, 52], ['Games', 88, 54], ['Prediction markets', 20, 80], ['Affiliate engine', 82, 82]];
    var nodes = [], paths = [];
    mods.forEach(function (m) {
      var n = document.createElement('div'); n.className = 'node'; n.style.left = m[1] + '%'; n.style.top = m[2] + '%';
      n.innerHTML = '<i></i>' + m[0]; eco.appendChild(n); nodes.push(n);
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var x1 = 500, y1 = 150, x2 = m[1] / 100 * 1000, y2 = m[2] / 100 * 300, mx = (x1 + x2) / 2;
      p.setAttribute('d', 'M' + x2 + ',' + y2 + ' C' + mx + ',' + y2 + ' ' + mx + ',' + y1 + ' ' + x1 + ',' + y1);
      links.appendChild(p); paths.push(p);
    });
    whenSeen(eco, function () {
      mods.forEach(function (m, i) { setTimeout(function () { nodes[i].classList.add('on'); paths[i].classList.add('live'); }, 220 * i + 200); });
    });
  }

  /* ---------- downline ---------- */
  function downline(panel) {
    var v = document.createElement('div'); v.className = 'ipv';
    v.innerHTML = '<div class="tree"><div class="you">YOU</div><div class="trunk"></div></div>' +
      '<div class="tfoot"><div><div class="k">Commission rolled up (illustrative)</div><div class="models">RevShare · CPA · Turnover · NGR · Profit Share</div></div><div class="v" data-tv>$0</div></div>';
    mount(panel, v);
    var tree = v.querySelector('.tree'), rows = [[2, 'L1', 64], [3, 'L2', 104], [4, 'L3', 150], [4, 'L4', 196], [5, 'L5', 240]], lvls = [];
    rows.forEach(function (r) {
      var lv = document.createElement('div'); lv.className = 'lvl'; lv.style.top = r[2] + 'px';
      var dim = Math.max(.4, 1 - (r[2] - 64) / 260);
      for (var i = 0; i < r[0]; i++) { var d = document.createElement('div'); d.className = 'dot'; d.style.opacity = dim; lv.appendChild(d); }
      tree.appendChild(lv); lvls.push(lv);
      var tg = document.createElement('div'); tg.className = 'tag'; tg.style.top = (r[2] - 6) + 'px'; tg.textContent = r[1]; tree.appendChild(tg);
    });
    var val = 0, tv = v.querySelector('[data-tv]');
    function rise() {
      var r = document.createElement('div'); r.className = 'rise'; r.style.top = '250px'; r.style.opacity = '1'; tree.appendChild(r);
      requestAnimationFrame(function () { r.style.transition = 'top 1.2s linear,opacity .3s linear'; r.style.top = '30px';
        setTimeout(function () { r.style.opacity = '0'; val += Math.round(3 + Math.random() * 9); tv.textContent = '$' + val; setTimeout(function () { r.remove(); }, 300); }, 1100); });
    }
    whenSeen(tree, function () {
      lvls.forEach(function (l, i) { setTimeout(function () { l.classList.add('on'); }, 180 * i + 200); });
      setTimeout(function () { rise(); setInterval(rise, 900); }, rows.length * 180 + 500);
    });
  }

  var STEP_ICONS = {
    calendar:'<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M10.5 14l1.5 1.5L15 12.5"/>',
    sliders:'<path d="M5 6h14M5 12h14M5 18h14"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
    plug:'<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8Z"/><path d="M12 16v5"/>',
    rocket:'<path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9Z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M9.5 17c-1 1-1.3 3-1.3 3s2-.3 3-1.3M14.5 17c1 1 1.3 3 1.3 3s-2-.3-3-1.3"/>',
    magnet:'<path d="M6 4v7a6 6 0 0 0 12 0V4"/><path d="M6 4h4v7M18 4h-4v7"/>',
    convert:'<path d="M4 5h16l-6.2 7.5V19l-3.6-1.8v-4.7L4 5Z"/>',
    crown:'<path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 9h-13L4 8Z"/><path d="M5.5 20h13"/>',
    browse:'<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>',
    takeside:'<path d="M12 5v14"/><path d="M9 9l-3 3 3 3"/><path d="M15 9l3 3-3 3"/>',
    trend:'<path d="M4 20V4M4 20h16"/><path d="M7 15l3.5-4 3 2.5L20 8"/><path d="M20 8h-3M20 8v3"/>',
    check:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.4 2.4L16 9.5"/>'
  };
  var STEP_MAP = {
    'how-it-works': ['calendar', 'sliders', 'plug', 'rocket'],
    'player-lifecycle': ['magnet', 'convert', 'crown'],
    'predictions': ['browse', 'takeside', 'trend', 'check']
  };

  function splitViz(panel) {
    var labels = panel.querySelectorAll('.panel-label');
    if (labels.length < 2) return;
    var a = labels[0], b = labels[1];
    var cardA = a.parentElement, cardB = b.parentElement, grid = cardA.parentElement;
    var bodyA = cardA.querySelector('.card-body'), bodyB = cardB.querySelector('.card-body');
    function side(cls, lab, body) {
      var s = document.createElement('div'); s.className = 'sd ' + cls;
      var cap = document.createElement('div'); cap.className = 'cap';
      var dot = document.createElement('i'); cap.appendChild(dot);
      cap.appendChild(document.createTextNode(lab ? lab.textContent : ''));
      var bd = document.createElement('p'); bd.className = 'bd';
      bd.textContent = body ? body.textContent : '';
      s.appendChild(cap); s.appendChild(bd); return s;
    }
    var wrap = document.createElement('div'); wrap.className = 'ipv ipv-split';
    wrap.appendChild(side('we', a, bodyA));
    wrap.appendChild(side('you', b, bodyB));
    var seam = document.createElement('div'); seam.className = 'ipv-seam'; wrap.appendChild(seam);
    var node = document.createElement('div'); node.className = 'ipv-node'; node.textContent = '\u27F7'; wrap.appendChild(node);
    if (grid === cardB.parentElement && grid.children.length === 2) {
      grid.parentNode.insertBefore(wrap, grid); grid.style.display = 'none';
    } else {
      cardA.parentNode.insertBefore(wrap, cardA); cardA.style.display = 'none'; cardB.style.display = 'none';
    }
    whenSeen(wrap, function () { wrap.classList.add('in'); });
  }

  function stepsViz(panel) {
    var seq = STEP_MAP[panel.getAttribute('data-steps')]; if (!seq) return;
    var labels = panel.querySelectorAll('.panel-label'), cards = [];
    for (var i = 0; i < labels.length; i++) { if (/^0?\d$/.test((labels[i].textContent || '').trim())) cards.push(labels[i]); }
    var tiles = [];
    cards.forEach(function (lab, i) {
      var name = seq[i]; if (!name || !STEP_ICONS[name]) return;
      var ic = document.createElement('div'); ic.className = 'ipv-ic';
      ic.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' + STEP_ICONS[name] + '</svg>';
      lab.parentElement.insertBefore(ic, lab); tiles.push(ic);
    });
    whenSeen(panel, function () { tiles.forEach(function (t, i) { setTimeout(function () { t.classList.add('in'); }, 90 * i); }); });
  }

  var BUILD = { routing: function (p) { routing(p, false); }, 'routing-mini': function (p) { routing(p, true); }, stress: stress, ecosystem: ecosystem, downline: downline, split: splitViz, steps: stepsViz };

  function run() {
    injectCSS();
    document.querySelectorAll('[data-viz]').forEach(function (p) {
      if (p.__ipv) return; var k = p.getAttribute('data-viz'); if (BUILD[k]) { p.__ipv = 1; BUILD[k](p); }
    });
  }
  if (document.readyState !== 'loading') run(); else document.addEventListener('DOMContentLoaded', run);
})();
