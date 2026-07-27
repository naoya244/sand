/* =========================================================
   sand — scroll-driven experience
   GSAP ScrollTrigger でスクロール量に演出を紐づける（scrub）。
   スクロール自体は奪わない（スクロールハイジャックはしない）。
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isNarrow = () => innerWidth < 820;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- データ ---------- */
  const SALONS = [
    { n:'sand Ginza',         a:'ginza',      j:'銀座',   z:'〒104-0061', d:'東京都中央区銀座1-8-7 VORT銀座DDI 5F',              img:'ginza.webp' },
    { n:'sand S Ginza',       a:'ginza',      j:'銀座',   z:'〒104-0061', d:'東京都中央区銀座2-11-5 陽光銀座セントラルビル 3F',    img:'sginza.webp' },
    { n:'sand Hearts ginza',  a:'ginza',      j:'銀座',   z:'〒104-0061', d:'東京都中央区銀座7-13-2 Tiara Grace 銀座タワー 6F',   img:'hearts.jpg' },
    { n:'sand omotesando',    a:'omotesando', j:'表参道', z:'〒150-0001', d:'東京都渋谷区神宮前5-20-21 タウンハウス神宮前B号室',  img:'omotesando.webp' },
    { n:'sand Scene',         a:'omotesando', j:'表参道', z:'〒150-0001', d:'東京都渋谷区神宮前3-6-7 Dear神宮前 2F',             img:'scene.webp' },
    { n:'sand Ikebukuro',     a:'ikebukuro',  j:'池袋',   z:'〒170-0013', d:'東京都豊島区東池袋1-22-13 近代グループBLD.11号館 5F', img:'ikebukuro.webp' },
    { n:'sand Ikebukuro 2nd', a:'ikebukuro',  j:'池袋',   z:'〒171-0022', d:'東京都豊島区南池袋2-17-8 ブルーム南池袋 6F',         img:'ikebukuro2.jpg' },
    { n:'sand Leo',           a:'shinjuku',   j:'新宿',   z:'〒151-0053', d:'東京都渋谷区代々木2-11-19 J-Grace新宿 4F',           img:'leo.jpg' },
    { n:'sand clear 横浜本店', a:'yokohama',  j:'横浜',   z:'〒220-0005', d:'神奈川県横浜市西区南幸2-11-1 横浜エムエスビル 4F',   img:'clear.jpg' },
    { n:'sand mieu',          a:'yokohama',   j:'横浜',   z:'〒220-0005', d:'神奈川県横浜市西区南幸2-11-1 横浜エムエスビル 5F',   img:'mieu.jpg' },
    { n:'sand yena',          a:'yokohama',   j:'横浜',   z:'〒221-0844', d:'神奈川県横浜市神奈川区沢渡3-1 東興ビル 2F-A',        img:'yena.jpg' },
    { n:'sand Osaka',         a:'osaka',      j:'大阪',   z:'〒530-0015', d:'大阪府大阪市北区中崎西3-1-4 Bonコンドミニアム梅田 1F-A', img:'osaka.webp' },
    { n:'sand Nagoya',        a:'nagoya',     j:'名古屋', z:'〒450-0002', d:'愛知県名古屋市中村区名駅4-16-33 パシフィックスクエア名駅 7F', img:'nagoya.jpg' }
  ];

  $('#salons').innerHTML = SALONS.map(s => `
    <article class="slnc" data-area="${s.a}">
      <div class="slnc__ph">
        <img src="assets/img/salon/${s.img}" alt="${s.n} の店内" loading="lazy">
        <span class="slnc__a">${s.j}</span>
      </div>
      <h3 class="slnc__n">${s.n}</h3>
      <p class="slnc__d"><span class="slnc__z">${s.z}</span>${s.d}</p>
      <a class="slnc__l" href="#contact"><span>RESERVE &amp; DETAIL</span><i>→</i></a>
    </article>`).join('');

  // MEDIA（掲載誌・出演）
  $('#hzTrack').innerHTML = Array.from({ length: 18 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<figure class="hz__c"><img src="assets/img/style/style${n}.jpg" alt="メディア掲載 ${n}" loading="lazy"><figcaption>MEDIA ${n}</figcaption></figure>`;
  }).join('');

  /* ---------- ヒーロー見出しを1文字ずつに ---------- */
  const ttl = $('.hero__ttl');
  $$('[data-split]', ttl).forEach((el, li) => {
    const chars = [...el.textContent];
    el.textContent = '';
    chars.forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.setProperty('--cd', `${0.25 + li * 0.14 + i * 0.032}s`);
      el.appendChild(s);
    });
  });

  /* ---------- ローダー ---------- */
  const load = $('#load');
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    load.classList.add('done');
    document.body.classList.remove('lock');
    ttl.classList.add('go');
    $$('.rise').forEach(el => rio.observe(el));
    ScrollTrigger.refresh();
    setTimeout(() => load.remove(), 900);
  };
  document.body.classList.add('lock');
  addEventListener('load', () => setTimeout(start, reduced ? 0 : 900));
  setTimeout(start, 4200);

  const rio = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .06 });

  /* =========================================================
     以下、動きの実装。reduced motion のときは一切組まない
     （CSS 側でピン留めも解除し、全内容が素直に縦に並ぶ）
     ========================================================= */
  if (!reduced) {

    /* ---- BEAT 1 : ヒーロー ----------------------------------
       「切り替える」のではなく、
       ・どのカットもスクロール中ずっと寄り/流れ続ける
       ・次のカットが下から拭き上がって重なる
       を1本のタイムラインに載せ、スクロール量へ連続的に紐づける      */
    const shots = $$('.shot');
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .6 }
    });
    shots.forEach((s, i) => {
      const img = s.querySelector('img');
      heroTl.fromTo(img,
        { scale: 1.30, yPercent: -3.5 },
        { scale: 1.02, yPercent: 3.5, ease: 'none', duration: 1 }, i);
      if (i > 0) {
        heroTl.fromTo(s,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: .85 }, i - .42);
      }
    });
    // 文字はスクロールに合わせて退場
    gsap.to('.hero__body', {
      yPercent: -14, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '64% top', end: 'bottom bottom', scrub: true }
    });

    /* ---- Apple 式リビール : 小窓から全画面へ連続的に開く ---- */
    if ($('.rvl')) {
      gsap.timeline({ scrollTrigger: { trigger: '.rvl', start: 'top top', end: 'bottom bottom', scrub: .6 } })
        .fromTo('.rvl__ph',     { '--c': 1 },              { '--c': 0, ease: 'none', duration: 1 }, 0)
        .fromTo('.rvl__ph img', { scale: 1.45 },           { scale: 1, ease: 'none', duration: 1.7 }, 0)
        .fromTo('.rvl__veil',   { opacity: 0 },            { opacity: 1, ease: 'none', duration: .6 }, .55)
        .fromTo('.rvl__cap',    { opacity: 0, y: 40 },     { opacity: 1, y: 0, ease: 'power2.out', duration: .5 }, .72);
    }

    /* ---- BEAT 2 : 視差レイヤー（背景ほどゆっくり） ---- */
    $$('[data-plx]').forEach(el => {
      const amt = Number(el.dataset.plx) * (isNarrow() ? 0.45 : 1);   // モバイルは弱める
      gsap.fromTo(el, { yPercent: -amt * 100 }, {
        yPercent: amt * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ---- BEAT 3 : ピン留めして写真と文章を差し替える ---- */
    const pshots = $$('.pshot');
    const chaps  = $$('.chap');
    const dots   = $$('.pin__dots li');

    gsap.set(pshots, { opacity: 0 });  gsap.set(pshots[0], { opacity: 1 });
    gsap.set(chaps,  { opacity: 0, y: 30 }); gsap.set(chaps[0], { opacity: 1, y: 0 });

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.pin', start: 'top top', end: 'bottom bottom', scrub: .6,
        onUpdate: (self) => {
          const i = Math.min(Math.floor(self.progress * chaps.length), chaps.length - 1);
          dots.forEach((d, n) => d.classList.toggle('is-on', n === i));
        }
      }
    });
    // 写真は担当区間のあいだ、寄りながら左右にゆっくり流れ続ける
    pshots.forEach((s, i) => {
      const img = s.querySelector('img');
      pinTl.fromTo(img,
        { scale: 1.24, xPercent: i % 2 ? 2.5 : -2.5 },
        { scale: 1.02, xPercent: i % 2 ? -2.5 : 2.5, ease: 'none', duration: 1 }, i);
      if (i > 0) {
        pinTl.to(pshots[i - 1], { opacity: 0, ease: 'none', duration: .45 }, i - .22)
             .to(s,             { opacity: 1, ease: 'none', duration: .45 }, i - .22);
      }
    });
    // 文章は上へ抜けながら、次が下から差し替わる
    chaps.forEach((c, i) => {
      if (i === 0) return;
      pinTl.to(chaps[i - 1], { opacity: 0, y: -26, ease: 'power1.in', duration: .3 }, i - .2)
           .fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', duration: .36 }, i - .06);
    });

    /* ---- マーキー : スクロール速度で加速し、逆スクロールで逆走する ---- */
    document.body.classList.remove('no-js-mq');   // ここから先はJSが流す
    const mqTween = gsap.to('.mq__t', { xPercent: -50, repeat: -1, duration: 24, ease: 'none' });
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        gsap.to(mqTween, {
          timeScale: gsap.utils.clamp(-5, 5, 1 + v / 800),
          duration: .45, overwrite: true
        });
      }
    });

    /* ---- 文字の中の写真を、スクロールでゆっくり流す ---- */
    if ($('.msk__t')) {
      gsap.fromTo('.msk__t',
        { backgroundPosition: '50% 8%' },
        { backgroundPosition: '50% 78%', ease: 'none',
          scrollTrigger: { trigger: '.msk', start: 'top bottom', end: 'bottom top', scrub: .5 } });
    }

    /* ---- サロン : ばらけた状態から所定位置へ組み上がる ---- */
    $$('.slnc').forEach((c, i) => {
      const dx = ((i % 3) - 1) * 80;          // 見た目のばらつきは index から作る（毎回同じ動きになる）
      const dy = 90 + (i % 4) * 34;
      const rot = ((i % 5) - 2) * 3.5;
      gsap.fromTo(c,
        { x: dx, y: dy, rotate: rot, scale: .88, opacity: 0 },
        { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'power3.out', duration: 1.05,
          scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
    });
    /* ---- 保険 ----------------------------------------------
       登場アニメは「再生されるまで中身が透明」になる作りなので、
       何らかの理由で再生されなかった要素は強制的に元に戻す。
       内容がアニメの裏に隠れたままになるのを防ぐため。              */
    const unhide = () => {
      $$('.slnc, .hdr__en > span').forEach(el => {
        if (parseFloat(getComputedStyle(el).opacity) < .05) gsap.set(el, { clearProps: 'all' });
      });
    };
    setTimeout(unhide, 5000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) setTimeout(unhide, 1200);   // 背面タブから戻ったとき
    });

    /* ---- コンセプトの地の色をスクロールで深める ---- */
    if ($('.cpt')) {
      gsap.fromTo('.cpt', { backgroundColor: '#F1F7F7' }, {
        backgroundColor: '#DDEDEF', ease: 'none',
        scrollTrigger: { trigger: '.cpt', start: 'top center', end: 'bottom bottom', scrub: .6 }
      });
    }

    /* ---- 見出しの欧文を1文字ずつ立ち上げる ---- */
    $$('.hdr__en, .hz__hd .hdr__en').forEach(h => {
      if (h.dataset.split) return;
      h.dataset.split = '1';
      const chars = [...h.textContent];
      h.textContent = '';
      chars.forEach(c => {
        const s = document.createElement('span');
        s.textContent = c;
        s.style.display = 'inline-block';
        h.appendChild(s);
      });
      gsap.from(h.children, {
        yPercent: 110, opacity: 0, duration: .9, ease: 'power3.out', stagger: .035,
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });

    /* ---- BEAT 4 : MEDIA を横に流す（広い画面のみ） ---- */
    const track = $('#hzTrack');
    let hzST = null;
    // 移動量はレイアウトから毎回測り直す（onRefresh でのみ読む＝スクロール中は読まない）
    const calcDist = () =>
      Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2);

    const buildHz = () => {
      if (hzST) { hzST.kill(); hzST = null; }
      gsap.set(track, { x: 0 });
      if (isNarrow()) return;                       // 狭い画面は指で横スクロール
      if (calcDist() <= 0) return;
      let dist = calcDist();
      // tween を挟まず onUpdate で直接書く。tween のライフサイクル事故を避けるため
      hzST = ScrollTrigger.create({
        trigger: '.hz',
        pin: '.hz__stage',
        start: 'top top',
        end: () => '+=' + calcDist(),
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => { dist = calcDist(); },
        onUpdate: (self) => gsap.set(track, { x: -dist * self.progress })
      });
    };
    buildHz();
    addEventListener('resize', () => { clearTimeout(window.__rz); window.__rz = setTimeout(buildHz, 250); });
  }

  /* ---------- カスタムカーソル + ボタンの磁力 ---------- */
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cur = $('#cur');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      cur.classList.add('on');
      cur.classList.toggle('hot', !!e.target.closest('a,button,.slnc,.hz__c'));
    }, { passive: true });
    addEventListener('mouseleave', () => cur.classList.remove('on'));
    gsap.ticker.add(() => {
      cx += (x - cx) * .18; cy += (y - cy) * .18;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    });

    // ボタンがカーソルに少し引き寄せられる
    $$('.btn').forEach(b => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, {
          x: (e.clientX - (r.left + r.width / 2)) * .28,
          y: (e.clientY - (r.top + r.height / 2)) * .38,
          duration: .5, ease: 'power3.out'
        });
      });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
    });
  }

  /* ---------- 進捗バー・ヘッダー ---------- */
  const hd = $('#hd'), fab = $('.fab'), prog = $('#prog');
  const navLinks = $$('.hd__nav a');
  const navSecs = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const darkSecs = () => [$('.hero__stage'), $('.pin__stage'), $('.mn'), $('.rec'), $('.ft')].filter(Boolean);
  // リビールは開ききってから白抜きにしたいので別枠で判定する
  const rvlPh = $('.rvl__ph');

  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = `${Math.min(y / (max || 1), 1) * 100}%`;
    hd.classList.toggle('solid', y > 60);
    // ヒーローを抜けてから出す（ヒーロー下部の数値と重ならないように）
    fab.classList.toggle('in', $('.hero').getBoundingClientRect().bottom < innerHeight * 0.6);

    // ヘッダーが暗い面に重なっていれば白抜きに
    let inv = darkSecs().some(s => {
      const r = s.getBoundingClientRect();
      return r.top <= 40 && r.bottom >= 40;
    });
    if (!inv && rvlPh) {
      const r = rvlPh.getBoundingClientRect();
      // 小窓のうちは背景が明るいので、写真が上端まで開いてから反転させる
      inv = r.top <= 40 && r.bottom >= 40 && Number(getComputedStyle(rvlPh).getPropertyValue('--c')) < .35;
    }
    hd.classList.toggle('inv', inv);

    let cur = -1;
    navSecs.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * 0.35) cur = i; });
    navLinks.forEach((a, i) => a.classList.toggle('on', i === cur));
  };
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { onScroll(); tick = false; });
  }, { passive: true });
  onScroll();

  /* ---------- エリア絞り込み ---------- */
  $$('.flt__b').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = btn.dataset.area;
      $$('.flt__b').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
      });
      $$('.slnc').forEach(c => c.classList.toggle('hide', area !== 'all' && c.dataset.area !== area));
      ScrollTrigger.refresh();
    });
  });

  /* ---------- ドロワー ---------- */
  const burger = $('#burger'), drawer = $('#drawer');
  $$('.drawer__nav a').forEach((a, i) => a.style.setProperty('--i', i));
  const setDrawer = (open) => {
    drawer.classList.toggle('open', open);
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock', open);
  };
  burger.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
  $$('.drawer__nav a').forEach(a => a.addEventListener('click', () => setDrawer(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false); });

  /* ---------- カウンター ---------- */
  const cio = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, goal = Number(el.dataset.count);
      if (reduced) { el.textContent = goal; return; }
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1500, 1);
        el.textContent = Math.round(goal * (1 - (1 - p) ** 3));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(c => cio.observe(c));

  /* ---------- アンカーは自前でスムーズに（ピン留めと相性を取る） ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#main') return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  $('#yr').textContent = new Date().getFullYear();
})();
