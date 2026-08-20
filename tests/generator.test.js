const test = require("node:test");
const assert = require("node:assert/strict");

const {
  generate,
} = require("../js/generator.js");

function createOptions() {
  return {
    documentRef: {
      documentElement: {
        getAttribute() {
          return "light";
        },
      },
    },

    aboutFields: {
      location: {
        emoji: "📍",
        lead: "Based in",
      },
    },

    tech: {
      Languages: {
        JavaScript: {
          color: "F7DF1E",
          logo: "javascript",
        },
      },
    },

    socials: {
      github: {
        label: "GitHub",
        logo: "github",
        color: "181717",
        prefix: "https://github.com/",
      },
    },

    badgeUrl(label, cfg, style) {
      return `badge:${label}:${cfg.logo}:${style}`;
    },

    shEscape(value) {
      return encodeURIComponent(value);
    },

    normalizeHost(value) {
      return value || "";
    },

    ghProfileUrl(username) {
      return `https://github.com/${username}`;
    },

    escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },

    escapeMdText(value) {
      return String(value);
    },

    safeUrl(value) {
      return /^https?:\/\//.test(value)
        ? value
        : "#";
    },

    normalizeDevToUsername(value) {
      return value || "";
    },
  };
}

function createState() {
  return {
    username: "CloudFay",
    accent: "#2ea043",
    headlineColor: "#a371f7",

    greeting: "Hello! I'm",
    tagline: "Cloud & DevOps Engineer",
    tagline2: "",

    bio: "I build reliable developer tools.",

    factOrder: ["location"],
    location: "Nigeria",

    tech: {
      Languages: ["JavaScript"],
    },

    socials: {
      github: "CloudFay",
    },

    socialOrder: ["github"],

    badgeStyle: "for-the-badge",

    addons: {
      stats: false,
      langs: false,
      activity: false,
      quote: false,
      devto: false,
    },

    statsHost: "",

    devtoUsername: "",
    devtoPostCount: 5,

    devtoCache: {
      articles: [],
    },
  };
}

