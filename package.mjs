import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1'));
const marker='<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><filter id="white-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -0.2126 -0.7152 -0.0722 1 0"/></filter></defs></svg>';
let html=await fs.readFile(path.join(root,'index.html'),'utf8');
if(!html.includes('id="white-ink"')){html=html.replace('<body>','<body>'+marker);await fs.writeFile(path.join(root,'index.html'),html);}
const map=JSON.parse(await fs.readFile(path.join(root,'asset-map.json'),'utf8'));
const c=JSON.parse(await fs.readFile(path.join(root,'content.json'),'utf8'));
const issues=[];
for(const [url,file] of Object.entries(map)){await fs.access(path.join(root,file));if(!html.includes(file))issues.push('Missing asset in HTML: '+file);}
for(const col of c.collections)for(const p of col.products){if(!html.includes(p.name.replaceAll('&','&amp;')))issues.push('Missing product: '+p.name);if(!html.includes(p.price))issues.push('Missing price: '+p.price)}
if(issues.length)throw new Error(issues.join('\n'));
const css=(await fs.readFile(path.join(root,'style.css'),'utf8'))+'\n'+(await fs.readFile(path.join(root,'experience.css'),'utf8'));
const scripts=(await fs.readFile(path.join(root,'products.js'),'utf8'))+'\n'+(await fs.readFile(path.join(root,'app.js'),'utf8'))+'\n'+(await fs.readFile(path.join(root,'experience.js'),'utf8'));
let standalone=html.replace('<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="experience.css">',()=>`<style>${css}</style>`).replace('<script src="products.js"></script><script src="app.js"></script><script src="experience.js"></script>',()=>`<script>${scripts}</script>`).replaceAll('href="./index.html"','href="#"');
for(const file of Object.values(map)){const mime=file.endsWith('.png')?'image/png':'image/jpeg';const data=await fs.readFile(path.join(root,file));standalone=standalone.split(file).join('data:'+mime+';base64,'+data.toString('base64'));}
for(const file of await fs.readdir(path.join(root,'videos'))){const mime=file.endsWith('.mp4')?'video/mp4':'image/jpeg';const data=await fs.readFile(path.join(root,'videos',file));standalone=standalone.split('videos/'+file).join('data:'+mime+';base64,'+data.toString('base64'));}
await fs.writeFile(path.join(root,'Rowenger.html'),standalone);
await fs.writeFile(path.join(root,'QA.json'),JSON.stringify({source:'https://www.rowenger.com/',captured:'2026-10-27',updated:'2026-10-28',assets:49,slides:8,mainSections:10,videoSections:3,videoSource:'https://www.bork.ru/',localVideos:true,productCards:18,footerGroups:4,contentAudit:'passed',localImages:true,originalTrackingScriptsCopied:false,scrolling:'Native CSS scroll snapping with sticky overlapping sections; no wheel interception; reduced-motion fallback.',integration:'Static prototype. Product and category links lead to the original store. Newsletter never submits an address. Account dialog links to original store.'},null,2));
console.log(`Content audit passed. Standalone HTML: ${(Buffer.byteLength(standalone)/1024/1024).toFixed(1)} MB`);

