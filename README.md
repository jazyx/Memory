# React + Vite

A barebones React app created using Vite.

This app uses `react-router-dom` to create three placeholder pages. One of the pages performs a simple `fetch` request to an Express backend.

The Express backend is found in the `backend/` sub-directory in the same parent directory. During development, it should be run separately, but for production, you can serve this frontend with the Express backend, as a single Web Service.

1. Open a Terminal window in the parent directory of this `frontend/` sub-directory
2. Run `npm run publish`
3. Run `npm start`

This will run Vite's `build` process and copy all the files from `frontend/dist/` to `backend/public/`, then launch the Express backend.

See `index.html` in the parent directory for a complete tutorial.