test("generates a basic profile README", () => {
  const output = generate(
    createState(),
    createOptions()
  );

  assert.match(output, /Hello! I'm/);
  assert.match(output, /lines=Cloud%20%26%20DevOps%20Engineer/);
  assert.match(
    output,
    /I build reliable developer tools/
  );
  assert.match(output, /Tech Stack/);
  assert.match(output, /JavaScript/);
  assert.match(output, /Connect With Me/);
  assert.match(output, /CloudFay/);
});

test("does not generate greeting when greeting is empty", () => {
  const state = createState();

  state.greeting = "";

  const output = generate(
    state,
    createOptions()
  );

  assert.doesNotMatch(
    output,
    /capsule-render/
  );
});

test("generates both tagline lines", () => {
  const state = createState();

  state.tagline = "Cloud Engineer";
  state.tagline2 = "Building with AWS";

  const output = generate(
    state,
    createOptions()
  );

  assert.match(output, /lines=Cloud%20Engineer;Building%20with%20AWS/);
  assert.match(output, /readme-typing-svg/);
});

test("uses Tokyo Night stats theme for dark mode", () => {
  const state = createState();

  state.addons.stats = true;

  const options = createOptions();

  options.documentRef.documentElement.getAttribute =
    () => "dark";

  const output = generate(state, options);

  assert.match(
    output,
    /theme=tokyonight/
  );
});

test("uses default stats theme for light mode", () => {
  const state = createState();

  state.addons.stats = true;

  const output = generate(
    state,
    createOptions()
  );

  assert.match(
    output,
    /theme=default/
  );
});

test("generates GitHub stats and language cards", () => {
  const state = createState();

  state.addons.stats = true;
  state.addons.langs = true;

  const output = generate(
    state,
    createOptions()
  );

  assert.match(output, /GitHub Stats/);
  assert.match(output, /show_icons=true/);
  assert.match(output, /top-langs/);
});

test("generates contribution graph", () => {
  const state = createState();

  state.addons.activity = true;

  const output = generate(
    state,
    createOptions()
  );

  assert.match(
    output,
    /github-readme-activity-graph/
  );

  assert.match(
    output,
    /Contribution Graph/
  );
});

test("generates developer quote", () => {
  const state = createState();

  state.addons.quote = true;

  const output = generate(
    state,
    createOptions()
  );

  assert.match(output, /Dev Quote/);
  assert.match(
    output,
    /quotes-github-readme/
  );
});

test("generates DEV.to preview cards", () => {
  const state = createState();

  state.addons.devto = true;
  state.devtoUsername = "CloudFay";
  state.devtoPostCount = 2;

  state.devtoCache.articles = [
    {
      title: "Building with AWS",
      url: "https://dev.to/cloudfay/building-with-aws",
      published_at: "2026-08-19T10:00:00Z",
      cover_image: "https://example.com/aws.png",
      description: "A practical guide to building developer tools with AWS.",
      tag_list: ["aws", "devops", "cloud"],
      user: {
        name: "Faith Omobude",
      },
    },
    {
      title: "Docker for Beginners",
      url: "https://dev.to/cloudfay/docker-for-beginners",
      published_at: "2026-08-18T10:00:00Z",
      social_image: "https://example.com/docker.png",
      description: "Learning Docker step by step.",
      tag_list: ["docker", "containers"],
      user: {
        username: "CloudFay",
      },
    },
  ];

  const output = generate(
    state,
    createOptions()
  );

  assert.match(output, /devto-preview/);
  assert.match(output, /devto-grid/);
  assert.match(output, /Building with AWS/);
  assert.match(output, /Docker for Beginners/);
  assert.match(output, /devto-cover/);
  assert.match(output, /devto-tags/);
  assert.match(output, /#aws/);
  assert.match(output, /#docker/);
  assert.match(output, /Faith Omobude/);
  assert.match(output, /Read more ↗/);
  assert.match(output, /https:\/\/dev.to\/CloudFay/);
});

test("generates DEV.to README table in readme mode", () => {
  const state = createState();

  state.addons.devto = true;
  state.devtoUsername = "CloudFay";

  state.devtoCache.articles = [
    {
      title: "Profile Studio",
      url: "https://dev.to/cloudfay/profile-studio",
      published_at: "2026-08-20T10:00:00Z",
      cover_image: "https://example.com/profile-studio.png",
      description: "Building a developer profile generator.",
      tag_list: ["javascript", "github", "devtools", "testing"],
      user: {
        name: "Faith Omobude",
      },
    },
  ];

  const options = createOptions();
  options.readmeMode = true;

  const output = generate(state, options);

  assert.match(output, /<!-- DEVTO:START -->/);
  assert.match(output, /### 📝 Latest DEV.to Articles/);
  assert.match(output, /<table>/);
  assert.match(output, /Profile Studio/);
  assert.match(output, /#javascript/);
  assert.match(output, /\+1/);
  assert.match(output, /Read more ↗/);
  assert.match(output, /<!-- DEVTO:END -->/);
  assert.match(
    output,
    /\[!\[See more\].*https:\/\/dev\.to\/CloudFay/s
  );
});

test("limits DEV.to articles to configured post count", () => {
  const state = createState();

  state.addons.devto = true;
  state.devtoUsername = "CloudFay";
  state.devtoPostCount = 1;

  state.devtoCache.articles = [
    {
      title: "First Article",
      url: "https://dev.to/cloudfay/first",
      description: "First article",
      tag_list: ["aws"],
      user: {
        name: "Faith",
      },
    },
    {
      title: "Second Article",
      url: "https://dev.to/cloudfay/second",
      description: "Second article",
      tag_list: ["docker"],
      user: {
        name: "Faith",
      },
    },
  ];

  const output = generate(
    state,
    createOptions()
  );

  assert.match(output, /First Article/);
  assert.doesNotMatch(output, /Second Article/);
});

test("does not generate DEV.to section when disabled", () => {
  const state = createState();

  state.addons.devto = false;
  state.devtoUsername = "CloudFay";

  state.devtoCache.articles = [
    {
      title: "Should Not Appear",
      url: "https://dev.to/cloudfay/hidden",
      description: "This should not be rendered.",
      tag_list: ["testing"],
    },
  ];

  const output = generate(
    state,
    createOptions()
  );

  assert.doesNotMatch(output, /Should Not Appear/);
  assert.doesNotMatch(output, /devto-preview/);
  assert.doesNotMatch(output, /DEVTO:START/);
});
