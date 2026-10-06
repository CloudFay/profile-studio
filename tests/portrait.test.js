const test = require("node:test");
const assert = require("node:assert/strict");

const {
  generateFromImageData,
  DEFAULTS,
} = require("../js/portrait.js");

test("generates a dot-matrix SVG from image data", () => {
  const rgba = new Uint8ClampedArray([
    255, 255, 255, 255,
    120, 120, 120, 255,
    30, 30, 30, 255,
    255, 255, 255, 255,
  ]);

  const svg = generateFromImageData(
    { width: 2, height: 2, data: rgba },
    {
      ...DEFAULTS,
      cell: 10,
      reveal: true,
      color: false,
      floor: 0,
    }
  );

  assert.match(svg, /<circle\b/);
});

test("can generate a static color portrait", () => {
  const rgba = new Uint8ClampedArray([
    255, 0, 0, 255,
    0, 255, 0, 255,
    0, 0, 255, 255,
    255, 255, 0, 255,
  ]);

  const svg = generateFromImageData(
    { width: 2, height: 2, data: rgba },
    {
      ...DEFAULTS,
      cell: 10,
      reveal: false,
      color: true,
      floor: 0,
    }
  );

  assert.match(svg, /fill="#ff0000"/i);
  assert.doesNotMatch(svg, /@keyframes rv/);
});


test("supports invert, circle, animation, and upward reveal modes", () => {
  const rgba = new Uint8ClampedArray([
    20, 40, 60, 255,
    200, 180, 160, 255,
    80, 100, 120, 255,
    240, 220, 200, 255,
  ]);

  const svg = generateFromImageData(
    { width: 2, height: 2, data: rgba },
    {
      ...DEFAULTS,
      cell: 10,
      floor: 0,
      invert: true,
      circle: true,
      animate: true,
      lanes: 2,
      reveal: true,
      revealDir: "up",
    }
  );

  assert.match(svg, /@keyframes dp/);
  assert.match(svg, /@keyframes rv/);
  assert.match(svg, /class="d l[01]"/);
});

test("handles transparent pixels and disabled detail/contrast branches", () => {
  const rgba = new Uint8ClampedArray([
    0, 0, 0, 0,
    255, 255, 255, 255,
    80, 80, 80, 100,
    10, 20, 30, 255,
  ]);

  const svg = generateFromImageData(
    { width: 2, height: 2, data: rgba },
    {
      ...DEFAULTS,
      cell: 10,
      floor: 0,
      detail: 0,
      contrast: 1,
      reveal: false,
      color: false,
    }
  );

  assert.match(svg, /role="img"/);
  assert.match(svg, /fill="#39d353"/);
  assert.doesNotMatch(svg, /@keyframes rv/);
});

test("svgToDataUri encodes SVG content", () => {
  const { svgToDataUri } = require("../js/portrait.js");
  const uri = svgToDataUri("<svg><circle /></svg>");
  assert.match(uri, /^data:image\/svg\+xml;charset=utf-8,/);
  assert.match(uri, /%3Csvg%3E/);
});
