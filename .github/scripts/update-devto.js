const fs = require("fs");
const https = require("https");

const CONFIG_PATH = ".github/profile-studio.json";
const README_PATH = "README.md";

const START_MARKER = "<!-- DEVTO:START -->";
const END_MARKER = "<!-- DEVTO:END -->";

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`${CONFIG_PATH} not found`);
  }

  let config;

  try {
    config = JSON.parse(
      fs.readFileSync(CONFIG_PATH, "utf8")
    );
  } catch (error) {
    throw new Error(
      `Failed to parse ${CONFIG_PATH}: ${error.message}`
    );
  }

  const devto = config.devto || {};

  return {
    username: String(
      devto.username || ""
    ).trim(),

    postCount: Math.min(
      Math.max(
        Number(devto.post_count) || 5,
        1
      ),
      20
    ),

    enabled: devto.enabled === true,

    automation: devto.automation === true,
  };
}

function fetchArticles(username, postCount) {
  const url =
    `https://dev.to/api/articles?username=${encodeURIComponent(
      username
    )}&per_page=${Math.min(postCount, 100)}`;

  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "Profile-Studio-DEVto-Sync",
          Accept: "application/json",
        },
      },
      (response) => {
        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `DEV.to API returned HTTP ${response.statusCode}`
              )
            );
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(
              new Error(
                `Failed to parse DEV.to response: ${error.message}`
              )
            );
          }
        });
      }
    );

    request.on("error", reject);
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(value) {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
}

function generateMarkdown(articles, username) {
  const lines = [
    START_MARKER,
    "### 📝 Latest DEV.to Articles",
    "",
    "<table>",
    "<tr>",
  ];

  articles.forEach((article) => {
    const title = escapeHtml(
      article.title || ""
    );

    const url = safeUrl(article.url);

    if (!url) {
      return;
    }

    const coverImage = safeUrl(
      article.cover_image ||
      article.social_image ||
      ""
    );

    const description = String(
      article.description || ""
    )
      .replace(/\s+/g, " ")
      .trim();

    const desc = escapeHtml(
      description.substring(0, 160)
    );

    const date = article.published_at
      ? new Date(
          article.published_at
        ).toLocaleDateString()
      : "";

    let tags = [];

    if (Array.isArray(article.tag_list)) {
      tags = article.tag_list;
    } else if (
      typeof article.tag_list === "string" &&
      article.tag_list.trim()
    ) {
      tags = article.tag_list
        .split(",")
        .map((tag) => tag.trim());
    }

    const visibleTags = tags.slice(0, 3);

    const moreTags = Math.max(
      0,
      tags.length - visibleTags.length
    );

    const tagHtml = visibleTags
      .map(
        (tag) =>
          `<code>#${escapeHtml(
            String(tag).replace(/^#/, "")
          )}</code>`
      )
      .join(" ");

    const finalTagHtml =
      moreTags > 0
        ? `${tagHtml}${
            tagHtml ? " " : ""
          }<code>+${moreTags}</code>`
        : tagHtml;

    const author =
      article.user?.name ||
      article.user?.username ||
      username;

    lines.push(
      '<td width="33%" valign="top">'
    );

    if (coverImage) {
      lines.push(
        `<a href="${escapeHtml(url)}">`
      );

      lines.push(
        `<img src="${escapeHtml(
          coverImage
        )}" width="100%" alt="${title}" />`
      );

      lines.push("</a>");
      lines.push("<br>");
    }

    lines.push("<br>");

    lines.push(
      `<strong><a href="${escapeHtml(
        url
      )}">${title}</a></strong>`
    );

    lines.push("<br><br>");

    if (desc) {
      lines.push(desc);

      if (description.length > 160) {
        lines.push("...");
      }

      lines.push("<br><br>");
    }

    if (finalTagHtml) {
      lines.push(finalTagHtml);
      lines.push("<br><br>");
    }

    lines.push(
      `<sub>${escapeHtml(author)}${
        date
          ? ` · ${escapeHtml(date)}`
          : ""
      }</sub>`
    );

    lines.push("<br><br>");

    lines.push(
      `<a href="${escapeHtml(
        url
      )}"><strong>Read more ↗</strong></a>`
    );

    lines.push("</td>");
  });

  lines.push("</tr>");
  lines.push("</table>");
  lines.push("");

  const profileUrl =
    `https://dev.to/${encodeURIComponent(
      username
    )}`;

  lines.push(
    `[![See more](https://img.shields.io/badge/See%20more-%E2%86%92-c900a8?style=for-the-badge)](${profileUrl})`
  );

  lines.push("");
  lines.push(END_MARKER);

  return lines.join("\n");
}

function updateReadme(content) {
  if (!fs.existsSync(README_PATH)) {
    throw new Error("README.md not found");
  }

  const readme = fs.readFileSync(
    README_PATH,
    "utf8"
  );

  const start = readme.indexOf(
    START_MARKER
  );

  const end = readme.indexOf(
    END_MARKER
  );

  if (start === -1 || end === -1) {
    throw new Error(
      "DEV.to README markers were not found"
    );
  }

  if (end < start) {
    throw new Error(
      "DEV.to README markers are in the wrong order"
    );
  }

  const endPosition =
    end + END_MARKER.length;

  const updated =
    readme.substring(0, start) +
    content +
    readme.substring(endPosition);

  if (updated === readme) {
    console.log(
      "No README changes detected."
    );
    return;
  }

  fs.writeFileSync(
    README_PATH,
    updated,
    "utf8"
  );

  console.log(
    "README.md successfully updated."
  );
}

async function main() {
  const config = readConfig();

  if (!config.enabled) {
    console.log(
      "DEV.to articles are disabled."
    );
    return;
  }

  if (!config.automation) {
    console.log(
      "DEV.to automation is disabled."
    );
    return;
  }

  if (!config.username) {
    throw new Error(
      "DEV.to username is missing from configuration."
    );
  }

  console.log(
    `Fetching DEV.to articles for ${config.username}...`
  );

  const articles = await fetchArticles(
    config.username,
    config.postCount
  );

  console.log(
    `Found ${articles.length} DEV.to articles.`
  );

  const markdown = generateMarkdown(
    articles,
    config.username
  );

  updateReadme(markdown);
}

main().catch((error) => {
  console.error(
    `DEV.to update failed: ${error.message}`
  );

  process.exit(1);
});
