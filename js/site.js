(() => {
  const THEME_KEY = "profile-studio.site-theme";
  const themeToggle = document.querySelector(".theme-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  let main = document.getElementById("site-main");
  let revealObserver;

  if (!main) return;

  function setTheme(theme, save = true) {
    const value = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", value);

    if (themeToggle) {
      const next = value === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
      themeToggle.setAttribute("title", `Switch to ${next} theme`);
      themeToggle.innerHTML = value === "dark"
        ? '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.8"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
        : '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.3A8.8 8.8 0 0 1 8.7 3.5 8.8 8.8 0 1 0 20.5 15.3Z"/></svg>';
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = value === "dark" ? "#090812" : "#faf9fc";

    if (save) {
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch (error) {
        console.warn("Could not save the Profile Studio theme preference.", error);
      }
    }
  }

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) setTheme(savedTheme, false);
  } catch (error) {
    console.warn("Could not read the saved Profile Studio theme preference.", error);
  }

  themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  function closeMenu() {
    menuToggle?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
  }

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    navigation?.classList.toggle("is-open", open);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  function revealContent(container = document) {
    revealObserver?.disconnect();
    const revealItems = container.querySelectorAll("[data-reveal]");
    document.body.classList.add("site-motion-ready");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    revealObserver = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    revealItems.forEach((item) => {
      item.classList.remove("is-visible");
      revealObserver.observe(item);
    });
  }

  function updateActiveLink(page) {
    const segments = window.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    if (segments.at(-1) === "use-cases") segments.pop();
    const siteRoot = `/${segments.length ? `${segments.join("/")}/` : ""}`;

    document.querySelectorAll("[data-route]").forEach((link) => {
      const route = link.dataset.route;
      link.href = route === "use-cases" ? `${siteRoot}use-cases/` : siteRoot;
      if (route === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function routeFor(pathname) {
    const segments = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    const lastSegment = segments.at(-1);
    if (lastSegment === "use-cases") return "use-cases";
    if (lastSegment === "create-yours") return "builder";
    return "home";
  }

  async function navigate(url, { replace = false, scroll = true } = {}) {
    const response = await fetch(url.href, { headers: { Accept: "text/html" } });
    if (!response.ok) throw new Error(`Could not load ${url.pathname} (${response.status}).`);

    const nextDocument = new DOMParser().parseFromString(await response.text(), "text/html");
    const nextMain = nextDocument.getElementById("site-main");
    if (!nextMain) throw new Error(`The page at ${url.pathname} is missing its main content.`);

    main.replaceWith(nextMain);
    main = nextMain;
    nextMain.id = "site-main";
    document.title = nextDocument.title;
    const description = nextDocument.querySelector('meta[name="description"]')?.content;
    const currentDescription = document.querySelector('meta[name="description"]');
    if (description && currentDescription) currentDescription.content = description;

    const page = nextMain.dataset.page || "home";
    document.body.dataset.page = page;
    updateActiveLink(page);
    closeMenu();

    if (replace) history.replaceState({ page }, "", url);
    else history.pushState({ page }, "", url);

    revealContent(nextMain);
    if (url.hash) {
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: "smooth" });
      });
    } else if (scroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const heading = nextMain.querySelector("h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  document.addEventListener("click", async (event) => {
    const link = event.target.closest("a[data-site-link]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const targetPage = routeFor(destination.pathname);
    if (targetPage === "builder" || document.body.dataset.page === "builder") return;

    if (destination.pathname === window.location.pathname && destination.hash) {
      event.preventDefault();
      closeMenu();
      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (target) {
        history.pushState({ page: document.body.dataset.page }, "", destination);
        target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (destination.pathname === window.location.pathname && !destination.hash) {
      closeMenu();
      return;
    }

    event.preventDefault();
    try {
      await navigate(destination);
    } catch (error) {
      console.error("Profile Studio page navigation failed; opening the route directly.", error);
      window.location.assign(destination.href);
    }
  });

  window.addEventListener("popstate", () => {
    const currentRoute = routeFor(window.location.pathname);
    if (currentRoute === "builder") return;
    const currentPage = document.body.dataset.page;
    if (currentRoute === currentPage) {
      if (window.location.hash) {
        document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0 });
      }
      return;
    }

    navigate(new URL(window.location.href), { replace: true }).catch((error) => {
      console.error("Could not restore the previous Profile Studio page.", error);
      window.location.reload();
    });
  });

  updateActiveLink(main.dataset.page || "home");
  revealContent();
})();
