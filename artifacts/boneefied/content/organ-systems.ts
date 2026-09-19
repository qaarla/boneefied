import type { Lesson, Module, Question, SourceRecord, Structure } from './model';

const license = 'CC BY 4.0; attribution to OpenStax and contributors required';
const url = 'https://creativecommons.org/licenses/by/4.0/';
const src = (id: string, title: string, section: string): SourceRecord => ({
  id, filename: `OpenStax Anatomy and Physiology (2013), ${title}`, hash: `openstax-ap-2013-${id}`,
  pageCount: null, title: `OpenStax 2013 · ${title}`, courseLabAssociation: null, sourceType: 'text',
  attributionLicenseStatus: license, notes: 'Chapter-level provenance for original anatomy study content.',
  verificationStatus: 'verified', sourceUrl: `https://openstax.org/books/anatomy-and-physiology/pages/${section}`, licenseUrl: url,
});
export const respiratorySources = [src('source-openstax-ap-2013-respiratory','Chapter 22 Respiratory System','22-1-organs-and-structures-of-the-respiratory-system')];
export const digestiveSources = [src('source-openstax-ap-2013-digestive','Chapter 23 Digestive System','23-1-overview-of-the-digestive-system')];
export const urinarySources = [src('source-openstax-ap-2013-urinary','Chapter 25 Urinary System','25-1-anatomy-of-the-urinary-system')];
export const maleReproductiveSources = [src('source-openstax-ap-2013-male-reproductive','Chapter 27 Male Reproductive System','27-1-anatomy-of-the-male-reproductive-system')];
export const femaleReproductiveSources = [src('source-openstax-ap-2013-female-reproductive','Chapter 27 Female Reproductive System','27-2-anatomy-of-the-female-reproductive-system')];
export const organSystemsSources = [...respiratorySources,...digestiveSources,...urinarySources,...maleReproductiveSources,...femaleReproductiveSources];

const makeStructures = (moduleId: string, sourceId: string, groups: Record<string,string>): Structure[] => Object.entries(groups).flatMap(([category, list]) => list.split('|').map(name => ({
  id: `${moduleId}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`, canonicalName: name, acceptedAliases: [],
  moduleId, category, sourceId, sourcePage: null, examPriority: false, verificationStatus: 'verified' as const,
})));
const ids = (structures: Structure[], names: string[]) => names.map(name => structures.find(s => s.canonicalName === name)!.id);
const makeLesson = (id:string,title:string,moduleId:string,sourceId:string,structureIds:string[],summary:string):Lesson => ({
  id,title,summary,structureIds,sourceIds:[sourceId],
  recognitionCues:['Orient by position, continuity, and distinctive wall or tissue features.','Compare adjacent structures before selecting a label.'],
  landmarks:['Use named boundaries, layers, and connected passages as landmarks.'],
  relationships:['Location predicts the structure’s contribution to the organ pathway or function.'],
  commonConfusions:['Do not substitute a neighboring structure or a different tissue layer.'],
});
const addLessonDetails = (lesson: Lesson): Lesson => {
  const details: Record<string, { cues: string[]; relationships: string[]; confusions: string[] }> = {
    'respiratory-upper-airway': { cues: ['Nasal conchae project from the lateral nasal wall; the choanae open posteriorly into the nasopharynx.'], relationships: ['The nasal conchae, hard palate, and choanae mark the transition from the nasal cavity to the pharynx.'], confusions: ['Do not confuse a nasal concha with a paranasal sinus or the nasal septum.'] },
    'respiratory-larynx': { cues: ['The laryngeal inlet leads to the vestibule; the glottis comprises the true vocal folds and the rima glottidis, whose rima is the opening.'], relationships: ['The cricoid is the complete laryngeal ring and the trachealis bridges the posterior tracheal cartilage.'], confusions: ['The laryngeal inlet and rima glottidis are openings; the glottis is the vocal-fold/rima unit, not a cartilage.'] },
    'respiratory-exchange': { cues: ['Alveolar septa contain pulmonary capillaries and form the thin interface between adjacent air spaces.'], relationships: ['The alveolar septum combines epithelium, shared basement membrane, and capillary endothelium in the respiratory membrane.'], confusions: ['An alveolar duct is a passage with alveolar openings; an alveolar septum is a wall between air spaces.'] },
    'digestive-small': { cues: ['Brunner glands are submucosal duodenal glands, whereas intestinal crypts extend into the mucosa.'], relationships: ['The duodenum, jejunum, and ileum differ in mucosal and submucosal landmarks along the small intestine.'], confusions: ['Do not label a submucosal duodenal gland as an intestinal crypt.'] },
    'digestive-large': { cues: ['Haustra and taeniae coli are gross landmarks of the colon; the anal sphincters mark the terminal outlet.'], relationships: ['Taeniae coli shorten the colon wall and contribute to its haustrated contour.'], confusions: ['Haustra are colonic pouches, not small-intestinal villi.'] },
    'digestive-accessory': { cues: ['Hepatic lobules are centered on a central vein and contain portal triads at their periphery; pancreatic acini surround ducts.'], relationships: ['Portal triads and hepatic sinusoids organize blood flow through the liver lobule, while pancreatic acini drain toward the pancreatic duct.'], confusions: ['A hepatic sinusoid is a vascular channel, not a bile duct; pancreatic islets are endocrine regions among exocrine acini.'] },
    'urinary-kidney': { cues: ['The renal hilum opens into the renal sinus, which contains the pelvis, calyces, vessels, and connective tissue. The Gray plate is for gross kidney location and relations, not internal microanatomy.'], relationships: ['Cortex surrounds the medulla, while the renal sinus is the internal space continuous with the hilum; kidneys lie beside the aorta and IVC.'], confusions: ['The renal sinus is an internal space; the renal pelvis is the urine-collecting funnel within it.'] },
    'urinary-tract': { cues: ['The detrusor forms the muscular bladder wall and the external urethral sphincter lies distal to the internal sphincter.'], relationships: ['Urothelium lines the ureter and bladder, while the detrusor provides the bladder wall muscle.'], confusions: ['The ureter carries urine to the bladder; the urethra carries it from the bladder to the exterior.'] },
    'male-testis': { cues: ['Tunica vaginalis covers the testis externally, while septa from the tunica albuginea divide it into lobules.'], relationships: ['Seminiferous tubules occupy lobules and converge on the rete testis through the testicular mediastinum.'], confusions: ['Tunica vaginalis is a serous covering and is distinct from the fibrous tunica albuginea.'] },
    'male-external': { cues: ['The bulbospongiosus overlies the bulb of the penis and the corpora cavernosa are paired dorsal erectile bodies.'], relationships: ['The corpus spongiosum surrounds the spongy urethra and expands distally as the glans.'], confusions: ['The dartos is smooth muscle in scrotal tissue; the cremaster is skeletal muscle associated with the spermatic cord.'] },
    'female-ovary': { cues: ['The ovarian hilum is the vascular entry region of the medulla; follicles are concentrated in the cortex.'], relationships: ['Follicles progress through cortical stages and the postovulatory corpus luteum may become corpus albicans.'], confusions: ['The corpus luteum is a functional postovulatory structure, whereas the corpus albicans is its fibrous remnant.'] },
    'female-wall': { cues: ['The endometrium has functional and basal strata, and uterine glands extend through its mucosa.'], relationships: ['The stratum functionale is shed cyclically while the stratum basale regenerates it; the myometrium forms the contractile wall.'], confusions: ['Perimetrium is the outer serosal covering, not the inner endometrium.'] },
    'female-histology': { cues: ['Ciliated columnar cells of the uterine tube and nonkeratinized squamous cells of the vagina are distinctive slide landmarks.'], relationships: ['Tubal cilia and folds aid oocyte transport, while vaginal epithelium resists abrasion.'], confusions: ['Do not use the general term follicular fluid for the zona pellucida or the corona radiata surrounding the oocyte.'] },
  };
  const detail = details[lesson.id];
  return detail ? { ...lesson, recognitionCues: [...lesson.recognitionCues, ...detail.cues], relationships: [...lesson.relationships, ...detail.relationships], commonConfusions: [...lesson.commonConfusions, ...detail.confusions] } : lesson;
};
const makeModule=(id:string,title:string,ordering:number,sourceId:string,system:string,lessons:Lesson[]):Module=>({
  id,title,ordering,sourceIds:[sourceId],visible:true,published:true,contentStatus:'available',system,
  category:'Gross anatomy and histology',summary:`Recognize the ${title.toLowerCase()} and its connected structures.`,coursePriority:false,lessons,
});
const q=(id:string,prompt:string,structureId:string,type:Question['taskType'],answer:string|string[],options:string[],explanation:string):Question=>({
  id,moduleId:'',structureIds:[structureId],taskType:type,prompt,answer,acceptedAliases:[],options:options.length?options:undefined,explanation,sourceId:'',sourcePage:null,examPriority:false,verificationStatus:'verified',
});
const bind=(moduleId:string,sourceId:string, questions:Question[])=>questions.map(question=>({...question,moduleId,sourceId}));

