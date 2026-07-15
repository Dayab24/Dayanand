(function () {
  "use strict";

  var root = document.querySelector(".achv-carousel-single[data-achievements]");
  if (!root) return;

  var items = JSON.parse(root.getAttribute("data-achievements"));
  var logoImg = root.querySelector(".achv-carousel-logo-img");
  var logoFallback = root.querySelector(".achv-carousel-logo-fallback-text");
  var statEl = root.querySelector(".achv-carousel-stat");
  var quoteEl = root.querySelector(".achv-carousel-quote");
  var prevBtn = root.querySelector(".prev-button");
  var nextBtn = root.querySelector(".next-button");
  var pauseBtn = root.querySelector(".pause-button");
  var iconPause = pauseBtn.querySelector(".icon-pause");
  var iconPlay = pauseBtn.querySelector(".icon-play");
  var counterEl = root.querySelector(".achv-carousel-counter");

  var index = 0;
  var timer = null;
  var isPaused = false;
  var AUTOPLAY_MS = 5000;

  function initials(name) {
    var words = name.replace(/\(.*?\)/g, "").trim().split(/\s+/);
    return words.slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  function render() {
    var item = items[index];
    statEl.textContent = item.stat;
    quoteEl.textContent = item.quote;
    counterEl.textContent = (index + 1) + " / " + items.length;
    root.setAttribute("aria-label", "Career achievements, item " + (index + 1) + " of " + items.length + ": " + item.company);

    if (item.logo) {
      logoImg.src = item.logo;
      logoImg.alt = item.company;
      logoImg.style.display = "";
      logoFallback.style.display = "none";
    } else {
      logoImg.style.display = "none";
      logoFallback.textContent = initials(item.company);
      logoFallback.style.display = "flex";
    }
  }

  function goTo(next) {
    root.classList.add("is-transitioning");
    window.setTimeout(function () {
      index = (next + items.length) % items.length;
      render();
      root.classList.remove("is-transitioning");
    }, 200);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = window.setInterval(function () { goTo(index + 1); }, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
  }
  function resetAutoplay() {
    if (!isPaused) startAutoplay();
  }

  function setPaused(paused) {
    isPaused = paused;
    if (isPaused) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
    pauseBtn.setAttribute("aria-pressed", String(isPaused));
    pauseBtn.setAttribute("aria-label", isPaused ? "Resume automatic rotation" : "Pause automatic rotation");
    iconPause.hidden = isPaused;
    iconPlay.hidden = !isPaused;
  }

  prevBtn.addEventListener("click", function () { goTo(index - 1); resetAutoplay(); });
  nextBtn.addEventListener("click", function () { goTo(index + 1); resetAutoplay(); });
  pauseBtn.addEventListener("click", function () { setPaused(!isPaused); });
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", resetAutoplay);

  // Swipe/drag to navigate (mouse, touch, and pen via Pointer Events).
  var dragStartX = null;
  var DRAG_THRESHOLD = 40;

  root.addEventListener("pointerdown", function (e) {
    dragStartX = e.clientX;
    stopAutoplay();
  });
  root.addEventListener("pointerup", function (e) {
    if (dragStartX === null) return;
    var deltaX = e.clientX - dragStartX;
    dragStartX = null;
    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    }
    resetAutoplay();
  });
  root.addEventListener("pointercancel", function () {
    dragStartX = null;
    resetAutoplay();
  });

  render();
  startAutoplay();
})();
