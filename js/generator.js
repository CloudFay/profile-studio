(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ProfileStudioGenerator = factory();
  }
})(
  typeof window !== "undefined" ? window : globalThis,
  function () {
    function statTheme(documentRef) {
      return documentRef &&
        documentRef.documentElement.getAttribute("data-theme") === "dark"
        ? "tokyonight"
        : "default";
    }

    function generate(state, options) {
      const {
        readmeMode = false,
        documentRef = typeof document !== "undefined" ? document : null,
        aboutFields,
        tech,
        socials,
        badgeUrl,
        shEscape,
        normalizeHost,
        ghProfileUrl,
        escapeHtml,
        escapeMdText,
        safeUrl,
        normalizeDevToUsername,
      } = options;

      const s = state;
      const user = (s.username || "").trim();
      const uEnc = encodeURIComponent(user);
      const ac = (s.accent || "#2ea043").replace("#", "");
      const a = s.addons;
      const th = statTheme(documentRef);
      const L = [];

      // ───────── HERO ─────────
      const typeLines = [];

      if (s.tagline.trim()) {
        typeLines.push(s.tagline.trim());
      }

      if (s.tagline2.trim()) {
        typeLines.push(s.tagline2.trim());
      }

      const linesParam = typeLines
        .map((l) => encodeURIComponent(l))
        .join(";");

      const longest = typeLines.reduce(
        (m, l) => Math.max(m, l.length),
        0
      );

      const subWidth = Math.min(
        900,
        Math.max(360, longest * 15 + 40)
      );

      const hlc = (
        s.headlineColor || "#a371f7"
      ).replace("#", "");

      const greeting = (
        s.greeting == null ? "Hello! I'm" : s.greeting
      ).trim();

      if (greeting) {
        const headerWidth = Math.min(
          1200,
          Math.max(420, greeting.length * 32 + 90)
        );

        L.push(`<p align="center">`);
        L.push(
          `  <a href="${ghProfileUrl(user)}">`
        );
        L.push(
          `    <img src="https://capsule-render.vercel.app/api?type=transparent&fontColor=${ac}&fontSize=54&height=90&width=${headerWidth}&text=${encodeURIComponent(greeting)}" alt="${escapeHtml(greeting)}" />`
        );
        L.push(`  </a>`);
        L.push(`</p>`);
      }

      if (typeLines.length) {
        L.push("");
        L.push(`<p align="center">`);
        L.push(
          `  <img src="https://readme-typing-svg.demolab.com?font=Caveat&weight=600&size=26&pause=1000&color=${hlc}&center=true&vCenter=true&width=${subWidth}&height=44&lines=${linesParam}" alt="Typing headlines" />`
        );
        L.push(`</p>`);
      }

      L.push("");
      L.push("");

      // ───────── ABOUT ─────────
      const facts = [];

      (s.factOrder || []).forEach((key) => {
        const cfg = aboutFields[key];
        const val = (s[key] || "").trim();

        if (!cfg || !val) return;

        facts.push(
          `${cfg.emoji} &nbsp;${cfg.lead} **${escapeMdText(val)}**`
        );
      });

      if (s.bio.trim() || facts.length) {
        L.push("### 🚀 About Me");
        L.push("");

        if (s.bio.trim()) {
          L.push(
            escapeMdText(s.bio.trim())
              .split("\n")
              .filter((l) => l.trim())
              .join("  \n")
          );
          L.push("");
        }

        if (facts.length) {
          L.push(facts.join("  \n"));
          L.push("");
        }
      }

      // ───────── TECH STACK ─────────
      const allTech = [];

      Object.entries(tech).forEach(([cat, items]) => {
        (s.tech[cat] || []).forEach((name) => {
          if (items[name]) {
            allTech.push([name, items[name]]);
          }
        });
      });

      if (allTech.length) {
        L.push("### 🛠️ Tech Stack");
        L.push("");
        L.push(`<p align="left">`);

        L.push(
          allTech
            .map(
              ([name, cfg]) =>
                `  <img src="${badgeUrl(
                  name,
                  cfg,
                  s.badgeStyle
                )}" alt="${escapeHtml(name)}" />`
            )
            .join("\n")
        );

        L.push(`</p>`);
        L.push("");
      }

      // ───────── CONNECT ─────────
      const socialBadges = [];

      (s.socialOrder || []).forEach((key) => {
        const cfg = socials[key];
        const value = (s.socials[key] || "").trim();

        if (!cfg || !value) return;

        const href =
          /^https?:\/\//.test(value) ||
          value.startsWith("mailto:")
            ? value
            : cfg.prefix + value;

        socialBadges.push(
          `  <a href="${escapeHtml(
            href
          )}" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/${shEscape(
            cfg.label
          )}-${cfg.color}?style=${s.badgeStyle}&logo=${
            cfg.logo
          }&logoColor=white" alt="${escapeHtml(
            cfg.label
          )}" /></a>`
        );
      });

      if (socialBadges.length) {
        L.push("### 🔗 Connect With Me");
        L.push("");
        L.push(`<p align="left">`);
        L.push(socialBadges.join("\n"));
        L.push(`</p>`);
        L.push("");
      }

      // ───────── STATS ─────────
      const cardColors =
        `&title_color=${ac}` +
        `&icon_color=${ac}` +
        `&hide_border=true` +
        `&bg_color=00000000`;

      const sText =
        th === "default" ? "1f2328" : "c9d1d9";

      const statsHost =
        normalizeHost(s.statsHost) ||
        "github-readme-stats-five-sigma-99.vercel.app";

      if (user && (a.stats || a.langs)) {
        L.push("### 📊 GitHub Stats");
        L.push("");
        L.push(`<p align="center">`);

        if (a.stats) {
          L.push(
            `  <img height="165" src="https://${statsHost}/api?username=${uEnc}&show_icons=true&theme=${th}${cardColors}&count_private=true" alt="stats" />`
          );
        }

        if (a.langs) {
          L.push(
            `  <img height="165" src="https://${statsHost}/api/top-langs/?username=${uEnc}&layout=compact&theme=${th}${cardColors}&langs_count=8" alt="top langs" />`
          );
        }

        L.push(`</p>`);
        L.push("");
      }

      if (user && a.activity) {
        L.push("### 📈 Contribution Graph");
        L.push("");
        L.push(`<p align="center">`);
        L.push(
          `  <img width="100%" src="https://github-readme-activity-graph.vercel.app/graph?username=${uEnc}&bg_color=00000000&color=${ac}&line=${ac}&point=${sText}&area=true&hide_border=true" alt="activity graph" />`
        );
        L.push(`</p>`);
        L.push("");
      }

      // ───────── DEV QUOTE ─────────
      if (a.quote) {
        L.push("### 💭 Dev Quote");
        L.push("");
        L.push(`<p align="center">`);
        L.push(
          `  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${th}" alt="Dev quote" />`
        );
        L.push(`</p>`);
        L.push("");
      }

      // ───────── DEV.TO ─────────
      const devtoUser = normalizeDevToUsername(
        s.devtoUsername
      );

      if (
        a.devto &&
        devtoUser &&
        s.devtoCache &&
        s.devtoCache.articles.length
      ) {
        const articles =
          s.devtoCache.articles.slice(
            0,
            Math.min(3, s.devtoPostCount || 5)
          );

        if (readmeMode) {
          L.push("<!-- DEVTO:START -->");
          L.push("### 📝 Latest DEV.to Articles");
          L.push("");

          articles.forEach((article) => {
            const title = escapeHtml(
              article.title || ""
            );
            const url = safeUrl(article.url);

            const date = article.published_at
              ? new Date(
                  article.published_at
                ).toLocaleDateString()
              : "";

            const coverImage =
              article.cover_image ||
              article.social_image ||
              "";

            const descRaw = (
              article.description || ""
            )
              .replace(/\s+/g, " ")
              .trim();

            const desc = escapeHtml(
              descRaw.substring(0, 140)
            );

            let tags = [];

            if (Array.isArray(article.tag_list)) {
              tags = article.tag_list;
            } else if (
              typeof article.tag_list === "string" &&
              article.tag_list.trim()
            ) {
              tags = article.tag_list
                .split(",")
                .map((t) => t.trim());
            } else if (article.tags) {
              tags = Array.isArray(article.tags)
                ? article.tags
                : String(article.tags)
                    .split(",")
                    .map((t) => t.trim());
            }

            const visibleTags = tags.slice(0, 3);
            const moreTags = Math.max(
              0,
              tags.length - visibleTags.length
            );

            const author =
              (article.user &&
                article.user.name) ||
              (article.user &&
                article.user.username) ||
              "";

            L.push(
              '<td width="33%" valign="top">'
            );

            if (coverImage) {
              L.push(
                `<a href="${escapeHtml(url)}">`
              );

              L.push(
                `<img src="${escapeHtml(
                  coverImage
                )}" width="100%" alt="${title}" />`
              );

              L.push("</a>");
              L.push("<br>");
            }

            L.push("<br>");

            L.push(
              `<strong><a href="${url}">${title}</a></strong>`
            );

            L.push("<br><br>");

            if (desc) {
              L.push(
                `${desc}${
                  descRaw.length > 140
                    ? "..."
                    : ""
                }`
              );
              L.push("<br><br>");
            }

            if (visibleTags.length) {
              const tagHtml = visibleTags
                .map(
                  (tag) =>
                    `<code>#${escapeHtml(
                      String(tag).replace(
                        /^#/,
                        ""
                      )
                    )}</code>`
                )
                .join(" ");

              L.push(tagHtml);

              if (moreTags) {
                L.push(
                  ` <code>+${moreTags}</code>`
                );
              }

              L.push("<br><br>");
            }

            L.push(
              `<sub>${escapeHtml(author)}${
                date
                  ? ` · ${escapeHtml(date)}`
                  : ""
              }</sub>`
            );

            L.push("<br><br>");

            L.push(
              `<a href="${url}"><strong>Read more ↗</strong></a>`
            );

            L.push("</td>");
          });

          L.push("</tr>");
          L.push("</table>");
          L.push("");

          const devtoProfile =
            `https://dev.to/${encodeURIComponent(
              devtoUser
            )}`;

          L.push(
            `[![See more](https://img.shields.io/badge/See%20more-%E2%86%92-c900a8?style=for-the-badge)](${devtoProfile})`
          );

          L.push("");
          L.push("<!-- DEVTO:END -->");
          L.push("");
        } else {
          L.push(
            '<div class="devto-preview">'
          );
          L.push(
            '  <div class="devto-grid">'
          );

          articles.forEach((article) => {
            const title = escapeHtml(
              article.title || ""
            );
            const url = safeUrl(article.url);

            const date = article.published_at
              ? new Date(
                  article.published_at
                ).toLocaleDateString()
              : "";

            const coverImage =
              article.cover_image ||
              article.social_image ||
              "";

            const descRaw = (
              article.description || ""
            )
              .replace(/\s+/g, " ")
              .trim();

            const desc = escapeHtml(
              descRaw.substring(0, 160)
            );

            let tags = [];

            if (Array.isArray(article.tag_list)) {
              tags = article.tag_list;
            } else if (
              typeof article.tag_list === "string" &&
              article.tag_list.trim()
            ) {
              tags = article.tag_list
                .split(",")
                .map((t) => t.trim());
            } else if (article.tags) {
              tags = Array.isArray(article.tags)
                ? article.tags
                : String(article.tags)
                    .split(",")
                    .map((t) => t.trim());
            }

            const visibleTags = tags.slice(0, 3);
            const moreTags = Math.max(
              0,
              tags.length - visibleTags.length
            );

            L.push(
              '    <article class="devto-card">'
            );

            if (coverImage) {
              L.push(
                `      <a class="devto-cover" href="${escapeHtml(
                  url
                )}" target="_blank" rel="noopener noreferrer">`
              );

              L.push(
                `        <img src="${escapeHtml(
                  coverImage
                )}" alt="${title}" />`
              );

              L.push("      </a>");
            }

            L.push(
              '      <div class="devto-body">'
            );

            L.push(
              `        <h4 class="devto-title"><a href="${escapeHtml(
                url
              )}" target="_blank" rel="noopener noreferrer">${title}</a></h4>`
            );

            if (desc) {
              L.push(
                `        <p class="devto-desc">${desc}${
                  descRaw.length > 160
                    ? "..."
                    : ""
                }</p>`
              );
            }

            if (visibleTags.length) {
              const tagHtml = visibleTags
                .map(
                  (tag) =>
                    `<span class="devto-tag">#${escapeHtml(
                      String(tag).replace(
                        /^#/,
                        ""
                      )
                    )}</span>`
                )
                .join("");

              L.push(
                `        <div class="devto-tags">${tagHtml}${
                  moreTags
                    ? `<span class="devto-tag">+${moreTags}</span>`
                    : ""
                }</div>`
              );
            }

            const author =
              (article.user &&
                article.user.name) ||
              (article.user &&
                article.user.username) ||
              "";

            L.push(
              `        <div class="devto-meta"><span class="meta-author">${escapeHtml(
                author
              )}</span> <span class="meta-sep">•</span> <span class="meta-date">${escapeHtml(
                date
              )}</span> <a class="devto-read" href="${escapeHtml(
                url
              )}" target="_blank" rel="noopener noreferrer">Read more ↗</a></div>`
            );

            L.push("      </div>");
            L.push("    </article>");
          });

          L.push("  </div>");

          L.push(
            `  <div style="margin-top:16px;text-align:left;"><a class="btn btn-primary" href="https://dev.to/${escapeHtml(
              devtoUser
            )}" target="_blank" rel="noopener noreferrer">See more →</a></div>`
          );

          L.push("</div>");
          L.push("");
        }
      }

      // ───────── FOOTER ─────────
      L.push("---");

      L.push(
        `<p align="center"><i>⭐️ From <a href="${ghProfileUrl(
          user
        )}">${escapeMdText(
          user || "your-username"
        )}</a></i></p>`
      );

      return (
        L.join("\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim() + "\n"
      );
    }

    return {
      statTheme,
      generate,
    };
  }
);