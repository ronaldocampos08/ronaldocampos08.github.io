const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
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
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let startX = 0;

  const wrap = (index) => (index + slides.length) % slides.length;

  const render = () => {
    slides.forEach((slide, index) => {
      slide.classList.remove("is-active", "is-prev", "is-next");
      slide.setAttribute("aria-hidden", "true");

      if (index === activeIndex) {
        slide.classList.add("is-active");
        slide.removeAttribute("aria-hidden");
      } else if (index === wrap(activeIndex - 1)) {
        slide.classList.add("is-prev");
      } else if (index === wrap(activeIndex + 1)) {
        slide.classList.add("is-next");
      }
    });

    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
        dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
      });
    }
  };

  if (dotsWrap) {
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ver imagen ${index + 1}`);
      dot.addEventListener("click", () => {
        activeIndex = index;
        render();
      });
      dotsWrap.appendChild(dot);
    });
  }

  prevButton?.addEventListener("click", () => {
    activeIndex = wrap(activeIndex - 1);
    render();
  });

  nextButton?.addEventListener("click", () => {
    activeIndex = wrap(activeIndex + 1);
    render();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      activeIndex = wrap(activeIndex - 1);
      render();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activeIndex = wrap(activeIndex + 1);
      render();
    }
  });

  carousel.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    const movement = event.changedTouches[0].clientX - startX;
    if (Math.abs(movement) > 45) {
      activeIndex = wrap(activeIndex + (movement < 0 ? 1 : -1));
      render();
    }
  }, { passive: true });

  carousel.setAttribute("tabindex", "0");
  render();
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
