const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeDevToUsername,
  devToMarkdown,
} = require("../js/devto.js");

test("normalizes a DEV.to username", () => {
  assert.equal(
    normalizeDevToUsername("CloudFay"),
    "CloudFay"
  );
});

test("normalizes a DEV.to profile URL", () => {
  assert.equal(
    normalizeDevToUsername(
      "https://dev.to/CloudFay"
    ),
    "CloudFay"
  );
});

test("normalizes a DEV.to URL with trailing path", () => {
  assert.equal(
    normalizeDevToUsername(
      "https://dev.to/CloudFay/"
    ),
    "CloudFay"
  );
});

test("empty DEV.to username returns empty string", () => {
  assert.equal(
    normalizeDevToUsername(""),
    ""
  );
});

test("generates DEV.to markdown", () => {
  const markdown = devToMarkdown(
    "CloudFay",
    [
      {
        title: "Building Secure Developer Tools",
        url: "https://dev.to/CloudFay/example",
        description: "A short article description.",
        published_at: "2026-08-11T10:00:00Z",
        cover_image:
          "https://example.com/cover.png",
      },
    ]
  );

  assert.match(
    markdown,
    /DEVTO:START/
  );

  assert.match(
    markdown,
    /Building Secure Developer Tools/
  );

  assert.match(
    markdown,
    /https:\/\/dev\.to\/CloudFay\/example/
  );
});

test("unsafe DEV.to article URL is replaced", () => {
  const markdown = devToMarkdown(
    "CloudFay",
    [
      {
        title: "Unsafe article",
        url: "javascript:alert(1)",
      },
    ]
  );

  assert.match(
    markdown,
    /\(#\)/
  );

  assert.doesNotMatch(
    markdown,
    /javascript:/i
  );
});

test("unsafe cover image is not rendered", () => {
  const markdown = devToMarkdown(
    "CloudFay",
    [
      {
        title: "Image test",
        url: "https://dev.to/CloudFay/test",
        cover_image:
          "javascript:alert(1)",
      },
    ]
  );

  assert.doesNotMatch(
    markdown,
    /<img/
  );
});