import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),root=path.dirname(fileURLToPath(import.meta.url));
const ffmpeg=path.join(root,'.tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const sources=JSON.parse(await fs.readFile(path.join(root,'video-sources.json'),'utf8'));
await fs.mkdir(path.join(root,'videos'),{recursive:true});
await Promise.all(sources.map(async s=>{
  const file=path.join(root,'videos',s.id+'.mp4');
  await run(ffmpeg,['-y','-loglevel','error','-i',s.source,'-an','-vf','scale=1280:-2','-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-movflags','+faststart',file],{maxBuffer:2e6});
  await run(ffmpeg,['-y','-loglevel','error','-ss','1.5','-i',file,'-frames:v','1','-q:v','3',path.join(root,'videos',s.id+'.jpg')]);
  console.log(s.id+': '+(await fs.stat(file)).size+' bytes');
}));
