(function () {
  "use strict";

  var roots = document.querySelectorAll(".testimonials-demo[data-testimonials]");

  roots.forEach(function (root) {
    var items = JSON.parse(root.getAttribute("data-testimonials"));
    var card = root.querySelector(".tt-card");
    var quoteEl = root.querySelector(".tt-quote");
    var nameEl = root.querySelector(".tt-name");
    var titleEl = root.querySelector(".tt-title");
    var dotsWrap = root.querySelector(".tt-dots");
    var controls = root.querySelector(".tt-controls");
    var prevBtn = root.querySelector(".tt-prev");
    var nextBtn = root.querySelector(".tt-next");

    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 5000;

    items.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "tt-dot" + (i === 0 ? " is-active" : "");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show achievement " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); startAutoplay(); });
      dotsWrap.appendChild(dot);
    });

    function render() {
      var item = items[index];
      quoteEl.textContent = "“" + item.quote + "”";
      nameEl.textContent = item.name;
      titleEl.textContent = item.title;
      titleEl.style.display = item.title ? "" : "none";
      dotsWrap.querySelectorAll(".tt-dot").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function goTo(next) {
      card.classList.add("is-transitioning");
      window.setTimeout(function () {
        index = (next + items.length) % items.length;
        render();
        card.classList.remove("is-transitioning");
      }, 200);
    }

    function startAutoplay() {
      stopAutoplay();
      if (items.length > 1) {
        timer = window.setInterval(function () { goTo(index + 1); }, AUTOPLAY_MS);
      }
    }
    function stopAutoplay() {
      if (timer) window.clearInterval(timer);
    }

    render();

    if (items.length <= 1) {
      if (controls) controls.style.display = "none";
      return;
    }

    prevBtn.addEventListener("click", function () { goTo(index - 1); startAutoplay(); });
    nextBtn.addEventListener("click", function () { goTo(index + 1); startAutoplay(); });
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    startAutoplay();
  });
})();
