document.addEventListener("DOMContentLoaded", () => {
  // Artesanías
  fetch("json/artesanias.json")
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll(".card [data-idArtesania]").forEach((card) => {
        card.addEventListener("click", function () {
          const id = this.getAttribute("data-idArtesania");
          const artesania = data[id];

          if (artesania) {
            openModalArtesania(
              artesania.title || "",
              artesania.description || "",
              artesania.images || []
            );
          } else {
            openModalArtesania(
              "Información no disponible",
              "",
              []
            );
          }
        });
      });

      document
        .getElementById("modalArtesania-close")
        .addEventListener("click", closeModalArtesania);
      window.addEventListener("click", (e) => {
        if (e.target === document.getElementById("modalArtesania")) {
          closeModalArtesania();
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar ArtesaniasInfo.json:", error);
    });
});

// Variable global para controlar GLightbox
import PhotoSwipeLightbox from "../libraries/photoswiper/photoswipe-lightbox.esm.js";

let artesaniaLightbox = null;

function openModalArtesania(title, description, images) {
  document.body.style.overflow = "hidden";

  const modalArtesania = document.getElementById("modalArtesania");
  const modalArtesaniaTitle = document.getElementById("modalArtesania-title");
  const modalArtesaniaDescription = document.getElementById(
    "modalArtesania-description"
  );
  const modalArtesaniaImages = document.getElementById("modalArtesania-images");

  modalArtesaniaTitle.innerText = title;
  modalArtesaniaDescription.innerHTML = description;
  modalArtesaniaImages.innerHTML = "";

  // Destruir instancia anterior de PhotoSwipe
  if (artesaniaLightbox) {
    artesaniaLightbox.destroy();
  }

  if (Array.isArray(images) && images.length > 0) {
    images.forEach((src) => {
      const a = document.createElement("a");
      a.href = src;
      a.setAttribute("data-pswp-width", "1200"); // Ajusta según tamaño real
      a.setAttribute("data-pswp-height", "800"); // Ajusta según tamaño real
      a.style.cursor = "pointer";
      const img = document.createElement("img");
      img.src = src;
      img.alt = title;
      img.classList.add("modalArtesania-image");
      a.appendChild(img);
      modalArtesaniaImages.appendChild(a);
    });
    // Crear nueva instancia de PhotoSwipeLightbox
    artesaniaLightbox = new PhotoSwipeLightbox({
      gallery: "#modalArtesania-images",
      children: "a",
      pswpModule: () => import("../libraries/photoswiper/photoswipe.esm.js"),
      showHideAnimationType: "fade",
      loop: true,
      showHideAnimationType: "zoom",
      bgOpacity: 0.8,
      clickToCloseNonZoomable: true,
      tapAction: "toggle-controls",
      preload: [1, 1],
    });
    artesaniaLightbox.init();
  }

  modalArtesania.style.display = "flex";
}

// Función para cerrar el modal
function closeModalArtesania() {
  document.body.style.overflow = "auto";
  const modalArtesania = document.getElementById("modalArtesania");
  modalArtesania.style.display = "none";
}
