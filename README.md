# Serres Historical Spatial Exploration Platform

The Serres Historical Spatial Exploration Platform is an interactive web application for exploring the historical urban landscape of Serres, Greece, through geospatial visualisation, archival material, and three-dimensional reconstruction.

---

## Overview

This project combines historical research, spatial data, and interactive visualisation to reconstruct parts of the Ottoman and early twentieth-century urban fabric of Serres.

The platform integrates archival photographs, reconstructed building footprints, scholarly publications, and three-dimensional models into a unified exploration environment. Users can investigate historical locations through both an interactive map and a synchronised 3D scene.

Developed in collaboration with **F/8 Studio**, the project demonstrates how modern web technologies can support digital heritage research and public engagement with historical urban environments.

**Live Demo**

https://serres-map-project.vercel.app/

---

## Features

### Interactive Map

- Reconstructed historical building footprints
- Geolocated archival photographs
- Publication markers
- Interactive filtering and selection

### Three-Dimensional Exploration

- Reconstructed architectural models
- Orbit camera controls
- Synchronised interaction with the map view

### Relational Navigation

Each hotspot connects multiple types of historical information.

- Buildings
- Archival images
- Scholarly publications

Selecting an item automatically highlights all related entities across both visualisation modes.

### Detail Panel

Each hotspot provides:

- Historical descriptions
- Image galleries
- Related buildings
- Bibliographic references
- External publication links

---

## Project Structure

```
src/
├── app/
├── components/
├── services/
├── state/
└── views/
    ├── MapView/
    └── SceneView/

public/
├── data/
├── models/
└── draco/
```

---

## Tech Stack

- React
- Vite
- Mapbox GL JS
- Three.js
- React Three Fiber
- Zustand
- NocoDB
- Vercel

---

## Getting Started

```bash
npm install

npm run dev
```

---

## Research Context

The platform forms part of ongoing historical research conducted by **F/8 Studio** into the urban development of Serres during the Ottoman and early post-Ottoman period.

Historical reconstructions are based on archival maps, photographs, and published scholarship.

The project was presented at the **1st National Conference of Architects in Serres (2025)** under the title:

*Digital Reconstruction of Lost Urban Heritage – Serres, Greece.*

---

## Current Status

The platform is under active development, with historical content and reconstructed buildings being progressively expanded as research continues.

---

## Future Work

- Expand the reconstructed building collection.
- Improve spatial querying and filtering.
- Introduce temporal navigation between historical periods.
- Support additional archival collections.
- Extend the platform with richer historical storytelling tools.

---

## Rights

© 2026 F/8 Studio.

The source code, historical reconstructions, and original research content are the intellectual property of F/8 Studio.

Archival material remains the property of its respective rights holders and is included solely for research and documentation purposes.

---

## Author

Athanasia Lantouri

Applied Machine Learning | Human-Centered AI | Interactive Systems

GitHub: https://github.com/lant96
