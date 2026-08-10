# DEV.to Integration Guide

Profile Studio includes two complementary DEV.to integrations:

## 1. Browser Preview (DEV.to API)

The browser preview uses the **DEV.to API** to display a live feed of your latest articles.

### How to Use

1. Go to the **Add-ons** step in Profile Studio
2. Toggle on **DEV.to articles**
3. Enter your **DEV.to username** (or full profile URL like `dev.to/yourname`)
4. Set the **number of posts** to display (1–20)
5. Your latest articles will appear in the live preview

The preview refreshes automatically when you change your username or post count. The API data is cached to avoid repeated requests.

### Features

- ✅ Live preview of your DEV.to articles
- ✅ **Cover images** for each article (when available)
- ✅ Works in both dark and light mode
- ✅ Responsive design
- ✅ Shows article title, cover image, publication date, and URL
- ✅ Article preview/description snippet
- ✅ Handles errors gracefully (network issues, invalid username, no articles)

## 2. GitHub Action (DEV.to RSS)

The GitHub Action automatically updates your GitHub profile README with your latest DEV.to articles.

### Setup Instructions

1. **Ensure markers are in your README:**

   Add these markers to your `README.md` where you want DEV.to articles to appear:

   ```markdown
   <!-- DEVTO:START -->
   <!-- DEVTO:END -->
   ```

2. **Store your DEV.to username in git config:**

   Run this once in your profile repository:

   ```bash
   git config --local devto.username YOUR_DEVTO_USERNAME
   ```

   Replace `YOUR_DEVTO_USERNAME` with your actual DEV.to username (e.g., `anurag`).

3. **The Action will automatically:**

   - Run daily at 9 AM UTC
   - Fetch your latest articles from DEV.to RSS
   - Update the README between the markers
   - Commit changes only if there are new articles
   - Push the updated README to your repository

### Manual Trigger

You can also manually trigger the workflow from GitHub Actions:

1. Go to your repository
2. Click **Actions**
3. Select **Update DEV.to Articles**
4. Click **Run workflow**
5. Optionally enter:
   - **DEV.to username** (overrides git config)
   - **Number of posts** (default: 5)

### How the Workflow Works

The Action reads your DEV.to RSS feed at `https://dev.to/feed/USERNAME` and extracts:

- Article title
- Article URL
- Publication date
- **Cover image** (when available in RSS metadata)

It generates a markdown list with images:

```markdown
<!-- DEVTO:START -->
### 📝 Latest DEV.to Articles

<a href="https://dev.to/..." target="_blank" rel="noopener noreferrer">
  <img src="https://..." alt="Article Title" width="100%" style="border-radius:8px;margin-bottom:8px;" />
</a>
**[Article Title](https://dev.to/...)** — 8/10/2026

<a href="https://dev.to/..." target="_blank" rel="noopener noreferrer">
  <img src="https://..." alt="Another Article" width="100%" style="border-radius:8px;margin-bottom:8px;" />
</a>
**[Another Article](https://dev.to/...)** — 8/9/2026

<!-- DEVTO:END -->
```

### Configuration

The Action stores the DEV.to username in your repository's git config. To change it:

```bash
git config --local devto.username NEW_USERNAME
git push
```

Or use the GitHub Actions UI to manually trigger with a different username.

## Architecture: Why Two Approaches?

### Browser Preview Uses API

- Better data: structured article metadata, cover images (future enhancement)
- Real-time: fetch on demand in the UI
- User-friendly: no server-side setup required

### GitHub Action Uses RSS

- Server-side automation: runs automatically on schedule
- No API polling limits to worry about
- Simpler to parse and update markdown
- Standard web format (RSS/Atom)

## Troubleshooting

### "No articles found" in preview

- Check that your DEV.to username is correct
- Ensure you have published at least one article on DEV.to
- Try refreshing the page
- Check your browser console for errors

### GitHub Action doesn't update README

- Verify the markers `<!-- DEVTO:START -->` and `<!-- DEVTO:END -->` are in your README
- Check git config: `git config --local --list | grep devto`
- Go to Actions tab and check the workflow run logs
- Make sure the action has write permissions (should be automatic for personal repos)

### "Markers not found in README.md"

- Add the markers to your README:
  ```markdown
  <!-- DEVTO:START -->
  <!-- DEVTO:END -->
  ```
- Make sure they're on separate lines
- Push the changes and re-run the workflow

## Example README Setup

```markdown
# Hi, I'm Anurag! 👋

I write about web development, open source, and software engineering.

### 📝 Latest DEV.to Articles

<!-- DEVTO:START -->
<!-- DEVTO:END -->

### My GitHub Stats

...rest of your README...
```

---

For questions or issues, open an issue in the Profile Studio repository!
