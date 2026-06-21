const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  const closeMenu = ({ returnFocus = false } = {}) => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      closeMenu({ returnFocus: true });
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = carousel.querySelector("[data-carousel-dots]");
  const status = carousel.querySelector("[data-carousel-status]");
  let current = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let touchStartX = 0;
  current = current >= 0 ? current : 0;

  if (!slides.length || !prevButton || !nextButton || !dotsWrap) return;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Mostrar imagen ${index + 1} de ${slides.length}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsWrap.appendChild(dot);
    return dot;
  });

  const updateStatus = () => {
    if (status) status.textContent = `Imagen ${current + 1} de ${slides.length}`;
  };

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
    updateStatus();
  }

  prevButton.addEventListener("click", () => showSlide(current - 1));
  nextButton.addEventListener("click", () => showSlide(current + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(current - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(current + 1);
    }
  });
  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showSlide(current + (delta < 0 ? 1 : -1));
  }, { passive: true });

  showSlide(current);
});

const targets = document.querySelectorAll(".reveal-target");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  targets.forEach((target) => target.classList.add("reveal"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });
  targets.forEach((target) => observer.observe(target));
}
