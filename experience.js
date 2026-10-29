(()=>{'use strict';
  const sections=[...document.querySelectorAll('#main>section')],header=document.querySelector('.site-header'),nav=document.querySelector('.chapter-nav'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const films=[...document.querySelectorAll('.film-section')];let scheduled=false;let currentSection=-1;
  const anchors=[];
  sections.forEach((s,i)=>{s.style.setProperty('--layer',i+1);const anchor=document.createElement('span');anchor.className='stack-anchor';anchor.setAttribute('aria-hidden','true');s.before(anchor);anchors.push(anchor);const b=document.createElement('button');b.type='button';const label=s.getAttribute('aria-label')||s.querySelector('h2')?.textContent||'Rowenger';b.setAttribute('aria-label',label);b.title=label;b.innerHTML='<span></span>';b.firstElementChild.textContent=label;b.addEventListener('click',()=>{const y=scrollY+anchor.getBoundingClientRect().top-header.offsetHeight;window.scrollTo({top:y,behavior:reduced.matches?'instant':'smooth'})});nav.append(b)});
  const buttons=[...nav.children];
  function syncButton(video){const b=video.closest('section').querySelector('.video-toggle');const playing=!video.paused;b.setAttribute('aria-pressed',String(playing));b.setAttribute('aria-label',playing?'Videoyu duraklat':'Videoyu oynat');b.querySelector('.video-state').textContent=playing?'Duraklat':'Oynat';b.querySelector('.play-icon').textContent=playing?'Ⅱ':'▶';}
  function play(video){if(!video.src){video.src=video.dataset.src;video.load()}video.muted=true;video.play().then(()=>syncButton(video)).catch(()=>syncButton(video));}
  films.forEach(s=>{const v=s.querySelector('video');v.addEventListener('play',()=>syncButton(v));v.addEventListener('pause',()=>syncButton(v));s.querySelector('.video-toggle').addEventListener('click',()=>{if(v.paused){v.dataset.manualPause='';play(v)}else{v.dataset.manualPause='true';v.pause()}})});
  const preload=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const v=e.target.querySelector('video');if(!v.src){v.preload='metadata';v.src=v.dataset.src;v.load()}preload.unobserve(e.target)}})},{rootMargin:'500px 0px'});films.forEach(s=>preload.observe(s));
  function measure(){const h=header.offsetHeight;document.documentElement.style.setProperty('--header-h',h+'px');sections.forEach(s=>s.style.setProperty('--stack-top',Math.min(h,innerHeight-s.offsetHeight)+'px'));render()}
  function render(){scheduled=false;const h=header.offsetHeight,available=innerHeight-h;let active=0;
    sections.forEach((s,i)=>{const next=sections[i+1];if(anchors[i].getBoundingClientRect().top<h+available*.48)active=i;let cover=0;if(next)cover=Math.max(0,Math.min(1,(innerHeight-next.getBoundingClientRect().top)/available));s.style.setProperty('--stack-scale',reduced.matches?1:1-cover*.025);s.style.setProperty('--stack-shade',reduced.matches?0:cover*.22);s.style.setProperty('--stack-radius',reduced.matches?'0px':cover*14+'px')});
    if(active!==currentSection){currentSection=active;buttons.forEach((b,i)=>b.setAttribute('aria-current',String(i===active)));}
    films.forEach(s=>{const v=s.querySelector('video');const r=s.getBoundingClientRect();const next=s.nextElementSibling;const visible=Math.max(0,Math.min(innerHeight,next?.getBoundingClientRect().top??innerHeight,r.bottom)-Math.max(h,r.top));if(visible>available*.4&&!reduced.matches&&!document.hidden&&!v.dataset.manualPause){if(v.paused)play(v)}else if(!v.paused)v.pause()});
  }
  function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',measure);window.addEventListener('load',measure);document.addEventListener('visibilitychange',queue);reduced.addEventListener('change',measure);
  const resize=new ResizeObserver(measure);resize.observe(header);sections.forEach(s=>resize.observe(s));measure();
})();
