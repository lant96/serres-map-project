# Serres Historical Spatial Exploration Platform

An interactive web platform for exploring the historical urban fabric of Serres, Greece — focusing on the Ottoman-era and early 20th-century built environment of the city centre.

🔗 **Live demo:** [serres-map-project.vercel.app](https://serres-map-project.vercel.app)

---

## Overview

The platform combines archival research, architectural reconstruction, and spatial data to create a layered exploration experience. Users can navigate through historical buildings, archival photographs, and scholarly publications, all anchored to their geographic and architectural context.

---

## Features

### Two view modes
- **Map view** — 2D interactive map (Mapbox GL JS) with building footprints reconstructed from historical sources and geolocated image/publication markers
- **3D view** — Three.js scene with architectural 3D models of reconstructed buildings, navigable with orbit controls

### Hotspot system
Each point of interest is a *hotspot* — a spatial node connecting a location on the map or a mesh in the 3D scene to one or more content entities:
- **Buildings** — reconstructed floor plans, descriptions, and related archival images
- **Images** — archival photographs with year, description, and associated buildings
- **Publications** — scholarly sources with year and external links

### Relational highlighting
Selecting a hotspot automatically highlights all spatially related hotspots — on both the map (polygon/marker opacity) and the 3D scene (emissive material glow). Hovering over related items in the detail panel highlights their counterparts on the map or in the scene in real time.

### Detail overlay
Clicking any hotspot opens a detail panel showing the full content of the selected entity, including image galleries (with lightbox), related building lists, and source links for publications.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| State management | Zustand |
| Map | Mapbox GL JS |
| 3D scene | Three.js via React Three Fiber |
| 3D model compression | Draco (GLTF) |
| Backend / CMS | NocoDB (hosted) |
| Deployment | Vercel |

---

## Data sources

Spatial data, archival images, and bibliographic records are managed in a NocoDB instance. The platform fetches content at runtime via the NocoDB API v3.

Content tables:
- **Hotspots** — spatial nodes linking locations to content entities
- **Buildings** — reconstructed building records with floor plans
- **Images** — archival photographs with metadata
- **Publications** — scholarly and archival sources

---

## Project structure

```
src/
├── app/                    # Root component and global styles
├── components/
│   ├── sidebar/            # Hotspot list, filter bar, detail overlay and cards
│   └── ui/                 # View toggle
├── services/               # NocoDB API client and entity services
├── state/                  # Zustand store and selectors
└── views/
    ├── MapView/            # Mapbox map, markers, building polygons
    └── SceneView/          # Three.js scene, models, lighting, controls

public/
├── data/                   # GeoJSON layers (building footprints, market outline)
├── models/                 # GLB 3D models
└── draco/                  # Draco decoder for compressed GLTF
```

---

## Environment variables

Create a `.env` file at the project root:

```
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_NOCODB_TOKEN=your_nocodb_api_token
VITE_NOCODB_URL=https://app.nocodb.com/api/v3/data/.../hotspots/records
VITE_NOCODB_BUILDINGS_URL=https://app.nocodb.com/api/v3/data/.../buildings/records
VITE_NOCODB_IMAGES_URL=https://app.nocodb.com/api/v3/data/.../images/records
VITE_NOCODB_PUBLICATIONS_URL=https://app.nocodb.com/api/v3/data/.../publications/records
```

---

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The output goes to `dist/`. Upload its contents to your hosting provider's public directory.

---

## Research context

This platform was developed as part of ongoing research into the historical urban landscape of Serres during the Ottoman and early post-Ottoman period. The reconstructed building footprints and 3D models are based on archival maps, photographs, and published scholarship.

---

## Status

Active development. Content is being progressively added to the NocoDB database as research continues.
