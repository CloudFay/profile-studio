(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ProfileStudioState = factory();
  }
})(
  typeof window !== "undefined" ? window : globalThis,
  function () {
    const LS_KEY = "ghprofile.v2";

    const defaultState = () => ({
      name: "",
      username: "",
      tagline: "",
      tagline2: "",
      greeting: "Hello! I'm",
      headlineColor: "#a371f7",

      bio: "",
      working: "",
      learning: "",
      collab: "",
      help: "",
      ask: "",
      pronouns: "",
      fun: "",

      tech: {},
      socials: {},

      factOrder: [
        "working",
        "learning",
        "collab",
        "help",
        "ask",
        "pronouns",
        "fun",
      ],

      socialOrder: [
        "linkedin",
        "x",
        "instagram",
        "tiktok",
        "youtube",
        "pinterest",
        "devto",
        "website",
        "email",
      ],

      addons: {
        stats: true,
        langs: true,
        activity: true,
        quote: true,
        devto: false,
      },

      devtoUsername: "",
      devtoPostCount: 5,

      devtoCache: {
        articles: [],
        lastFetch: 0,
        error: "",
      },

      statsHost: "",
      badgeStyle: "for-the-badge",
      accent: "#2ea043",
    });

    function mergeOrder(saved, defaults) {
      const order = Array.isArray(saved)
        ? saved.filter((key) => defaults.includes(key))
        : [];

      defaults.forEach((key) => {
        if (!order.includes(key)) {
          order.push(key);
        }
      });

      return order;
    }

    function load() {
      try {
        const raw = JSON.parse(localStorage.getItem(LS_KEY));

        if (raw && typeof raw === "object") {
          const defaults = defaultState();

          const state = Object.assign(defaults, raw);

          state.addons = Object.assign(
            defaultState().addons,
            raw.addons || {}
          );

          state.devtoCache = Object.assign(
            defaultState().devtoCache,
            raw.devtoCache || {}
          );

          // Removed features from older versions.
          delete state.addons.views;
          delete state.addons.trophies;
          delete state.reach;

          // Ensure saved ordering remains valid.
          state.factOrder = mergeOrder(
            raw.factOrder,
            defaults.factOrder
          );

          state.socialOrder = mergeOrder(
            raw.socialOrder,
            defaults.socialOrder
          );

          return state;
        }
      } catch (error) {
        // Fall back to defaults if localStorage contains
        // invalid JSON or is unavailable.
      }

      return defaultState();
    }

    function persist(state) {
      try {
        localStorage.setItem(
          LS_KEY,
          JSON.stringify(state)
        );
      } catch (error) {
        // Ignore persistence failures.
      }
    }

    return {
      LS_KEY,
      defaultState,
      mergeOrder,
      load,
      persist,
    };
  }
);