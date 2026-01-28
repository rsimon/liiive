# liiive: Collaborative Annotation for IIIF Images

liiive is an open-source, web-based tool for **real-time collaborative annotation** of IIIF images.

Explore visual materials like artworks, manuscripts, maps, or historical documents together–live, in the browser–with shared cursors, synchronized annotations, and rich-text comments.

![Screenshot of the liiive annotation environment](/screenshot.jpg "Screenshot of the liiive annotation environment")

## 1. What is liiive?

liiive is a web-based tool that lets users explore and annotate digital images together, in real time. Built on the [IIIF (International Image Interoperability Framework)](https://iiiif.io) standard, it's designed for researchers, educators, students, and cultural heritage professionals working with high-resolution images.

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
  Create ad-hoc rooms for short-lived collaboration that get deleted automatically after a set time, or persistent spaces with permanent annotation storage.

- **Annotation export**  
  Download annotations in standard, IIIF-compatible format for reuse, archival, or further analysis.

- **Publishing via derivative manifests**  
  Permanent rooms publish a IIIF v3 manifest at a stable, live URL, allowing annotations to be viewed in external viewers like Theseus, Universal Viewer, or Mirador.

## 3. Non-Goals

liiive is not intended to be:
- A general-purpose IIIF viewer
- A digital asset management system
- A replacement for long-term annotation repositories

## 4. Try liiive

The easiest way to try liiive–no installation needed–is via the hosted service at [liiive.now](https://liiive.now).

1. Paste any URL to a IIIF Presentation or Image manifest in the search box
2. Hit the 'Go liiive' button
3. Share your unique room link with others
4. Collaborate instantly, even without a login

## 5. Self-Hosting

Coming soon!

## 6. Contributing

Contributions are welcome! Please use the [issue tracker](https://github.com/rsimon/liiive/issues) to discuss major changes or new features before submitting a pull request.

## 7. License

liiive is licensed under the terms of the [MIT License](LICENSE).
