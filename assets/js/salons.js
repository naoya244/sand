/* =========================================================
   sand — サロンデータ（全ページ共通）
   予約URL(hp)と店舗ページ(sl)は sand 公式サロン一覧から、
   住所つきのブロック単位で店名と対にして取得したもの。
   ========================================================= */
window.SAND = (() => {
  const HP = 'https://beauty.hotpepper.jp/';
  const SL = 'https://sand-hair.com/salon/';

  const SALONS = [
    { n:'sand Ginza',         a:'ginza',      j:'銀座',   z:'〒104-0061', d:'東京都中央区銀座1-8-7 VORT銀座DDI 5F',                     img:'ginza.webp',      hp:'slnH000394957/', sl:'ginza/' },
    { n:'sand S Ginza',       a:'ginza',      j:'銀座',   z:'〒104-0061', d:'東京都中央区銀座2-11-5 陽光銀座セントラルビル 3F',           img:'sginza.webp',     hp:'slnH000473494/', sl:'sginza/' },
    { n:'sand Hearts ginza',  a:'ginza',      j:'銀座',   z:'〒104-0061', d:'東京都中央区銀座7-13-2 Tiara Grace 銀座タワー 6F',          img:'hearts.jpg',      hp:'slnH000742982/', sl:'heartsginza/' },
    { n:'sand omotesando',    a:'omotesando', j:'表参道', z:'〒150-0001', d:'東京都渋谷区神宮前5-20-21 タウンハウス神宮前B号室',         img:'omotesando.webp', hp:'slnH000453258/', sl:'omotesando/' },
    { n:'sand Scene',         a:'omotesando', j:'表参道', z:'〒150-0001', d:'東京都渋谷区神宮前3-6-7 Dear神宮前 2F',                    img:'scene.webp',      hp:'slnH000503933/', sl:'scene/' },
    { n:'sand Ikebukuro',     a:'ikebukuro',  j:'池袋',   z:'〒170-0013', d:'東京都豊島区東池袋1-22-13 近代グループBLD.11号館 5F',        img:'ikebukuro.webp',  hp:'slnH000626503/', sl:'ikebukuro/' },
    { n:'sand Ikebukuro 2nd', a:'ikebukuro',  j:'池袋',   z:'〒171-0022', d:'東京都豊島区南池袋2-17-8 ブルーム南池袋 6F',                img:'ikebukuro2.jpg',  hp:'slnH000730768/', sl:'ikebukuro-2nd/' },
    { n:'sand Leo',           a:'shinjuku',   j:'新宿',   z:'〒151-0053', d:'東京都渋谷区代々木2-11-19 J-Grace新宿 4F',                  img:'leo.jpg',         hp:'slnH000784610/', sl:'leo/' },
    { n:'sand clear 横浜本店', a:'yokohama',  j:'横浜',   z:'〒220-0005', d:'神奈川県横浜市西区南幸2-11-1 横浜エムエスビル 4F',          img:'clear.jpg',       hp:'slnH000541701/', sl:'yokohama/' },
    { n:'sand mieu',          a:'yokohama',   j:'横浜',   z:'〒220-0005', d:'神奈川県横浜市西区南幸2-11-1 横浜エムエスビル 5F',          img:'mieu.jpg',        hp:'slnH000710982/', sl:'mieu/' },
    { n:'sand yena',          a:'yokohama',   j:'横浜',   z:'〒221-0844', d:'神奈川県横浜市神奈川区沢渡3-1 東興ビル 2F-A',               img:'yena.jpg',        hp:'slnH000775464/', sl:'yena/' },
    { n:'sand Osaka',         a:'osaka',      j:'大阪',   z:'〒530-0015', d:'大阪府大阪市北区中崎西3-1-4 Bonコンドミニアム梅田 1F-A',     img:'osaka.webp',      hp:'slnH000568554/', sl:'osaka/' },
    { n:'sand Nagoya',        a:'nagoya',     j:'名古屋', z:'〒450-0002', d:'愛知県名古屋市中村区名駅4-16-33 パシフィックスクエア名駅 7F', img:'nagoya.jpg',      hp:'slnH000677248/', sl:'nagoya/' }
  ];

  const book = s => HP + s.hp;
  const detail = s => SL + s.sl;

  // 予約リスト（contact / recruit で使う）
  const renderReserve = (el) => {
    if (!el) return;
    el.innerHTML = SALONS.map(s => `
      <div class="rsv rise">
        <div class="rsv__t"><span class="rsv__a">${s.j}</span><h3>${s.n}</h3></div>
        <p class="rsv__d">${s.d}</p>
        <div class="rsv__act">
          <a class="rsv__go" href="${book(s)}" target="_blank" rel="noopener noreferrer">WEB予約<i>↗</i></a>
          <a class="rsv__sub" href="${detail(s)}" target="_blank" rel="noopener noreferrer">店舗詳細</a>
        </div>
      </div>`).join('');
  };

  // フォームのサロン選択
  const fillSelect = (sel) => {
    if (!sel) return;
    SALONS.forEach(s => {
      const o = document.createElement('option');
      o.textContent = `${s.n}（${s.j}）`;
      sel.appendChild(o);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderReserve(document.querySelector('#reserveList'));
    fillSelect(document.querySelector('#f-salon'));
  });

  return { SALONS, book, detail, renderReserve, fillSelect };
})();
