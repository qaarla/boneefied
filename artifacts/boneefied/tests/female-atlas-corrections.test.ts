import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {content} from '../content/canonical.ts';
import {combinedAtlasAssetsForStructure} from '../content/atlas-index.ts';
import {bvis06Plates} from '../content/bvis06-plates.generated.ts';
import {answerIsCorrect} from '../content/study.ts';
import {anatomyImageCacheKey} from '../components/anatomyImageCacheKey.ts';
import {protectedOverlayHeight,containedOverlayBox,protectedOverlayRects} from '../components/viewerOverlayProtection.ts';
import {spreadAtlasCallouts} from '../components/viewerMarkerLayout.ts';
import {fitViewerScene,imageCenteredSceneBounds} from '../components/viewerSceneFraming.ts';
import {bvr02OverlayOverrides} from '../content/bvr02-overlay-overrides.ts';

const root=new URL('../',import.meta.url);
const mod=content.modules.find(m=>m.id==='female-reproductive')!;
const structures=content.structures.filter(s=>s.moduleId===mod.id);
const ids=new Set([...mod.lessons!.flatMap(l=>l.assetIds??[]),
  ...content.questions.filter(q=>q.moduleId===mod.id).flatMap(q=>q.assetId?[q.assetId]:[]),
  ...structures.flatMap(s=>combinedAtlasAssetsForStructure(s.id).map(a=>a.id))]);
