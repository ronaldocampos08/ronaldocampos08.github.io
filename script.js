const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  const menuText = menuButton.querySelector(".sr-only");

  const setMenuState = (open, returnFocus = false) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (menuText) menuText.textContent = open ? "Cerrar menú" : "Abrir menú";
    navigation.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (!open && returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    setMenuState(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuState(false, true);
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
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
  }, { threshold: 0.1 });
  targets.forEach((target) => observer.observe(target));
}

document.querySelectorAll("[data-carousel]").forEach((carousel, carouselIndex) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const previousButton = carousel.querySelector(".carousel-prev");
  const nextButton = carousel.querySelector(".carousel-next");
  const dotsContainer = carousel.querySelector(".carousel-dots");
  const status = carousel.querySelector(".carousel-status");

  if (!track || slides.length === 0 || !previousButton || !nextButton || !dotsContainer) return;

  let currentIndex = 0;
  let touchStartX = 0;
  carousel.setAttribute("tabindex", "0");

  const dots = slides.map((slide, index) => {
    const slideId = `carousel-${carouselIndex + 1}-slide-${index + 1}`;
    slide.id = slideId;
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-controls", slideId);
    dot.setAttribute("aria-label", `Ver imagen ${index + 1} de ${slides.length}`);
    dot.addEventListener("click", () => goTo(index));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const goTo = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.setAttribute("aria-hidden", String(!active));
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentIndex;
      dot.setAttribute("aria-selected", String(active));
      dot.tabIndex = active ? 0 : -1;
    });

    if (status) status.textContent = `Imagen ${currentIndex + 1} de ${slides.length}`;
  };

  previousButton.addEventListener("click", () => goTo(currentIndex - 1));
  nextButton.addEventListener("click", () => goTo(currentIndex + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 45) return;
    goTo(delta > 0 ? currentIndex - 1 : currentIndex + 1);
  }, { passive: true });

  goTo(0);
});
