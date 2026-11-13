/* FuturePath — Site Interactions, Motion System & Accessibility
   Powered by the frontend-design skill:
   - Smooth mouse-following parallax (--mx, --my) with lerp on hero & page-hero
   - Cursor-tracking radial spotlight (--px, --py) on cards
   - Subtle magnetic pull on primary/hero buttons
   - Staggered scroll-reveal choreography & animated metric counters
   - Scroll progress bar & accessible keyboard/touch navigation */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var btn = document.querySelector(".menu-btn");
  var moreDetails = document.querySelectorAll("details.more");
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Sticky header elevation + top scroll progress bar
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (header) {
      if (scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    var docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var pct = docHeight > 0 ? Math.min(100, Math.max(8, (scrollY / docHeight) * 100)) : 100;
    document.documentElement.style.setProperty("--scroll-progress", pct.toFixed(1) + "%");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 2. Mobile menu toggle
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 3. Close <details class="more"> dropdowns when clicking outside or pressing Escape
  document.addEventListener("click", function (e) {
    for (var i = 0; i < moreDetails.length; i++) {
      var d = moreDetails[i];
      if (d.hasAttribute("open") && !d.contains(e.target)) {
        d.removeAttribute("open");
      }
    }
    if (nav && btn && nav.classList.contains("open")) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      for (var i = 0; i < moreDetails.length; i++) {
        moreDetails[i].removeAttribute("open");
      }
      if (nav && btn && nav.classList.contains("open")) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    }
  });

  // 4. Newsletter (Phase 5 — not wired up yet, by design)
  var news = document.getElementById("news");
  if (news) {
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = document.getElementById("em");
      var msg = document.getElementById("msg");
      if (em && em.checkValidity() && em.value) {
        msg.textContent =
          "Thanks! Signup isn't connected yet (it arrives with Phase 5), so your email wasn't saved.";
        msg.style.color = "#0F766E";
      } else {
        msg.textContent = "Enter a valid email address, like name@example.com.";
        msg.style.color = "#B45309";
      }
    });
  }

  // 5. Contact form (Phase 5 — not wired up yet, by design)
  var contact = document.getElementById("contact");
  if (contact) {
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      var ce = document.getElementById("ce");
      var cm = document.getElementById("cmsg");
      if (ce && ce.checkValidity() && ce.value) {
        cm.textContent =
          "Thanks for reaching out! This form isn't connected yet (it arrives with Phase 5), so your message wasn't sent.";
        cm.style.color = "#0F766E";
      } else {
        cm.textContent = "Please add a valid email so we know where to reply.";
        cm.style.color = "#B45309";
      }
    });
  }

  // 6. Resilient editorial SVG illustration fallback if external CDN images are offline/blocked
  function makeFallbackSvg(altText) {
    var label = (altText || "FuturePath Guidance").slice(0, 42);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480">' +
      '<defs>' +
      '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#0F1B3D"/>' +
      '<stop offset="100%" stop-color="#1E3A8A"/>' +
      "</linearGradient>" +
      '<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">' +
      '<path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>' +
      "</pattern>" +
      "</defs>" +
      '<rect width="640" height="480" fill="url(#bg)"/>' +
      '<rect width="640" height="480" fill="url(#grid)"/>' +
      '<circle cx="520" cy="110" r="140" fill="rgba(142,197,255,0.10)"/>' +
      '<circle cx="120" cy="380" r="160" fill="rgba(45,212,191,0.08)"/>' +
      '<rect x="70" y="70" width="500" height="340" rx="16" fill="rgba(11,19,43,0.65)" stroke="rgba(142,197,255,0.25)" stroke-width="1.5"/>' +
      '<circle cx="104" cy="102" r="5" fill="#8EC5FF"/>' +
      '<circle cx="122" cy="102" r="5" fill="rgba(142,197,255,0.45)"/>' +
      '<circle cx="140" cy="102" r="5" fill="rgba(142,197,255,0.2)"/>' +
      '<line x1="70" y1="128" x2="570" y2="128" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>' +
      '<path d="M130 320 C190 250, 260 270, 320 210 C380 150, 440 190, 510 155" fill="none" stroke="#8EC5FF" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M130 350 C210 310, 290 325, 370 275 C430 240, 470 255, 510 225" fill="none" stroke="#2DD4BF" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>' +
      '<circle cx="130" cy="320" r="7" fill="#FFFFFF"/>' +
      '<circle cx="320" cy="210" r="7" fill="#8EC5FF"/>' +
      '<circle cx="510" cy="155" r="8" fill="#2DD4BF"/>' +
      '<rect x="110" y="155" width="160" height="64" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>' +
      '<rect x="126" y="173" width="80" height="8" rx="4" fill="#8EC5FF"/>' +
      '<rect x="126" y="191" width="120" height="6" rx="3" fill="rgba(255,255,255,0.35)"/>' +
      '<text x="320" y="382" text-anchor="middle" fill="#CBD5E1" font-family="system-ui,sans-serif" font-size="14" font-weight="600" letter-spacing="0.5">' +
      label.replace(/[<>&"']/g, "") +
      "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  var imgs = document.querySelectorAll("img");
  for (var k = 0; k < imgs.length; k++) {
    (function (imgEl) {
      function handleImgError() {
        if (imgEl.dataset.fallbackApplied) return;
        imgEl.dataset.fallbackApplied = "true";
        imgEl.src = makeFallbackSvg(imgEl.getAttribute("alt"));
      }
      imgEl.addEventListener("error", handleImgError);
      if (imgEl.complete && imgEl.naturalWidth === 0) {
        handleImgError();
      }
    })(imgs[k]);
  }

  // 7. Assign stagger index (--stagger-idx) to cards in grids/steps for cascading reveal
  function assignStaggerIndices() {
    var groups = document.querySelectorAll(".grid, .steps, .grid-2, .grid-3, .grid-4");
    for (var g = 0; g < groups.length; g++) {
      var children = groups[g].children;
      for (var c = 0; c < children.length; c++) {
        children[c].style.setProperty("--stagger-idx", c % 6);
      }
    }
  }
  assignStaggerIndices();

  var appContainer = document.getElementById("app");
  if (appContainer && "MutationObserver" in window) {
    var appObserver = new MutationObserver(function () {
      assignStaggerIndices();
    });
    appObserver.observe(appContainer, { childList: true, subtree: true });
  }

  // 8. Scroll reveal + Animated metric counters
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < reveals.length; i++) {
        reveals[i].classList.add("in");
      }
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "0px 0px 0px 0px" }
      );
      for (var j = 0; j < reveals.length; j++) {
        io.observe(reveals[j]);
      }
    }
  }

  // Animate hero metric numbers smoothly on load
  if (!reduceMotion) {
    var statNums = document.querySelectorAll(".hero-stat .num");
    for (var n = 0; n < statNums.length; n++) {
      (function (el) {
        var target = parseInt(el.textContent, 10);
        if (isNaN(target) || target <= 0) return;
        var duration = 1100;
        var start = performance.now();
        function tick(now) {
          var p = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      })(statNums[n]);
    }
  }

  // 9. Mouse-Following Parallax & Interactive Card Spotlight (Desktop pointer devices)
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var parallaxSurface = document.querySelector(".hero, .page-hero");
    var targetX = 0,
      targetY = 0,
      curX = 0,
      curY = 0,
      rafId = null;

    function updateParallax() {
      curX += (targetX - curX) * 0.1;
      curY += (targetY - curY) * 0.1;
      if (parallaxSurface) {
        parallaxSurface.style.setProperty("--mx", curX.toFixed(3));
        parallaxSurface.style.setProperty("--my", curY.toFixed(3));
      }
      if (Math.abs(targetX - curX) > 0.002 || Math.abs(targetY - curY) > 0.002) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    }

    if (parallaxSurface) {
      parallaxSurface.addEventListener(
        "mousemove",
        function (e) {
          var rect = parallaxSurface.getBoundingClientRect();
          targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          if (!rafId) rafId = requestAnimationFrame(updateParallax);
        },
        { passive: true }
      );

      parallaxSurface.addEventListener(
        "mouseleave",
        function () {
          targetX = 0;
          targetY = 0;
          if (!rafId) rafId = requestAnimationFrame(updateParallax);
        },
        { passive: true }
      );
    }

    // Subtle cursor spotlight on .card elements & magnetic pull on .btn
    document.addEventListener(
      "mousemove",
      function (e) {
        var card = e.target.closest && e.target.closest(".card");
        if (card) {
          var cr = card.getBoundingClientRect();
          card.style.setProperty("--px", (e.clientX - cr.left).toFixed(0) + "px");
          card.style.setProperty("--py", (e.clientY - cr.top).toFixed(0) + "px");
        }
        var magBtn = e.target.closest && e.target.closest(".btn");
        if (magBtn) {
          var br = magBtn.getBoundingClientRect();
          var bx = ((e.clientX - (br.left + br.width / 2)) / br.width) * 5;
          var by = ((e.clientY - (br.top + br.height / 2)) / br.height) * 5;
          magBtn.style.setProperty("--btn-tx", bx.toFixed(1) + "px");
          magBtn.style.setProperty("--btn-ty", by.toFixed(1) + "px");
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseout",
      function (e) {
        var magBtn = e.target.closest && e.target.closest(".btn");
        if (magBtn && !magBtn.contains(e.relatedTarget)) {
          magBtn.style.setProperty("--btn-tx", "0px");
          magBtn.style.setProperty("--btn-ty", "0px");
        }
      },
      { passive: true }
    );
  }
})();
