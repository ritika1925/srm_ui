# SAARAS-X interface (React + Vite)

Responsive implementation inspired by the supplied Figma screenshot. Includes the analysis setup, upload, processing, and result states.

## Run locally

1. Install Node.js (18+ recommended).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create a production build.

## Included interactions

- Responsive desktop/tablet/mobile navigation.
- Drag-and-drop or browse-to-select image upload.
- Client-side image preview, file-size/type checks, and remove action.
- Editable input and target resolution values with basic validation.
- A guided processing state and results summary.

## Important: connect the actual model

The processing transition is a **front-end demo**, not super-resolution inference. In `src/App.jsx`, replace the demo `window.setTimeout` inside `startAnalysis` with a request to your backend. For example:

```js
const body = new FormData();
body.append("image", file);
body.append("input_resolution", inputResolution);
body.append("target_resolution", targetResolution);

const response = await fetch("/api/super-resolution", {
  method: "POST",
  body
});
if (!response.ok) throw new Error("Analysis failed");
const result = await response.json();
// Store result output URL/metadata in state, then show it on the Results page.
```

Implement the API server-side to validate files and parameters, run your selected trained model, store the output, and return a result URL plus relevant metadata. Do not treat a browser-side preview as a scientific output.

## Design and UX notes

- Replaced the cramped, serif-like text visible in the screenshot with a consistent sans-serif type scale and stronger hierarchy.
- Used a grid layout that collapses into a single column on narrow screens; the sidebar becomes a slide-in drawer on mobile.
- Added clear step labels, field hints, status messaging, upload feedback, and error states.
- Keep units explicit (`m / pixel`) and explain that smaller target GSD values imply finer requested sampling, not guaranteed recovered detail.
- Consider adding geospatial metadata inspection, CRS/band selection, cloud/nodata handling, AOI selection, inference settings, and downloadable GeoTIFF output once the backend contract is known.
