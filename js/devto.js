(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./security.js")
    );
  } else {
    root.ProfileStudioDevTo = factory(
      root.ProfileStudioSecurity
    );
  }
})(
  typeof window !== "undefined" ? window : globalThis,
  function (security) {
    const {
      escapeHtml,
      escapeMdText,
      safeUrl,
    } = security;

    // Normalize DEV.to username from a username or profile URL.
    function normalizeDevToUsername(input) {
      if (!input) return "";

      input = String(input).trim();

      if (input.includes("/")) {
        const match = input.match(
          /dev\.to\/([a-zA-Z0-9_]+)/
        );

        return match
          ? match[1]
          : input.split("/").pop();
      }

      return input;
    }

    // Fetch DEV.to articles through the public API.
    async function fetchDevToArticles(username, limit = 5) {
      if (!username) return [];

      try {
        const url =
          `https://dev.to/api/articles?username=${encodeURIComponent(
            username
          )}&per_page=${limit}`;

        const response = await fetch(url);

        if (!response.ok) return [];

        const articles = await response.json();

        return Array.isArray(articles)
          ? articles
          : [];
      } catch (error) {
        console.error("DEV.to fetch error:", error);
        return [];
      }
    }

    // Generate the DEV.to markdown section.
    function devToMarkdown(username, articles) {
      if (!username || !Array.isArray(articles) || !articles.length) {
        return "";
      }

      const lines = [];

      lines.push("<!-- DEVTO:START -->");
      lines.push("### 📝 Latest DEV.to Articles");
      lines.push("");

      articles.slice(0, 10).forEach((article) => {
        const title = escapeMdText(
          article.title || ""
        );

        const url = safeUrl(article.url);

        const date = article.published_at
          ? new Date(
              article.published_at
            ).toLocaleDateString()
          : "";

        const coverImage = safeUrl(
          article.cover_image ||
            article.social_image
        );

        if (coverImage !== "#") {
          lines.push(
            `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">`
          );

          lines.push(
            `  <img src="${escapeHtml(
              coverImage
            )}" alt="${escapeHtml(
              title
            )}" width="100%" style="border-radius:8px;margin-bottom:8px;" />`
          );

          lines.push("</a>");
        }

        lines.push(
          `**[${title}](${url})**${
            date ? ` — ${date}` : ""
          }`
        );

        if (article.description) {
          const desc = escapeMdText(
            String(article.description).substring(
              0,
              120
            )
          );

          lines.push(`  \n${desc}...`);
        }

        lines.push("");
      });

      lines.push("<!-- DEVTO:END -->");

      return lines.join("\n");
    }

    return {
      normalizeDevToUsername,
      fetchDevToArticles,
      devToMarkdown,
    };
  }
);