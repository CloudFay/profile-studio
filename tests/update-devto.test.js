const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const https = require("node:https");

const updater = require("../.github/scripts/update-devto.js");

function withMockedHttpsGet(implementation) {
  const original = https.get;
  https.get = implementation;
  return () => {
    https.get = original;
  };
}

test("fetches DEV.to articles successfully", async () => {
  const restore = withMockedHttpsGet((url, options, callback) => {
    const response = {
      statusCode: 200,
      headers: {},
      setEncoding() {},
      on(event, handler) {
        if (event === "data") handler('[{"title":"Article"}]');
        if (event === "end") handler();
      },
    };
    callback(response);
    return { setTimeout() {}, on() {} };
  });

  try {
    const articles = await updater.fetchArticlesOnce("CloudFay", 20);
    assert.deepEqual(articles, [{ title: "Article" }]);
  } finally {
    restore();
  }
});

test("retries rate-limited DEV.to requests and honors Retry-After zero", async () => {
  let calls = 0;
  const restore = withMockedHttpsGet((url, options, callback) => {
    calls += 1;
    const status = calls === 1 ? 429 : 200;
    const response = {
      statusCode: status,
      headers: status === 429 ? { "retry-after": "0" } : {},
      setEncoding() {},
      on(event, handler) {
        if (event === "end") handler();
        if (event === "data" && status === 200) handler("[]");
      },
    };
    callback(response);
    return { setTimeout() {}, on() {} };
  });

  try {
    assert.deepEqual(await updater.fetchArticles("CloudFay", 20), []);
    assert.equal(calls, 2);
  } finally {
    restore();
  }
});

test("rejects malformed DEV.to API responses", async () => {
  const restore = withMockedHttpsGet((url, options, callback) => {
    const response = {
      statusCode: 200,
      headers: {},
      setEncoding() {},
      on(event, handler) {
        if (event === "data") handler("{}");
        if (event === "end") handler();
      },
    };
    callback(response);
    return { setTimeout() {}, on() {} };
  });

  try {
    await assert.rejects(
      updater.fetchArticlesOnce("CloudFay", 20),
      /unexpected response shape/
    );
  } finally {
    restore();
  }
});

test("generates safe DEV.to markdown and skips unsafe article URLs", () => {
  const markdown = updater.generateMarkdown(
    [
      {
        title: "<Safe & useful>",
        url: "https://dev.to/CloudFay/safe",
        description: "A ".repeat(100),
        cover_image: "javascript:alert(1)",
        tag_list: ["aws", "devops", "cloud", "extra"],
        user: { name: "Faith" },
      },
      {
        title: "Unsafe",
        url: "javascript:alert(1)",
      },
    ],
    "CloudFay"
  );

  assert.match(markdown, /DEVTO:START/);
  assert.match(markdown, /&lt;Safe &amp; useful&gt;/);
  assert.match(markdown, /#aws/);
  assert.match(markdown, /\+1/);
  assert.doesNotMatch(markdown, /javascript:/i);
  assert.match(markdown, /DEVTO:END/);
});

test("updates a README atomically when marker pair is valid", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);

  try {
    fs.writeFileSync(
      "README.md",
      "# Profile\n<!-- DEVTO:START -->\nold\n<!-- DEVTO:END -->\n",
      "utf8"
    );

    const changed = updater.updateReadme(
      "<!-- DEVTO:START -->\nnew\n<!-- DEVTO:END -->"
    );

    assert.equal(changed, true);
    assert.match(fs.readFileSync("README.md", "utf8"), /new/);
    assert.equal(fs.existsSync("README.md.tmp"), false);
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("rejects duplicate or reversed README markers", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);

  try {
    fs.writeFileSync(
      "README.md",
      "<!-- DEVTO:START -->\na\n<!-- DEVTO:START -->\nb\n<!-- DEVTO:END -->",
      "utf8"
    );
    assert.throws(
      () => updater.updateReadme("<!-- DEVTO:START -->x<!-- DEVTO:END -->"),
      /exactly one DEV.to marker pair/
    );

    fs.writeFileSync(
      "README.md",
      "<!-- DEVTO:END -->\nold\n<!-- DEVTO:START -->",
      "utf8"
    );
    assert.throws(
      () => updater.updateReadme("<!-- DEVTO:START -->x<!-- DEVTO:END -->"),
      /wrong order/
    );
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
