/* ============================================================
   Image Gallery — Logic
   - Renders gallery from IMAGES data
   - Category filtering
   - Lightbox with prev/next, keyboard nav, click-outside close
   - Downloads full-size images
   ============================================================ */

'use strict';

/* -------- Data source (swap URLs for local /assets images) -------- */
const IMAGES = [
  { id: 1, src: 'https://picsum.photos/id/1015/1200/800', thumb: 'https://picsum.photos/id/1015/400/300', title: 'Mountain Lake', category: 'nature' },
  { id: 2, src: 'https://picsum.photos/id/1016/1200/800', thumb: 'https://picsum.photos/id/1016/400/300', title: 'Forest Trail', category: 'nature' },
  { id: 3, src: 'https://picsum.photos/id/1040/1200/800', thumb: 'https://picsum.photos/id/1040/400/300', title: 'City Skyline', category: 'city' },
  { id: 4, src: 'https://picsum.photos/id/1067/1200/800', thumb: 'https://picsum.photos/id/1067/400/300', title: 'Urban Alley', category: 'city' },
  { id: 5, src: 'https://picsum.photos/id/1080/1200/800', thumb: 'https://picsum.photos/id/1080/400/300', title: 'Color Splash', category: 'abstract' },
  { id: 6, src: 'https://picsum.photos/id/106/1200/800', thumb: 'https://picsum.photos/id/106/400/300', title: 'Neon Lights', category: 'abstract' },
  { id: 7, src: 'https://picsum.photos/id/1018/1200/800', thumb: 'https://picsum.photos/id/1018/400/300', title: 'Valley View', category: 'nature' },
  { id: 8, src: 'https://picsum.photos/id/1076/1200/800', thumb: 'https://picsum.photos/id/1076/400/300', title: 'Night Street', category: 'city' },
  { id: 9, src: 'https://picsum.photos/id/1020/1200/800', thumb: 'https://picsum.photos/id/1020/400/300', title: 'Alpine Morning', category: 'nature' },
  { id: 10, src: 'https://picsum.photos/id/1021/1200/800', thumb: 'https://picsum.photos/id/1021/400/300', title: 'Open Road', category: 'nature' },
  { id: 11, src: 'https://picsum.photos/id/1024/1200/800', thumb: 'https://picsum.photos/id/1024/400/300', title: 'Quiet Companion', category: 'nature' },
  { id: 12, src: 'https://picsum.photos/id/1025/1200/800', thumb: 'https://picsum.photos/id/1025/400/300', title: 'Wild at Heart', category: 'nature' },
  { id: 13, src: 'https://picsum.photos/id/1031/1200/800', thumb: 'https://picsum.photos/id/1031/400/300', title: 'Coastal Light', category: 'nature' },
  { id: 14, src: 'https://picsum.photos/id/1033/1200/800', thumb: 'https://picsum.photos/id/1033/400/300', title: 'After the Rain', category: 'city' },
  { id: 15, src: 'https://picsum.photos/id/1035/1200/800', thumb: 'https://picsum.photos/id/1035/400/300', title: 'Rolling Green', category: 'nature' },
  { id: 16, src: 'https://picsum.photos/id/1036/1200/800', thumb: 'https://picsum.photos/id/1036/400/300', title: 'The Long Way', category: 'nature' },
  { id: 17, src: 'https://picsum.photos/id/1037/1200/800', thumb: 'https://picsum.photos/id/1037/400/300', title: 'Soft Geometry', category: 'abstract' },
  { id: 18, src: 'https://picsum.photos/id/1043/1200/800', thumb: 'https://picsum.photos/id/1043/400/300', title: 'City in Motion', category: 'city' },
];

/* -------- DOM refs -------- */
const galleryEl = document.getElementById('gallery');
const emptyStateEl = document.getElementById('emptyState');
const galleryCountEl = document.getElementById('galleryCount');
const downloadStatusEl = document.getElementById('downloadStatus');
const filterBtns = document.querySelectorAll('.filter-btn');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxDownload = document.getElementById('lightboxDownload');

/* -------- State -------- */
let activeFilter = 'all';
let visibleImages = [];
let currentIndex = 0;

/* -------- Render -------- */
function renderGallery() {
  galleryEl.replaceChildren();

  visibleImages = IMAGES.filter(
    (img) => activeFilter === 'all' || img.category === activeFilter
  );

  emptyStateEl.hidden = visibleImages.length > 0;
  galleryCountEl.textContent = `${visibleImages.length} photographs`;

  visibleImages.forEach((img, index) => {
    const item = document.createElement('figure');
    item.className = 'gallery-item';

    const image = document.createElement('img');
    image.src = img.thumb;
    image.alt = img.title;
    image.loading = 'lazy';

    const caption = document.createElement('figcaption');
    caption.className = 'overlay';

    const title = document.createElement('span');
    title.className = 'image-title';
    title.textContent = img.title;

    const downloadButton = document.createElement('button');
    downloadButton.className = 'download-btn';
    downloadButton.type = 'button';
    downloadButton.setAttribute('aria-label', `Download ${img.title}`);
    downloadButton.innerHTML = '<span aria-hidden="true">↓</span> Download';
    downloadButton.addEventListener('click', (event) => {
      event.stopPropagation();
      downloadImage(img, downloadButton);
    });

    caption.append(title, downloadButton);
    item.append(image, caption);
    item.addEventListener('click', () => openLightbox(index));
    galleryEl.appendChild(item);
  });
}

/* -------- Downloads -------- */
async function downloadImage(img, button) {
  button.disabled = true;
  downloadStatusEl.textContent = `Preparing “${img.title}”…`;

  try {
    const response = await fetch(img.src);
    if (!response.ok) {
      throw new Error(`Image server returned ${response.status}`);
    }

    const imageBlob = await response.blob();
    const downloadUrl = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${img.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    downloadStatusEl.textContent = `“${img.title}” downloaded.`;
  } catch (error) {
    console.error('Image download failed:', error);
    downloadStatusEl.textContent = `Could not download “${img.title}”. Please try again.`;
  } finally {
    button.disabled = false;
  }
}

/* -------- Lightbox -------- */
function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img = visibleImages[currentIndex];
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.title;
  lightboxCap.textContent = `${img.title}  •  ${currentIndex + 1} / ${visibleImages.length}`;
  lightboxDownload.setAttribute('aria-label', `Download ${img.title}`);
}

function showNext() {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  updateLightbox();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  updateLightbox();
}

/* -------- Events -------- */
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((filterBtn) => {
      filterBtn.classList.remove('active');
      filterBtn.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    activeFilter = btn.dataset.filter;
    renderGallery();
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);
lightboxDownload.addEventListener('click', () => {
  const img = visibleImages[currentIndex];
  if (img) downloadImage(img, lightboxDownload);
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showNext();
  if (event.key === 'ArrowLeft') showPrev();
});

/* -------- Init -------- */
renderGallery();
