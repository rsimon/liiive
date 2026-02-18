# liiive: Collaborative Annotation for IIIF Images

liiive is an open-source, web-based tool for **real-time collaborative annotation** of IIIF images.

Explore visual materials like artworks, manuscripts, maps, or historical documents together–live, in the browser–with shared cursors, synchronized annotations, and rich-text comments.

![Screenshot of the liiive annotation environment](/screenshot.jpg "Screenshot of the liiive annotation environment")

## Contents

1. [What is liiive?](#1-what-is-liiive)
2. [Key Features](#2-key-features)
3. [Try liiive](#3-try-liiive) - **no installation needed**
4. [Non-Goals](#4-non-goals)
5. [Open Source vs. liiive.now](#5-open-source-version-vs-liiivenow)
6. [Architecture](#6-architecture)
7. [Self-Hosting](#7-self-hosting) - **on your own server**
   - [Prerequisites](#71-prerequisites)
   - [Development Deployment](#72-development-deployment)
   - [Production Deployment](#73-production-deployment)
8. [Managed Hosting](#8-managed-hosting) - **no server required**
9. [Contributing](#9-contributing)
10. [License](#10-license)
11. [Supporters](#11-supporters)

## 1. What is liiive?

liiive is a browser-based collaboration tool for exploring and annotate digital images together, in real time. Built on the [IIIF (International Image Interoperability Framework)](https://iiif.io) standard, it's designed for researchers, educators, students, and cultural heritage professionals working with high-resolution images.

## 2. Key Features

- **Real-time collaborative annotation**  
  Multiple users can view and annotate IIIF images simultaneously, with low-latency synchronization.

- **Live presence and awareness**  
  See other users' cursors in real time, and view collaborator activity directly in the navigation thumbnail strip.

- **Annotation tools**  
  Create region-based annotations using rectangle, polygon, circle/ellipse, and path drawing tools.

- **Smart scissors drawing tool**  
  A Photoshop-style "magnetic lasso" that snaps to object edges as you move your cursor, making it easy to outline complex shapes with minimal clicks.

- **Permanent and temporary collaboration spaces**  
  Create ad-hoc rooms for short-lived sessions that are deleted automatically after a set time, or persistent spaces with permanent annotation storage.

- **Annotation export**  
  Download annotations in standard, IIIF-compatible format for reuse, archival, or further analysis.

- **Publishing via derivative manifests**  
  Permanent rooms publish a IIIF v3 manifest at a stable, live URL, making annotations viewable in external viewers like Theseus, Universal Viewer, or Mirador.

## 3. Try liiive

The easiest way to try liiive–no installation needed–is via the hosted service at [liiive.now](https://liiive.now).

1. Paste any URL to a IIIF Presentation or Image manifest in the search box
2. Hit the 'Go liiive' button
3. Share your unique room link with others
4. Collaborate instantly, even without a login

## 4. Non-Goals

liiive is not intended to be:
- A general-purpose IIIF viewer
- A digital asset management system
- A replacement for long-term annotation repositories

## 5. Open Source version vs liiive.now

This repository contains the full-featured, self-hostable open-source core of liiive. This is the same codebase that powers [liiive.now](https://liiive.now), a hosted service with managed infrastructure, unlimited free basic accounts, and an optional paid plan for additional storage

To deploy liiive on your own infrastructure, see [Self-Hosting](#7-self-hosting). For a dedicated, privately hosted instance without the need to manage servers yourself, see [Managed Hosting](#8-managed-hosting).

## 6. Architecture

liiive consists of:
- A web frontend built with [Astro](https://astro.build/) and [React](https://react.dev/)
- Real-time collaborative synchronization using [Yjs](https://yjs.dev/) and [Hocuspocus](https://github.com/ueberdosis/hocuspocus)
- Backend services (database, storage, authentication) powered by [Supabase](https://supabase.com/)
- Supabase Studio backend admin environment (optional)
- Docker-based infrastructure for fully self-hosted deployment

## 7. Self-Hosting

liiive can be self-hosted in two modes: as a local development setup intended for frontend development, and a fully containerized production deployment for institutional or public use.

### 7.1 Prerequisites

To deploy liiive, ensure you have the following installed:

- Docker 24.0+ and Docker Compose 2.x
- Node.js 20+ and npm (for development deployment only)

### 7.2 Development Deployment

The development setup is intended for developers working on the liiive client, with hot reloading and local backend.

In development mode, the Supabase backend and admin UI ("Supabase Studio") as well as the liiive WebSocket server (Yjs/Hocuspocus) run in Docker and are exposed on different localhost ports.

The full deployment guide is available here: [development deployment](guides/dev-deployment.md)

### 7.3 Production Deployment

The production deployment is a fully containerized setup for a Linux/Docker host, with all service components: 

- Supabase backend (database, auth, storage)
- Supabase Studio (backend admin UI, optional)
- liiive WebSocket server
- liiive client application
- Traefik reverse proxy

**Requirements:**

- Your own Linux production server
- Your own registered domain name
- Multiple subdomains, for example:
  - `app.example.org` – frontend
  - `ws.example.org` – WebSocket server
  - `api.example.org` – backend API
  - `studio.example.org` – Supabase Studio admin UI (optional)

The full deployment guide is available here: [production deployment](guides/prod-deployment.md)

## 8. Managed Hosting

If your institution or project doesn't have in-house IT support or server infrastructure, managed hosting provides a dedicated, privately hosted liiive instance – optionally with custom branding or domain – without the overhead of setup and server management.

Managed hosting includes:

- Deployment and server management
- Updates and ongoing maintenance
- Priority technical support

For pricing details or to discuss project requirements, please contact [hello@rainersimon.io](mailto:hello@rainersimon.io). Your subscription also directly supports the continued maintenance and development of liiive as an open-source project.

## 9. Contributing

Contributions are welcome! Please use the [issue tracker](https://github.com/rsimon/liiive/issues) to discuss major changes or new features before submitting a pull request.

## 10. License

liiive is licensed under the terms of the [MIT License](LICENSE).

For convenience, this repository includes Docker configuration for the Supabase backend. Supabase is licensed under the [Apache 2 License](supabase/docker/LICENSE).

## 11. Supporters

Thanks to the following supporters for funding parts of this work:

- [Department of Digital Humanities](https://digital-humanities.uni-graz.at/), University of Graz, Project [DHInfra.at](https://dhinfra.at), funded through programme [(Digitale) Forschungsinfrastruktur](https://www.bmfwf.gv.at/wissenschaft/hochschulgovernance/steuerungsinstrumente/ausschreibung-digi.html)