export function enhance(html){
  const arrow='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
  const scenes=[
    {id:'coffee',label:'Enerji ve performans',title:'Her yudumda<br>enerji ve performans.',subtitle:'KÜÇÜK EV ALETLERİ',link:'https://www.rowenger.com/kucuk-ev-altletri',num:'01'},
    {id:'cooking',label:'Güç ve lezzet',title:'Gücü hisset.<br>Lezzeti keşfet.',subtitle:'ROWENGER',link:'https://www.rowenger.com/kucuk-ev-altletri',num:'02'},
    {id:'living',label:'Daha iyi hayat',title:'Daha akıllı yaşam.<br>Daha iyi hayat.',subtitle:'ROWENGER',link:'https://www.rowenger.com/',num:'03'}
  ];
  const scene=s=>`<section class="film-section" id="film-${s.id}" aria-label="${s.label}"><div class="film-media"><video muted loop playsinline preload="none" poster="videos/${s.id}.jpg" data-src="videos/${s.id}.mp4" aria-label="${s.label} — BORK referans videosu"></video></div><div class="film-shade"></div><div class="film-top"><span>ROWENGER</span><span>${s.num} / 03</span></div><div class="film-content"><span class="film-eyebrow">${s.subtitle}</span><h2>${s.title}</h2><a class="film-link" href="${s.link}">İncele ${arrow}</a></div><div class="film-bottom"><a class="reference-credit" href="https://www.bork.ru/" target="_blank" rel="noopener">BORK · Referans videosu</a><button class="video-toggle" type="button" aria-label="Videoyu oynat" aria-pressed="false"><span class="video-state">Oynat</span><span class="play-icon" aria-hidden="true">Ⅱ</span></button></div></section>`;
  html=html.replace('<section class="mosaic-section',scene(scenes[0])+'\n<section class="mosaic-section');
  html=html.replace('<section class="collection section-shell "',scene(scenes[1])+'\n<section class="collection section-shell "');
  html=html.replace('<section class="bottom-promos',scene(scenes[2])+'\n<section class="bottom-promos');
  html=html.replace('</main>','</main><nav class="chapter-nav" aria-label="Bölümler"></nav>');
  html=html.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="experience.css">');
  html=html.replace('<script src="app.js"></script>','<script src="app.js"></script><script src="experience.js"></script>');
  return html;
}
