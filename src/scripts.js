(() => {
  const root = document.querySelector('[data-carousel="work"]');
  if (!root) return;

  const track = root.querySelector("[data-track]");
  const slides = Array.from(track.children);
  const prevBtn = root.querySelector("[data-prev]");
  const nextBtn = root.querySelector("[data-next]");

  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let rafId = null;

  const clampIndex = (i) => (i + slides.length) % slides.length;

  const scrollToIndex = (i) => {
    currentIndex = clampIndex(i);
    track.scrollTo({
      left: slides[currentIndex].offsetLeft,
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", () => scrollToIndex(currentIndex - 1));
  nextBtn.addEventListener("click", () => scrollToIndex(currentIndex + 1));

  // Optional: keyboard support when focused
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollToIndex(currentIndex - 1);
    if (e.key === "ArrowRight") scrollToIndex(currentIndex + 1);
  });
})();
