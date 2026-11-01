# Curated Image Gallery

A responsive image gallery built with HTML, CSS, and vanilla JavaScript. Browse a collection of photographs, filter them by category, open images in a lightbox, and download the full-size image.

## Features

- Responsive CSS Grid layout for desktop, tablet, and mobile screens.
- 18 gallery images organized into Nature, City, and Abstract categories.
- Category filters with an empty-state message and live image count.
- Lazy-loaded thumbnail images.
- Lightbox viewer with previous/next controls, image caption, and download button.
- Keyboard controls in the lightbox: **Left/Right Arrow** to navigate and **Escape** to close.
- Click the area outside the lightbox image to close it.
- Download progress and error messages announced to assistive technology.
- Reduced-motion support and visible keyboard focus styles.
- No build step, framework, or package installation required.

## Run locally

The images are served by [Picsum Photos](https://picsum.photos), so an internet connection is needed to load them. For the most reliable image downloads, open the project using a local web server rather than directly as a `file://` URL.

### VS Code Live Server

1. Open the `task1-image-gallery` folder in VS Code.
2. Install or enable the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.

Alternatively, run any static HTTP server from the project directory and open the local address it provides.

## Project structure

```text
task1-image-gallery/
├── assets/       # Optional local image assets
├── css/
│   └── style.css # Layout, theme, responsive styles, and animations
├── js/
│   └── app.js    # Image data, rendering, filters, lightbox, and downloads
├── index.html    # Gallery and lightbox markup
└── README.md
```

## Using the gallery

- Select **All**, **Nature**, **City**, or **Abstract** to filter the collection.
- Select a thumbnail to open the lightbox.
- Use the circular arrows or keyboard arrow keys to move through the currently visible images.
- Select **Download** on a thumbnail or in the lightbox to save its full-size image.
- Press **Escape** or select the close button to dismiss the lightbox.

## Customize the collection

Edit the `IMAGES` array near the top of `js/app.js`. Each entry has this shape:

```js
{
  id: 1,
  src: 'https://example.com/full-size-image.jpg',
  thumb: 'https://example.com/thumbnail.jpg',
  title: 'Image title',
  category: 'nature'
}
```

Use `nature`, `city`, or `abstract` as the category to match the supplied filters. Keep `src` and `thumb` as valid image URLs. If you add another category, add a corresponding filter button to `index.html`.

The thumbnail URL is used in the grid, while `src` is used by the lightbox and download feature. Downloading remote images uses `fetch`, so the image host must allow cross-origin requests (CORS). Otherwise, the gallery displays a download error; use a local image or a host that permits the request.

## Technologies

- HTML5
- CSS3 (Grid, custom properties, media queries, and animations)
- Vanilla JavaScript (DOM APIs, Fetch, and Blob URLs)
- Picsum Photos for the sample image collection