const respiratoryId='respiratory-system', respiratorySource=respiratorySources[0].id;
export const respiratoryStructures=makeStructures(respiratoryId,respiratorySource,{
   'nasal anatomy':'Nose|Nasal cavity|Nasal septum|Nasal vestibule|Nasal concha|Choanae|Hard palate|Soft palate|Frontal sinus|Maxillary sinus|Ethmoidal sinus|Sphenoidal sinus|Nasopharynx|Oropharynx|Laryngopharynx',
   'larynx and conducting airway':'Larynx|Epiglottis|Laryngeal inlet|Laryngeal vestibule|Glottis|Rima glottidis|Thyroid cartilage|Cricoid cartilage|Arytenoid cartilage|Vocal folds|Vestibular folds|Trachea|Carina|Trachealis muscle|Right main bronchus|Left main bronchus|Lobar bronchus|Segmental bronchus|Bronchiole|Terminal bronchiole',
  'lungs and pleura':'Right lung|Left lung|Superior lobe|Middle lobe|Inferior lobe|Cardiac notch|Oblique fissure|Horizontal fissure|Hilum of lung|Root of lung|Visceral pleura|Parietal pleura|Pleural cavity|Diaphragm',
   'respiratory histology':'Respiratory bronchiole|Alveolar duct|Alveolar sac|Alveolus|Alveolar septum|Type I pneumocyte|Type II pneumocyte|Alveolar macrophage|Respiratory membrane|Pulmonary capillary|Ciliated pseudostratified epithelium|Goblet cell|Surfactant|Smooth muscle of airway|Elastic fiber',
});
const R=(...n:string[])=>ids(respiratoryStructures,n);
export const respiratoryLessons=[
  makeLesson('respiratory-upper-airway','Upper airway',respiratoryId,respiratorySource,R('Nose','Nasal cavity','Nasal septum','Nasal vestibule','Nasal concha','Choanae','Hard palate','Soft palate','Frontal sinus','Maxillary sinus','Ethmoidal sinus','Sphenoidal sinus','Nasopharynx','Oropharynx','Laryngopharynx'),'The nasal passages condition inhaled air before it reaches the larynx.'),
 makeLesson('respiratory-larynx','Larynx and conducting tree',respiratoryId,respiratorySource,R('Larynx','Epiglottis','Laryngeal inlet','Laryngeal vestibule','Glottis','Rima glottidis','Thyroid cartilage','Cricoid cartilage','Arytenoid cartilage','Vocal folds','Vestibular folds','Trachea','Carina','Trachealis muscle','Right main bronchus','Left main bronchus','Lobar bronchus','Segmental bronchus','Bronchiole','Terminal bronchiole'),'The glottis comprises the true vocal folds and rima glottidis; the rima glottidis is the opening.'),
 makeLesson('respiratory-lungs','Lungs and pleura',respiratoryId,respiratorySource,R('Right lung','Left lung','Superior lobe','Middle lobe','Inferior lobe','Cardiac notch','Oblique fissure','Horizontal fissure','Hilum of lung','Root of lung','Visceral pleura','Parietal pleura','Pleural cavity'),'Lobes, fissures, hilum, and pleura orient the lungs in the thorax.'),
  makeLesson('respiratory-exchange','Respiratory zone',respiratoryId,respiratorySource,R('Respiratory bronchiole','Alveolar duct','Alveolar sac','Alveolus','Alveolar septum','Type I pneumocyte','Type II pneumocyte','Alveolar macrophage','Respiratory membrane','Pulmonary capillary'),'Alveoli and their thin capillary interface enable gas exchange.'),
 makeLesson('respiratory-histology','Respiratory histology',respiratoryId,respiratorySource,R('Ciliated pseudostratified epithelium','Goblet cell','Smooth muscle of airway','Elastic fiber','Type I pneumocyte','Type II pneumocyte','Alveolar macrophage','Surfactant'),'Epithelium, secretory cells, elastic tissue, and pneumocytes distinguish airway slides.'),
 makeLesson('respiratory-mechanics','Ventilation relationships',respiratoryId,respiratorySource,R('Diaphragm','Parietal pleura','Visceral pleura','Pleural cavity','Elastic fiber'),'Diaphragm movement and pleural coupling change lung volume.'),
 makeLesson('respiratory-airflow','Airflow sequence',respiratoryId,respiratorySource,R('Nasal cavity','Nasopharynx','Oropharynx','Laryngopharynx','Larynx','Trachea','Carina','Right main bronchus','Lobar bronchus','Segmental bronchus','Terminal bronchiole','Respiratory bronchiole','Alveolar duct','Alveolus'),'Trace air from the nasal cavity to an alveolus through the conducting and respiratory zones.'),
  ].map(addLessonDetails) as Lesson[];
