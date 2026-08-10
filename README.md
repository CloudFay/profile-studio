# 🎨 Profile Studio

### 🚀 [**Open the live app →**](https://cloudfay.github.io/profile-studio/)

Fill in a short, friendly wizard and walk away with clean, ready-to-paste
Markdown — an animated header, tech badges, social links, live GitHub stats,
a contribution graph, and a dev quote.

---

## ✨ What you get

- **Animated header** — a customizable greeting + typing headlines
- **About section** — bio plus optional lines (currently learning, fun fact, pronouns…), drag to reorder
- **Tech stack** — 100+ technology badges across languages, frameworks, tools & more
- **Social links** — GitHub, LinkedIn, X, Instagram, TikTok, Pinterest, YouTube, email, and more
- **Live widgets** — GitHub stats, top languages, contribution graph, streak, and a random dev quote
- **DEV.to integration** ✨ — automatic live feed of your latest blog posts with cover images (see [guide](./DEVTO_INTEGRATION.md))
- **14 accent colors** + light/dark themes + a custom color picker
- **Live preview** — see the rendered README and raw Markdown update as you type

## 📋 How to use

1. Open the [live app](https://techwithgen.github.io/profile-studio/).
2. Enter your GitHub username and fill in the steps.
3. Click **Download** (or **Copy**) to get your `README.md`.
4. Create a **public repo named exactly your username**, add the file it shows on your profile.

That's it. Nothing is uploaded, tracked, or stored on a server your work lives in your own browser.

## 🗂️ Project structure

```
index.html        Markup
css/styles.css    All styling
js/catalog.js     Tech + social data and badge helpers
js/app.js         Wizard logic, Markdown generation, live preview
```

No build step, no framework — open `index.html` locally, or host the folder on any static host.

## 🛠️ Run locally

Just open `index.html`. For a local server (optional):

```bash
npx serve .
# or
python3 -m http.server
```

## 🌐 Deploy (GitHub Pages)

1. Push this folder to a **public** repo.
2. **Settings → Pages → Deploy from a branch → main → / (root)**.
3. Live at `https://<username>.github.io/<repo>/`.

## ℹ️ About the live widgets

The stats, language, graph, streak, and quote cards are rendered by external
services (github-readme-stats, shields.io, readme-typing-svg, and others). They
load live wherever the README is shown and populate once a real GitHub username
is entered. If a widget's service is temporarily busy, the builder shows a small
"Renders on your live profile" placeholder — the card still appears on your
actual profile once its service recovers.

## 📝 DEV.to Integration

Profile Studio now includes built-in DEV.to support with two complementary features:

### 🎯 Browser Preview (Live)
- **Enable** the "DEV.to articles" addon in the wizard
- **Enter** your DEV.to username (or profile URL like `dev.to/yourname`)
- **See** your latest articles with **cover images** in the live preview
- **Configure** how many articles to display (1–20, default: 5)
- **Copy** the generated markdown to your README

**How It Works:**
- Uses DEV.to API for real-time article metadata
- Displays article title, cover image, URL, and publication date
- Responsive design works on mobile, tablet, and desktop
- Cached results prevent excessive API requests
- Handles errors gracefully (invalid username, network issues, no articles)

### 🤖 GitHub Action (Automated)
- **Automatic daily updates** — Runs every day at 9 AM UTC (configurable)
- **Manual trigger** — Run anytime from GitHub Actions tab
- **Cover images included** — Beautiful article cards with visuals
- **Safe updates** — Only modifies section between markers
- **Smart commits** — Skips commit if nothing changed

**Quick Setup:**
```bash
1. Add markers to your README:
   <!-- DEVTO:START -->
   <!-- DEVTO:END -->

2. Set your DEV.to username:
   git config --local devto.username YOUR_USERNAME
   git push

3. Go to Actions tab and run the workflow — that's it!
```

### 📚 DEV.to Integration Documentation
- **[DEVTO_INTEGRATION.md](./DEVTO_INTEGRATION.md)** — Complete setup guide & troubleshooting
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** — Technical architecture & details
- **[CONTRIBUTORS.md](./CONTRIBUTORS.md)** — Credits & team

## 👥 Contributors & Credits

**Original Creator:** [@techwithgen](https://github.com/techwithgen)  
Profile Studio is a beautiful, intuitive README builder for GitHub profiles.

**DEV.to Integration & Cover Images:** [@CloudFay](https://github.com/CloudFay) (Faith Omobude)  
Added full DEV.to integration including browser preview, GitHub Actions automation, and cover image support.

**[→ See full contributors & acknowledgements](./CONTRIBUTORS.md)**

---

## 📄 License

MIT — free to use, share, and build on.
