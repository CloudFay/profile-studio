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
