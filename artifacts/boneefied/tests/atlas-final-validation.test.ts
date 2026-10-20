import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {content} from '../content/canonical.ts';
import {combinedAtlasAssetsForStructure} from '../content/atlas-index.ts';
import {fitViewerScene,imageCenteredSceneBounds,viewerPanBounds,fittedSceneRect} from '../components/viewerSceneFraming.ts';
const ids=new Set(content.modules.flatMap(m=>[
  ...(m.lessons??[]).flatMap(l=>l.assetIds??[]),
  ...content.questions.filter(q=>q.moduleId===m.id).flatMap(q=>q.assetId?[q.assetId]:[]),
  ...content.structures.filter(s=>s.moduleId===m.id).flatMap(s=>combinedAtlasAssetsForStructure(s.id).map(a=>a.id)),
]));
const assets=content.assets.filter(a=>ids.has(a.id));
test('complete final publication union includes 158 diagrams and six specimens',()=>{
  assert.equal(assets.length,164);
  assert.equal(assets.filter(a=>a.assetType==='diagram').length,158);
  assert.equal(assets.filter(a=>a.assetType==='histology').length,6);
  assert.equal(assets.reduce((n,a)=>n+(a.labels?.length??0),0),1433);
  for(const a of assets){
    assert.ok(existsSync(new URL('../'+a.localAssetPath,import.meta.url)),a.id);
    assert.ok(a.attributionLicense?.trim(),a.id);
    for(const label of a.labels??[])assert.ok(label.x>=0&&label.x<=1&&label.y>=0&&label.y<=1,a.id+': invalid endpoint');
  }
});
test('final shared fitting and pan policy no longer depends on group opt-ins',()=>{
  const source=readFileSync(new URL('../components/AnatomyImageViewer.tsx',import.meta.url),'utf8');
  assert.match(source,/\.\.\.content\.assets\.filter\(a => a\.assetType === 'diagram' \|\| a\.assetType === 'histology'\)\.map\(a => a\.id\)/);
  assert.match(source,/viewerPanBounds\([^\n]+centeredNervousAssets\.has/);
  for(const a of assets){
    const w=286,h=420,aspect=a.imageAspectRatio??1;
    const image={x:12,y:(h-(w-24)/aspect)/2,width:w-24,height:(w-24)/aspect};
    const rects=[image,{x:0,y:12,width:44,height:44},{x:w-44,y:h-44,width:44,height:44}];
    const fit=fitViewerScene(w,h,w,h,imageCenteredSceneBounds(rects,image));
    const bounds=viewerPanBounds(image,w,h,fit,true);
    const painted=fittedSceneRect(image,w,h,fit);
    assert.ok(bounds.width+.001>=painted.width&&bounds.height+.001>=painted.height,a.id);
    assert.ok(fit.scale>0&&fit.scale<=1,a.id);
  }
});
