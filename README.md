# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# SocialApp 🚀

A Facebook clone built with pure React — no backend, no database, just localStorage doing all the heavy lifting.

---

### Built With

React (Vite) · React Router v6 · Tailwind CSS · React Hook Form · Context API · localStorage · clsx

---

### What it does

- 🔐 Sign up / log in with real validation, session survives a refresh
- 📰 Public feed of posts — guests can look, but liking/commenting sends them to login
- ✍️ Create, edit, delete posts — with drafts, public/private toggle, and image upload + preview
- ❤️ Like/unlike posts, comment, delete your own comments (inline confirm, no ugly popups)
- 👤 Public profiles + editable settings that update everywhere instantly, no refresh
- 🌙 Dark mode that remembers your preference
- ⚡ Every page lazy-loads on its own — no giant upfront bundle

---

### Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. That's it — no `.env`, no backend, no database setup.

---

### The data model

Everything lives in localStorage under 5 keys — no server, no SQL, just arrays of objects.

```js
// users
{ id, name, email, password, bio, location, avatar, coverImage, joinedAt }

// posts
{ id, authorId, description, image, isPublic, isDraft, createdAt, updatedAt }

// comments
{ id, postId, authorId, text, createdAt }

// likes
{ id, postId, userId, createdAt }

// currentUser (single object, not an array — the active session, password stripped)
```

---

### What I learned

Designing `storage.js` before touching a single component forced me to think about data shape first, which made every page after that way easier to build. Context API finally clicked once I saw why `updateCurrentUser` has to touch state, session, *and* the users array at the same time — miss one and things silently get out of sync. I also ran into a subtle React lesson: localStorage doesn't trigger re-renders on its own, so I had to force refreshes manually after mutations like likes and comments. React Hook Form's `watch()` made the password-confirmation logic trivial once I understood it. Biggest takeaway overall: hiding a button in the UI isn't the same as actually guarding the logic behind it — like blocking edit access to someone else's post even if they type the URL directly.

---

### Known limitations

No backend means no real security — passwords sit in plain text in localStorage, data doesn't sync across devices or browsers, and images as base64 strings won't scale well. A real version would add hashed passwords + server auth, proper file storage for images, and real-time sync across users.

---

**Eman Fatima** — MERN Stack + AI Engineering Bootcamp