export const respiratoryModule=makeModule(respiratoryId,'Respiratory System',7,respiratorySource,'respiratory',respiratoryLessons);
export const respiratoryQuestions=bind(respiratoryId,respiratorySource,[
 q('respiratory-q1','Which structure closes over the laryngeal inlet during swallowing?',R('Epiglottis')[0],'multiple-choice','Epiglottis',['Epiglottis','Vocal folds','Soft palate','Cricoid cartilage'],'The epiglottis redirects material away from the airway.'),
 q('respiratory-q2','Which ridge marks the split of the trachea?',R('Carina')[0],'typed-recall','Carina',[],'The carina is at the tracheal bifurcation.'),
 q('respiratory-q3','Which bronchus is more vertical and commonly receives aspirated material?',R('Right main bronchus')[0],'multiple-choice','Right main bronchus',['Right main bronchus','Left main bronchus','Lobar bronchus','Terminal bronchiole'],'The right main bronchus is wider and more vertical.'),
 q('respiratory-q4','Which lobe is absent from the left lung?',R('Middle lobe')[0],'multiple-choice','Middle lobe',['Middle lobe','Superior lobe','Inferior lobe','Cardiac notch'],'The left lung has a cardiac notch rather than a middle lobe.'),
 q('respiratory-q5','Which pleura directly covers the lung surface?',R('Visceral pleura')[0],'multiple-choice','Visceral pleura',['Visceral pleura','Parietal pleura','Pleural cavity','Pericardium'],'Visceral pleura adheres to the lung.'),
 q('respiratory-q6','Which cell type forms most of the thin gas-exchange surface?',R('Type I pneumocyte')[0],'multiple-choice','Type I pneumocyte',['Type I pneumocyte','Type II pneumocyte','Goblet cell','Macrophage'],'Type I pneumocytes are thin exchange cells.'),
 q('respiratory-q7','Which cell secretes pulmonary surfactant?',R('Type II pneumocyte')[0],'multiple-choice','Type II pneumocyte',['Type II pneumocyte','Type I pneumocyte','Goblet cell','Ciliated cell'],'Type II pneumocytes produce surfactant.'),
 q('respiratory-q8','Order airflow through progressively smaller conducting passages to the gas-exchange surface.',R('Trachea','Carina','Right main bronchus','Lobar bronchus','Segmental bronchus','Terminal bronchiole','Respiratory bronchiole','Alveolar duct','Alveolus')[0],'ordered-sequence',['Trachea','Carina','Right main bronchus','Lobar bronchus','Segmental bronchus','Terminal bronchiole','Respiratory bronchiole','Alveolar duct','Alveolus'],['Alveolar duct','Segmental bronchus','Trachea','Alveolus','Terminal bronchiole','Carina','Lobar bronchus','Respiratory bronchiole','Right main bronchus'],'The sequence moves from conducting airway to respiratory zone.'),
 q('respiratory-q9','Which epithelium is typical of the trachea?',R('Ciliated pseudostratified epithelium')[0],'multiple-choice','Ciliated pseudostratified epithelium',['Ciliated pseudostratified epithelium','Simple squamous epithelium','Keratinized stratified squamous','Transitional epithelium'],'Cilia and goblet cells help clear the conducting airway.'),
 q('respiratory-q10','Which cell removes debris in alveolar spaces?',R('Alveolar macrophage')[0],'typed-recall','Alveolar macrophage',[],'Alveolar macrophages patrol the air spaces.'),
 q('respiratory-q11','Which structure lies between visceral and parietal pleura?',R('Pleural cavity')[0],'multiple-choice','Pleural cavity',['Pleural cavity','Hilum','Mediastinum','Alveolar duct'],'The pleural cavity is the potential space between pleural layers.'),
 q('respiratory-q12','Which structure is the main muscle of quiet inspiration?',R('Diaphragm')[0],'multiple-choice','Diaphragm',['Diaphragm','Internal intercostal','Epiglottis','Trachealis'],'Contraction of the diaphragm enlarges thoracic volume.'),
 q('respiratory-q13','Which airway follows a lobar bronchus?',R('Segmental bronchus')[0],'multiple-choice','Segmental bronchus',['Segmental bronchus','Trachea','Carina','Alveolar sac'],'Segmental bronchi branch from lobar bronchi.'),
 q('respiratory-q14','Which structure is the terminal conducting airway?',R('Terminal bronchiole')[0],'multiple-choice','Terminal bronchiole',['Terminal bronchiole','Respiratory bronchiole','Alveolar duct','Alveolus'],'Terminal bronchioles lead into the respiratory zone.'),
 q('respiratory-q15','Which structure is a respiratory-zone passage containing alveolar outpouchings?',R('Respiratory bronchiole')[0],'multiple-choice','Respiratory bronchiole',['Respiratory bronchiole','Terminal bronchiole','Lobar bronchus','Trachea'],'Respiratory bronchioles bridge conducting and exchange regions.'),
 q('respiratory-q16','Which lung landmark receives bronchi and vessels?',R('Hilum of lung')[0],'multiple-choice','Hilum of lung',['Hilum of lung','Cardiac notch','Horizontal fissure','Pleural cavity'],'The hilum is the entry and exit region for the root.'),
 q('respiratory-q17','Which fissure separates the right middle and inferior lobes?',R('Oblique fissure')[0],'multiple-choice','Oblique fissure',['Oblique fissure','Horizontal fissure','Cardiac notch','Costal groove'],'The oblique fissure extends between right lung lobes.'),
 q('respiratory-q18','Which substance lowers alveolar surface tension?',R('Surfactant')[0],'function-relationship','Surfactant',['Surfactant','Mucus','Pleural fluid','Hemoglobin'],'Surfactant reduces the tendency of alveoli to collapse.'),
]);

