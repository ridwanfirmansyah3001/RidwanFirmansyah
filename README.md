<<<<<<< HEAD
=======
<<<<<<< HEAD
# RidwanFirmansyah
=======
>>>>>>> d1def16 (Changing Website Title)
# Maple Pixel Portfolio

Autumn pixel-art portfolio. Plain HTML/CSS/JS, no build step.

```
maple-portfolio/
├── index.html            # markup only
├── .nojekyll             # tells GitHub Pages to skip Jekyll processing
├── css/styles.css        # pixel-art styles (CSS variables for the palette)
└── js/
    ├── tailwind.config.js  # Tailwind CDN theme (colors, fonts)
    ├── main.js             # entry point, wires modules together
    ├── audio.js            # Web Audio SFX + sound toggle
    ├── leaves.js           # falling-leaf background
    ├── hero-canvas.js      # hero artwork
    ├── gallery-data.js     # <- edit artworks here
    ├── gallery.js          # grid, filters, lightbox
    ├── draw-studio.js      # 16x16 drawing tool
    └── contact.js          # contact form
```

## Run locally

ES modules don't load from `file://`, so use a local server:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder's contents to a repo (`index.html` must be at the repo root).
2. Repo **Settings → Pages → Build and deployment**
3. Source: **Deploy from a branch**, Branch: `main`, Folder: `/ (root)`, then Save.
4. Site goes live at `https://<username>.github.io/<repo>/`
   (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).

All paths are relative, so it works under both URL styles.

## Notes

- The contact form is a front-end demo. GitHub Pages is static, so wire it to Formspree / Web3Forms to receive real messages (see `js/contact.js`).
- Tailwind runs through the Play CDN for zero-setup. For production, consider the Tailwind CLI to ship a small compiled CSS file.
- Footer social links are `#` placeholders. Replace them with real URLs.
<<<<<<< HEAD
=======
>>>>>>> 0d577b0 (Initial website commit)
>>>>>>> d1def16 (Changing Website Title)
