/* =========================================================
   sand — 下層ページ共通スクリプト
   index の演出は読み込まず、ヘッダー・ドロワー・フォームだけを扱う
   ========================================================= */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ヘッダー ---------- */
  const hd = $('#hd'), prog = $('#prog');
  const onScroll = () => {
    const y = scrollY;
    if (hd) hd.classList.toggle('solid', y > 40);
    if (prog) {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = `${Math.min(y / (max || 1), 1) * 100}%`;
    }
  };
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { onScroll(); tick = false; });
  }, { passive: true });
  onScroll();

  /* ---------- ドロワー ---------- */
  const burger = $('#burger'), drawer = $('#drawer');
  if (burger && drawer) {
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
  }

  /* ---------- カスタムカーソル ---------- */
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cur = $('#cur');
    if (cur) {
      let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
      addEventListener('mousemove', (e) => {
        x = e.clientX; y = e.clientY;
        cur.classList.add('on');
        cur.classList.toggle('hot', !!e.target.closest('a,button,input,select,textarea'));
      }, { passive: true });
      addEventListener('mouseleave', () => cur.classList.remove('on'));
      const loop = () => {
        cx += (x - cx) * .18; cy += (y - cy) * .18;
        cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
        requestAnimationFrame(loop);
      };
      loop();
    }
  }

  /* ---------- スクロールで出す ---------- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
  $$('.rise').forEach(el => io.observe(el));
  setTimeout(() => $$('.rise').forEach(el => el.classList.add('in')), 4000);   // 保険

  /* ---------- フォーム ----------------------------------------
     送信先のサーバーは未接続。入力チェックだけ行い、
     送信できない事実をその場ではっきり伝える（黙って成功風にしない）  */
  const form = $('#inquiry');
  if (form) {
    const note = $('#formNote');
    const say = (kind, html) => {
      note.className = 'fnote is-' + kind;
      note.innerHTML = html;
      note.hidden = false;
      note.setAttribute('role', kind === 'err' ? 'alert' : 'status');
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));

      const missing = [];
      form.querySelectorAll('[required]').forEach(el => {
        if (!el.value.trim() || (el.type === 'checkbox' && !el.checked)) {
          missing.push(el.dataset.label || el.name);
          el.setAttribute('aria-invalid', 'true');
        }
      });
      const mail = form.elements.email;
      if (mail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())) {
        missing.push('メールアドレスの形式');
        mail.setAttribute('aria-invalid', 'true');
      }
      if (missing.length) {
        say('err', '入力を確認してください：<b>' + [...new Set(missing)].join(' / ') + '</b>');
        form.querySelector('[aria-invalid]')?.focus();
        return;
      }
      say('warn',
        '<b>このフォームはまだ送信先に接続されていません。</b>' +
        'デザイン確認用のため、入力内容は送信されず保存もされません。<br>' +
        'お急ぎの場合は、ご希望のサロンへ直接お電話ください。' +
        '<a href="index.html#salon">サロン一覧を見る</a>');
    });
  }

  /* ---------- 年号 ---------- */
  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