const buildOrgan=(id:string,sourceId:string,groups:Record<string,string>)=>makeStructures(id,sourceId,groups);
const digestiveId='digestive-system',digestiveSource=digestiveSources[0].id;
export const digestiveStructures=buildOrgan(digestiveId,digestiveSource,{
 'oral cavity':'Mouth|Tongue|Hard palate|Soft palate|Teeth|Parotid gland|Submandibular gland|Sublingual gland|Sublingual duct|Pharynx|Esophagus',
 'stomach':'Stomach|Cardia|Fundus|Body of stomach|Pyloric antrum|Pylorus|Pyloric canal|Pyloric sphincter|Rugae',
  'small intestine':'Duodenum|Jejunum|Ileum|Ileocecal valve|Villi|Microvilli|Intestinal crypt|Brunner gland|Enterocyte|Goblet cell|Paneth cell',
  'large intestine':'Cecum|Appendix|Ascending colon|Transverse colon|Descending colon|Sigmoid colon|Rectum|Anal canal|Anus|Haustra|Taeniae coli|Internal anal sphincter|External anal sphincter',
  'accessory organs':'Liver|Right lobe of liver|Left lobe of liver|Hepatic artery|Gallbladder|Cystic duct|Common hepatic duct|Common bile duct|Pancreas|Head of pancreas|Body of pancreas|Tail of pancreas|Pancreatic duct|Hepatopancreatic ampulla|Major duodenal papilla|Liver lobule|Central vein|Hepatic sinusoid|Portal triad|Pancreatic acinus|Pancreatic islet',
 'peritoneum and wall':'Mesentery|Greater omentum|Lesser omentum|Mucosa|Lamina propria|Muscularis mucosae|Submucosa|Muscularis externa|Serosa|Circular muscle layer|Longitudinal muscle layer|Gastric pit|Parietal cell|Chief cell|Hepatocyte|Hepatic portal vein',
});
const D=(...n:string[])=>ids(digestiveStructures,n);
export const digestiveLessons=[
 makeLesson('digestive-oral','Oral cavity and swallowing',digestiveId,digestiveSource,D('Mouth','Tongue','Hard palate','Soft palate','Teeth','Parotid gland','Submandibular gland','Sublingual gland','Sublingual duct','Pharynx','Esophagus'),'The mouth begins mechanical processing and salivary digestion.'),
 makeLesson('digestive-stomach','Stomach regions',digestiveId,digestiveSource,D('Stomach','Cardia','Fundus','Body of stomach','Pyloric antrum','Pylorus','Pyloric canal','Pyloric sphincter','Rugae','Gastric pit','Parietal cell','Chief cell'),'Stomach regions mix food and begin protein digestion.'),
  makeLesson('digestive-small','Small intestine and mucosa',digestiveId,digestiveSource,D('Duodenum','Jejunum','Ileum','Ileocecal valve','Villi','Microvilli','Intestinal crypt','Brunner gland','Enterocyte','Goblet cell','Paneth cell'),'The three small-intestinal regions absorb digested nutrients.'),
  makeLesson('digestive-large','Large intestine',digestiveId,digestiveSource,D('Cecum','Appendix','Ascending colon','Transverse colon','Descending colon','Sigmoid colon','Rectum','Anal canal','Anus','Haustra','Taeniae coli','Internal anal sphincter','External anal sphincter'),'The large intestine reclaims water and conducts fecal material.'),
  makeLesson('digestive-accessory','Accessory digestive organs',digestiveId,digestiveSource,D('Liver','Right lobe of liver','Left lobe of liver','Hepatic artery','Gallbladder','Cystic duct','Common hepatic duct','Common bile duct','Pancreas','Head of pancreas','Body of pancreas','Tail of pancreas','Pancreatic duct','Hepatopancreatic ampulla','Major duodenal papilla','Liver lobule','Central vein','Hepatic sinusoid','Portal triad','Pancreatic acinus','Pancreatic islet'),'Bile and pancreatic secretions reach the duodenum through connected ducts.'),
 makeLesson('digestive-wall','Digestive wall layers',digestiveId,digestiveSource,D('Mucosa','Lamina propria','Muscularis mucosae','Submucosa','Muscularis externa','Serosa','Circular muscle layer','Longitudinal muscle layer'),'Wall layers organize secretion, absorption, vessels, and propulsion.'),
 makeLesson('digestive-histology','Digestive histology',digestiveId,digestiveSource,D('Villi','Microvilli','Intestinal crypt','Enterocyte','Goblet cell','Paneth cell','Gastric pit','Parietal cell','Chief cell','Hepatocyte'),'Specialized cells and surfaces identify digestive tissue slides.'),
 makeLesson('digestive-peritoneum','Peritoneal relationships',digestiveId,digestiveSource,D('Mesentery','Greater omentum','Lesser omentum'),'Peritoneal folds suspend, connect, and protect abdominal organs.'),
 makeLesson('digestive-portal','Portal circulation',digestiveId,digestiveSource,D('Hepatic portal vein','Liver','Hepatocyte'),'Absorbed nutrients travel through portal blood to hepatocytes.'),
 makeLesson('digestive-continuity','Alimentary canal continuity',digestiveId,digestiveSource,D('Mouth','Pharynx','Esophagus','Stomach','Duodenum','Jejunum','Ileum','Cecum','Ascending colon','Transverse colon','Descending colon','Sigmoid colon','Rectum','Anal canal','Anus'),'Trace the lumen from mouth to anus without substituting accessory organs.'),
 ].map(addLessonDetails) as Lesson[];
export const digestiveModule=makeModule(digestiveId,'Digestive System',8,digestiveSource,'digestive',digestiveLessons);
const dq=(id:string,p:string,s:string,a:string|string[],o:string[],e:string,t:Question['taskType']='multiple-choice')=>q(id,p,D(s)[0],t,t==='ordered-sequence' ? a.toString().split('|') : a,o,e);
export const digestiveQuestions=bind(digestiveId,digestiveSource,[
 dq('digestive-q1','Which stomach region joins the esophagus?','Cardia','Cardia',['Cardia','Fundus','Pylorus','Cecum'],'The cardia surrounds the gastroesophageal entry.'),
 dq('digestive-q2','Which structure contains villi for absorptive surface area?','Duodenum','Duodenum',['Duodenum','Esophagus','Rectum','Gallbladder'],'Small-intestinal mucosa has villi.'),
 dq('digestive-q3','Which segment follows the duodenum?','Jejunum','Jejunum',['Jejunum','Ileum','Cecum','Pylorus'],'The jejunum follows the duodenum.'),
 dq('digestive-q4','Which segment joins the large intestine?','Ileum','Ileum',['Ileum','Jejunum','Duodenum','Sigmoid colon'],'The ileum meets the cecum at the ileocecal valve.'),
 dq('digestive-q5','Which cell secretes mucus in intestinal epithelium?','Goblet cell','Goblet cell',['Goblet cell','Enterocyte','Parietal cell','Hepatocyte'],'Goblet cells produce mucin.'),
 dq('digestive-q6','Which cell produces hydrochloric acid?','Parietal cell','Parietal cell',['Parietal cell','Chief cell','Paneth cell','Goblet cell'],'Parietal cells secrete acid.'),
 dq('digestive-q7','Which organ stores and concentrates bile?','Gallbladder','Gallbladder',['Gallbladder','Pancreas','Liver','Appendix'],'The gallbladder stores bile made by the liver.'),
 dq('digestive-q8','Which duct carries bile from the liver toward the duodenum?','Common bile duct','Common bile duct',['Common bile duct','Cystic duct','Pancreatic duct','Hepatic portal vein'],'The common bile duct conveys bile distally.'),
 dq('digestive-q9','Which organ supplies digestive enzymes and bicarbonate?','Pancreas','Pancreas',['Pancreas','Gallbladder','Spleen','Liver'],'The exocrine pancreas empties into the duodenum.'),
 dq('digestive-q10','Which structure is the first part of the large intestine?','Cecum','Cecum',['Cecum','Ileum','Rectum','Ascending colon'],'The cecum receives the ileum.'),
 dq('digestive-q11','Which narrow structure projects from the cecum?','Appendix','Appendix',['Appendix','Anal canal','Pyloric antrum','Villi'],'The appendix is attached to the cecum.'),
  dq('digestive-q12','Order the small intestine from proximal to distal.','Duodenum','Duodenum|Jejunum|Ileum',['Ileum','Duodenum','Jejunum'],'The sequence is duodenum, jejunum, ileum.','ordered-sequence'),
 dq('digestive-q13','Which colon segment crosses the abdomen?','Transverse colon','Transverse colon',['Transverse colon','Ascending colon','Sigmoid colon','Cecum'],'The transverse colon runs between the ascending and descending segments.'),
 dq('digestive-q14','Which layer contains the muscularis mucosae?','Mucosa','Mucosa',['Mucosa','Submucosa','Serosa','Muscularis externa'],'Muscularis mucosae is a mucosal component.'),
 dq('digestive-q15','Which projection increases intestinal absorptive area?','Villi','Villi',['Villi','Rugae','Gastric pit','Haustra'],'Villi project from small-intestinal mucosa.'),
 dq('digestive-q16','Which cell absorbs nutrients across villus epithelium?','Enterocyte','Enterocyte',['Enterocyte','Goblet cell','Chief cell','Paneth cell'],'Enterocytes line absorptive surfaces.'),
 dq('digestive-q17','Which vessel delivers gut nutrient-rich blood to the liver?','Hepatic portal vein','Hepatic portal vein',['Hepatic portal vein','Hepatic artery','Cystic duct','Pancreatic duct'],'Portal blood reaches liver sinusoids.'),
 dq('digestive-q18','Which fold suspends much of the small intestine?','Mesentery','Mesentery',['Mesentery','Greater omentum','Lesser omentum','Serosa'],'The mesentery carries vessels and suspends intestine.'),
 dq('digestive-q19','Which region connects sigmoid colon to anal canal?','Rectum','Rectum',['Rectum','Cecum','Duodenum','Pylorus'],'The rectum precedes the anal canal.'),
 dq('digestive-q20','Which structure is the terminal opening of the canal?','Anus','Anus',['Anus','Rectum','Appendix','Ileum'],'The anus is the terminal opening.'),
 dq('digestive-q21','Which organ produces bile?','Liver','Liver',['Liver','Gallbladder','Pancreas','Duodenum'],'Hepatocytes synthesize bile.'),
 dq('digestive-q22','Which duct joins pancreatic drainage near the duodenum?','Hepatopancreatic ampulla','Hepatopancreatic ampulla',['Hepatopancreatic ampulla','Cystic duct','Ileocecal valve','Pyloric sphincter'],'The ampulla is the common entry region for bile and pancreatic secretions.'),
 dq('digestive-q23','Which gland lies near the cheek and opens into the mouth?','Parotid gland','Parotid gland',['Parotid gland','Sublingual gland','Pancreas','Liver'],'The parotid is a major salivary gland.'),
 dq('digestive-q24','Which gastric cell releases pepsinogen?','Chief cell','Chief cell',['Chief cell','Parietal cell','Goblet cell','Enterocyte'],'Chief cells release pepsinogen.'),
]);

