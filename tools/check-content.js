#!/usr/bin/env node
/* Prüft content.js auf Fehler und auf Antworten, die sich ohne Wissen erraten lassen.
   Aufruf: node tools/check-content.js   (Exit-Code 1 bei Fehlern) */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'content.js'),'utf8')+';this.CATS=CATS;this.LEARN=typeof LEARN!=="undefined"?LEARN:null;this.PLANS=typeof PLANS!=="undefined"?PLANS:null;this.THEMES=typeof THEMES!=="undefined"?THEMES:{};',ctx);
const {CATS,LEARN,PLANS,THEMES}=ctx;

const errors=[],warns=[];
const err=(k,m)=>errors.push(`${k}: ${m}`),warn=(k,m)=>warns.push(`${k}: ${m}`);
let mc=0,mcLongest=0,mcShortest=0,tf=0,tfFalse=0;

CATS.forEach(c=>c.lessons.forEach((l,li)=>l.ex.forEach((e,ei)=>{
  const k=`${c.id}:${li}:${ei}`;
  if(!e.q)err(k,'Frage fehlt');
  if(!e.x)warn(k,'kein Hinweis von Tilly (x oder TIPS)');
  if(e.t==='mc'){
    mc++;
    if(!Array.isArray(e.o)||e.o.length<3)err(k,'zu wenige Optionen');
    else if(!(e.a>=0&&e.a<e.o.length))err(k,'a zeigt auf keine Option');
    else{
      if(new Set(e.o).size!==e.o.length)err(k,'doppelte Option');
      const len=e.o.map(s=>s.length),others=len.filter((_,i)=>i!==e.a);
      if(len[e.a]>=Math.max(...others))mcLongest++;
      if(len[e.a]<=Math.min(...others))mcShortest++;
      const avg=others.reduce((a,b)=>a+b,0)/others.length;
      if(len[e.a]>avg*1.8&&len[e.a]-avg>15)warn(k,`richtige Antwort deutlich länger als die Ablenker (${len[e.a]} vs. Ø ${Math.round(avg)} Zeichen)`);
    }
  }else if(e.t==='tf'){
    tf++;if(typeof e.a!=='boolean')err(k,'a muss true oder false sein');else if(!e.a)tfFalse++;
  }else if(e.t==='match'){
    if(!Array.isArray(e.p)||e.p.length<3)err(k,'zu wenige Paare');
    else if(new Set(e.p.map(p=>p[0])).size!==e.p.length||new Set(e.p.map(p=>p[1])).size!==e.p.length)err(k,'Paare nicht eindeutig');
  }else if(e.t==='gap'){
    const n=(e.s.match(/\{\d\}/g)||[]).length;
    if(n!==e.a.length)err(k,`${n} Lücken, aber ${e.a.length} Antworten`);
    e.a.forEach(a=>{if(!e.b.includes(a))err(k,`Antwort „${a}“ fehlt in der Auswahl`);});
  }else if(e.t==='order'){
    if(!Array.isArray(e.o)||e.o.length<3)err(k,'zu wenige Schritte');
  }else err(k,`unbekannter Typ ${e.t}`);
})));

/* Ratbarkeit über alle Aufgaben: Bei 4 Optionen wären zufällig je ~25 % die längste bzw. kürzeste */
const pLong=mcLongest/mc,pShort=mcShortest/mc,pFalse=tfFalse/tf;
if(pLong>0.4)err('Auswahl',`richtige Antwort ist in ${Math.round(pLong*100)} % der Fälle die längste (Grenze 40 %)`);
if(pShort>0.4)err('Auswahl',`richtige Antwort ist in ${Math.round(pShort*100)} % der Fälle die kürzeste (Grenze 40 %)`);
if(pFalse<0.35||pFalse>0.65)err('Stimmt/Stimmt nicht',`${Math.round(pFalse*100)} % der Aussagen sind falsch (Ziel 35 bis 65 %)`);

/* Lernbereich: jede Lizenzangabe muss einen bekannten Plan nennen */
if(LEARN&&PLANS){
  const ids=new Set(PLANS.map(p=>p.id)),seen=new Set();
  LEARN.zones.forEach(z=>z.tools.forEach(t=>{
    const k='learn:'+t.id;
    if(seen.has(t.id))err(k,'id doppelt');seen.add(t.id);
    ['name','what','office','why'].forEach(f=>{if(!t[f])err(k,`${f} fehlt`);});
    Object.keys(t.lic||{}).forEach(p=>{if(!ids.has(p))err(k,`unbekannter Plan ${p}`);});
    if(!Object.keys(t.lic||{}).length&&!t.add)err(k,'weder Plan noch Add-on angegeben');
    if(!THEMES[t.th])err(k,`unbekanntes Thema ${t.th}`);
  }));
}

/* 3D-Büro: jedes Tool sollte ein eigenes Objekt haben, sonst steht es nur auf einem Sockel */
if(LEARN){const o3=fs.readFileSync(path.join(root,'office3d.js'),'utf8');
  LEARN.zones.forEach(z=>z.tools.forEach(t=>{if(!o3.includes(`tool('${t.id}'`))warn('learn:'+t.id,'kein eigenes Objekt im 3D-Büro (office3d.js), wird auf einem Sockel gezeigt');}));}

console.log(`Aufgaben: ${CATS.reduce((a,c)=>a+c.lessons.reduce((b,l)=>b+l.ex.length,0),0)}`);
console.log(`Auswahl: richtige Antwort ist die längste in ${mcLongest}/${mc} (${Math.round(pLong*100)} %), die kürzeste in ${mcShortest}/${mc} (${Math.round(pShort*100)} %)`);
console.log(`Stimmt/Stimmt nicht: ${tfFalse}/${tf} falsch (${Math.round(pFalse*100)} %)`);
if(LEARN)console.log(`Lernbereich: ${LEARN.zones.reduce((a,z)=>a+z.tools.length,0)} Tools in ${LEARN.zones.length} Bereichen`);
warns.forEach(w=>console.log('Hinweis  '+w));
errors.forEach(e=>console.log('FEHLER   '+e));
process.exit(errors.length?1:0);