const assets=content.assets.filter(a=>ids.has(a.id));
const source=readFileSync(new URL('scripts/atlas/bvis06-repro.mjs',root),'utf8');
test('female publication union is three original plates with 54 ordered targets',()=>{
  assert.deepEqual(assets.map(a=>a.id),['asset-bvis06-female-gross','asset-bvis06-ovary-follicle','asset-bvis06-uterine-wall']);
  assert.deepEqual(assets.map(a=>a.labels!.length),[25,20,9]);
  assert.equal(structures.length,65);
  assert.ok(assets.every(a=>a.assetType==='diagram'));
});
test('all 53 female visual questions retain valid mappings and usable scoring',()=>{
  const qs=content.questions.filter(q=>q.moduleId===mod.id&&q.assetId);
  assert.equal(qs.length,53);
  assert.deepEqual(qs.reduce((o,q)=>({...o,[q.taskType]:(o[q.taskType]??0)+1}),{} as Record<string,number>),
    {hotspot:49,'image-identification':3,'ordered-sequence':1});
  for(const q of qs){
    assert.ok(answerIsCorrect(q.answer,q),q.id);
    const a=assets.find(a=>a.id===q.assetId)!;
    for(const h of q.hotspots??[]){
      assert.ok(a.labels!.some(l=>l.structureId===h.structureId&&l.x===h.x&&l.y===h.y),q.id);
      if(q.taskType==='hotspot')assert.equal(answerIsCorrect(h.structureId,q),q.structureIds.includes(h.structureId),q.id);
    }
  }
  assert.ok(answerIsCorrect('female-reproductive-ovary',qs.find(q=>q.id==='q-visual-ovary')!));
  assert.match(readFileSync(new URL('locales/es/modules/female-reproductive.ts',root),'utf8'),/'q-visual-ovary': \{[^}]*acceptedAliases: \['female-reproductive-ovary'\]/);
});
test('female local sources, original rights and provenance hashes agree',()=>{
  const proof=JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis06-atlas/provenance.json',root),'utf8'));
  const manifest=readFileSync(new URL('content/bvis06-image-sources.generated.ts',root),'utf8');
  for(const a of assets){
    const p=bvis06Plates.find(p=>p.id===a.id)!;
    const record=proof.plates.find((r:{id:string})=>r.id===a.id);
    for(const ext of ['png','svg'] as const)assert.equal(createHash('sha256').update(readFileSync(new URL(p[ext+'Path' as 'pngPath'|'svgPath'],root))).digest('hex'),record.sha256[ext]);
    assert.deepEqual(p.labels.map(l=>[l.structureId,l.x,l.y]),a.labels!.map(l=>[l.structureId,l.x,l.y]));
    assert.ok(manifest.includes(`'${p.id}': require('@/${p.pngPath}')`));
    assert.match(a.attributionLicense!,/Original Boneefied/);
    assert.match(record.rights,/no third-party illustration imported, traced or reproduced/);
    if(p.teachingKind==='tissue-schematic')assert.match(a.specimenNote!,/not a real specimen/);
  }
});
test('ovarian and suspensory pointers lie on the actual thin support bands',()=>{
  const a=assets[0];
  for(const [id,p0,p1,p2] of [
    ['ovarian-ligament',[246,590],[310,500],[352,350]],
    ['suspensory-ligament-of-ovary',[160,566],[100,500],[100,390]]
  ] as const){
    const l=a.labels!.find(l=>l.structureId==='female-reproductive-'+id)!;
    let distance=Infinity;
    for(let n=0;n<=1000;n++){
      const t=n/1000,u=1-t;
      distance=Math.min(distance,Math.hypot(l.x*1450-(u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0]),l.y*1000-(u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1])));
    }
    assert.ok(distance<4.5,id+': endpoint must lie within the painted 9px band, not only its wider mask');
  }
  const muscle=assets[2].labels!.find(l=>l.structureId==='female-reproductive-smooth-muscle-of-uterus')!;
  assert.ok(Math.hypot(muscle.x*1450-196,muscle.y*1000-516)<3);
});
test('fornix is only the cervical recess and fundus ends at tube entry level',()=>{
  assert.match(source,/rect\(x, 690, 24, 30\)/);
  assert.match(source,/rect\(x, 716, 32, 30\)/);
  assert.match(source,/\[640, 326\], \[300, 326\]/);
  assert.match(source,/\[1390, 176\], \[960, 176\]/);
  assert.match(source,/pts: \[\[1085, 176\], \[1040, 160\], \[980, 150\]\]/);
  assert.match(source,/Math\.sin\(t \* Math\.PI \* 6\) \* 12/);
});
test('female framing is scoped and cache refresh only changes corrected rasters',()=>{
  const viewer=readFileSync(new URL('components/AnatomyImageViewer.tsx',root),'utf8');
  assert.match(viewer,/\.\.\.femaleReproductiveAssets/);
  assert.match(viewer,/viewerPanBounds\([^\n]+femaleReproductiveAssets\.has/);
  for(const name of ['17-female-gross','19-uterine-wall'])assert.match(anatomyImageCacheKey('/bvis06-'+name+'.png'),/female-relations-1/);
  assert.equal(anatomyImageCacheKey('/bvis06-18-ovary-follicle.png'),'/bvis06-18-ovary-follicle.png');
});
test('female tight gutters preserve independent touch cells and a useful art size',()=>{
  for(const width of [254,322])for(const a of assets){
    const cells=44,columns=Math.floor(width/cells);
    const base=Math.max(width/1.45,Math.ceil(a.labels!.length/columns)*cells+8);
    const avoid=bvr02OverlayOverrides[a.id].avoid!;
    const height=protectedOverlayHeight(a.labels!,width,base,cells,cells,1.45,avoid,8.5,12,0);
    const image=containedOverlayBox(width,height,1.45,12);
    const anchors=a.labels!.map(l=>({x:image.x+l.x*image.width,y:image.y+l.y*image.height}));
    const positions=spreadAtlasCallouts(anchors,width,height,cells,cells,0,{avoid:protectedOverlayRects(width,height,1.45,avoid,12),markerRadius:8.5});
    const rects=[image,...positions.map(p=>({x:p.x-22,y:p.y-22,width:44,height:44}))];
    const fit=fitViewerScene(width,width,width,height,imageCenteredSceneBounds(rects,image));
    assert.ok(image.width*fit.scale/width>=.5,a.id+': excessive unused gutter');
    for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++){
      assert.ok(Math.abs(positions[i].x-positions[j].x)>=44||Math.abs(positions[i].y-positions[j].y)>=44,a.id+': touch cell overlap');
    }
  }
});