const urinaryId='urinary-system',urinarySource=urinarySources[0].id;
export const urinaryStructures=buildOrgan(urinaryId,urinarySource,{
  'kidney':'Kidney|Renal capsule|Renal cortex|Renal medulla|Renal pyramid|Renal column|Renal papilla|Minor calyx|Major calyx|Renal pelvis|Renal hilum|Renal sinus',
  'tract':'Ureter|Urinary bladder|Trigone|Detrusor muscle|Urethra|Internal urethral sphincter|External urethral sphincter',
 'nephron':'Nephron|Renal corpuscle|Glomerulus|Glomerular capsule|Proximal convoluted tubule|Nephron loop|Descending limb|Ascending limb|Distal convoluted tubule|Collecting duct|Papillary duct|Juxtaglomerular apparatus|Macula densa|Juxtaglomerular cell',
 'vessels and histology':'Podocyte|Filtration membrane|Peritubular capillary|Vasa recta|Afferent arteriole|Efferent arteriole|Renal artery|Renal vein|Segmental artery|Interlobar artery|Arcuate artery|Cortical radiate artery|Transitional epithelium|Principal cell|Intercalated cell|Cortical radiate vein',
});
const U=(...n:string[])=>ids(urinaryStructures,n);
export const urinaryLessons=[
  makeLesson('urinary-kidney','Kidney regions',urinaryId,urinarySource,U('Kidney','Renal capsule','Renal cortex','Renal medulla','Renal pyramid','Renal column','Renal papilla','Minor calyx','Major calyx','Renal pelvis','Renal hilum','Renal sinus'),'Cortex, medulla, pyramids, and calyces orient the kidney.'),
  makeLesson('urinary-tract','Urinary tract',urinaryId,urinarySource,U('Ureter','Urinary bladder','Trigone','Detrusor muscle','Urethra','Internal urethral sphincter','External urethral sphincter'),'The tract conducts, stores, and expels urine.'),
 makeLesson('urinary-nephron','Nephron segments',urinaryId,urinarySource,U('Nephron','Proximal convoluted tubule','Nephron loop','Descending limb','Ascending limb','Distal convoluted tubule','Collecting duct','Papillary duct'),'Tubular segments modify filtrate.'),
 makeLesson('urinary-corpuscle','Renal corpuscle',urinaryId,urinarySource,U('Renal corpuscle','Glomerulus','Glomerular capsule','Podocyte','Filtration membrane'),'The corpuscle begins filtration across a specialized barrier.'),
 makeLesson('urinary-vessels','Renal vessels',urinaryId,urinarySource,U('Renal artery','Segmental artery','Interlobar artery','Arcuate artery','Cortical radiate artery','Cortical radiate vein','Afferent arteriole','Efferent arteriole','Peritubular capillary','Vasa recta','Renal vein'),'Vessels branch from hilum toward nephron capillaries.'),
 makeLesson('urinary-histology','Urinary histology',urinaryId,urinarySource,U('Transitional epithelium','Principal cell','Intercalated cell','Macula densa','Juxtaglomerular cell','Juxtaglomerular apparatus','Podocyte'),'Distinct epithelia and cells reveal urinary function.'),
 makeLesson('urinary-pathway','Urine pathway',urinaryId,urinarySource,U('Glomerulus','Glomerular capsule','Proximal convoluted tubule','Nephron loop','Distal convoluted tubule','Collecting duct','Papillary duct','Minor calyx','Major calyx','Renal pelvis','Ureter','Urinary bladder','Urethra'),'Trace filtrate from corpuscle to the outside.'),
 ].map(addLessonDetails) as Lesson[];
