# 🎨 Profile Studio

### Build a polished GitHub Profile README without writing it from scratch.

[![Live App](https://img.shields.io/badge/Live%20App-Open%20Profile%20Studio-c900a8?style=for-the-badge)](https://cloudfay.github.io/profile-studio/)
[![GitHub](https://img.shields.io/badge/GitHub-CloudFay-181717?style=for-the-badge&logo=github)](https://github.com/CloudFay/profile-studio)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**Profile Studio** is a browser-based GitHub README builder that helps developers create polished GitHub profile READMEs through a guided wizard and live preview.

Choose your identity, bio, technologies, social links, GitHub widgets, theme, and optional integrations — then copy or download the generated Markdown.

No account.  
No backend.  
No database.  
No build step.

Just open Profile Studio and build your profile.

---

## 🚀 Open Profile Studio

**[→ Launch the live app](https://cloudfay.github.io/profile-studio/)**

---

## ✨ What is Profile Studio?

Your GitHub profile is often one of the first places people look when they want to understand what you build.

But creating a good `README.md` can mean dealing with:

- Markdown formatting
- HTML tables
- SVG badges
- GitHub statistics
- social links
- contribution graphs
- dynamic widgets
- responsive layouts
- external image URLs
- repeated README updates

Profile Studio turns that process into a guided interface.

Instead of manually assembling everything, you fill out a short wizard and watch your profile README come together in real time.

### The goal

> **Spend less time fighting README Markdown and more time building things.**

---

# ✨ Features

## 🧙 Guided README Builder

Profile Studio walks you through the process step by step.

Configure:

- GitHub username
- Profile greeting
- Headlines
- About section
- Optional profile information
- Technology stack
- Social links
- GitHub widgets
- DEV.to articles
- Theme and accent color

---

## 👋 Custom Profile Header

Create a profile header with:

- Custom greeting
- Multiple headlines
- Animated typing text
- Optional header content

The generated Markdown is ready to paste directly into your GitHub profile repository.

---

## 📝 About Section

Build an About section with configurable profile information.

You can include:

- Bio
- Currently learning
- Fun facts
- Pronouns
- Additional profile information

The fields can also be reordered to control how they appear in the generated README.

---

## 🛠️ Technology Stack

Choose from a large catalog of technologies and tools.

Profile Studio supports badges for:

- Programming languages
- Frameworks
- Databases
- Cloud platforms
- DevOps tools
- Developer tools
- Operating systems
- Other technologies

Selected technologies are automatically converted into README-ready badges.

---

## 🔗 Social Links

Add your online presence without manually writing Markdown.

Supported platforms include:

- GitHub
- LinkedIn
- X
- Instagram
- TikTok
- Pinterest
- YouTube
- Email
- And more

---

## 📊 GitHub Widgets

Add dynamic GitHub profile widgets such as:

- GitHub statistics
- Top languages
- Contribution graph
- Contribution streak
- Developer quote

These widgets are generated using external services and load dynamically when your profile README is rendered.

---

## 🎨 Themes & Accent Colors

Customize the appearance of your generated profile.

Profile Studio includes:

- Dark mode
- Light mode
- Multiple predefined accent colors
- Custom accent color picker

You can change the visual style without touching the generated Markdown.

---

## 👀 Live Preview

The preview updates as you configure your profile.

You can see what your README will look like before copying or downloading it.

Profile Studio provides both:

- Rendered preview
- Generated Markdown

This makes it easier to catch mistakes before publishing your profile.

---

# 📝 DEV.to Integration

Profile Studio includes built-in DEV.to support.

There are two separate parts:

### 1. Browser Preview

The Profile Studio interface can fetch your DEV.to articles and display them directly in the preview.

You can:

- Enable or disable DEV.to articles
- Enter your DEV.to username
- Use a DEV.to profile URL
- Configure the number of articles
- Display article covers
- Preview article metadata
- See the generated Markdown

The browser integration uses the DEV.to API.

---

### 2. GitHub Actions Automation

Profile Studio can also automatically keep your GitHub profile README synchronized with your DEV.to articles.

The GitHub Action can:

- Fetch your latest DEV.to articles
- Update a specific section of your README
- Include article covers when available
- Run on a schedule
- Be triggered manually
- Avoid unnecessary commits when nothing changed

The generated section is protected by markers:

```markdown
<!-- DEVTO:START -->
### 📝 Latest DEV.to Articles

<!-- DEVTO:END -->
```

Only the content between these markers is updated by the automation.

### Configuration

The project includes a Profile Studio configuration file:

```text
.github/profile-studio.json
```

Example:

```json
{
  "devto": {
    "post_count": 3,
    "username": "your-devto-username",
    "enabled": true,
    "automation": true
  }
}
```

For complete DEV.to setup instructions, troubleshooting, and architecture details, see:

[**→ DEV.to Integration Guide**](./DEVTO_INTEGRATION.md)

---

# 🔒 Security

Profile Studio runs primarily in the browser and does not require a backend server to generate your README.

The project also includes URL validation and output escaping to reduce the risk of unsafe content being introduced through generated Markdown.

For example, unsafe article URLs such as:

```text
javascript:alert(1)
```

are not rendered as executable links.

The project includes automated tests covering DEV.to URL handling and generated Markdown.

---

# 🧪 Testing

Profile Studio uses Node's built-in test runner for automated tests.

Run the test suite with:

```bash
npm test
```

You can also check individual JavaScript files for syntax errors with Node:

```bash
node --check js/app.js
```

And run the project's formatting/diff checks with:

```bash
git diff --check
```

The test suite currently includes coverage for functionality such as:

- DEV.to username normalization
- DEV.to profile URL normalization
- DEV.to Markdown generation
- Unsafe article URL handling
- Unsafe cover image handling

---

# 🏗️ Project Structure

Profile Studio is intentionally built as a small, modular static application.

The project started with more responsibilities living together in the application code. As the project grew, those responsibilities became increasingly difficult to reason about and maintain.

The architecture has therefore evolved toward separating responsibilities between UI logic, README generation, DEV.to integration, security, and application data.

At a high level:


```text

                    ┌──────────────────────────┐
                    │       User / Browser     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Profile Studio     │
                    │          UI              │
                    │      index.html          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │          app.js           │
                    │   Wizard + UI State Flow  │
                    └────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────┐     ┌────────────┐     ┌────────────┐
       │  catalog   │     │  devto.js  │     │ generator  │
       │    .js     │     │            │     │    .js     │
       │            │     │ DEV.to API │     │ Markdown   │
       │ Tech/social│     │ integration│     │ generation │
       │ metadata   │     └─────┬──────┘     └─────┬──────┘
       └────────────┘           │                  │
                                ▼                  ▼
                         ┌────────────┐      ┌─────────────┐
                         │ DEV.to API │      │ README.md   │
                         └────────────┘      └─────────────┘

                         ┌────────────┐
                         │ security.js│
                         │            │
                         │ URL + HTML │
                         │ sanitizing │
                         └────────────┘
```

## Repo Structure

```text
profile-studio/
│
├── .github/
│   ├── workflows/
│   │   └── ...
│   └── profile-studio.json
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── catalog.js
│   ├── devto.js
│   ├── generator.js
│   └── security.js
│
├── tests/
│   └── devto.test.js
│
├── index.html
├── eslint.config.js
├── package.json
├── DEVTO_INTEGRATION.md
├── CONTRIBUTORS.md
└── README.md
```

### Main Components

| File / Directory | Purpose |
|---|---|
| `index.html` | Application interface and wizard markup |
| `css/styles.css` | Application styling and responsive layout |
| `js/app.js` | Application state, wizard behavior, and UI interactions |
| `js/catalog.js` | Technology, social platform, and badge catalog |
| `js/devto.js` | DEV.to username handling, article fetching, and Markdown generation |
| `js/generator.js` | README content generation |
| `js/security.js` | URL validation and output-safety helpers |
| `tests/` | Automated tests |
| `.github/workflows/` | GitHub Actions automation |
| `.github/profile-studio.json` | Profile Studio configuration |
| `DEVTO_INTEGRATION.md` | Detailed DEV.to integration documentation |
| `CONTRIBUTORS.md` | Contributors and acknowledgements |

---

# 🧰 Tech Stack

Profile Studio intentionally keeps the technology stack simple.

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Libraries

- [Marked](https://marked.js.org/) — Markdown rendering
- [Globals](https://www.npmjs.com/package/globals) — ESLint environment globals

### Development

- Node.js
- Node Test Runner
- ESLint
- GitHub Actions

There is no frontend framework and no application build pipeline.

---

# 💻 Run Locally

You don't need to install a large development environment to run Profile Studio.

Clone the repository:

```bash
git clone https://github.com/CloudFay/profile-studio.git
cd profile-studio
```

Then open:

```text
index.html
```

in your browser.

---

## 🌐 Optional Local Server

If you prefer running Profile Studio through a local HTTP server:

### Using Node.js

```bash
npx serve .
```

### Using Python

```bash
python3 -m http.server
```

Then open the local address provided by the server.

---

# 🚀 Deploy to GitHub Pages

Profile Studio is a static application, so it can be deployed to GitHub Pages without a build process.

### 1. Push the project to GitHub

```bash
git add .
git commit -m "feat: deploy profile studio"
git push origin main
```

### 2. Enable GitHub Pages

Go to:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Deploy from a branch
→ main
→ / (root)
```

GitHub will publish the application.

Your site will be available at:

```text
https://<username>.github.io/<repository>/
```

---

# 📖 Creating Your GitHub Profile README

Profile Studio generates the Markdown for your GitHub profile.

To use it:

### 1. Open Profile Studio

[**Launch the app**](https://cloudfay.github.io/profile-studio/)

### 2. Enter your GitHub username

Your username powers the GitHub widgets and profile links.

### 3. Complete the wizard

Configure the sections you want to appear on your profile.

### 4. Preview your README

Use the live preview to check the generated result.

### 5. Copy or download the Markdown

Profile Studio gives you ready-to-use Markdown.

### 6. Create your GitHub profile repository

Create a **public repository with exactly the same name as your GitHub username**.

For example:

```text
github.com/yourusername
```

Create:

```text
yourusername/yourusername
```

### 7. Add the generated README

Place the generated content in:

```text
README.md
```

Once committed, GitHub will display the README on your profile.

---

# 🤖 DEV.to GitHub Action

If you want your profile README to update automatically when you publish new DEV.to articles, use the included GitHub Action.

The workflow uses markers so it can update only the DEV.to section of your README without overwriting the rest of your profile.

Example:

```markdown
<!-- DEVTO:START -->

### 📝 Latest DEV.to Articles

<!-- Automatically generated content -->

<!-- DEVTO:END -->
```

You can manually trigger the workflow from:

```text
GitHub
→ Actions
→ Update DEV.to Articles
→ Run workflow
```

For the complete setup process:

[**→ Read the DEV.to Integration Guide**](./DEVTO_INTEGRATION.md)

---

# 🧑‍💻 Development

Contributions, improvements, and ideas are welcome.

### Fork the Repository

Clone the repository:

```bash
git clone https://github.com/CloudFay/profile-studio.git
cd profile-studio
```

Create a branch:

```bash
git checkout -b feature/my-feature
```

Make your changes, then run the tests:

```bash
npm test
```

Check for common Git whitespace issues:

```bash
git diff --check
```

Commit your changes:

```bash
git add .
git commit -m "feat: add my feature"
```

Push the branch:

```bash
git push origin feature/my-feature
```

Then open a Pull Request.

---

# 🤝 Contributing

Contributions are welcome.

Before opening a Pull Request:

1. Keep the project dependency-light.
2. Avoid introducing unnecessary frameworks.
3. Keep the application usable as a static site.
4. Add tests when introducing behavior that can be tested.
5. Keep security-sensitive URL handling intact.
6. Update documentation when changing user-facing functionality.
7. Run the test suite before submitting your PR.

For contributor information and acknowledgements:

[**→ See CONTRIBUTORS.md**](./CONTRIBUTORS.md)

---

# 🗺️ Roadmap

Profile Studio is still evolving.

Potential improvements include:

- More profile section templates
- More technology badges
- Additional social platforms
- More GitHub widgets
- Additional README layouts
- Improved customization controls
- More automated tests
- Better accessibility coverage
- More integrations for developer platforms
- Additional GitHub Actions automation

Have an idea?

Open an issue or start a discussion.

---

# 🌟 Why I Built This

GitHub profiles are part of a developer's public identity.

But creating a polished profile README often requires manually combining Markdown, HTML, badges, external widgets, and image URLs.

Profile Studio started from a simple idea:

> **What if building a good GitHub profile felt more like using a design tool than writing HTML?**

The project is also an experiment in building a small developer-focused tool with:

- Vanilla JavaScript
- Static hosting
- GitHub Actions
- API integrations
- Markdown generation
- Security-conscious input handling
- Automated testing
- Developer experience in mind

---

# 👥 Contributors & Credits

### Original Creator

[**@techwithgen**](https://github.com/techwithgen)

Profile Studio originated as a GitHub profile README builder created by `@techwithgen`.

### DEV.to Integration & Automation

[**@CloudFay**](https://github.com/CloudFay) — Faith Omobude

Contributed the DEV.to integration, including:

- Browser-based DEV.to article preview
- DEV.to article metadata handling
- Cover image support
- GitHub Actions automation
- Automated README updates
- DEV.to configuration
- Security handling for generated URLs
- Automated tests

See the complete acknowledgements:

[**→ CONTRIBUTORS.md**](./CONTRIBUTORS.md)

---

# 📄 License

Profile Studio is released under the **MIT License**.

You are free to:

- Use it
- Modify it
- Distribute it
- Build upon it

See the `LICENSE` file for the complete license text.

---

# ⭐ Support the Project

If Profile Studio helped you create your GitHub profile, consider giving the repository a ⭐ on GitHub.

[**⭐ Star Profile Studio on GitHub**](https://github.com/CloudFay/profile-studio)