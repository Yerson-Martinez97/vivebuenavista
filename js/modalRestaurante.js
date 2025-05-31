document.addEventListener("DOMContentLoaded", () => {
  // Artesanías
  fetch("json/restaurantes.json")
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll(".card [data-idRestaurante]").forEach((card) => {
        card.addEventListener("click", function () {
          const id = this.getAttribute("data-idRestaurante");
          const restaurante = data[id];

          if (restaurante) {
            openModalRestaurante(
              restaurante.title || "",
              restaurante.services || "",
              restaurante.atractions || "",
              restaurante.reservations || "",
              restaurante.images || [],
              restaurante.location || "",
              restaurante.socialnetworks || "",
              restaurante.website || ""
            );
          } else {
            openModalRestaurante(
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
        .getElementById("modalRestaurante-close")
        .addEventListener("click", closeModalRestaurante);
      window.addEventListener("click", (e) => {
        if (e.target === document.getElementById("modalRestaurante")) {
          closeModalRestaurante();
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar RestauranteInfo.json:", error);
    });
});

// Variable global para controlar GLightbox
import PhotoSwipeLightbox from "../libraries/photoswiper/photoswipe-lightbox.esm.js";

let restauranteLightbox = null;

function openModalRestaurante(
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

  const modalRestaurante = document.getElementById("modalRestaurante");

  // Title
  const modalRestauranteTitle = document.getElementById("modalRestaurante-title");

  modalRestauranteTitle.innerText = title;
  // Services
  const modalRestauranteServices = document.getElementById(
    "modalRestaurante-services"
  );
  if (Array.isArray(services)) {
    modalRestauranteServices.innerHTML = `
    <h2 class="modalRestaurante__title">Servicios</h2>
    ${services.map((service) => `<p>- ${service}</p>`).join("")}
  `;
  } else {
    modalRestauranteServices.style.display = "none";
  }
  // Atractions
  const modalRestauranteAtractions = document.getElementById(
    "modalRestaurante-atractions"
  );
  if (Array.isArray(atractions)) {
    modalRestauranteAtractions.innerHTML = `
    <h2 class="modalRestaurante__title">Atracciones</h2>
    ${atractions.map((atraction) => `<p>- ${atraction}</p>`).join("")}
  `;
  } else {
    modalRestauranteAtractions.style.display = "none";
  }
  // Reservations
  const modalRestauranteReservations = document.getElementById(
    "modalRestaurante-reservations"
  );
  modalRestauranteReservations.innerHTML = "";
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
      modalRestauranteReservations.appendChild(reservationContainer);
    });
  } else {
    // Si no existen reservas, mostrar un mensaje
    modalRestauranteReservations.innerHTML = "<p>No hay números disponibles.</p>";
  }
  // Images
  const modalRestauranteImages = document.getElementById("modalRestaurante-images");
  modalRestauranteImages.innerHTML = "";

  // Destruir instancia anterior de PhotoSwipe
  if (restauranteLightbox) {
    restauranteLightbox.destroy();
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
      img.classList.add("modalRestaurante-image");
      a.appendChild(img);
      modalRestauranteImages.appendChild(a);
    });
    // Crear nueva instancia de PhotoSwipeLightbox
    restauranteLightbox = new PhotoSwipeLightbox({
      gallery: "#modalRestaurante-images",
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
    restauranteLightbox.init();
  }
  // LOCATION
  const modalRestauranteAddress = document.getElementById(
    "restaurante-location__address"
  );
  const modalRestauranteBtnMap = document.getElementById("modalRestaurante-btnMap");

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

    modalRestauranteAddress.textContent =
      addressText || "Dirección no disponible";

    if (mapUrl) {
      modalRestauranteBtnMap.href = mapUrl;
      modalRestauranteBtnMap.style.display = "inline-block"; // Mostrar botón
    } else {
      modalRestauranteBtnMap.style.display = "none"; // Ocultar botón si no hay URL
    }
  } else {
    modalRestauranteBtnMap.style.display = "none";
    modalRestauranteAddress.textContent = "Dirección no disponible";
    modalRestauranteBtnMap.style.display = "none";
  }
  // =============================================================================================
  // SOCIAL NETWORK
  const modalRestauranteSociaNetworks = document.getElementById(
    "modalRestaurante-socialnetworks"
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

    modalRestauranteSociaNetworks.style.display = "block";
    modalRestauranteSociaNetworks.innerHTML =
      "<div class='title'>Redes Sociales</div>";
    modalRestauranteSociaNetworks.appendChild(ul);
  } else {
    modalRestauranteSociaNetworks.style.display = "none";
  }
  // =============================================================================================
  // WEBSITE
  const modalRestauranteWebsite = document.getElementById(
    "modalRestaurante-website"
  );
  modalRestauranteWebsite.innerHTML =
    website != "" ? `<i class="fa-solid fa-link fa-lg"></i> ` : "";
  modalRestauranteWebsite.innerHTML += website != "" ? `Sitio Web` : "";
  modalRestauranteWebsite.href = website;
  // --------
  modalRestaurante.style.display = "flex";
}

// Función para cerrar el modal
function closeModalRestaurante() {
  document.body.style.overflow = "auto";
  const modalRestaurante = document.getElementById("modalRestaurante");
  modalRestaurante.style.display = "none";
}
