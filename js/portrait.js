(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ProfileStudioPortrait = factory();
  }
})(
  typeof window !== "undefined" ? window : globalThis,
  function () {
    const DEFAULTS = {
      cols: 100,
      cell: 10,
      dotScale: 0.92,
      gamma: 1,
      contrast: 1.25,
      detail: 0.5,
      floor: 0.06,
      pad: 8,
      reveal: true,
      revealTime: 2.5,
      revealFade: 0.45,
      revealDir: "down",
      color: true,
      circle: false,
      animate: false,
      lanes: 14,
      duration: 4,
    };

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function luminance(r, g, b) {
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function equalize(gray, alpha) {
      const hist = new Uint32Array(256);
      let total = 0;

      for (let i = 0; i < gray.length; i += 1) {
        if (alpha[i] >= 128) {
          hist[gray[i]] += 1;
          total += 1;
        }
      }

      if (!total) return gray;

      const cdf = new Uint32Array(256);
      let running = 0;
      let cdfMin = 0;

      for (let i = 0; i < 256; i += 1) {
        running += hist[i];
        cdf[i] = running;
        if (!cdfMin && running) cdfMin = running;
      }

      const denominator = Math.max(1, total - cdfMin);
      const out = new Uint8ClampedArray(gray.length);

      for (let i = 0; i < gray.length; i += 1) {
        if (alpha[i] < 128) {
          out[i] = 0;
          continue;
        }
        out[i] = clamp(
          Math.round(((cdf[gray[i]] - cdfMin) / denominator) * 255),
          0,
          255
        );
      }

      return out;
    }

    function addDetail(gray, width, height, amount) {
      if (amount <= 0) return gray;

      const out = new Uint8ClampedArray(gray.length);

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          let sum = 0;
          let count = 0;

          for (let dy = -2; dy <= 2; dy += 1) {
            const ny = clamp(y + dy, 0, height - 1);

            for (let dx = -2; dx <= 2; dx += 1) {
              const nx = clamp(x + dx, 0, width - 1);
              sum += gray[ny * width + nx];
              count += 1;
            }
          }

          const index = y * width + x;
          const local = sum / count;

          out[index] = clamp(
            Math.round(gray[index] + (gray[index] - local) * amount),
            0,
            255
          );
        }
      }

      return out;
    }

    function applyContrast(gray, amount) {
      if (amount === 1) return gray;

      const out = new Uint8ClampedArray(gray.length);

      for (let i = 0; i < gray.length; i += 1) {
        out[i] = clamp(
          Math.round((gray[i] - 128) * amount + 128),
          0,
          255
        );
      }

      return out;
    }

    function adjustRgb(rgba, amount) {
      if (amount === 1) return rgba;

      const out = new Uint8ClampedArray(rgba.length);

      for (let i = 0; i < rgba.length; i += 1) {
        out[i] =
          i % 4 === 3
            ? rgba[i]
            : clamp(
                Math.round((rgba[i] - 128) * amount + 128),
                0,
                255
              );
      }

      return out;
    }

    function circleFalloff(x, y, cols, rows, feather) {
      const nx = ((x + 0.5) / cols) * 2 - 1;
      const ny = ((y + 0.5) / rows) * 2 - 1;
      const distance = Math.hypot(nx, ny);

      if (distance <= 1 - feather) return 1;
      if (distance >= 1 + feather) return 0;

      return (1 + feather - distance) / (2 * feather);
    }

    function svgHeader(width, height, rows, opts) {
      const css = [];

      if (opts.animate) {
        css.push("@keyframes dp{0%,100%{opacity:.45}50%{opacity:1}}");
        css.push(
          ".d{animation:dp " +
            opts.duration +
            "s ease-in-out infinite}"
        );

        for (let i = 0; i < opts.lanes; i += 1) {
          css.push(
            ".l" +
              i +
              "{animation-delay:" +
              ((i / opts.lanes) * opts.duration).toFixed(2) +
              "s}"
          );
        }
      }

      if (opts.reveal) {
        const step = opts.revealTime / Math.max(rows - 1, 1);

        css.push("@keyframes rv{from{opacity:0}to{opacity:1}}");
        css.push(
          ".rw{animation:rv " +
            opts.revealFade +
            "s ease-out both}"
        );

        for (let y = 0; y < rows; y += 1) {
          const index =
            opts.revealDir === "up"
              ? rows - 1 - y
              : y;

          css.push(
            ".r" +
              y +
              "{animation-delay:" +
              (index * step).toFixed(3) +
              "s}"
          );
        }
      }

      const style = css.length
        ? "<style>" + css.join("") + "</style>"
        : "";

      return (
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox="0 0 ' +
        (width + opts.pad * 2).toFixed(1) +
        " " +
        (height + opts.pad * 2).toFixed(1) +
        '" width="' +
        (width + opts.pad * 2).toFixed(1) +
        '" height="' +
        (height + opts.pad * 2).toFixed(1) +
        '" role="img" aria-label="dot-matrix portrait">' +
        style +
        '<g transform="translate(' +
        opts.pad.toFixed(1) +
        "," +
        opts.pad.toFixed(1) +
        ')">'
      );
    }

    function buildSvg(gray, rgba, alpha, cols, rows, options) {
      const opts = { ...DEFAULTS, ...options };
      const cell = opts.cell;
      const maxRadius = cell * 0.5 * opts.dotScale;
      const lanes = Math.max(1, Math.floor(opts.lanes));
      const output = [];

      for (let y = 0; y < rows; y += 1) {
        const row = [];

        for (let x = 0; x < cols; x += 1) {
          const index = y * cols + x;

          if (alpha[index] < 128) continue;

          let value = gray[index] / 255;

          if (opts.invert) {
            value = 1 - value;
          }

          value = clamp(Math.pow(value, opts.gamma), 0, 1);

          if (opts.circle) {
            value *= circleFalloff(
              x,
              y,
              cols,
              rows,
              0.06
            );
          }

          if (value < opts.floor) continue;

          const radius =
            maxRadius * Math.pow(value, 0.85);

          if (radius < 0.18) continue;

          const cx = x * cell + cell / 2;
          const cy = y * cell + cell / 2;

          let fill = "#39d353";

          if (opts.color) {
            const p = index * 4;
            fill =
              "#" +
              [rgba[p], rgba[p + 1], rgba[p + 2]]
                .map((channel) =>
                  Math.round(channel)
                    .toString(16)
                    .padStart(2, "0")
                )
                .join("");
          }

          let classes = "";

          if (opts.animate) {
            classes =
              ' class="d l' +
              (x % lanes) +
              '"';
          }

          row.push(
            '<circle cx="' +
              cx.toFixed(1) +
              '" cy="' +
              cy.toFixed(1) +
              '" r="' +
              radius.toFixed(2) +
              '" fill="' +
              fill +
              '"' +
              classes +
              "/>"
          );
        }

        if (!row.length) continue;

        const content = row.join("");

        if (opts.reveal) {
          output.push(
            '<g class="rw r' +
              y +
              '">' +
              content +
              "</g>"
          );
        } else {
          output.push(content);
        }
      }

      return (
        svgHeader(
          cols * cell,
          rows * cell,
          rows,
          opts
        ) +
        output.join("") +
        "</g></svg>"
      );
    }

    function generateFromImageData(imageData, options) {
      const opts = { ...DEFAULTS, ...(options || {}) };
      const width = imageData.width;
      const height = imageData.height;
      const rgba = imageData.data;

      const gray = new Uint8ClampedArray(
        width * height
      );
      const alpha = new Uint8ClampedArray(
        width * height
      );

      for (let i = 0; i < width * height; i += 1) {
        const p = i * 4;
        alpha[i] = rgba[p + 3];
        gray[i] = Math.round(
          luminance(
            rgba[p],
            rgba[p + 1],
            rgba[p + 2]
          )
        );
      }

      for (let i = 0; i < gray.length; i += 1) {
        if (alpha[i] < 250) {
          gray[i] = Math.round(
            gray[i] * (alpha[i] / 255)
          );
        }
      }

      const equalized = equalize(gray, alpha);
      const detailed = addDetail(
        equalized,
        width,
        height,
        opts.detail
      );
      const contrasted = applyContrast(
        detailed,
        opts.contrast
      );
      const adjustedRgb = adjustRgb(
        rgba,
        opts.contrast
      );

      return buildSvg(
        contrasted,
        adjustedRgb,
        alpha,
        width,
        height,
        opts
      );
    }

    function loadImage(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = function () {
          URL.revokeObjectURL(url);
          resolve(image);
        };

        image.onerror = function () {
          URL.revokeObjectURL(url);
          reject(
            new Error(
              "The selected image could not be decoded."
            )
          );
        };

        image.src = url;
      });
    }

    async function createFromFile(file, options) {
      const opts = { ...DEFAULTS, ...(options || {}) };

      if (
        !file ||
        !/^image\/(jpeg|png|webp)$/i.test(file.type)
      ) {
        throw new Error(
          "Choose a JPG, PNG, or WebP image."
        );
      }

      const image = await loadImage(file);
      const cols = clamp(
        Math.round(Number(opts.cols) || 100),
        60,
        140
      );

      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = cols;

      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!ctx) {
        throw new Error(
          "Your browser could not create an image-processing canvas."
        );
      }

      const imageWidth =
        image.naturalWidth || image.width;
      const imageHeight =
        image.naturalHeight || image.height;
      const side = Math.min(
        imageWidth,
        imageHeight
      );

      const focusX = clamp(
        Number(opts.focusX) || 0.5,
        0,
        1
      );
      const focusY = clamp(
        Number(opts.focusY) || 0.5,
        0,
        1
      );

      const left = clamp(
        focusX * imageWidth - side / 2,
        0,
        imageWidth - side
      );
      const top = clamp(
        focusY * imageHeight - side / 2,
        0,
        imageHeight - side
      );

      ctx.clearRect(0, 0, cols, cols);
      ctx.drawImage(
        image,
        left,
        top,
        side,
        side,
        0,
        0,
        cols,
        cols
      );

      return generateFromImageData(
        ctx.getImageData(
          0,
          0,
          cols,
          cols
        ),
        { ...opts, cols }
      );
    }

    function svgToDataUri(svg) {
      return (
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svg)
      );
    }

    return {
      DEFAULTS,
      clamp,
      generateFromImageData,
      createFromFile,
      svgToDataUri,
    };
  }
);
