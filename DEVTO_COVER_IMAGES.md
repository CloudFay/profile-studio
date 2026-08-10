# DEV.to Cover Images Support

The DEV.to integration now includes **cover images** for all articles in both the browser preview and GitHub Action.

## How It Works

### Browser Preview

When you enable the DEV.to addon and enter your username:

1. The app fetches articles from the DEV.to API
2. Each article's `cover_image` is extracted (or `social_image` as fallback)
3. Images display clickable in the preview
4. Hover effect scales images slightly for visual feedback

**Example Preview Output:**

```
### 📝 Latest DEV.to Articles

[Cover Image 1 - clickable to article]
**[Building Scalable APIs with Node.js](https://dev.to/...)**
8/10/2026

[Cover Image 2 - clickable to article]
**[Understanding React Hooks](https://dev.to/...)**
8/8/2026
```

### GitHub Action

The workflow now:

1. Parses the DEV.to RSS feed
2. Extracts image from `media:content` or `enclosure` tags
3. Includes images in the updated README
4. Images are fully responsive with rounded corners

**Example README Output:**

```markdown
<!-- DEVTO:START -->
### 📝 Latest DEV.to Articles

<a href="https://dev.to/..." target="_blank" rel="noopener noreferrer">
  <img src="https://dev-to-uploads.s3.amazonaws.com/..." 
       alt="Building Scalable APIs with Node.js" 
       width="100%" 
       style="border-radius:8px;margin-bottom:8px;" />
</a>
**[Building Scalable APIs with Node.js](https://dev.to/...)** — 8/10/2026

<!-- ... more articles ... -->

<!-- DEVTO:END -->
```

## Features

✅ **Cover Images Always Shown**
- Displays featured image from each article
- Fallback to social image if cover image unavailable
- Gracefully skips images for articles without covers

✅ **Interactive**
- Clickable images link to the full article
- Hover effect on preview
- Works on mobile and desktop

✅ **Responsive Design**
- Images scale to 100% width
- Rounded corners (8px border radius)
- Proper spacing between articles
- Works in both dark and light themes

✅ **Accessible**
- Alt text set to article title
- `target="_blank"` with `rel="noopener noreferrer"` for security
- Semantic HTML links

## Image Sources

### Browser Preview (DEV.to API)

The DEV.to API provides:

```json
{
  "title": "Article Title",
  "cover_image": "https://dev-to-uploads.s3.amazonaws.com/...",
  "social_image": "https://dev-to-uploads.s3.amazonaws.com/...",
  "url": "https://dev.to/...",
  "published_at": "2026-08-10T..."
}
```

The app uses `cover_image` first, then falls back to `social_image`.

### GitHub Action (DEV.to RSS)

The RSS feed includes images in:

```xml
<item>
  <title>Article Title</title>
  <link>https://dev.to/...</link>
  <pubDate>Sun, 10 Aug 2026 ...</pubDate>
  <media:content url="https://dev-to-uploads.s3.amazonaws.com/..." />
</item>
```

The workflow extracts the image URL from `media:content` or `enclosure` tags.

## Styling

### CSS Applied

```css
/* Hover effect in preview */
.md a img[alt]:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.3);
}

/* Inline styles in generated markdown */
style="border-radius:8px;margin-bottom:8px;width:100%"
```

### Dark Mode

Images work perfectly in dark mode:
- No background color needed
- Rounded corners visible on all backgrounds
- Shadow visible even with dark backgrounds

### Light Mode

Images work perfectly in light mode too:
- Same styling applied
- Rounded corners and shadows visible
- Good contrast with light backgrounds

## Performance

✅ **Optimized Image Loading**
- DEV.to CDN serves images
- Images cached by browser
- No extra API calls for images
- Fast loading (already optimized by DEV.to)

✅ **Workflow Performance**
- Image extraction from RSS (minimal overhead)
- No additional HTTP requests during workflow
- Same execution time as before

## Browser Compatibility

✅ All modern browsers support:
- `<img>` tags with `width` attribute
- CSS `border-radius`
- CSS `box-shadow`
- `:hover` pseudo-class
- `target="_blank"` links

## Troubleshooting

### Images not showing in preview

**Check:**
1. DEV.to username is correct
2. Articles have cover images on DEV.to
3. Browser console for errors
4. Try refreshing the page
5. Check DevTools Network tab for image loading

### Images not in GitHub Action README

**Check:**
1. Workflow ran successfully (check Actions tab)
2. README.md has the markers
3. DEV.to RSS feed has images (not all articles have covers)
4. Git config has the correct username

### Images showing but cropped/stretched

This shouldn't happen with current styling (`width="100%"` with `border-radius`), but if it does:

Check if custom CSS is interfering with `.md a img` styling.

---

## Example Complete Output

Here's what a full DEV.to section looks like with cover images:

```markdown
## 📝 Latest DEV.to Articles

<!-- DEVTO:START -->

<a href="https://dev.to/anurag/building-scalable-apis" target="_blank" rel="noopener noreferrer">
  <img src="https://dev-to-uploads.s3.amazonaws.com/i/1a2b3c4d5e6f7g8h9i0j.png" alt="Building Scalable APIs with Node.js" width="100%" style="border-radius:8px;margin-bottom:8px;" />
</a>
**[Building Scalable APIs with Node.js](https://dev.to/anurag/building-scalable-apis)** — 8/10/2026

<a href="https://dev.to/anurag/react-hooks" target="_blank" rel="noopener noreferrer">
  <img src="https://dev-to-uploads.s3.amazonaws.com/i/2b3c4d5e6f7g8h9i0j1k.png" alt="Understanding React Hooks" width="100%" style="border-radius:8px;margin-bottom:8px;" />
</a>
**[Understanding React Hooks](https://dev.to/anurag/react-hooks)** — 8/8/2026

<a href="https://dev.to/anurag/docker-best-practices" target="_blank" rel="noopener noreferrer">
  <img src="https://dev-to-uploads.s3.amazonaws.com/i/3c4d5e6f7g8h9i0j1k2l.png" alt="Docker Best Practices" width="100%" style="border-radius:8px;margin-bottom:8px;" />
</a>
**[Docker Best Practices](https://dev.to/anurag/docker-best-practices)** — 8/5/2026

<!-- DEVTO:END -->
```

When rendered on GitHub (or in Profile Studio preview), this shows three beautiful article cards with cover images, each clickable and properly styled!

---

For more information, see [DEVTO_INTEGRATION.md](./DEVTO_INTEGRATION.md)
