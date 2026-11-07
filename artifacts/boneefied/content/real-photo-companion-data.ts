/** Inspected photographs of selected structures, NOT complete-comparison approvals. Metadata only. */
import type { PhotoReference } from './real-photo-references';

export const companions: Readonly<Record<string, readonly PhotoReference[]>> = {
  "asset-skeletal-atlas-vertebra-typical": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Thoracic_vertebrae.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Thoracic vertebrae.jpg",
        "es": "Espécimen anatómico humano; vista y alcance según la página fuente"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-atlas-axis": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Vertebra_-_atlas,_axis_(superior).jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry atlas and axis, superior views",
        "es": "Atlas y axis humanos secos, vistas superiores"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-thoracic-cage": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:VrParaPersp.gif",
      "mediaType": "diagnostic-imaging",
      "subject": {
        "en": "Thoracic cage on real CT; not a dry-bone photograph",
        "es": "Caja torácica en TC real; no es fotografía de huesos secos"
      },
      "sourceName": "Kieran Maher / Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-rib-detail": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:VrParaPersp.gif",
      "mediaType": "diagnostic-imaging",
      "subject": {
        "en": "Rib curvature on CT; fine head/tubercle/groove details unresolved",
        "es": "Curvatura costal en TC; sin detalle fino de cabeza, tubérculo o surco"
      },
      "sourceName": "Kieran Maher / Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-pectoral-girdle": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Anterior_surface_of_scapula.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Anterior (side unstated)",
        "es": "Anterior (lado no indicado)"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Scapula_-_posterior_view.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human scapula, posterior specimen; side not stated",
        "es": "Escápula humana, espécimen posterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/74761ef06360839b7e8bc0fcd7d84ef6/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human right shoulder, anterior joint dissection",
        "es": "Hombro humano derecho, disección articular anterior"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-forearm": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:AnteriorHumerusRadiusUlnaArticulated.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry articulated elbow bones, anterior view",
        "es": "Huesos humanos secos del codo articulados, vista anterior"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-hand-palmar": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Hand-bones.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human hand skeleton; side and palmar/dorsal view unstated",
        "es": "Esqueleto de mano humana; lado y vista palmar/dorsal no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-hip-bone": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Pelvis_-_os_coxae_(lateral_view)_2.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry hip bone, lateral view; side not stated",
        "es": "Hueso coxal humano seco, vista lateral; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-leg-tibia-fibula": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Tibia,_fibula_(anterior).jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry tibia and fibula, anterior view; side unstated",
        "es": "Tibia y fíbula humanas secas, vista anterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-synovial-joint": [
    {
      "url": "https://calisphere.org/item/e3ac55f2986d93e7a83b199d9254ad95/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human left elbow joint dissection",
        "es": "Disección de articulación del codo humano izquierdo"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-shoulder-joint": [
    {
      "url": "https://calisphere.org/item/74761ef06360839b7e8bc0fcd7d84ef6/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human right shoulder, anterior joint dissection",
        "es": "Hombro humano derecho, disección articular anterior"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-skeletal-atlas-knee-joint": [
    {
      "url": "https://calisphere.org/item/9a7013bf8ccee4934b4789248d2f16d7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human left knee, medial dissection",
        "es": "Rodilla humana izquierda, disección medial"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/33d419fe3c2fb6e5c76009d048df117c",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human popliteal-fossa dissection showing posterior cruciate ligament",
        "es": "Disección humana de fosa poplítea con ligamento cruzado posterior"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-body-cavities": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Opened abdominal cavity and organ relations; abdominal region only",
        "es": "Cavidad abdominal abierta y relaciones orgánicas; solo abdomen"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-abdominal-quadrants": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_Body.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Adult abdominal surface; quadrant boundaries are not marked",
        "es": "Superficie abdominal adulta; límites de cuadrantes sin marcar"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-abdominal-regions": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_Body.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Adult abdominal surface; nine-region grid is not marked",
        "es": "Superficie abdominal adulta; nueve regiones sin marcar"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-organ-locations": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Dissected abdominal organ positions; not a whole-body map",
        "es": "Posición de órganos abdominales disecados; no es un mapa corporal completo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Dissected abdominal organ positions; not a whole-body map",
        "es": "Posición de órganos abdominales disecados; no es un mapa corporal completo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=148-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Dissected abdominal organ positions; not a whole-body map",
        "es": "Posición de órganos abdominales disecados; no es un mapa corporal completo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-skeleton-anterior": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_skull_1.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human skull specimen, anterior aspect",
        "es": "Espécimen de cráneo humano, vista anterior"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Anterior_surface_of_scapula.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Anterior (side unstated)",
        "es": "Anterior (lado no indicado)"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Femur_-_anterior,_posterior.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "One human dry femur, anterior and posterior views; side unstated",
        "es": "Un fémur humano seco, vistas anterior y posterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Tibia,_fibula_(anterior).jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry tibia and fibula, anterior view; side unstated",
        "es": "Tibia y fíbula humanas secas, vista anterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Hand-bones.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human hand skeleton; side and palmar/dorsal view unstated",
        "es": "Esqueleto de mano humana; lado y vista palmar/dorsal no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Foot_bones_-_tarsus,_metatarsus_and_phalanges.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human foot bones, dorsal-compatible; side/plane unstated",
        "es": "Huesos del pie humano, compatible con vista dorsal; lado/plano no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-skeleton-posterior": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Scapula_-_posterior_view.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human scapula, posterior specimen; side not stated",
        "es": "Escápula humana, espécimen posterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Femur_-_anterior,_posterior.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "One human dry femur, anterior and posterior views; side unstated",
        "es": "Un fémur humano seco, vistas anterior y posterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-atlas-skeleton-axial-appendicular": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_skull_1.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human skull specimen, anterior aspect",
        "es": "Espécimen de cráneo humano, vista anterior"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Anterior_surface_of_scapula.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Anterior (side unstated)",
        "es": "Anterior (lado no indicado)"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Femur_-_anterior,_posterior.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "One human dry femur, anterior and posterior views; side unstated",
        "es": "Un fémur humano seco, vistas anterior y posterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Tibia,_fibula_(anterior).jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry tibia and fibula, anterior view; side unstated",
        "es": "Tibia y fíbula humanas secas, vista anterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Hand-bones.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human hand skeleton; side and palmar/dorsal view unstated",
        "es": "Esqueleto de mano humana; lado y vista palmar/dorsal no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Foot_bones_-_tarsus,_metatarsus_and_phalanges.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human foot bones, dorsal-compatible; side/plane unstated",
        "es": "Huesos del pie humano, compatible con vista dorsal; lado/plano no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skull-front": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_skull_1.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human skull specimen, anterior aspect",
        "es": "Espécimen de cráneo humano, vista anterior"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-skull-lateral": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:SkullSideView.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Photographed skull, oblique side view; fine landmarks limited",
        "es": "Cráneo fotografiado, vista lateral oblicua; detalle fino limitado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:X-ray_of_the_human_skull_(side_view).jpg",
      "mediaType": "diagnostic-imaging",
      "subject": {
        "en": "Human lateral skull X-ray; superimposed structures",
        "es": "Radiografía lateral de cráneo humano; estructuras superpuestas"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-vertebral-column": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Thoracic_vertebrae.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Individual thoracic vertebra; not the articulated lateral column",
        "es": "Vértebra torácica individual; no es la columna lateral articulada"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-cervical-vertebra": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Vertebra_-_cervicales.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry cervical vertebra, superior-compatible aspect",
        "es": "Vértebra cervical humana seca, aspecto compatible con vista superior"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Thoracic_vertebrae.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Thoracic vertebrae.jpg",
        "es": "Espécimen anatómico humano; vista y alcance según la página fuente"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-original-body-cavities": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Opened abdominal cavity; other body cavities are not shown",
        "es": "Cavidad abdominal abierta; no se muestran las otras cavidades"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-servier-elbow-joint": [
    {
      "url": "https://calisphere.org/item/e3ac55f2986d93e7a83b199d9254ad95/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human left elbow joint dissection",
        "es": "Disección de articulación del codo humano izquierdo"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-commons-axial-skeleton-blank": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_skull_1.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human skull specimen, anterior aspect",
        "es": "Espécimen de cráneo humano, vista anterior"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Cranium_-_inferior_view.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry skull, inferior surface; laterality not stated",
        "es": "Cráneo humano seco, vista inferior; lateralidad no indicada"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Cranium_-_basis_cranii_interna.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry cranial floor, superior/internal view",
        "es": "Base craneal humana seca, vista superior/interna"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Thoracic_vertebrae.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Thoracic vertebrae.jpg",
        "es": "Espécimen anatómico humano; vista y alcance según la página fuente"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-commons-appendicular-skeleton-blank": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Anterior_surface_of_scapula.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Anterior (side unstated)",
        "es": "Anterior (lado no indicado)"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Femur_-_anterior,_posterior.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "One human dry femur, anterior and posterior views; side unstated",
        "es": "Un fémur humano seco, vistas anterior y posterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Tibia,_fibula_(anterior).jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human dry tibia and fibula, anterior view; side unstated",
        "es": "Tibia y fíbula humanas secas, vista anterior; lado no indicado"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Hand-bones.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human hand skeleton; side and palmar/dorsal view unstated",
        "es": "Esqueleto de mano humana; lado y vista palmar/dorsal no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Foot_bones_-_tarsus,_metatarsus_and_phalanges.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human foot bones, dorsal-compatible; side/plane unstated",
        "es": "Huesos del pie humano, compatible con vista dorsal; lado/plano no indicados"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-muscular-atlas-deep-back": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=214-3",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Thoracic/lumbosacral posterior deep-back specimen",
        "es": "Muestra posterior profunda torácica/lumbosacra"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/3e11b4c30a17bf5d220dcd44f7bd273a/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Right posterior scapular dissection",
        "es": "Disección escapular posterior derecha"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-muscular-atlas-deep-thigh": [
    {
      "url": "https://calisphere.org/item/3150453dd97f9fd45f760e59c9a51b64",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Right anterior thigh; deep quadriceps exposure",
        "es": "Muslo anterior derecho; exposición profunda del cuádriceps"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-muscular-atlas-calf": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Medial_view_of_a_cadaver_dissection_of_the_gastrocnemius%E2%80%93soleus_junction.png",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Isolated medial gastrocnemius–soleus specimen",
        "es": "Muestra medial aislada de gastrocnemio y sóleo"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-muscular-atlas-foot": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=201-4",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Left plantar foot; deep nerve/muscle exposure",
        "es": "Pie plantar izquierdo; exposición profunda de nervios/músculos"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=202-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Left plantar foot close-up; deep adductor hallucis view",
        "es": "Primer plano plantar izquierdo; vista profunda del aductor del dedo gordo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-muscular-atlas-pelvic-floor": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=174-5",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Male perineum/pelvic diaphragm; inferior/perineal view",
        "es": "Periné masculino/diafragma pélvico; vista inferior/perineal"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-muscle-face-neck": [
    {
      "url": "https://calisphere.org/item/287e0f96d086919e57c58c9cb1cb8ab2",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Right anterolateral face dissection; specific muscles not all captioned",
        "es": "Disección anterolateral derecha de la cara; no todos los músculos se identifican"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/a7f4387ffed8c8052efd7972dba545ed",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Left lateral neck specimen",
        "es": "Muestra lateral del cuello izquierdo"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-muscle-anterior-trunk": [
    {
      "url": "https://calisphere.org/item/af7ea2e6aaca62aa241f1c57ffcaa39e",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Anterior thorax after right pectoral removal",
        "es": "Tórax anterior tras retirar pectoral derecho"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/5a68ccc28314a457fdfbcba4a1b09918",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Right anterior axilla dissection",
        "es": "Disección de la axila anterior derecha"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-muscle-posterior-back": [
    {
      "url": "https://med.libretexts.org/Bookshelves/Anatomy_and_Physiology/Human_Anatomy_(Lange_et_al.)/09:_Muscular_System/9.08:_Anatomical_Atlas_-_Muscular_System",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Posterior superficial back photo; letter markers undecoded",
        "es": "Foto posterior superficial de espalda; marcadores no descifrados"
      },
      "sourceName": "Medicine LibreTexts / BlueLink",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-muscle-posterior-leg": [
    {
      "url": "https://calisphere.org/item/ef4a33ce7a18d8229561390be729db99/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Left posterolateral thigh/gluteal specimen",
        "es": "Muestra posterolateral de muslo/glúteo izquierdo"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-muscle-labeled-overview": [
    {
      "url": "https://calisphere.org/item/3e11b4c30a17bf5d220dcd44f7bd273a/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Right posterior shoulder/back region; not whole-body overview",
        "es": "Región posterior derecha de hombro/espalda; no es vista corporal completa"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/ef4a33ce7a18d8229561390be729db99/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Left posterolateral thigh/gluteal region; not paired overview",
        "es": "Región posterolateral izquierda de muslo/glúteo; no es vista bilateral"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    },
    {
      "url": "https://calisphere.org/item/af7ea2e6aaca62aa241f1c57ffcaa39e",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Anterior thorax after pectoral removal; not superficial whole-body view",
        "es": "Tórax anterior tras retirar pectoral; no es vista corporal superficial completa"
      },
      "sourceName": "Calisphere / USC",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-diaphragm-labeled": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=130-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human diaphragm viewed from above, pleura removed",
        "es": "Diafragma humano visto desde arriba, pleura retirada"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=130-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human diaphragm viewed from below",
        "es": "Diafragma humano visto desde abajo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-gray880-optic-nerve-head": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Fundus_of_eye_normal.jpg",
      "mediaType": "diagnostic-imaging",
      "subject": {
        "en": "Human fundus photograph; side not established",
        "es": "Fotografía de fondo de ojo humano; lateralidad no establecida"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://www.intechopen.com/chapters/62850",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human fundus photograph; side not established",
        "es": "Fotografía de fondo de ojo humano; lateralidad no establecida"
      },
      "sourceName": "IntechOpen chapter (Optic Nerve)",
      "coverage": "selected-structures"
    }
  ],
  "asset-servier-brain-lateral": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_brain_lateral_view.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Intact lateral brain surface; insula is not exposed",
        "es": "Superficie lateral cerebral intacta; ínsula no expuesta"
      },
      "sourceName": "John A. Beal / Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-servier-eye-section": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Fundus_of_eye_normal.jpg",
      "mediaType": "diagnostic-imaging",
      "subject": {
        "en": "Human fundus photograph only; not a globe section",
        "es": "Solo fotografía de fondo de ojo humano; no es un corte del globo"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-servier-ear-section": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10153736",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human fetal organ of Corti; inner-ear microscopic region only",
        "es": "Órgano de Corti fetal humano; solo una región microscópica del oído interno"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-deep-nuclei": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Coronal_cross-section_of_human_brain.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human pathological coronal brain section; basal nuclei unlabelled",
        "es": "Corte coronal patológico de cerebro humano; núcleos basales sin identificar"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-csf-meninges": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_brain_right_dissected_lateral_view_description.JPG",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Dissected lateral ventricle; not all ventricles/meninges or CSF flow",
        "es": "Ventrículo lateral disecado; no muestra todos los ventrículos, meninges ni flujo del LCR"
      },
      "sourceName": "John A. Beal / Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-spinal-cross-section": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/nervensystem-anatomische-mikroskopie-52/spinal-cord-cervical-337",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human cord horns, canal, tracts and neurons; photos below viewer",
        "es": "Astas, canal, cordones y neuronas medulares humanos; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-plexus-overview": [
    {
      "url": "https://sites.google.com/a/umich.edu/bluelink/resources/bluelink/labeled-brachial-plexus-images",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Brachial plexus roots, trunks and cords",
        "es": "Raíces, troncos y fascículos del plexo braquial"
      },
      "sourceName": "Michigan BlueLink",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-lower-limb-nerves": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4630888/",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Right sciatic variants: Figures 1 and 3; femoral nerve not shown",
        "es": "Variantes ciáticas derechas: figuras 1 y 3; no muestra el nervio femoral"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-eye-anterior-segment": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4785705/",
      "mediaType": "diagnostic-imaging",
      "subject": {
        "en": "Human anterior-segment OCT: Figures 2 and 7; not every zonular fibre",
        "es": "OCT del segmento anterior humano: figuras 2 y 7; no todas las fibras zonulares"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-retina-layers": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11652816/",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human retinal layers: Figure 6 d-e ONLY; a-c are rabbit",
        "es": "Capas retinianas humanas: SOLO figura 6 d-e; a-c son de conejo"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    },
    {
      "url": "https://www.cellimagelibrary.org/images/11458",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human photoreceptor inner segment and mitochondria; TEM",
        "es": "Segmento interno y mitocondrias de un fotorreceptor humano; MET"
      },
      "sourceName": "Cell Image Library",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-inner-ear-vestibular": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10153736",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human fetal cochlear sensory surface; vestibular organs are not shown",
        "es": "Superficie sensorial coclear fetal humana; no muestra órganos vestibulares"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-cochlea-corti": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10153736",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human cochlear sensory-surface micrographs; not complete duct section",
        "es": "Micrografías humanas de superficie sensorial coclear; no es corte completo del conducto"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-smell-taste": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/verdauungsorgane-mundhohle-anatomische-mikroskopie-54/taste-bud-vallate-papilla-353",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human taste buds; olfactory epithelium/pathway not shown",
        "es": "Botones gustativos humanos; no muestra epitelio ni vía olfatoria"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-gray946-sweat-gland": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human sebaceous/eccrine glands and ducts; static photos below viewer",
        "es": "Glándulas sebáceas y ecrinas humanas; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-original-cell-overview": [
    {
      "url": "https://www.nanolive.com/mitosis-in-mesenchymal-stem-cells/",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human cultured cells/nuclei; grayscale microscope panels, not all organelles",
        "es": "Células humanas cultivadas y núcleos; paneles microscópicos grises, no todos los orgánulos"
      },
      "sourceName": "Nanolive",
      "coverage": "selected-structures"
    },
    {
      "url": "https://www.cellimagelibrary.org/images/11458",
      "mediaType": "micrograph",
      "subject": {
        "en": "Real human cellular mitochondria/cristae; specialized photoreceptor TEM",
        "es": "Mitocondrias y crestas celulares humanas reales; MET de fotorreceptor especializado"
      },
      "sourceName": "Cell Image Library",
      "coverage": "selected-structures"
    }
  ],
  "asset-original-mitosis-stages": [
    {
      "url": "https://www.nanolive.com/mitosis-in-mesenchymal-stem-cells/",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human mitosis; grayscale microscopy panels beside the drawings",
        "es": "Mitosis humana; paneles microscópicos grises junto a los dibujos"
      },
      "sourceName": "Nanolive",
      "coverage": "selected-structures"
    }
  ],
  "asset-openstax-historical-skin-structure": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human skin layers and appendages; static photos below viewer",
        "es": "Capas y anexos cutáneos humanos; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    },
    {
      "url": "https://www.digitalscope.org/ViewerUI/?SlideId=f957ef21-dae0-4732-b8a1-120fc1b3c7fd",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human thick skin and Pacinian corpuscle; complementary specimen",
        "es": "Piel gruesa humana y corpúsculo de Pacini; espécimen complementario"
      },
      "sourceName": "Duke Histology / DigitalScope",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-epidermis-strata": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/epithel-allgemeine-histologie-38/stratified-keratinized-squamous-epithelium-finger-skin-219",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human thick epidermis; not identification of every specialized cell",
        "es": "Epidermis gruesa humana; no identifica cada tipo celular especializado"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    },
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human thin-skin strata; static photos below viewer",
        "es": "Estratos de piel fina humana; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-dermis-hypodermis": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human dermal collagen/elastin and subcutaneous fat; photos below viewer",
        "es": "Colágeno y elastina dérmicos y grasa subcutánea humanos; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-hair-follicle": [
    {
      "url": "https://www.digitalscope.org/ViewerUI/?SlideId=a16ef7b4-afc1-496d-963b-b81bbcd15c86",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human scalp longitudinal follicles/bulbs; fine papilla details unresolved",
        "es": "Folículos y bulbos longitudinales de cuero cabelludo humano; papila sin resolver"
      },
      "sourceName": "Duke Histology / DigitalScope",
      "coverage": "selected-structures"
    },
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human follicular infundibulum and sebaceous gland; photos below viewer",
        "es": "Infundíbulo folicular y glándula sebácea humanos; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-epithelia-other-stratified": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human sweat ducts; not the complete three-epithelium comparison",
        "es": "Conductos sudoríparos humanos; no completa la comparación de tres epitelios"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-connective-loose": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human subcutaneous adipose/connective tissue; reticular comparison incomplete",
        "es": "Tejido adiposo y conjuntivo subcutáneo humano; comparación reticular incompleta"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-connective-dense": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/haut-und-anhangsorgane-anatomische-mikroskopie-49/nasal-skin-308",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human dermal collagen/elastic fibres; not all dense-tissue types",
        "es": "Colágeno y fibras elásticas dérmicas humanas; no todos los tejidos densos"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-cartilage": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/knorpel-allgemeine-histologie-41/elastic-cartilage-ear-239",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human elastic cartilage only; static photos below viewer",
        "es": "Solo cartílago elástico humano; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-nervous-tissue": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/nervensystem-anatomische-mikroskopie-52/spinal-cord-cervical-337",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human motor neurons and glia; not every glial subtype",
        "es": "Neuronas motoras y glía humanas; no cada subtipo glial"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis04-nail-section": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Fingernails.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "External human fingernails; not an internal longitudinal section",
        "es": "Uñas humanas externas; no es un corte longitudinal interno"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-blood-composition": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_peripheral_blood_smear,_May-Gr%C3%BCnwald_stain.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "human peripheral smear formed elements only",
        "es": "solo elementos formes de un frotis periférico humano"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:SEM_blood_cells.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "human blood SEM with erythrocytes, leukocytes and platelets; no plasma/serum separation",
        "es": "SEM de sangre humana con eritrocitos, leucocitos y plaquetas; no muestra separación de plasma/suero"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-marrow-hematopoiesis": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/cardiovascular-organs-anatomical-microscopy-50/bone-marrow-320",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human red-marrow cells; not every developmental stage",
        "es": "Células de médula roja humana; no cada etapa de desarrollo"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-vessel-wall-types": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/cardiovascular-organs-anatomical-microscopy-50/artery-and-vein-313",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human arterial/venous walls; static photos below viewer",
        "es": "Paredes arteriales y venosas humanas; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-vessel-flow-chain": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=117-2",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Real aortic arch and arterial branches; not the entire flow chain",
        "es": "Arco aórtico real y ramas arteriales; no toda la cadena circulatoria"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-capillary-types": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "human glomerular capillary beds; other capillary types not shown",
        "es": "lechos capilares glomerulares humanos; no muestra otros tipos capilares"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-alveolar-unit": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Alveolar_sac.JPG",
      "mediaType": "micrograph",
      "subject": {
        "en": "human alveolar sac/septa only; bronchiole and duct not shown",
        "es": "solo saco alveolar/septos humanos; sin bronquiolo ni conducto"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-respiratory-membrane-histology": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Alveolar_sac.JPG",
      "mediaType": "micrograph",
      "subject": {
        "en": "human alveolar air spaces and septa only; membrane ultrastructure not resolved",
        "es": "solo espacios aéreos y septos alveolares humanos; sin detalle ultraestructural de la membrana"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-lymph-node-structure": [
    {
      "url": "https://www.digitalscope.org/ViewerUI/?SlideId=9b7da464-8c07-44e9-85c6-4e4610cc394e",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human lymph-node biopsy, Masson; overview/5x fields",
        "es": "Biopsia de ganglio humano, Masson; vista general y campos a 5x"
      },
      "sourceName": "Duke Histology / DigitalScope",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-spleen-pulp": [
    {
      "url": "https://www.digitalscope.org/ViewerUI/?SlideId=80e46a8b-8b01-465f-94d6-d0fb13211b04",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human spleen red/white pulp; fine cord/sinusoid detail unresolved",
        "es": "Pulpa roja y blanca esplénica humana; cordones y sinusoides sin resolver"
      },
      "sourceName": "Duke Histology / DigitalScope",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-thymus-lobule": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/lymphatische-organe-anatomische-mikroskopie-51/thymus-child-328",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human child thymic lobules and Hassall corpuscles; photos below viewer",
        "es": "Lobulillos tímicos y corpúsculos de Hassall de un niño; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-tonsil-map-structure": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/lymphatische-organe-anatomische-mikroskopie-51/palatine-tonsil-330",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human palatine tonsil only; static photos below viewer",
        "es": "Solo amígdala palatina humana; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-gut-lymphoid-lacteal": [
    {
      "url": "https://www.digitalscope.org/ViewerUI/?SlideId=13457083-c943-4131-93c1-13770745e0fe",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human ileal villi and lymphoid tissue; overview, not resolved lacteal cells",
        "es": "Vellosidades y tejido linfoide ileales humanos; vista general sin detalle celular del vaso quilífero"
      },
      "sourceName": "Duke Histology / DigitalScope",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-endocrine-body-map": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_pancreatic_islet.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "human pancreatic islet only; red glucagon and blue insulin staining",
        "es": "solo islote pancreático humano; tinción roja de glucagón y azul de insulina"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-hypothalamus-pituitary-axis": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/endokrine-organe-anatomische-mikroskopie-45/pituitary-gland-267",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human pituitary portions/cells; not the complete hypothalamic pathways",
        "es": "Porciones y células hipofisarias humanas; no todas las vías hipotalámicas"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-thyroid-parathyroid": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/endokrine-organe-anatomische-mikroskopie-45/thyroid-gland-273",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human thyroid follicles and C cells; static photos below viewer",
        "es": "Folículos tiroideos y células C humanos; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    },
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/endokrine-organe-anatomische-mikroskopie-45/parathyroid-gland-268",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human parathyroid chief/oxyphilic cells; photos below viewer",
        "es": "Células principales y oxífilas paratiroideas humanas; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-adrenal-zones": [
    {
      "url": "https://www.digitalscope.org/ViewerUI/?SlideId=f28d5a55-ab2c-4156-bf96-a92e1d83b985",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human adrenal cortex/medulla; overview, not every cortical cell zone",
        "es": "Corteza y médula suprarrenales humanas; vista general, no cada zona celular"
      },
      "sourceName": "Duke Histology / DigitalScope",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-pancreas-islet": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_pancreatic_islet.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "human pancreatic islet only; red glucagon and blue insulin staining",
        "es": "solo islote pancreático humano; tinción roja de glucagón y azul de insulina"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-ovary-testis": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_ovary.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human ovary and follicular specimen; not a full cycle sequence",
        "es": "Ovario y espécimen folicular humanos; no toda la secuencia cíclica"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Graafian_Follicle,_Human_Ovary_(3595010317).jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human ovary and follicular specimen; not a full cycle sequence",
        "es": "Ovario y espécimen folicular humanos; no toda la secuencia cíclica"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/fortpflanzungsorgane-mannlich-anatomische-mikroskopie-47/testis-elderly-289",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human elderly/atrophic testis; not a healthy spermatogenic sequence",
        "es": "Testículo humano anciano y atrófico; no una secuencia espermatogénica sana"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-heart-wall-pericardium": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=118-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Pericardium and layers of the heart wall; human specimen example; limitation: Captioned plane is an interatrial cleavage view; not a full anterior heart or complete layer specimen. Photograph was not visible in screenshot viewport.",
        "es": "pericardio y capas de la pared cardíaca; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-conduction-system": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=118-2",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Conduction system of the heart; human specimen example; limitation: Does not show all tiny conduction elements as a grossly distinguishable separate route, and is not a superior four-valve view.",
        "es": "sistema de conducción cardíaca; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-body-artery-vein-maps": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=117-2",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Major arteries and major veins of the body; human specimen example; limitation: Only the aortic arch/upper thoracic branches; no full body map, peripheral limbs or venous return.",
        "es": "arterias y venas principales; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=192-4",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Major arteries and major veins of the body; human specimen example; limitation: Local recurrent branch; no full femoral-popliteal-tibial route.",
        "es": "arterias y venas principales; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=186-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Major arteries and major veins of the body; human specimen example; limitation: Branch-focused thigh view; not the complete lower limb arterial path.",
        "es": "arterias y venas principales; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=76-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Major arteries and major veins of the body; human specimen example; limitation: Only the neck/upper thorax and right lymphatic duct are shown; not the full body-wide lymphatic or venous route.",
        "es": "arterias y venas principales; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-head-neck-vessels": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=117-2",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Carotid arteries and jugular veins of the head and neck; human specimen example; limitation: Only the aortic arch/upper thoracic branches; no full body map, peripheral limbs or venous return.",
        "es": "vasos de cabeza y cuello; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=76-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Carotid arteries and jugular veins of the head and neck; human specimen example; limitation: Only the neck/upper thorax and right lymphatic duct are shown; not the full body-wide lymphatic or venous route.",
        "es": "vasos de cabeza y cuello; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-upper-limb-arteries": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=117-2",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Arterial route to the arm and hand; human specimen example; limitation: Only the aortic arch/upper thoracic branches; no full body map, peripheral limbs or venous return.",
        "es": "arterias del brazo y la mano; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=76-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Arterial route to the arm and hand; human specimen example; limitation: Only the neck/upper thorax and right lymphatic duct are shown; not the full body-wide lymphatic or venous route.",
        "es": "arterias del brazo y la mano; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-upper-limb-veins": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=76-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Venous return from the arm and the median cubital vein; human specimen example; limitation: Only the neck/upper thorax and right lymphatic duct are shown; not the full body-wide lymphatic or venous route.",
        "es": "venas del brazo; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-lower-limb-arteries": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=192-4",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Arterial route to the leg and foot; human specimen example; limitation: Local recurrent branch; no full femoral-popliteal-tibial route.",
        "es": "arterias de la pierna y el pie; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=196-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Arterial route to the leg and foot; human specimen example; limitation: The page does not identify the great saphenous vein or its proximal course.",
        "es": "arterias de la pierna y el pie; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=186-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Arterial route to the leg and foot; human specimen example; limitation: Branch-focused thigh view; not the complete lower limb arterial path.",
        "es": "arterias de la pierna y el pie; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-great-saphenous-route": [
    {
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12317783",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Great saphenous vein: foot to groin; human specimen example; limitation: The isolated vein view does not show surrounding limb anatomy or femoral artery/vein relations; proximal context is provided separately by Bassett image 185-4.",
        "es": "vena safena mayor; ejemplo humano limitado: ejemplo regional; no verifica todo el trayecto pie-ingle"
      },
      "sourceName": "PubMed Central",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=185-4",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Great saphenous vein: foot to groin; human specimen example; limitation: Shows the proximal superficial thigh only, not the full ankle-to-groin course or deep femoral vessel relations.",
        "es": "vena safena mayor; ejemplo humano limitado: ejemplo regional; no verifica todo el trayecto pie-ingle"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-hepatic-portal-system": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=148-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Hepatic portal system; human specimen example; limitation: Arterial/nerve dissection, not portal venous return or kidney hilum.",
        "es": "sistema porta hepático; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-upper-airway": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=72-3",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human right nasal wall, nasopharynx and palate; photograph beside drawing",
        "es": "Pared nasal derecha, nasofaringe y paladar humanos; fotografía junto al dibujo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-larynx-glottis": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_larynx_cut_section_2.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Larynx and glottis; human specimen example; limitation: One labeled cut section; does not show vocal folds/glottis in the assigned view or the complete relation to the whole upper airway.",
        "es": "laringe y glotis; ejemplo humano limitado: corte de laringe; no muestra la vista de glotis/pliegues vocales"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-trachea-bronchial-tree": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=123-5",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Trachea, bronchi and bronchioles; human specimen example; limitation: A single in-situ view cannot substitute for distinct lobar, pleural, diaphragm, mucosal or section views; the photograph itself was not visible in screenshot viewport.",
        "es": "tráquea, bronquios y bronquiolos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-pleura-diaphragm": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=130-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Pleura and diaphragm; human specimen example; limitation: One dissection aspect; does not show both pleural layers or movement through breathing.",
        "es": "pleura y diafragma; ejemplo humano limitado: muestra el diafragma, no las capas pleurales"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis05-lymph-overview": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=144-4",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Lymphatic drainage routes and node groups; human specimen example; limitation: Regional sigmoid-colon view only; not a whole-body lymph route or anal sphincter view.",
        "es": "drenaje linfático y grupos ganglionares; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=76-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Lymphatic drainage routes and node groups; human specimen example; limitation: Only the neck/upper thorax and right lymphatic duct are shown; not the full body-wide lymphatic or venous route.",
        "es": "drenaje linfático y grupos ganglionares; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-oral-cavity": [
    {
      "url": "https://peir.path.uab.edu/library/picture.php?/30672/categories",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human parotid/head dissection; not the entire oral/pharyngeal map",
        "es": "Disección humana de parótida y cabeza; no es todo el mapa oral y faríngeo"
      },
      "sourceName": "UAB PEIR",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=72-3",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human nasopharynx/palate; palatine tonsil resected",
        "es": "Nasofaringe y paladar humanos; amígdala palatina resecada"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-stomach": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Part_of_a_human_stomach_dissected_by_Edward_Jenner,_England,_Wellcome_L0057749.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Flattened human stomach preparation with injected vessels; not an intact opened stomach",
        "es": "Preparación gástrica humana aplanada con vasos inyectados; no es un estómago intacto y abierto"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=142-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Stomach: regions, rugae and gastric glands; human specimen example; limitation: Vessel-focused close-up rather than a complete opened stomach or gastric mucosal histology view.",
        "es": "estómago: regiones, pliegues y glándulas; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Normal_gastric_mucosa_low_mag.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "Stomach: regions, rugae and gastric glands; human micrograph example; limitation: Mucosal field only; not a complete stomach or all named cell types.",
        "es": "estómago: regiones, pliegues y glándulas; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=142-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Human stomach, opened anteriorly with rugae and pyloric region; no microscopic cell detail",
        "es": "Estómago humano abierto por delante, con rugas y región pilórica; sin detalle celular microscópico"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-alimentary-canal": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Alimentary canal: mouth to anus; human specimen example; limitation: Does not show all mesenteric attachments or whole-body organ placement.",
        "es": "tubo digestivo; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Alimentary canal: mouth to anus; human specimen example; limitation: Only portions of the alimentary canal, not mouth-to-anus continuity or anal canal.",
        "es": "tubo digestivo; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-5",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Alimentary canal: mouth to anus; human specimen example; limitation: No anal-canal sphincter section; does not represent the entire large intestine alone.",
        "es": "tubo digestivo; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-liver-biliary-pancreas": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=146-6",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Liver, gallbladder, pancreas and their ducts; human specimen example; limitation: Duct-focused specimen, not a complete liver, pancreas or microscopic acinus view.",
        "es": "hígado, vesícula, páncreas y conductos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Liver, gallbladder, pancreas and their ducts; human specimen example; limitation: Does not show all mesenteric attachments or whole-body organ placement.",
        "es": "hígado, vesícula, páncreas y conductos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=148-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Liver, gallbladder, pancreas and their ducts; human specimen example; limitation: Arterial/nerve dissection, not portal venous return or kidney hilum.",
        "es": "hígado, vesícula, páncreas y conductos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-liver-lobule-pancreas": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/drusen-allgemeine-histologie-40/pancreas-exocrine-portion-228",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human pancreatic acini and ducts; static photos below viewer",
        "es": "Acinos y conductos pancreáticos humanos; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    },
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/drusen-allgemeine-histologie-40/pancreas-endocrine-portion-229",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human pancreatic islets and alpha/beta cells; photos below viewer",
        "es": "Islotes pancreáticos humanos y células alfa y beta; fotos bajo el visor"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-digestive-wall-layers": [
    {
      "url": "https://wellcomecollection.org/works/tjxuhj2w",
      "mediaType": "micrograph",
      "subject": {
        "en": "Layers of the digestive wall; human micrograph example; limitation: Does not show the complete gut wall or all named epithelial/crypt cell types.",
        "es": "capas de la pared digestiva; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Wellcome Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Normal_gastric_mucosa_low_mag.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "Layers of the digestive wall; human micrograph example; limitation: Mucosal field only; not a complete stomach or all named cell types.",
        "es": "capas de la pared digestiva; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-small-intestine": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Small intestine: regions and mucosa; human specimen example; limitation: Only portions of the alimentary canal, not mouth-to-anus continuity or anal canal.",
        "es": "intestino delgado; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://wellcomecollection.org/works/tjxuhj2w",
      "mediaType": "micrograph",
      "subject": {
        "en": "Small intestine: regions and mucosa; human micrograph example; limitation: Does not show the complete gut wall or all named epithelial/crypt cell types.",
        "es": "intestino delgado; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Wellcome Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-large-intestine": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Large intestine and anal canal; human specimen example; limitation: Only portions of the alimentary canal, not mouth-to-anus continuity or anal canal.",
        "es": "intestino grueso y canal anal; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=144-4",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Large intestine and anal canal; human specimen example; limitation: Regional sigmoid-colon view only; not a whole-body lymph route or anal sphincter view.",
        "es": "intestino grueso y canal anal; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-5",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Large intestine and anal canal; human specimen example; limitation: No anal-canal sphincter section; does not represent the entire large intestine alone.",
        "es": "intestino grueso y canal anal; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-peritoneal-folds": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Peritoneal folds: mesentery and omenta; human specimen example; limitation: Does not show all mesenteric attachments or whole-body organ placement.",
        "es": "pliegues peritoneales: mesenterio y epiplones; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-urinary-tract": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=161-3",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Urinary tract and the opened bladder; human specimen example; limitation: Median section/lateral approach does not cover every anterior pelvic detail, ligament, follicular feature, or microscopic wall layer; photograph itself was not visible in screenshot viewport.",
        "es": "vías urinarias y vejiga abierta; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=169-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Urinary tract and the opened bladder; human specimen example; limitation: Lateral pelvic close-up does not establish the testis, epididymis, full duct course or penile cross-section; photograph itself was not visible in screenshot viewport.",
        "es": "vías urinarias y vejiga abierta; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=149-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Urinary tract and the opened bladder; human specimen example; limitation: Not a microscopic nephron/corpuscle view; does not show every segment or renal vascular branch.",
        "es": "vías urinarias y vejiga abierta; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-renal-vessels": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=149-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Renal blood vessels, hilum to nephron and back; human specimen example; limitation: Not a microscopic nephron/corpuscle view; does not show every segment or renal vascular branch.",
        "es": "vasos renales; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-nephron-pathway": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human renal corpuscle/tubules; not the complete nephron/collecting route",
        "es": "Corpúsculo y túbulos renales humanos; no toda la vía nefrónica y colectora"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-renal-corpuscle": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "human kidney cortex photomicrograph",
        "es": "fotomicrografía de corteza renal humana"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-male-system": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=169-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Male reproductive tract, glands and penis; human specimen example; limitation: Lateral pelvic close-up does not establish the testis, epididymis, full duct course or penile cross-section; photograph itself was not visible in screenshot viewport.",
        "es": "aparato reproductor masculino; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-testis-ducts": [
    {
      "url": "https://tales.nmc.unibas.ch/en/histology-12/fortpflanzungsorgane-mannlich-anatomische-mikroskopie-47/testis-elderly-289",
      "mediaType": "micrograph",
      "subject": {
        "en": "Human elderly seminiferous tubules/Leydig cells; epididymal route not shown",
        "es": "Túbulos seminíferos y células de Leydig de un anciano; no muestra la vía epididimaria"
      },
      "sourceName": "University of Basel",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-female-gross": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=161-3",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Female internal organs: ovary, tube, uterus and vagina; human specimen example; limitation: Median section/lateral approach does not cover every anterior pelvic detail, ligament, follicular feature, or microscopic wall layer; photograph itself was not visible in screenshot viewpo",
        "es": "órganos reproductores femeninos; ejemplo humano limitado: vistas y órganos no cubiertos por completo"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_ovary.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Female internal organs: ovary, tube, uterus and vagina; human specimen example; limitation: Shows postovulatory structures, not a full range of follicle stages or wall histology.",
        "es": "órganos reproductores femeninos; ejemplo humano limitado: vistas y órganos no cubiertos por completo"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-ovary-follicle": [
    {
      "url": "https://commons.wikimedia.org/wiki/File:Human_ovary.jpg",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Ovary: follicle stages and follicle wall; human specimen example; limitation: Shows postovulatory structures, not a full range of follicle stages or wall histology.",
        "es": "ovario y folículos; ejemplo humano limitado: falta la cobertura completa de etapas foliculares"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Graafian_Follicle,_Human_Ovary_(3595010317).jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "Ovary: follicle stages and follicle wall; human micrograph example; limitation: Does not show the full maturation sequence or all structures of the illustrated follicle wall.",
        "es": "ovario y folículos; ejemplo humano limitado: falta la cobertura completa de etapas foliculares"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-uterine-wall": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=161-3",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Uterine wall and endometrium; human specimen example; limitation: Median section/lateral approach does not cover every anterior pelvic detail, ligament, follicular feature, or microscopic wall layer; photograph itself was not visible in screenshot viewport.",
        "es": "pared uterina y endometrio; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://commons.wikimedia.org/wiki/File:Histology_of_normal_simple_columnar_epithelium_of_the_endometrium.jpg",
      "mediaType": "micrograph",
      "subject": {
        "en": "Uterine wall and endometrium; human micrograph example; limitation: Does not show the full uterine wall, endometrial layers, myometrium or both cycle states.",
        "es": "pared uterina y endometrio; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Wikimedia Commons",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-abdominal-placement": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=139-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Abdominal placement of the digestive organs; human specimen example; limitation: Does not show all mesenteric attachments or whole-body organ placement.",
        "es": "ubicación abdominal de los órganos digestivos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=143-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Abdominal placement of the digestive organs; human specimen example; limitation: Only portions of the alimentary canal, not mouth-to-anus continuity or anal canal.",
        "es": "ubicación abdominal de los órganos digestivos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    },
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=148-1",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Abdominal placement of the digestive organs; human specimen example; limitation: Arterial/nerve dissection, not portal venous return or kidney hilum.",
        "es": "ubicación abdominal de los órganos digestivos; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ],
  "asset-bvis06-kidney-placement": [
    {
      "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=149-7",
      "mediaType": "gross-photo",
      "subject": {
        "en": "Kidney placement in the abdomen; human specimen example; limitation: Not a microscopic nephron/corpuscle view; does not show every segment or renal vascular branch.",
        "es": "ubicación abdominal de los riñones; ejemplo humano limitado: ejemplo limitado; no cubre todas las vistas o estructuras de la lámina"
      },
      "sourceName": "Stanford Bassett Collection",
      "coverage": "selected-structures"
    }
  ]
};
