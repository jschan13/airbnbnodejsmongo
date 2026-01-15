This project is a small Express + EJS app that demonstrates session-based authentication and simple CRUD for "homes" stored in MongoDB via Mongoose. The file below gives focused, actionable guidance for an AI coding agent to be immediately productive in this repository.

High level architecture
- app.js: single Express app. Registers three routers: `storeRouter` (public store/home pages), `authRouter` (login/signup/logout), and `hostRouter` (protected host pages under `/host`). Sessions are persisted to MongoDB using `connect-mongodb-session` (see `app.use(session(...))`).
- controllers/: business logic and view rendering. Examples: `storeController.js` (listings, favourites), `authController.js` (login/signup), `hostController.js` (host CRUD).
- routes/: route definitions that map HTTP paths to controller methods (see `routes/*.js`).
- models/: Mongoose models (`home.js`, `favourite.js`). Note `home` schema installs a `pre('findOneAndDelete')` hook to cascade-delete related `Favourite` documents.
- views/: EJS templates. Partials live in `views/partials/` and are included with relative paths (e.g. `<%- include('../partials/head') %>` in `views/auth/signup.ejs`).

Key patterns and conventions
- Rendering: controllers call `res.render(viewPath, { ..., isLoggedIn: req.isLoggedIn })`. The app sets `req.isLoggedIn` in a simple middleware in `app.js`; do not assume `req.user` exists.
- Routing: routers are mounted without a base path (store and auth) or with `/host`. Host routes require `req.isLoggedIn` — the check is performed in `app.js` before mounting `hostRouter`.
- Body parsing: each router calls `router.use(bodyParser.urlencoded());` (legacy usage). When editing, prefer `express.urlencoded({ extended: false })` only if updating all routers consistently.
- Sessions: sessions use `secret: 'life2025'` and a MongoDB-backed store. When working with session handling or logout, call `req.session.destroy()` to clear the session.
- Mongoose usage: models export via `module.exports = mongoose.model('ModelName', schema)`. Find examples in `models/home.js` and `models/favourite.js`.

Important files to reference when changing behavior
- `app.js` — app wiring, session setup, route mounting, static assets, DB connection string (DB_PATH), 404 handler.
- `controllers/authController.js` — login/signup handlers; they currently set `req.session.isLoggedIn = true` without persisting user data.
- `controllers/storeController.js` — data access with `Home.find()` and `Favourite` population; includes add/remove favourite flows.
- `models/home.js` — shows the cascade delete hook: `pre('findOneAndDelete')` removes favourites matching deleted home.
- `views/` — EJS templates including Tailwind classes; static CSS lives in `public/` (`home.css`, `output.css`).

Developer workflows and commands
- Start the app (development): npm start or node app.js. Check `package.json` scripts before changing startup behavior.
- Live reload is likely provided via `nodemon` (there is a `nodemon.json`), so prefer `npm run dev` if present; otherwise use `nodemon app.js` for iterative development.
- MongoDB: the app connects to a MongoDB Atlas connection in `app.js` (DB_PATH). For local testing, replace `DB_PATH` with a local URI and ensure the session collection exists.

Project-specific implementation notes for code changes
- Auth is minimal: signup/login handlers do not create or validate persistent user documents. If implementing real auth, add a `models/user.js`, hash passwords, and update session handling to store user id (e.g. `req.session.userId`). Update `req.isLoggedIn` middleware to read `req.session.isLoggedIn` or `req.session.userId` consistently.
- Route protection: the `/host` routes are protected by a middleware in `app.js` that checks `req.isLoggedIn`. If you refactor auth, update this middleware or replace with an `isAuth` middleware function exported in `controllers/authController.js`.
- Database cleanup: the `Home` model's `pre('findOneAndDelete')` hook removes related favourites. When adding new relations, follow this pattern for consistency.
- Views: EJS partials use relative paths (e.g. `../partials/head`). When moving templates, update include paths. Keep `views` folder registered in `app.set('views','views')`.

Examples to cite in PRs or suggestions
- "When removing a home, use `Home.findOneAndDelete({ _id: id })` so the `pre('findOneAndDelete')` hook runs and cleans up `Favourite` entries" — see `models/home.js` and `controllers/hostController.js` (`postDeleteHome`).
- "To add a persisted user model, create `models/user.js` and replace the current `req.session.isLoggedIn=true` in `authController.postLogin` with `req.session.userId = savedUser._id` and set `req.session.save()` where needed." — see `controllers/authController.js`.

What not to change without explicit user confirmation
- The current DB connection string in `app.js` (DB_PATH) contains credentials; do not commit credentials or swap them without informing the repo owner.
- The `views` folder layout and EJS include paths — moving files will break many templates.

If you need to run tests or add CI
- There are no tests. If you add test runners, prefer lightweight Jest/Mocha + Supertest for route/controller unit tests. Ensure `app.js` exports the Express `app` (instead of always listening) to allow test imports.

If you change package scripts or add dependencies
- Run `npm ci` or `npm install` locally. Keep `nodemon.json` and existing Tailwind/PostCSS setup intact when changing build steps for CSS.

Contact points and follow-ups
- When a change touches auth, session persistence, or DB schemas, add a short note in the PR about migration steps (sessions invalidation, sample DB updates).

If anything below is unclear or you'd like more examples (e.g., hostController internals or package.json scripts), tell me which area to expand and I'll iterate.
