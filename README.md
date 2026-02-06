
# demo-dorm-directory

## Dorm Directory Web App

This project displays dorms from a Google Apps Script API in a responsive grid with filters, styled using TailwindCSS.

### API Endpoint
Dorms are fetched from:
```
https://script.google.com/macros/s/AKfycbxQbOK53qvL3FwtkYklYVFWjKn2yc4w9sN4t7DYcgNg_ex5TpNvkqlXulecBYfwSusCuw/exec?sheet=dorms
```

### Sample Data Format
See `example-data.json` for the dorms data structure.

### How to Use
1. Update `app.js` and set `API_URL` to the API endpoint above.
2. Open `index.html` in your browser to view the dorms grid.
3. Use the filter dropdowns to filter dorms by type, capacity, or location.

### Deploying to GitHub Pages
1. Commit `index.html` and `app.js` to your GitHub repository.
2. Enable GitHub Pages in your repository settings (set source to main branch or `/docs` folder).
3. Visit your GitHub Pages URL to view the live site.

### Styling
TailwindCSS is included via CDN for easy styling and layout.

---
Events will be added to the page later.