export const urinaryModule=makeModule(urinaryId,'Urinary System',9,urinarySource,'urinary',urinaryLessons);
const uq=(id:string,p:string,s:string,a:string|string[],o:string[],e:string,t:Question['taskType']='multiple-choice')=>q(id,p,U(s)[0],t,a,o,e);
export const urinaryQuestions=bind(urinaryId,urinarySource,[
 uq('urinary-q1','Which region contains renal pyramids?','Renal medulla','Renal medulla',['Renal medulla','Renal cortex','Renal capsule','Renal pelvis'],'Pyramids are medullary structures.'),
 uq('urinary-q2','Which structure receives urine from a renal papilla?','Minor calyx','Minor calyx',['Minor calyx','Major calyx','Ureter','Bladder'],'A minor calyx cups a papilla.'),
 uq('urinary-q3','Which organ stores urine?','Urinary bladder','Urinary bladder',['Urinary bladder','Ureter','Kidney','Urethra'],'The bladder is a muscular reservoir.'),
 uq('urinary-q4','Which capillary tuft is enclosed by the glomerular capsule?','Glomerulus','Glomerulus',['Glomerulus','Vasa recta','Peritubular capillary','Arcuate artery'],'The glomerulus is the filtration tuft.'),
 uq('urinary-q5','Which cell wraps glomerular capillaries with filtration processes?','Podocyte','Podocyte',['Podocyte','Principal cell','Macula densa','Intercalated cell'],'Podocyte processes form filtration slits.'),
 uq('urinary-q6','Which tubule follows the renal corpuscle?','Proximal convoluted tubule','Proximal convoluted tubule',['Proximal convoluted tubule','Distal convoluted tubule','Collecting duct','Ascending limb'],'The proximal tubule receives filtrate first.'),
 uq('urinary-q7','Which limb is especially associated with water permeability?','Descending limb','Descending limb',['Descending limb','Ascending limb','Distal tubule','Collecting duct'],'The descending limb permits substantial water movement.'),
 uq('urinary-q8','Which cells sense tubular sodium near the vascular pole?','Macula densa','Macula densa',['Macula densa','Podocyte','Principal cell','Intercalated cell'],'Macula densa cells monitor tubular fluid.'),
 uq('urinary-q9','Which arteriole enters the glomerulus?','Afferent arteriole','Afferent arteriole',['Afferent arteriole','Efferent arteriole','Arcuate artery','Renal vein'],'The afferent arteriole supplies the tuft.'),
 uq('urinary-q10','Which vessels follow the corticomedullary boundary?','Arcuate artery','Arcuate artery',['Arcuate artery','Renal artery','Cortical radiate artery','Interlobar vein'],'Arcuate arteries arch along the boundary.'),
 uq('urinary-q11','Which epithelium accommodates bladder stretching?','Transitional epithelium','Transitional epithelium',['Transitional epithelium','Simple squamous','Ciliated columnar','Pseudostratified'],'Urothelium changes shape with filling.'),
 uq('urinary-q12','Order filtrate flow after the renal corpuscle.','Proximal convoluted tubule',['Proximal convoluted tubule','Nephron loop','Distal convoluted tubule','Collecting duct'],['Collecting duct','Distal convoluted tubule','Proximal convoluted tubule','Nephron loop'],'Tubular flow proceeds through these segments.','ordered-sequence'),
 uq('urinary-q13','Which structure drains into the ureter?','Renal pelvis','Renal pelvis',['Renal pelvis','Minor calyx','Bladder','Papilla'],'The renal pelvis funnels urine to the ureter.'),
 uq('urinary-q14','Which capillaries surround cortical tubules?','Peritubular capillary','Peritubular capillary',['Peritubular capillary','Vasa recta','Glomerulus','Renal vein'],'Peritubular networks exchange with cortical tubules.'),
 uq('urinary-q15','Which cells regulate collecting-duct water and sodium handling?','Principal cell','Principal cell',['Principal cell','Podocyte','Macula densa','Intercalated cell'],'Principal cells respond to hormonal regulation.'),
 uq('urinary-q16','Which structure is the final passage before the exterior?','Urethra','Urethra',['Urethra','Ureter','Renal pelvis','Trigone'],'The urethra exits the bladder.'),
 uq('urinary-q17','Which artery follows the renal columns?','Interlobar artery','Interlobar artery',['Interlobar artery','Arcuate artery','Renal vein','Afferent arteriole'],'Interlobar arteries pass between pyramids.'),
 uq('urinary-q18','Which structure is a triangular bladder region?','Trigone','Trigone',['Trigone','Renal pyramid','Papilla','Calyx'],'The trigone lies between ureteric and urethral openings.'),
]);

const maleId='male-reproductive',maleSource=maleReproductiveSources[0].id;
export const maleReproductiveStructures=buildOrgan(maleId,maleSource,{
  'testis':'Testis|Tunica albuginea|Tunica vaginalis|Testicular lobule|Testicular mediastinum|Seminiferous tubule|Sertoli cell|Leydig cell|Rete testis|Efferent ductule',
 'ducts':'Epididymis|Head of epididymis|Body of epididymis|Tail of epididymis|Ductus deferens|Ampulla of ductus deferens|Ejaculatory duct|Urethra',
  'glands and external':'Seminal vesicle|Prostate gland|Bulbourethral gland|Penis|Root of penis|Body of penis|Glans penis|Prepuce|Scrotum|Spermatic cord|Dartos muscle|Cremaster muscle|Bulbospongiosus muscle|Pampiniform plexus',
  'histology':'Spermatogonium|Primary spermatocyte|Secondary spermatocyte|Spermatid|Spermatozoon|Acrosome|Flagellum|Blood-testis barrier|Interstitial tissue|Corpus cavernosum|Corpus spongiosum|Seminal plasma|Prostatic urethra|Spongy urethra|Peritubular myoid cell',
});
const M=(...n:string[])=>ids(maleReproductiveStructures,n);
export const maleReproductiveLessons=[
  makeLesson('male-testis','Testis and coverings',maleId,maleSource,M('Testis','Tunica albuginea','Tunica vaginalis','Testicular lobule','Testicular mediastinum','Seminiferous tubule','Sertoli cell','Leydig cell'),'Testicular compartments support sperm production and endocrine function.'),
 makeLesson('male-ducts','Epididymis and duct system',maleId,maleSource,M('Rete testis','Efferent ductule','Epididymis','Head of epididymis','Body of epididymis','Tail of epididymis','Ductus deferens','Ampulla of ductus deferens','Ejaculatory duct','Spermatic cord'),'Sperm mature and travel through connected ducts; the spermatic cord supports the testis and duct.'),
 makeLesson('male-glands','Accessory glands',maleId,maleSource,M('Seminal vesicle','Prostate gland','Bulbourethral gland','Seminal plasma'),'Glands add fluids with distinct contributions to semen.'),
  makeLesson('male-external','External anatomy',maleId,maleSource,M('Penis','Root of penis','Body of penis','Glans penis','Prepuce','Scrotum','Dartos muscle','Cremaster muscle','Bulbospongiosus muscle'),'External structures and scrotal muscle layers protect and position reproductive tissues.'),
 makeLesson('male-spermatogenesis','Spermatogenesis',maleId,maleSource,M('Spermatogonium','Primary spermatocyte','Secondary spermatocyte','Spermatid','Spermatozoon','Acrosome','Flagellum'),'Germ cells progress through meiosis and differentiation in seminiferous tubules.'),
 makeLesson('male-histology','Male reproductive histology',maleId,maleSource,M('Seminiferous tubule','Sertoli cell','Leydig cell','Blood-testis barrier','Corpus cavernosum','Corpus spongiosum','Peritubular myoid cell'),'Supporting, endocrine, germ, and erectile tissues identify male histology.'),
 makeLesson('male-relationships','Sperm pathway and support',maleId,maleSource,M('Seminiferous tubule','Rete testis','Efferent ductule','Epididymis','Ductus deferens','Ejaculatory duct','Prostatic urethra','Spongy urethra','Urethra','Pampiniform plexus'),'Trace sperm while keeping the urethra, cord, and erectile structures distinct from the duct pathway.'),
 ].map(addLessonDetails) as Lesson[];
