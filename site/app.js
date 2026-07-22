/* pangu.skill landing — theme, live demo, copy, reveal. No dependencies
   beyond the real pangu.js UMD loaded from the CDN (with a small fallback). */
(function () {
  "use strict";

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme");
      var next = cur
        ? cur === "dark" ? "light" : "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("pangu-theme", next); } catch (e) {}
    });
  }

  /* ---------- live spacing demo ---------- */
  var input = document.getElementById("demo-in");
  var output = document.getElementById("demo-out");

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, function (c) {
      return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
    });
  }

  // Offline fallback if the CDN pangu fails. Approximate; the real library is
  // the source of truth and is used whenever it loads.
  function fallbackSpace(s) {
    var CJK = "⺀-⻿぀-ヿ㐀-䶿一-鿿豈-﫿";
    s = s.replace(new RegExp("([" + CJK + "])([A-Za-z0-9@&=\\[\\(])", "g"), "$1 $2");
    s = s.replace(new RegExp("([A-Za-z0-9!~&=%\\]\\)])([" + CJK + "])", "g"), "$1 $2");
    return s;
  }

  function space(s) {
    if (window.pangu && typeof window.pangu.spacingText === "function") {
      try { return window.pangu.spacingText(s); } catch (e) {}
    }
    return fallbackSpace(s);
  }

  // pangu only inserts spaces, so align spaced against raw and mark the inserts.
  function highlight(raw, spaced) {
    var out = "", i = 0;
    for (var j = 0; j < spaced.length; j++) {
      var c = spaced[j];
      if (i < raw.length && c === raw[i]) { out += escapeHtml(c); i++; }
      else if (c === " ") { out += '<span class="sp"> </span>'; }
      else { out += escapeHtml(c); }
    }
    return out;
  }

  function render() {
    if (!input || !output) return;
    var raw = input.value;
    var spaced = space(raw);
    output.innerHTML = highlight(raw, spaced);
  }

  if (input) {
    input.addEventListener("input", render);
    // pangu loads with defer; render now and once more after load settles.
    render();
    window.addEventListener("load", render);
  }

  /* ---------- show the running pangu version ---------- */
  // Read the version off the loaded library so the label can never disagree
  // with the pangu that actually spaced the demo above.
  var verEl = document.getElementById("pangu-ver");
  function showVersion() {
    if (verEl && window.pangu && window.pangu.version) {
      verEl.textContent = " · v" + window.pangu.version;
    }
  }
  showVersion();
  window.addEventListener("load", showVersion);

  /* ---------- copy buttons ---------- */
  var copies = document.querySelectorAll(".copy");
  Array.prototype.forEach.call(copies, function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".cmd");
      var pre = card && card.querySelector("pre");
      if (!pre) return;
      var lines = pre.querySelectorAll(".ln");
      var text = lines.length
        ? Array.prototype.map.call(lines, function (l) { return l.textContent; }).join("\n")
        : pre.textContent;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "copied";
        btn.classList.add("ok");
        setTimeout(function () { btn.textContent = old; btn.classList.remove("ok"); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.16 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }
})();
