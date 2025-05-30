document.addEventListener("DOMContentLoaded", () => {
  const subir = document.getElementById("subir");
  const mainNavLinks = document.querySelectorAll("nav div ul li a");
  const offsetNavbar = 30;

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const toggleSubirBtn = () => {
    subir.classList.toggle("irArriba", window.scrollY >= 500);
  };

  const updateActiveLink = () => {
    const fromTop = window.scrollY + offsetNavbar + 5;
    let currentId = null;

    mainNavLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (fromTop >= top && fromTop < bottom) {
          link.classList.add("current");
          currentId = link.hash;
        } else {
          link.classList.remove("current");
        }
      }
    });

    if (currentId) {
      sessionStorage.setItem("activeSection", currentId);
    }
  };

  const smoothScroll = (target) => {
    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + startY - offsetNavbar;
    const duration = 600;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startY + (targetY - startY) * ease);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  window.addEventListener("scroll", () => {
    toggleSubirBtn();
    updateActiveLink();
  });

  document.querySelectorAll(".scroll").forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = elem.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) smoothScroll(target);
    });
  });

  window.addEventListener("load", () => {
    const savedId = sessionStorage.getItem("activeSection");
    if (savedId) {
      mainNavLinks.forEach((link) => {
        link.classList.toggle("current", link.hash === savedId);
      });
      toggleSubirBtn();
    } else {
      setTimeout(() => {
        requestAnimationFrame(() => {
          updateActiveLink();
          toggleSubirBtn();
        });
      }, 100);
    }
  });
});
