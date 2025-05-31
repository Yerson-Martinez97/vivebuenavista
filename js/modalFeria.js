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
              feria.event || ""
            );
          } else {
            openModalFeria("Información no disponible", "", []);
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

function openModalFeria(title, description, event) {
  document.body.style.overflow = "hidden";

  const modalFeria = document.getElementById("modalFeria");
  const modalFeriaTitle = document.getElementById("modalFeria-title");
  const modalFeriaDescription = document.getElementById(
    "modalFeria-description"
  );
  const modalFeriaEvent = document.getElementById("modalFeria-event");

  modalFeriaTitle.innerText = title;
  modalFeriaDescription.innerHTML = description;
  modalFeriaEvent.innerHTML = "<h2 class='modalFeria__title'>Evento</h2>";
  modalFeriaEvent.innerHTML += event;
  // -----
  modalFeria.style.display = "flex";
}

// Función para cerrar el modal
function closeModalFeria() {
  document.body.style.overflow = "auto";
  const modalFeria = document.getElementById("modalFeria");
  modalFeria.style.display = "none";
}
