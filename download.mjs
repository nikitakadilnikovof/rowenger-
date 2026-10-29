import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec = promisify(execFile);
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1'));
const content=JSON.parse(await fs.readFile(path.join(root,'content.json'),'utf8'));
const urls=new Set();
function walk(x){if(!x||typeof x!=='object')return;if(x.src)urls.add(x.src);for(const v of Object.values(x))walk(v);}
walk(content);await fs.mkdir(path.join(root,'assets'),{recursive:true});
const map={};const failures=[];
const list=[...urls]; let next=0;
await Promise.all(Array.from({length:5},async()=>{while(next<list.length){const i=next++;const url=list[i];const name=`${String(i+1).padStart(2,'0')}-${path.basename(new URL(url).pathname)}`;const dest=path.join(root,'assets',name);try {await exec('curl.exe',['-L','--fail','--retry','1','--max-time','35',url,'-o',dest]);map[url]='assets/'+name;}catch(e){failures.push({url,error:e.message.slice(0,120)});}}}));
await fs.writeFile(path.join(root,'asset-map.json'),JSON.stringify(map,null,2));
console.log(JSON.stringify({saved:Object.keys(map).length,total:urls.size,failures},null,2));
