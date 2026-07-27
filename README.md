# sand — website renewal

美容室 **sand**（[sand-hair.com](https://sand-hair.com/)）のWebサイトリニューアル案。
スクロール駆動のシネマティック構成。ビルド不要の静的サイト。

## 見る

```bash
python3 -m http.server 4321
# → http://localhost:4321
```

公開URL: https://naoya244.github.io/sand/

## 構成

```
index.html
assets/
  css/style.css
  js/main.js
  js/vendor/        GSAP + ScrollTrigger（CDN非依存のためベンダリング）
  img/hero          ヒーロー3点
  img/salon         全13サロンの内観
  img/style         メディア掲載・出演
  img/misc          メニュー／採用の背景、ロゴ
```

## デザイン

- テーマカラー **`#8FC6CD`（ソフトアクア）**。暗い面は深いティール `#1D3F46` / `#0D2025`
- 和文ディスプレイ Zen Old Mincho ／ 欧文 Cormorant Garamond ／ ラベル Jost

## スクロール演出

離散的な切り替えではなく、すべてスクロール量に連続的に紐づけてある（GSAP ScrollTrigger の scrub）。

| セクション | 動き |
|---|---|
| ヒーロー | 各カットが寄り続けながら、次が `clip-path` で下から拭き上がって重なる |
| リビール | 写真が小窓から全画面へ連続的に開く（`--c` 1→0）。内側の画像は別速度で引く |
| CRAFT | 画面を固定し、写真が寄りながら流れ、文章が上へ抜けて差し替わる |
| MEDIA | ピン留めして横スクロール（狭い画面では指スクロールに自動フォールバック） |

`prefers-reduced-motion: reduce` ではピン留めを解除し、全内容が素直に縦に並ぶ。

## 注意

`assets/img/` の写真は **sand 公式サイトの素材**。リニューアル検討用であり、権利は sand に帰属する。

`assets/img/style/` はヘアスタイル写真ではなく**掲載誌の表紙とYouTubeサムネイル**なので、MEDIA 以外で使わないこと。

スタッフ個人写真は、名前と顔の対応が確証できなかったため未使用。