maleReproductiveLessons.find((lesson) => lesson.id === 'male-testis')?.structureIds.push('male-reproductive-interstitial-tissue');
export const maleReproductiveModule=makeModule(maleId,'Male Reproductive System',10,maleSource,'male-reproductive',maleReproductiveLessons);
const mq=(id:string,p:string,s:string,a:string|string[],o:string[],e:string,t:Question['taskType']='multiple-choice')=>q(id,p,M(s)[0],t,a,o,e);
export const maleReproductiveQuestions=bind(maleId,maleSource,[
 mq('male-q1','Which tubules produce sperm?','Seminiferous tubule','Seminiferous tubule',['Seminiferous tubule','Rete testis','Ductus deferens','Epididymis'],'Spermatogenesis occurs in seminiferous tubules.'),
 mq('male-q2','Which cells support developing germ cells?','Sertoli cell','Sertoli cell',['Sertoli cell','Leydig cell','Spermatid','Podocyte'],'Sertoli cells support the seminiferous epithelium.'),
 mq('male-q3','Which cells secrete testosterone?','Leydig cell','Leydig cell',['Leydig cell','Sertoli cell','Spermatogonium','Chief cell'],'Leydig cells lie in interstitial tissue and secrete androgens.'),
 mq('male-q4','Which duct receives sperm from efferent ductules?','Epididymis','Epididymis',['Epididymis','Ductus deferens','Rete testis','Ejaculatory duct'],'The epididymis receives and matures sperm.'),
 mq('male-q5','Which epididymal region continues as ductus deferens?','Tail of epididymis','Tail of epididymis',['Tail of epididymis','Head of epididymis','Body of epididymis','Rete testis'],'The tail continues into the ductus deferens.'),
 mq('male-q6','Which gland contributes fructose-rich seminal fluid?','Seminal vesicle','Seminal vesicle',['Seminal vesicle','Prostate gland','Bulbourethral gland','Testis'],'Seminal vesicles contribute much of seminal fluid.'),
 mq('male-q7','Which gland surrounds the proximal urethra?','Prostate gland','Prostate gland',['Prostate gland','Seminal vesicle','Bulbourethral gland','Epididymis'],'The prostate surrounds the prostatic urethra.'),
 mq('male-q8','Which cell is the earliest listed germ stage?','Spermatogonium','Spermatogonium',['Spermatogonium','Spermatid','Spermatozoon','Primary spermatocyte'],'Spermatogonia precede meiotic stages.'),
 mq('male-q9','Order germ cells from earliest to mature.', 'Spermatogonium',['Spermatogonium','Primary spermatocyte','Secondary spermatocyte','Spermatid','Spermatozoon'],['Spermatid','Spermatogonium','Spermatozoon','Secondary spermatocyte','Primary spermatocyte'],'This is the progression through spermatogenesis.','ordered-sequence'),
 mq('male-q10','Which sperm structure contains enzymes for egg interaction?','Acrosome','Acrosome',['Acrosome','Flagellum','Seminal plasma','Corpus spongiosum'],'The acrosome caps the sperm head.'),
 mq('male-q11','Which sperm structure provides motility?','Flagellum','Flagellum',['Flagellum','Acrosome','Tail of epididymis','Tunica albuginea'],'The flagellum propels the spermatozoon.'),
 mq('male-q12','Which structure contains erectile vascular spaces?','Corpus cavernosum','Corpus cavernosum',['Corpus cavernosum','Corpus spongiosum','Ductus deferens','Scrotum'],'Corpora cavernosa are paired erectile bodies.'),
 mq('male-q13','Which erectile body surrounds the spongy urethra?','Corpus spongiosum','Corpus spongiosum',['Corpus spongiosum','Corpus cavernosum','Pampiniform plexus','Prostate'],'Corpus spongiosum encloses the spongy urethra.'),
 mq('male-q14','Which structure carries sperm through the inguinal region?','Ductus deferens','Ductus deferens',['Ductus deferens','Efferent ductule','Seminal vesicle','Urethra'],'The ductus deferens carries sperm from epididymis.'),
 mq('male-q15','Which vascular network helps cool testicular blood?','Pampiniform plexus','Pampiniform plexus',['Pampiniform plexus','Dartos muscle','Spermatic cord','Rete testis'],'The pampiniform plexus participates in heat exchange.'),
 mq('male-q16','Which muscle wrinkles scrotal skin?','Dartos muscle','Dartos muscle',['Dartos muscle','Cremaster muscle','Bulbospongiosus','Sertoli cell'],'Dartos smooth muscle wrinkles the scrotal skin.'),
 mq('male-q17','Which barrier isolates developing germ cells?','Blood-testis barrier','Blood-testis barrier',['Blood-testis barrier','Tunica albuginea','Acrosome','Seminal plasma'],'Sertoli tight junctions form the blood-testis barrier.'),
 mq('male-q18','Which duct joins the urethra after the seminal vesicle duct?','Ejaculatory duct','Ejaculatory duct',['Ejaculatory duct','Ductus deferens','Efferent ductule','Rete testis'],'The ejaculatory duct passes through the prostate to the urethra.'),
]);

const femaleId='female-reproductive',femaleSource=femaleReproductiveSources[0].id;
export const femaleReproductiveStructures=buildOrgan(femaleId,femaleSource,{
  'ovary and follicles':'Ovary|Ovarian cortex|Ovarian medulla|Ovarian hilum|Ovarian follicle|Primordial follicle|Primary follicle|Secondary follicle|Antral follicle|Mature follicle|Corpus luteum|Corpus albicans|Oocyte|Granulosa cell|Theca cell',
 'tube and uterus':'Uterine tube|Fimbriae|Infundibulum|Ampulla of uterine tube|Isthmus of uterine tube|Uterus|Fundus of uterus|Body of uterus|Cervix|Cervical canal|Vagina',
  'wall and support':'Endometrium|Stratum functionale|Stratum basale|Myometrium|Perimetrium|Uterine gland|Broad ligament|Suspensory ligament of ovary|Ovarian ligament|Round ligament|Mesovarium|Vaginal fornix|External os|Internal os',
 'external and mammary':'Vulva|Mons pubis|Labium majus|Labium minus|Clitoris|Vestibule|Greater vestibular gland|Mammary gland|Nipple|Areola|Mammary lobule|Lactiferous duct|Lactiferous sinus',
  'histology':'Fallopian epithelium|Ciliated columnar cell|Nonkeratinized stratified squamous epithelium|Follicular fluid|Corona radiata|Zona pellucida|Theca interna|Theca externa|Secretory endometrium|Proliferative endometrium|Smooth muscle of uterus|Mammary alveolus',
});
const F=(...n:string[])=>ids(femaleReproductiveStructures,n);
export const femaleReproductiveLessons=[
  makeLesson('female-ovary','Ovary and follicles',femaleId,femaleSource,F('Ovary','Ovarian cortex','Ovarian medulla','Ovarian hilum','Ovarian follicle','Primordial follicle','Primary follicle','Secondary follicle','Antral follicle','Mature follicle','Corpus luteum','Corpus albicans','Oocyte','Granulosa cell','Theca cell'),'The ovary houses follicles and produces oocytes and hormones.'),
 makeLesson('female-tube','Uterine tube',femaleId,femaleSource,F('Uterine tube','Fimbriae','Infundibulum','Ampulla of uterine tube','Isthmus of uterine tube','Fallopian epithelium'),'Tube regions guide the oocyte toward the uterus.'),
 makeLesson('female-uterus','Uterus and cervix',femaleId,femaleSource,F('Uterus','Fundus of uterus','Body of uterus','Cervix','Cervical canal','Vagina','External os','Internal os'),'Uterine regions and the cervix form the birth canal.'),
  makeLesson('female-wall','Uterine wall',femaleId,femaleSource,F('Endometrium','Stratum functionale','Stratum basale','Myometrium','Perimetrium','Uterine gland','Secretory endometrium','Proliferative endometrium','Smooth muscle of uterus'),'Wall layers support implantation, cycling, and contraction.'),
 makeLesson('female-support','Reproductive support',femaleId,femaleSource,F('Broad ligament','Suspensory ligament of ovary','Ovarian ligament','Round ligament','Mesovarium','Vaginal fornix'),'Ligaments and folds position the reproductive organs.'),
 makeLesson('female-external','Vulva and mammary anatomy',femaleId,femaleSource,F('Vulva','Mons pubis','Labium majus','Labium minus','Clitoris','Vestibule','Greater vestibular gland','Mammary gland','Nipple','Areola','Mammary lobule','Lactiferous duct','Lactiferous sinus'),'External genital and mammary structures have distinct landmarks.'),
  makeLesson('female-histology','Female reproductive histology',femaleId,femaleSource,F('Granulosa cell','Theca cell','Theca interna','Theca externa','Corona radiata','Zona pellucida','Follicular fluid','Fallopian epithelium','Ciliated columnar cell','Nonkeratinized stratified squamous epithelium','Mammary alveolus'),'Follicle stages and epithelia identify reproductive tissue; secretory mammary alveoli are smaller units that drain into larger mammary ducts.'),
 makeLesson('female-pathway','Oocyte pathway',femaleId,femaleSource,F('Ovary','Fimbriae','Infundibulum','Ampulla of uterine tube','Isthmus of uterine tube','Uterus','Cervix','Vagina'),'Trace the oocyte from ovary through the uterine tube and relate the uterus.'),
 ].map(addLessonDetails) as Lesson[];
