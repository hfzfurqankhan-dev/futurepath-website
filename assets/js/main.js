/* FuturePath — Site Interactions & Accessibility
   Handles responsive navigation, dropdown dismissal, sticky header elevation,
   honest form feedback, resilient image fallbacks, and scroll-reveal animations. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var btn = document.querySelector(".menu-btn");
  var moreDetails = document.querySelectorAll("details.more");

  // Sticky header elevation on scroll
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
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

  // Close <details class="more"> dropdowns when clicking outside or pressing Escape
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

  // Newsletter (Phase 5 — not wired up yet, by design)
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

  // Contact form (Phase 5 — not wired up yet, by design)
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

  // Resilient editorial SVG illustration fallback if external CDN images are offline/blocked
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

  // Scroll reveal — progressive enhancement
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
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
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
      );
      for (var j = 0; j < reveals.length; j++) {
        io.observe(reveals[j]);
      }
    }
  }
})();
