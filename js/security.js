(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ProfileStudioSecurity = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  // Escape a value before placing it inside HTML.
  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Escape a value used as Markdown body text.
  function escapeMdText(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Only allow URL schemes that Profile Studio explicitly trusts.
  function isSafeUrl(value) {
    const raw = String(value == null ? "" : value).trim();

    if (!raw) return false;

    try {
      const url = new URL(raw);

      return (
        url.protocol === "https:" ||
        url.protocol === "http:" ||
        url.protocol === "mailto:"
      );
    } catch {
      return false;
    }
  }

  function safeUrl(value, fallback = "#") {
    return isSafeUrl(value)
      ? String(value).trim()
      : fallback;
  }

  return {
    escapeHtml,
    escapeMdText,
    isSafeUrl,
    safeUrl,
  };
});


