# Karthik Vinay Putchala – Portfolio

A static portfolio website. No build step, no backend, no database. Works on GitHub Pages, including under a repository path such as `https://<username>.github.io/<repo>/`.

## Structure

```
index.html            Page shell (loads CSS and JS with relative paths)
css/style.css         All styling (colour tokens at the top, light and dark)
js/data.js            ALL CONTENT: PORTFOLIO_DATA (edit this to update the site)
js/app.js             Rendering code (components); rarely needs editing
js/editor.js          "Edit Portfolio" mode (edits PORTFOLIO_DATA, saves to browser localStorage)
assets/images/        Project images and screenshots
assets/documents/     PDFs, reports, presentations
assets/certificates/  Certificate files
.nojekyll             Tells GitHub Pages to serve files as-is
```

## Deploy to GitHub Pages

1. Create a GitHub repository and upload everything in this folder to the repository root (`index.html` must be at the top level).
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch**, choose branch `main` and folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<username>.github.io/<repo>/`.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit `http://localhost:8000`.

## Updating content

Edit `js/data.js` only.

- **Add a project:** copy an object in `projects`, change its fields. Empty fields are hidden.
- **Add a project image:** put the file in `assets/images/projects/`, then add to that project:
  `images: [{ src: "assets/images/projects/my-chart.png", caption: "Forecast chart" }]`
- **Add a document:** put the PDF in `assets/documents/`, then add
  `documents: [{ label: "Project Report", url: "assets/documents/report.pdf" }]`
- **Add a certification / experience / education:** add an object to the matching array.

## Path rules (important for GitHub Pages)

- Always use relative paths: `assets/...`, never `/assets/...` and never `http://localhost...`.
- File names are case-sensitive on GitHub Pages. Keep names lowercase with hyphens (no spaces).

## Edit Portfolio mode

Click **Edit Portfolio** (small link in the footer, or open `index.html#edit`). Edit personal details, experience, projects (including the Status dropdown), education, certifications and skills. Changes preview live; **Save Changes** stores them in this browser's localStorage (key `portfolio_data_v1`).

- **Important:** localStorage is per browser. Visitors never see your edits. To publish edits, click **Export Portfolio Data**, then replace the `PORTFOLIO_DATA` content in `js/data.js` with the exported JSON (or send me the file and I will update `data.js`), commit and push.
- **Import Portfolio Data** restores a JSON file and saves it. **Reset Changes** returns to the content in `js/data.js`.
- Images and documents are not editable in the editor; add them to `assets/` and reference them in `js/data.js`.
