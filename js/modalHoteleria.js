document.addEventListener("DOMContentLoaded", () => {
  // Artesanías
  fetch("json/hoteleria.json")
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll(".card [data-idHoteleria]").forEach((card) => {
        card.addEventListener("click", function () {
          const id = this.getAttribute("data-idHoteleria");
          const hoteleria = data[id];

          if (hoteleria) {
            openModalHoteleria(
              hoteleria.title || "",
              hoteleria.services || "",
              hoteleria.atractions || "",
              hoteleria.reservations || "",
              hoteleria.images || [],
              hoteleria.location || "",
              hoteleria.socialnetworks || "",
              hoteleria.website || ""
            );
          } else {
            openModalHoteleria(
              "Información no disponible",
              "",
              "",
              "",
              [],
              "",
              "",
              ""
            );
          }
        });
      });

      document
        .getElementById("modalHoteleria-close")
        .addEventListener("click", closeModalHoteleria);
      window.addEventListener("click", (e) => {
        if (e.target === document.getElementById("modalHoteleria")) {
          closeModalHoteleria();
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar HoteleriaInfo.json:", error);
    });
});

// Variable global para controlar GLightbox
import PhotoSwipeLightbox from "../libraries/photoswiper/photoswipe-lightbox.esm.js";

let hoteleriaLightbox = null;

function openModalHoteleria(
  title,
  services,
  atractions,
  reservations,
  images,
  location,
  socialnetworks,
  website
) {
  document.body.style.overflow = "hidden";

  const modalHoteleria = document.getElementById("modalHoteleria");

  // Title
  const modalHoteleriaTitle = document.getElementById("modalHoteleria-title");

  modalHoteleriaTitle.innerText = title;
  // Services
  const modalHoteleriaServices = document.getElementById(
    "modalHoteleria-services"
  );
  if (Array.isArray(services)) {
    modalHoteleriaServices.innerHTML = `
    <h2 class="modal__subtitle">Servicios</h2>
    ${services.map((service) => `<p>- ${service}</p>`).join("")}
  `;
  } else {
    modalHoteleriaServices.style.display = "none";
  }
  // Atractions
  const modalHoteleriaAtractions = document.getElementById(
    "modalHoteleria-atractions"
  );
  if (Array.isArray(atractions)) {
    modalHoteleriaAtractions.innerHTML = `
    <h2 class="modal__subtitle">Atracciones</h2>
    ${atractions.map((atraction) => `<p>- ${atraction}</p>`).join("")}
  `;
  } else {
    modalHoteleriaAtractions.style.display = "none";
  }
  // Reservations
  const modalHoteleriaReservations = document.getElementById(
    "modalHoteleria-reservations"
  );
  modalHoteleriaReservations.innerHTML = "";
  if (Array.isArray(reservations) && reservations.length > 0) {
    reservations.forEach((reservation) => {
      // Crea un contenedor flex
      const reservationContainer = document.createElement("div");
      reservationContainer.classList.add("reservation-container");

      let hasPhones = false; // Bandera para verificar si hay teléfonos

      // Para Fijo
      if (reservation.Landline && reservation.Landline.length > 0) {
        const fixedContainer = document.createElement("div");
        fixedContainer.classList.add("fixed-container");
        fixedContainer.innerHTML = "<strong>Fijo:</strong><br>";

        reservation.Landline.forEach((fixedPhone) => {
          fixedContainer.innerHTML += `<p>${fixedPhone}</p>`;
        });
        reservationContainer.appendChild(fixedContainer);
        hasPhones = true; // Se encuentra al menos un teléfono fijo
      }

      // Para Móvil
      if (reservation.Mobile && reservation.Mobile.length > 0) {
        const mobileContainer = document.createElement("div");
        mobileContainer.classList.add("mobile-container");
        mobileContainer.innerHTML = "<strong>Whatsapp</strong><br>";

        reservation.Mobile.forEach((mobilePhone) => {
          mobileContainer.innerHTML += `
        <p>
            <i class="fa-brands fa-whatsapp sn-whatsapp"></i>
            <a href="https://wa.me/${mobilePhone.replace(
              /\s+/g,
              ""
            )}" target="_blank">${mobilePhone}</a>
        </p>
      `;
        });
        reservationContainer.appendChild(mobileContainer);
        hasPhones = true; // Se encuentra al menos un teléfono móvil
      }

      // Si no hay números fijos ni móviles, mostramos un mensaje
      if (!hasPhones) {
        reservationContainer.innerHTML = "<p>No hay números disponibles</p>";
      }

      // Añadir el contenedor al modal
      modalHoteleriaReservations.appendChild(reservationContainer);
    });
  } else {
    // Si no existen reservas, mostrar un mensaje
    modalHoteleriaReservations.innerHTML = "<p>No hay números disponibles.</p>";
  }
  // Images
  const modalHoteleriaImages = document.getElementById("modalHoteleria-images");
  modalHoteleriaImages.innerHTML = "";

  // Destruir instancia anterior de PhotoSwipe
  if (hoteleriaLightbox) {
    hoteleriaLightbox.destroy();
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
      modalHoteleriaImages.appendChild(a);
    });
    // Crear nueva instancia de PhotoSwipeLightbox
    hoteleriaLightbox = new PhotoSwipeLightbox({
      gallery: "#modalHoteleria-images",
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
    hoteleriaLightbox.init();
  }
  // LOCATION
  const modalHoteleriaAddress = document.getElementById(
    "hoteleria-location__address"
  );
  const modalHoteleriaBtnMap = document.getElementById("modalHoteleria-btnMap");

  if (location && Array.isArray(location)) {
    // Buscar la dirección y el URL del mapa dentro del array location
    let addressText = "";
    let mapUrl = "";

    location.forEach((item) => {
      if (item.address) {
        addressText = item.address;
      }
      if (item.map_url) {
        mapUrl = item.map_url;
      }
    });

    modalHoteleriaAddress.textContent =
      addressText || "Dirección no disponible";

    if (mapUrl) {
      modalHoteleriaBtnMap.href = mapUrl;
      modalHoteleriaBtnMap.style.display = "inline-block"; // Mostrar botón
    } else {
      modalHoteleriaBtnMap.style.display = "none"; // Ocultar botón si no hay URL
    }
  } else {
    modalHoteleriaBtnMap.style.display = "none";
    modalHoteleriaAddress.textContent = "Dirección no disponible";
    modalHoteleriaBtnMap.style.display = "none";
  }
  // =============================================================================================
  // SOCIAL NETWORK
  const modalHoteleriaSociaNetworks = document.getElementById(
    "modalHoteleria-socialnetworks"
  );

  if (Array.isArray(socialnetworks) && socialnetworks.length > 0) {
    const ul = document.createElement("ul");

    socialnetworks.forEach((item) => {
      for (let key in item) {
        const li = document.createElement("li");
        const red = item[key];

        if (Array.isArray(red)) {
          let icon = "";
          let name = "";
          let link = "";

          red.forEach((r) => {
            if (r.icon) icon = r.icon;
            if (r.name) name = r.name;
            if (r.link) link = r.link;
          });

          li.innerHTML = `<a href="${link}" target="_blank" rel="noopener" class="sn-${key}" title="${name}">
                        ${icon}
                      </a>`;
        } else {
          li.textContent = `${key}: ${item[key]}`;
        }

        ul.appendChild(li);
      }
    });

    modalHoteleriaSociaNetworks.style.display = "block";
    modalHoteleriaSociaNetworks.innerHTML =
      "<div class='title'>Redes Sociales</div>";
    modalHoteleriaSociaNetworks.appendChild(ul);
  } else {
    modalHoteleriaSociaNetworks.style.display = "none";
  }
  // =============================================================================================
  // WEBSITE
  const modalHoteleriaWebsite = document.getElementById(
    "modalHoteleria-website"
  );
  modalHoteleriaWebsite.innerHTML =
    website != "" ? `<i class="fa-solid fa-link fa-lg"></i> ` : "";
  modalHoteleriaWebsite.innerHTML += website != "" ? `Sitio Web` : "";
  modalHoteleriaWebsite.href = website;
  // --------
  modalHoteleria.style.display = "flex";
}

// Función para cerrar el modal
function closeModalHoteleria() {
  document.body.style.overflow = "auto";
  const modalHoteleria = document.getElementById("modalHoteleria");
  modalHoteleria.style.display = "none";
}
