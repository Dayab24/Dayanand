(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  // Mobile nav toggle
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header shadow/background once page has scrolled
  if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  // Scroll-spy: highlight the in-page nav link matching the visible section
  var sections = document.querySelectorAll("main [id]");
  var spyLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (sections.length && spyLinks.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          spyLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) { spyObserver.observe(section); });
  }

  // Reveal-on-scroll animation
  var revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  // Lightbox: click a project image to zoom it in a popup
  var galleryImgs = document.querySelectorAll(".project-gallery img, .project-body figure img");
  if (galleryImgs.length) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image">&times;</button><img alt="">';
    document.body.appendChild(overlay);

    var overlayImg = overlay.querySelector("img");
    var closeBtn = overlay.querySelector(".lightbox-close");

    var openLightbox = function (src, alt) {
      overlayImg.src = src;
      overlayImg.alt = alt || "";
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    var closeLightbox = function () {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    galleryImgs.forEach(function (img) {
      img.addEventListener("click", function () {
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    closeBtn.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();
