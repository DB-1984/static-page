(() => {
  const root = document.querySelector('[data-carousel="work"]');
  if (!root) return;

  const track = root.querySelector("[data-track]");
  if (!track) return;

  const prevBtn = root.querySelector("[data-prev]");
  const nextBtn = root.querySelector("[data-next]");
  if (!prevBtn || !nextBtn) return;

  // How far to move each click. Tune 0.9 → 1.0
  const getStep = () => Math.max(1, Math.floor(track.clientWidth * 0.9));

  const go = (dir) => {
    track.scrollBy({
      left: dir * getStep(),
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go(-1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go(1);
  });

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
})();

function scrollToTarget(selector, options = {}) {
  const { offset = 0, behavior = "smooth" } = options;

  const target = document.querySelector(selector);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({ top, behavior });
}

(() => {
  document.addEventListener("click", (e) => {
    if (e.target.closest("#workDrawerPanel")) return; // don't hijack drawer clicks
    const trigger = e.target.closest("[data-scroll]");
    if (!trigger) return;

    e.preventDefault();

    const selector = trigger.dataset.scroll;
    scrollToTarget(selector, { offset: 0 });
  });
})();

(() => {
  const drawer = document.getElementById("workDrawer");
  const panel = document.getElementById("workDrawerPanel");
  const overlay = document.getElementById("workDrawerOverlay");
  const closeBtn = document.getElementById("workDrawerClose");
  const imgEl = document.getElementById("workDrawerImg");
  const titleEl = document.getElementById("workDrawerTitle");
  const descEl = document.getElementById("workDrawerDesc");
  const linkEl = document.getElementById("workDrawerLink");

  if (!drawer || !panel || !closeBtn || !titleEl || !descEl || !linkEl) return;

  let lastFocus = null;

  function openDrawer(data) {
    lastFocus = document.activeElement;

    titleEl.textContent = data.title || "Project";
    descEl.textContent = data.desc || "";

    if (imgEl) {
      if (data.img) {
        imgEl.src = data.img;
        imgEl.alt = data.title || "Project screenshot";
        imgEl.classList.remove("hidden");
      } else {
        imgEl.classList.add("hidden");
        imgEl.removeAttribute("src");
      }
    }

    if (linkEl) {
      if (data.link) {
        linkEl.href = data.link;
        linkEl.target = "_blank";
        linkEl.rel = "noopener";
        linkEl.classList.remove("hidden");
      } else {
        linkEl.href = "#";
        linkEl.classList.add("hidden");
      }
    }

    drawer.classList.remove("hidden");
    drawer.setAttribute("aria-hidden", "false");

    document.documentElement.classList.add("overflow-hidden");

    requestAnimationFrame(() => {
      panel.classList.remove("translate-x-full");
    });

    document.addEventListener("keydown", onKeydown);
    closeBtn.focus();
  }

  function closeDrawer() {
    panel.classList.add("translate-x-full");
    drawer.setAttribute("aria-hidden", "true");

    document.removeEventListener("keydown", onKeydown);

    setTimeout(() => {
      drawer.classList.add("hidden");
      document.documentElement.classList.remove("overflow-hidden");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }, 300);
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeDrawer();
  }

  document
    .querySelectorAll('[data-carousel="work"] .work-slide')
    .forEach((slide) => {
      slide.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer({
          title: slide.dataset.title,
          desc: slide.dataset.desc,
          img: slide.dataset.img,
          link: slide.dataset.link,
        });
      });
    });

  overlay?.addEventListener("click", closeDrawer);
  closeBtn.addEventListener("click", closeDrawer);
})();
