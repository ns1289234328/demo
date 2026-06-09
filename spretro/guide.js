/* ============================================================
   SP Retroperitoneal Access — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Build step navigator + mobile select ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
  var steplist = document.getElementById('steplist');
  var navSelect = document.getElementById('navSelect');

  sections.forEach(function (sec) {
    var label = sec.getAttribute('data-step');
    var num = sec.getAttribute('data-num') || '•';
    var id = sec.id;

    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'steplink';
    a.href = '#' + id;
    a.dataset.target = id;
    a.innerHTML = '<span class="num">' + num + '</span><span>' + label + '</span>';
    li.appendChild(a);
    steplist.appendChild(li);

    var opt = document.createElement('option');
    opt.value = id;
    opt.textContent = (num !== '•' ? num + ' · ' : '') + stripTags(label);
    navSelect.appendChild(opt);
  });

  function stripTags(s) { var d = document.createElement('div'); d.innerHTML = s; return d.textContent; }

  navSelect.addEventListener('change', function () {
    var el = document.getElementById(this.value);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  var links = Array.prototype.slice.call(steplist.querySelectorAll('.steplink'));

  /* ---------- 2. Scrollspy + progress bar ---------- */
  var progress = document.getElementById('progress');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      var marker = y + 140;
      var current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= marker) current = sections[i];
      }
      links.forEach(function (l) {
        l.classList.toggle('active', l.dataset.target === current.id);
      });
      if (navSelect.value !== current.id) navSelect.value = current.id;

      var docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Equipment checklist ---------- */
  var equip = [
    { name: 'Flexible ureteroscope + light source', spec: 'available at START of case' },
    { name: 'Guidewire', spec: 'advanced to the stricture' },
    { name: 'Foley catheter', spec: '14 Fr → 18 Fr final' },
    { name: 'da Vinci SP system', spec: 'small "beach-ball" access port' },
    { name: 'AirSeal insufflation', spec: 'low flow · 8 mmHg' },
    { name: 'Custom suction-irrigator parts', spec: 'see Step 06 assembly' },
    { name: 'Neptune / wall suction', spec: 'suction end of the rig' },
    { name: '2-0 silk', spec: 'drain holding sutures' }
  ];
  var checkSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  var equipList = document.getElementById('equipList');
  equip.forEach(function (it) {
    var row = document.createElement('div');
    row.className = 'ci';
    row.innerHTML =
      '<span class="check-box" role="checkbox" aria-checked="false" tabindex="0">' + checkSVG + '</span>' +
      '<span class="name">' + it.name + '</span>' +
      '<span class="spec">' + it.spec + '</span>';
    var box = row.querySelector('.check-box');
    function toggle() {
      var on = box.classList.toggle('on');
      box.setAttribute('aria-checked', on ? 'true' : 'false');
      row.classList.toggle('done', on);
    }
    box.addEventListener('click', toggle);
    box.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
    equipList.appendChild(row);
  });

  /* ---------- 4. Fascial layer stepper ---------- */
  var layerBtns = Array.prototype.slice.call(document.querySelectorAll('.layer-btn'));
  var layerImgs = Array.prototype.slice.call(document.querySelectorAll('.layer-figwrap img'));
  var layerBadge = document.getElementById('layerBadge');
  var layerTitle = document.getElementById('layerTitle');
  var layerDesc = document.getElementById('layerDesc');
  var badgeNames = ['External oblique', 'Internal oblique', 'Transversus abdominis', 'Retroperitoneum'];

  layerBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.dataset.img, 10);
      layerBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      layerImgs.forEach(function (im, i) { im.classList.toggle('show', i === idx); });
      layerBadge.textContent = 'Layer ' + (idx + 1) + ' · ' + badgeNames[idx];
      layerTitle.textContent = btn.dataset.title;
      var desc = btn.dataset.desc;
      if (btn.dataset.crux) {
        desc += ' ';
        layerDesc.innerHTML = btn.dataset.desc + ' <span class="crux-flag">' + btn.dataset.crux + '</span>';
      } else {
        layerDesc.textContent = desc;
      }
    });
  });

  /* ---------- 5. Suction-irrigator assembly diagram ---------- */
  var G = {
    drain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 12h13"/><rect x="15" y="9" width="6" height="6" rx="2"/><circle cx="6" cy="12" r=".7" fill="currentColor"/><circle cx="9" cy="12" r=".7" fill="currentColor"/><circle cx="12" cy="12" r=".7" fill="currentColor"/></svg>',
    adapter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4"/><path d="M7 9l4 1.5L7 12V9z"/><path d="M11 8l4 2-4 2V8z"/><path d="M15 7l5 3-5 3V7z"/></svg>',
    tubing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 9c3 0 3 6 6 6s3-6 6-6 3 6 6 6"/></svg>',
    stopcock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M3 12h5M16 12h5M12 8V3"/></svg>',
    canister: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="9" width="12" height="12" rx="2"/><path d="M12 9V4M12 4l-2.5 2.5M12 4l2.5 2.5"/></svg>'
  };
  var rig = [
    { g: 'drain', n: '15 Fr Blake / JP drain', s: 'round perforated tip · cut to size · 2-0 silk handles' },
    { g: 'adapter', n: 'Christmas-tree adapter', s: 'stepped barb connector' },
    { g: 'tubing', n: 'Yellow cysto tubing', s: 'flexible yellow segment' },
    { g: 'stopcock', n: '3-way stopcock', s: '+ 50 cc syringe (irrigate)', branch: true },
    { g: 'tubing', n: 'Suction tubing', s: 'to canister' },
    { g: 'canister', n: 'Neptune suction', s: 'continuous suction' }
  ];
  var arrowSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>';
  var rigFlow = document.getElementById('rigFlow');
  rig.forEach(function (node, i) {
    var div = document.createElement('div');
    div.className = 'rig-node';
    var sub = node.branch
      ? '<div class="rs" style="color:#9a6b1f">' + node.s + '</div>'
      : '<div class="rs">' + node.s + '</div>';
    div.innerHTML =
      '<span class="ord">' + (i + 1) + '</span>' +
      '<span class="rig-glyph"' + (node.branch ? ' style="background:#f6efde;color:#9a6b1f"' : '') + '>' + G[node.g] + '</span>' +
      '<div class="rn">' + node.n + '</div>' + sub;
    rigFlow.appendChild(div);
    if (i < rig.length - 1) {
      var ar = document.createElement('div');
      ar.className = 'rig-arrow';
      ar.innerHTML = arrowSVG;
      rigFlow.appendChild(ar);
    }
  });

  /* ---------- 6. Firefly toggle ---------- */
  var scene = document.getElementById('scene');
  var modeStd = document.getElementById('modeStd');
  var modeFf = document.getElementById('modeFf');
  var modeTag = document.getElementById('modeTag');

  function setMode(ff) {
    scene.classList.toggle('ff', ff);
    modeStd.classList.toggle('on', !ff);
    modeFf.classList.toggle('on', ff);
    modeTag.textContent = ff ? 'Fluorescence · Firefly' : 'Standard · 0°';
  }
  modeStd.addEventListener('click', function () { setMode(false); });
  modeFf.addEventListener('click', function () { setMode(true); });

})();
