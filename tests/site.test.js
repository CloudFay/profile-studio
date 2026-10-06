const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function readPage(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertLocalAssetsResolve(pagePath, html) {
  const assetPaths = [...html.matchAll(/(?:href|src)="(\.\.?\/[^"#?]+)"/g)]
    .map((match) => match[1])
    .filter((assetPath) => !assetPath.endsWith("/"));

  assetPaths.forEach((assetPath) => {
    assert.equal(
      fs.existsSync(path.resolve(root, path.dirname(pagePath), assetPath)),
      true,
      `${pagePath} references missing local asset ${assetPath}`
    );
  });
}

test("marketing routes load directly with their local assets", () => {
  const pages = [
    ["index.html", "home"],
    ["use-cases/index.html", "use-cases"],
    ["create-yours/index.html", "builder"],
  ];

  pages.forEach(([pagePath, route]) => {
    const html = readPage(pagePath);
    assert.match(html, new RegExp(`<body[^>]*data-page="${route}"`));
    assertLocalAssetsResolve(pagePath, html);
  });

  assert.match(readPage("index.html"), /href="create-yours\/"/);
  assert.match(readPage("use-cases/index.html"), /href="\.\.\/create-yours\/"/);
});

test("the create route keeps the existing builder integration points", () => {
  const html = readPage("create-yours/index.html");
  assert.match(html, /class="site-page builder-page"/);
  assert.match(html, /class="site-header"/);
  assert.match(html, /href="\.\.\/use-cases\/"/);
  assert.match(html, /href="\.\.\/css\/site\.css"/);
  assert.match(html, /src="\.\.\/js\/site\.js"/);

  const requiredIds = [
    "f_username",
    "f_greeting",
    "f_tagline",
    "f_tagline2",
    "f_portrait",
    "f_profileViews",
    "aboutFields",
    "catalog",
    "socials",
    "addons",
    "stepper",
    "previewRendered",
    "previewRaw",
    "copyBtn",
    "downloadBtn",
    "finishPackageBtn",
  ];

  requiredIds.forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));
  [
    "catalog.js",
    "security.js",
    "portrait.js",
    "state.js",
    "devto.js",
    "generator.js",
    "jszip",
    "app.js",
  ].forEach((script) => assert.ok(html.includes(script), `Missing builder integration: ${script}`));
});
