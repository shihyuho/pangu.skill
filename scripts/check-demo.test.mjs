import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import pangu from "pangu";

const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../site/app.js", import.meta.url), "utf8");

// Exercise the actual UMD asset and site script together. Only the DOM shell
// is stubbed; API changes must not silently send a loaded library to fallback.
function demo(value, loadLibrary = true) {
  const listeners = {};
  const elements = {
    "demo-in": { value, addEventListener: (event, fn) => { listeners[event] = fn; } },
    "demo-out": { innerHTML: "" },
    "demo-mode": { textContent: "" },
    "pangu-ver": { textContent: "" },
  };
  const context = vm.createContext({
    document: {
      documentElement: {},
      getElementById: (id) => elements[id] || null,
      querySelectorAll: () => [],
    },
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
  });
  context.window = context;
  if (loadLibrary) {
    const asset = html.match(/https:\/\/cdn\.jsdelivr\.net\/npm\/pangu@([^/]+)\/([^"\s]+)/);
    assert.ok(asset, "the site must reference a pinned pangu CDN asset");
    assert.equal(asset[1], pangu.version);
    const bundle = fs.readFileSync(new URL(`../node_modules/pangu/${asset[2]}`, import.meta.url), "utf8");
    vm.runInContext(bundle, context);
  }
  vm.runInContext(app, context);
  return {
    elements,
    type(value) {
      elements["demo-in"].value = value;
      listeners.input();
    },
    output() {
      return elements["demo-out"].innerHTML
        .replace(/<span class="sp"> <\/span>/g, " ")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    },
  };
}

test("the demo uses the pinned UMD library on initial render and input", () => {
  const page = demo("Switch+健身環");
  assert.equal(page.output(), "Switch + 健身環");
  assert.equal(page.elements["demo-mode"].textContent, `pangu.js · v${pangu.version}`);
  assert.equal(page.elements["pangu-ver"].textContent, ` · v${pangu.version}`);
  for (const [input, expected] of [
    ["前面/後面", "前面/後面"],
    ["前+A+B", "前 + A + B"],
    ["商標™產品，溫度℃變化", "商標™ 產品，溫度 ℃ 變化"],
    ["參考https://example.com/中文API?q=中文&lang=zh，謝謝", "參考 https://example.com/中文API?q=中文&lang=zh，謝謝"],
    ["喬治·R·R·馬丁", "喬治・R・R・馬丁"],
    ["前<script>後", "前 <script> 後"],
  ]) {
    page.type(input);
    assert.equal(page.output(), expected, input);
    assert.equal(page.elements["demo-mode"].textContent, `pangu.js · v${pangu.version}`);
  }
  assert.ok(!page.elements["demo-out"].innerHTML.includes("<script>"));
});

test("the demo identifies its approximate fallback when the CDN is unavailable", () => {
  const page = demo("中文API", false);
  assert.equal(page.output(), "中文 API");
  assert.equal(page.elements["demo-mode"].textContent, "Approximate fallback");
});
