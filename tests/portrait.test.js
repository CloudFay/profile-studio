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

  assert.match(svg, /<svg[^>]+viewBox="0 0 36.0 36.0"/);
  assert.match(svg, /<circle/);
  assert.match(svg, /class="rw r0"/);
  assert.match(svg, /@keyframes rv/);
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
