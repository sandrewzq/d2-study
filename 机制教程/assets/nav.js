/* D2 机制教程 · 导航与配色
   三件事：配色切换、侧栏高亮、移动端抽屉。零依赖。 */
(function () {
  var root = document.documentElement;

  /* ---------- 配色 ---------- */
  var order = ["auto", "dark", "light"];
  var label = { auto: "跟随系统", dark: "深色", light: "浅色" };
  var btn = document.getElementById("theme");
  var saved = null;
  try { saved = localStorage.getItem("d2manual-theme"); } catch (e) {}
  if (saved && order.indexOf(saved) > -1) root.setAttribute("data-theme", saved);

  function paintTheme() {
    if (!btn) return;
    btn.textContent = "配色：" + label[root.getAttribute("data-theme") || "auto"];
  }
  paintTheme();

  if (btn) {
    btn.addEventListener("click", function () {
      var now = root.getAttribute("data-theme") || "auto";
      var next = order[(order.indexOf(now) + 1) % order.length];
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("d2manual-theme", next); } catch (e) {}
      paintTheme();
    });
  }

  /* ---------- 侧栏：当前页高亮 ---------- */
  /* 两套导航各按自己的键高亮：.g-nav 认「属于学习手册的哪一块」（data-block），
     .c-nav 认「属于这一块的哪一页」（data-page）。 */
  function markCurrent(selector, key) {
    if (!key) return;
    [].slice.call(document.querySelectorAll(selector)).forEach(function (a) {
      if (a.getAttribute("data-key") === key) {
        a.classList.add("on");
        a.setAttribute("aria-current", "page");
      }
    });
  }
  markCurrent(".g-nav a", document.body.getAttribute("data-block"));
  markCurrent(".c-nav a", document.body.getAttribute("data-page"));

  /* ---------- 侧栏：当前页锚点跟随滚动 ---------- */
  var localLinks = [].slice.call(document.querySelectorAll(".l-nav a"));
  if (localLinks.length) {
    var targets = localLinks.map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return document.getElementById(id);
    });
    var syncLocal = function () {
      var y = window.scrollY + 140;
      var best = 0;
      targets.forEach(function (t, i) {
        if (t && t.offsetTop <= y) best = i;
      });
      localLinks.forEach(function (a, i) {
        a.classList.toggle("on", i === best);
      });
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        syncLocal();
        ticking = false;
      });
    }, { passive: true });
    window.addEventListener("resize", syncLocal, { passive: true });
    syncLocal();
  }

  /* ---------- 移动端抽屉 ---------- */
  var toggle = document.getElementById("navtoggle");
  var side = document.getElementById("side");
  if (toggle && side) {
    toggle.addEventListener("click", function () {
      var open = side.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "关闭" : "目录";
    });
    side.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        side.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "目录";
      }
    });
  }
})();
