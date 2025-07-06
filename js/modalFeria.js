document.addEventListener("DOMContentLoaded", () => {
  // Artesanías
  fetch("json/ferias.json")
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll(".card [data-idFeria]").forEach((card) => {
        card.addEventListener("click", function () {
          const id = this.getAttribute("data-idFeria");
          const feria = data[id];

          if (feria) {
            openModalFeria(
              feria.title || "",
              feria.description || "",
              feria.images || "",
              feria.event || ""
            );
          } else {
            openModalFeria("Información No Disponible", "", [], []);
          }
        });
      });

      document
        .getElementById("modalFeria-close")
        .addEventListener("click", closeModalFeria);
      window.addEventListener("click", (e) => {
        if (e.target === document.getElementById("modalFeria")) {
          closeModalFeria();
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar FeriaInfo.json:", error);
    });
});

// Variable global para controlar GLightbox
import PhotoSwipeLightbox from "../libraries/photoswiper/photoswipe-lightbox.esm.js";

let feriaLightbox = null;

function openModalFeria(title, description, images, event) {
  document.body.style.overflow = "hidden";

  const modalFeria = document.getElementById("modalFeria");
  const modalFeriaTitle = document.getElementById("modalFeria-title");
  const modalFeriaDescription = document.getElementById(
    "modalFeria-description"
  );
  const modalFeriaImages = document.getElementById("modalFeria-images");
  const modalFeriaEvent = document.getElementById("modalFeria-event");

  modalFeriaTitle.innerText = title;
  modalFeriaDescription.innerHTML = description;
  modalFeriaImages.innerHTML = "";
  modalFeriaEvent.innerHTML = "<h2 class='modalFeria__title'>Evento</h2>";
  modalFeriaEvent.innerHTML += event;
  // Destruir instancia anterior de PhotoSwipe
  if (feriaLightbox) {
    feriaLightbox.destroy();
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
      img.classList.add("card__image");
      a.appendChild(img);
      modalFeriaImages.appendChild(a);
    });
    // Crear nueva instancia de PhotoSwipeLightbox
    feriaLightbox = new PhotoSwipeLightbox({
      gallery: "#modalFeria-images",
      children: "a",
      pswpModule: () => import("../libraries/photoswiper/photoswipe.esm.js"),
      showHideAnimationType: "fade",
      loop: false,
      showHideAnimationType: "zoom",
      bgOpacity: 0.8,
      clickToCloseNonZoomable: true,
      tapAction: "toggle-controls",
      preload: [1, 1],
    });
    feriaLightbox.init();
  }
  // // -----
  modalFeria.style.display = "flex";
}

// Función para cerrar el modal
function closeModalFeria() {
  document.body.style.overflow = "auto";
  const modalFeria = document.getElementById("modalFeria");
  modalFeria.style.display = "none";
}
