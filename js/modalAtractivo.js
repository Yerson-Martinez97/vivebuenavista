document.addEventListener("DOMContentLoaded", () => {
  // Artesanías
  fetch("json/atractivos.json")
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll(".card [data-idAtractivo]").forEach((card) => {
        card.addEventListener("click", function () {
          const id = this.getAttribute("data-idAtractivo");
          const atractivo = data[id];
          if (Array.isArray(atractivo)) {
            let title = "Murales de Buena Vista";
            let description = "";

            atractivo.forEach((mural, index) => {
              description += `<div class="mural-item">
                <h3 class="title"> ${mural.title}</h3>
                <p class="description">${mural.description}</p>`;

              if (Array.isArray(mural.images)) {
                description += `<div class="scroll-container">`;
                mural.images.forEach((imgUrl) => {
                  description += `<img src="${imgUrl}" alt="" class="image">`;
                });
                description += `</div>`;
              }
              if (mural.location) {
                description += `<div class="button-wrapper">
                <a href="${mural.location}" target="_blank" class="button"><i class="fa-solid fa-location-dot fa-xl"></i> Ver Ruta</a>
                </div>`;
              }
              description += `</div>`;
            });

            openModalAtractivo(title, description, [], null);
          } else if (atractivo) {
            openModalAtractivo(
              atractivo.title || "",
              atractivo.description || "",
              atractivo.images || [],
              atractivo.location || ""
            );
          } else {
            openModalAtractivo("Información no disponible", "", [], "");
          }
        });
      });

      document
        .getElementById("modalAtractivo-close")
        .addEventListener("click", closeModalAtractivo);
      window.addEventListener("click", (e) => {
        if (e.target === document.getElementById("modalAtractivo")) {
          closeModalAtractivo();
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar AtractivosInfo.json:", error);
    });
});

// Variable global para controlar GLightbox
import PhotoSwipeLightbox from "../libraries/photoswiper/photoswipe-lightbox.esm.js";

let atractivoLightbox = null;

function openModalAtractivo(title, description, images, location) {
  document.body.style.overflow = "hidden";

  const modalAtractivo = document.getElementById("modalAtractivo");
  const modalAtractivoTitle = document.getElementById("modalAtractivo-title");
  const modalAtractivoDescription = document.getElementById(
    "modalAtractivo-description"
  );
  const modalAtractivoImages = document.getElementById("modalAtractivo-images");

  modalAtractivoTitle.innerText = title;
  modalAtractivoDescription.innerHTML = description;
  modalAtractivoImages.innerHTML = "";

  // Destruir instancia anterior de PhotoSwipe
  if (atractivoLightbox) {
    atractivoLightbox.destroy();
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
      modalAtractivoImages.appendChild(a);
    });
    // Crear nueva instancia de PhotoSwipeLightbox
    atractivoLightbox = new PhotoSwipeLightbox({
      gallery: "#modalAtractivo-images",
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
    atractivoLightbox.init();
  }
  // LOCATION
  const modalAtractivoAddress = document.getElementById(
    "restaurante-location__address"
  );
  const modalAtractivoBtnMap = document.getElementById("modalAtractivo-btnMap");

  // Verifica si location es una cadena de texto (como en tu JSON)
  if (typeof location === "string" && location.trim() !== "") {
    modalAtractivoAddress.textContent = "Ubicación disponible en el mapa";
    modalAtractivoBtnMap.href = location;
    modalAtractivoBtnMap.style.display = "inline-block";
  } else {
    modalAtractivoAddress.textContent = "Dirección no disponible";
    modalAtractivoBtnMap.style.display = "none";
  }
  // ------
  modalAtractivo.style.display = "flex";
}

// Función para cerrar el modal
function closeModalAtractivo() {
  document.body.style.overflow = "auto";
  const modalAtractivo = document.getElementById("modalAtractivo");
  modalAtractivo.style.display = "none";
}
