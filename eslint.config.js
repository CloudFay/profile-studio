const globals = require("globals");

module.exports = [
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.es2021,

        // UMD / CommonJS compatibility
        module: "readonly",
        require: "readonly",

        // Browser libraries loaded by index.html
        marked: "readonly",
        JSZip: "readonly",

        // Globals provided by catalog.js
        TECH: "readonly",
        SOCIALS: "readonly",
        badgeUrl: "readonly",
        shEscape: "readonly",
      },
    },

    rules: {
      "no-undef": "error",

      "no-unused-vars": [
        "warn",
        {
          args: "none",
          caughtErrors: "none",
        },
      ],

      "no-constant-binary-expression": "error",
      "no-unreachable": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-fallthrough": "error",
      "no-invalid-regexp": "error",
      "no-self-assign": "error",
      "no-unexpected-multiline": "error",
    },
  },

  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-undef": "error",

      "no-unused-vars": [
        "warn",
        {
          args: "none",
          caughtErrors: "none",
        },
      ],
    },
  },

  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
    ],
  },
];