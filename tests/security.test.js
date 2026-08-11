const test = require("node:test");
const assert = require("node:assert/strict");

const {
  escapeHtml,
  escapeMdText,
  isSafeUrl,
  safeUrl,
} = require("../js/security.js");

test("escapeHtml neutralizes HTML markup", () => {
  const input = '<script>alert("xss")</script>';

  const result = escapeHtml(input);

  assert.equal(
    result,
    "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
  );
});

test("escapeHtml neutralizes attribute injection", () => {
  const input = '"><img src=x onerror=alert(1)>';

  const result = escapeHtml(input);

  assert.equal(
    result,
    "&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"
  );
});

test("escapeMdText neutralizes raw HTML", () => {
  const input = "<img src=x onerror=alert(1)>";

  const result = escapeMdText(input);

  assert.equal(
    result,
    "&lt;img src=x onerror=alert(1)&gt;"
  );
});

test("https URLs are allowed", () => {
  assert.equal(
    isSafeUrl("https://dev.to/CloudFay"),
    true
  );
});

test("http URLs are allowed", () => {
  assert.equal(
    isSafeUrl("http://example.com"),
    true
  );
});

test("mailto URLs are allowed", () => {
  assert.equal(
    isSafeUrl("mailto:test@example.com"),
    true
  );
});

test("javascript URLs are rejected", () => {
  assert.equal(
    isSafeUrl("javascript:alert(1)"),
    false
  );
});

test("data URLs are rejected", () => {
  assert.equal(
    isSafeUrl("data:text/html,<script>alert(1)</script>"),
    false
  );
});

test("empty URLs are rejected", () => {
  assert.equal(
    isSafeUrl(""),
    false
  );
});

test("safeUrl returns allowed URLs", () => {
  assert.equal(
    safeUrl("https://dev.to/CloudFay"),
    "https://dev.to/CloudFay"
  );
});

test("safeUrl replaces unsafe URLs", () => {
  assert.equal(
    safeUrl("javascript:alert(1)"),
    "#"
  );
});

test("safeUrl replaces empty URLs", () => {
  assert.equal(
    safeUrl(""),
    "#"
  );
});