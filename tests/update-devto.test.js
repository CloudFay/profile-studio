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

test("retries transient 5xx responses without delaying the test", async () => {
  let calls = 0;
  const delays = [];
  const restore = withMockedHttpsGet((url, options, callback) => {
    calls += 1;
    const status = calls < 3 ? 503 : 200;
    const response = {
      statusCode: status,
      headers: {},
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
    assert.deepEqual(await updater.fetchArticles("CloudFay", 20, {
      sleepFn: async (ms) => delays.push(ms),
    }), []);
    assert.equal(calls, 3);
    assert.deepEqual(delays, [1000, 2000]);
  } finally {
    restore();
  }
});

test("exhausts retries and returns the final transient error", async () => {
  let calls = 0;
  const restore = withMockedHttpsGet((url, options, callback) => {
    calls += 1;
    const response = {
      statusCode: 500,
      headers: {},
      setEncoding() {},
      on(event, handler) {
        if (event === "end") handler();
      },
    };
    callback(response);
    return { setTimeout() {}, on() {} };
  });

  try {
    await assert.rejects(
      updater.fetchArticles("CloudFay", 20, { sleepFn: async () => {} }),
      /HTTP 500/
    );
    assert.equal(calls, 3);
  } finally {
    restore();
  }
});

test("ignores invalid Retry-After values and uses exponential backoff", async () => {
  let calls = 0;
  const delays = [];
  const restore = withMockedHttpsGet((url, options, callback) => {
    calls += 1;
    const response = {
      statusCode: 502,
      headers: { "retry-after": "tomorrow" },
      setEncoding() {},
      on(event, handler) {
        if (event === "end") handler();
      },
    };
    callback(response);
    return { setTimeout() {}, on() {} };
  });

  try {
    await assert.rejects(
      updater.fetchArticles("CloudFay", 20, {
        sleepFn: async (ms) => delays.push(ms),
      }),
      /HTTP 502/
    );
    assert.equal(calls, 3);
    assert.deepEqual(delays, [1000, 2000]);
  } finally {
    restore();
  }
});

test("retries request errors without delaying the test", async () => {
  let calls = 0;
  const restore = withMockedHttpsGet((url, options, callback) => {
    calls += 1;
    if (calls < 3) {
      const request = {
        setTimeout() {},
        on(event, handler) {
          if (event === "error") {
            queueMicrotask(() => handler(new Error("socket failure")));
          }
        },
      };
      return request;
    }

    const response = {
      statusCode: 200,
      headers: {},
      setEncoding() {},
      on(event, handler) {
        if (event === "data") handler("[]");
        if (event === "end") handler();
      },
    };
    callback(response);
    return { setTimeout() {}, on() {} };
  });

  try {
    assert.deepEqual(await updater.fetchArticles("CloudFay", 20, {
      sleepFn: async () => {},
    }), []);
    assert.equal(calls, 3);
  } finally {
    restore();
  }
});

test("rejects README updates when README is missing", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    assert.throws(
      () => updater.updateReadme("<!-- DEVTO:START -->x<!-- DEVTO:END -->"),
      /README.md not found/
    );
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("rejects generated DEV.to content without both markers", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    fs.writeFileSync("README.md", "<!-- DEVTO:START -->\nold\n<!-- DEVTO:END -->\n", "utf8");
    assert.throws(
      () => updater.updateReadme("generated content"),
      /Generated DEV.to content is missing required markers/
    );
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("rejects README with only one DEV.to marker", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    fs.writeFileSync("README.md", "<!-- DEVTO:START -->\nold\n", "utf8");
    assert.throws(
      () => updater.updateReadme("<!-- DEVTO:START -->x<!-- DEVTO:END -->"),
      /exactly one DEV.to marker pair/
    );
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("returns false when the README content is already current", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    const content = "<!-- DEVTO:START -->\nx\n<!-- DEVTO:END -->";
    fs.writeFileSync("README.md", content, "utf8");
    assert.equal(updater.updateReadme(content), false);
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("normalizes DEV.to post_count configuration", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    fs.mkdirSync(".github");
    fs.writeFileSync(".github/profile-studio.json", JSON.stringify({
      devto: { username: " CloudFay ", post_count: 99, enabled: true, automation: true },
    }), "utf8");
    assert.deepEqual(updater.readConfig(), {
      username: "CloudFay", postCount: 20, enabled: true, automation: true,
    });
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("defaults invalid post_count and disabled DEV.to flags safely", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    fs.mkdirSync(".github");
    fs.writeFileSync(".github/profile-studio.json", JSON.stringify({
      devto: { post_count: "not-a-number", enabled: false, automation: false },
    }), "utf8");
    assert.deepEqual(updater.readConfig(), {
      username: "", postCount: 5, enabled: false, automation: false,
    });
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("fails clearly when DEV.to configuration is missing or invalid", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-studio-devto-"));
  const previous = process.cwd();
  process.chdir(tempDir);
  try {
    assert.throws(() => updater.readConfig(), /profile-studio\.json not found/);
    fs.mkdirSync(".github");
    fs.writeFileSync(".github/profile-studio.json", "{", "utf8");
    assert.throws(() => updater.readConfig(), /Failed to parse/);
  } finally {
    process.chdir(previous);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