export const femaleReproductiveModule=makeModule(femaleId,'Female Reproductive System',11,femaleSource,'female-reproductive',femaleReproductiveLessons);
const fq=(id:string,p:string,s:string,a:string|string[],o:string[],e:string,t:Question['taskType']='multiple-choice')=>q(id,p,F(s)[0],t,a,o,e);
export const femaleReproductiveQuestions=bind(femaleId,femaleSource,[
 fq('female-q1','Where are most ovarian follicles located?','Ovarian cortex','Ovarian cortex',['Ovarian cortex','Ovarian medulla','Myometrium','Endometrium'],'Follicles occupy the cortex.'),
 fq('female-q2','Which follicle stage contains an antrum?','Antral follicle','Antral follicle',['Antral follicle','Primordial follicle','Corpus albicans','Oocyte'],'Antral follicles contain a fluid-filled cavity.'),
 fq('female-q3','Which cells surround the oocyte within a follicle?','Granulosa cell','Granulosa cell',['Granulosa cell','Theca cell','Leydig cell','Goblet cell'],'Granulosa cells surround and support the oocyte.'),
 fq('female-q4','Which ovarian structure forms after ovulation?','Corpus luteum','Corpus luteum',['Corpus luteum','Corpus albicans','Mature follicle','Ovarian medulla'],'The ruptured follicle becomes corpus luteum.'),
 fq('female-q5','Which tube region is a common site of fertilization?','Ampulla of uterine tube','Ampulla of uterine tube',['Ampulla of uterine tube','Isthmus','Infundibulum','Cervical canal'],'The ampulla is the broad central tube region.'),
 fq('female-q6','Which projections sweep near the ovary?','Fimbriae','Fimbriae',['Fimbriae','Vaginal fornix','Round ligament','Labium minus'],'Fimbriae fringe the infundibulum.'),
 fq('female-q7','Which uterine layer is shed during menstruation?','Endometrium','Endometrium',['Endometrium','Myometrium','Perimetrium','Mesovarium'],'The functional endometrium cycles and sheds.'),
 fq('female-q8','Which layer contracts during labor?','Myometrium','Myometrium',['Myometrium','Endometrium','Perimetrium','Uterine gland'],'Myometrial smooth muscle contracts.'),
 fq('female-q9','Which uterine region projects into the vagina?','Cervix','Cervix',['Cervix','Fundus','Body','Ampulla'],'The cervix is the inferior uterine portion.'),
 fq('female-q10','Order the uterine tube from lateral to medial.', 'Fimbriae',['Fimbriae','Infundibulum','Ampulla of uterine tube','Isthmus of uterine tube'],['Isthmus of uterine tube','Ampulla of uterine tube','Fimbriae','Infundibulum'],'The tube narrows from infundibulum through ampulla to isthmus.','ordered-sequence'),
 fq('female-q11','Which ligament connects ovary to uterus?','Ovarian ligament','Ovarian ligament',['Ovarian ligament','Suspensory ligament','Round ligament','Broad ligament'],'The ovarian ligament connects ovary and uterus.'),
 fq('female-q12','Which structure is erectile tissue?','Clitoris','Clitoris',['Clitoris','Labium majus','Vestibule','Cervix'],'The clitoris is erectile external genital tissue.'),
 fq('female-q13','Which gland opens into the vestibule?','Greater vestibular gland','Greater vestibular gland',['Greater vestibular gland','Mammary gland','Uterine gland','Ovary'],'Greater vestibular glands lubricate the vestibule.'),
 fq('female-q14','Which cells form the follicular steroid-producing layer?','Theca cell','Theca cell',['Theca cell','Granulosa cell','Oocyte','Corpus albicans'],'Theca cells contribute steroidogenic support.'),
 fq('female-q15','Which glycoprotein coat surrounds the oocyte?','Zona pellucida','Zona pellucida',['Zona pellucida','Corona radiata','Follicular fluid','Theca externa'],'Zona pellucida surrounds the oocyte.'),
 fq('female-q16','Which epithelium lines much of the vagina?','Nonkeratinized stratified squamous epithelium','Nonkeratinized stratified squamous epithelium',['Nonkeratinized stratified squamous epithelium','Simple cuboidal','Ciliated pseudostratified','Transitional'],'This epithelium resists abrasion while remaining moist.'),
 fq('female-q17','Which mammary structure carries milk toward the nipple?','Lactiferous duct','Lactiferous duct',['Lactiferous duct','Mammary lobule','Areola','Nipple'],'Lactiferous ducts drain lobules toward the nipple.'),
 fq('female-q18','Which ligament carries vessels to the ovary?','Suspensory ligament of ovary','Suspensory ligament of ovary',['Suspensory ligament of ovary','Ovarian ligament','Round ligament','Mesovarium'],'The suspensory ligament contains ovarian vessels.'),
 fq('female-q19','Which follicle stage precedes ovulation?','Mature follicle','Mature follicle',['Mature follicle','Primordial follicle','Corpus albicans','Primary follicle'],'The mature follicle releases the oocyte.'),
 fq('female-q20','Which structure is the external opening of the cervical canal?','External os','External os',['External os','Internal os','Vaginal fornix','Uterine gland'],'The external os opens toward the vagina.'),
]);

export const organSystemsStructures=[...respiratoryStructures,...digestiveStructures,...urinaryStructures,...maleReproductiveStructures,...femaleReproductiveStructures];
export const organSystemsLessons=[...respiratoryLessons,...digestiveLessons,...urinaryLessons,...maleReproductiveLessons,...femaleReproductiveLessons];
export const organSystemsQuestions=[...respiratoryQuestions,...digestiveQuestions,...urinaryQuestions,...maleReproductiveQuestions,...femaleReproductiveQuestions];
export const organSystemsModules=[respiratoryModule,digestiveModule,urinaryModule,maleReproductiveModule,femaleReproductiveModule];