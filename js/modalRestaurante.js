document.addEventListener("DOMContentLoaded", () => {
  // Artesanías
  fetch("json/restaurantes.json")
    .then((res) => res.json())
    .then((data) => {
      document
        .querySelectorAll(".card [data-idRestaurante]")
        .forEach((card) => {
          card.addEventListener("click", function () {
            const id = this.getAttribute("data-idRestaurante");
            const restaurante = data[id];

            if (restaurante) {
              openModalRestaurante(
                restaurante.title || "",
                restaurante.stars || "",
                restaurante.description || "",
                restaurante.reservations || "",
                restaurante.images || [],
                restaurante.opinions || "",
                restaurante.businesshours || "",
                restaurante.location || "",
                restaurante.socialnetworks || "",
                restaurante.recommendations || ""
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
  stars,
  description,
  reservations,
  images,
  opinions,
  businesshours,
  location,
  socialnetworks,
  recommendations
) {
  document.body.style.overflow = "hidden";

  const modalRestaurante = document.getElementById("modalRestaurante");

  // Title
  const modalRestauranteTitle = document.getElementById(
    "modalRestaurante-title"
  );

  modalRestauranteTitle.innerText = title;
  // Stars
  const modalRestauranteStars = document.getElementById(
    "modalRestaurante-stars"
  );
  modalRestauranteStars.innerHTML = ""; // Limpiar estrellas anteriores

  // Crear un contenedor para las estrellas y el valor
  const starContainer = document.createElement("div");
  starContainer.classList.add("star-container");

  // Convertir el puntaje en un número flotante
  const fullStars = Math.floor(stars); // Número de estrellas completas
  const partialStar = stars - fullStars; // Parte de la estrella (si existe)

  // Crear las estrellas completas
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("i");
    star.classList.add("fas", "fa-star"); // Usar Font Awesome para estrella llena
    starContainer.appendChild(star);
  }

  // Crear la estrella parcial, si hay parte decimal
  if (partialStar > 0) {
    const star = document.createElement("i");
    star.classList.add("fas", "fa-star-half-alt"); // Usar Font Awesome para estrella media
    starContainer.appendChild(star);
  }

  // Rellenar las estrellas vacías restantes (hasta 5)
  for (let i = fullStars + (partialStar > 0 ? 1 : 0); i < 5; i++) {
    const star = document.createElement("i");
    star.classList.add("far", "fa-star"); // Usar Font Awesome para estrella vacía
    starContainer.appendChild(star);
  }

  // Mostrar el valor de las estrellas al lado
  const starValue = document.createElement("span");
  starValue.classList.add("star-value");
  starValue.innerText = `(${stars})`; // Muestra el valor numérico entre paréntesis

  // Añadir las estrellas y el valor al contenedor
  starContainer.appendChild(starValue);

  // Añadir las estrellas y el valor al modal
  modalRestauranteStars.appendChild(starContainer);

  // Description
  const modalRestauranteDescription = document.getElementById(
    "modalRestaurante-description"
  );
  modalRestauranteDescription.innerHTML = description;
  // Images
  const modalRestauranteImages = document.getElementById(
    "modalRestaurante-images"
  );
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
      img.classList.add("card__image");
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
  // Opinions
  const modalRestauranteOpinions = document.getElementById(
    "modalRestaurante-opinions"
  );
  if (opinions) {
    modalRestauranteOpinions.innerHTML = opinions;
  } else {
    modalRestauranteOpinions.style.display = "none";
  }
  // =============================================================================================
  // BUSINESS HOURS
  const modalRestauranteBusinessHours = document.getElementById(
    "modalRestaurante-businesshours"
  );
  modalRestauranteBusinessHours.innerHTML = ""; // Limpiar horario anterior

  if (businesshours && Array.isArray(businesshours)) {
    const businessHoursTitle = document.createElement("h3");
    businessHoursTitle.innerText = "Horario de Atención:";
    modalRestauranteBusinessHours.appendChild(businessHoursTitle);

    const list = document.createElement("ul");
    if (Array.isArray(businesshours[1])) {
      businesshours[1].forEach((hour) => {
        const li = document.createElement("li");
        const [day, time] = Object.entries(hour)[0];
        li.innerHTML = `<strong>${day}:</strong> ${time}`;
        list.appendChild(li);
      });
    } else {
      modalRestauranteBusinessHours.style.display = "none";
    }

    modalRestauranteBusinessHours.appendChild(list);
  } else {
    modalRestauranteBusinessHours.style.display = "none";
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
        // reservationContainer.innerHTML = "<p>No hay números disponibles</p>";
        reservationContainer.style.display = "none";
      }

      // Añadir el contenedor al modal
      modalRestauranteReservations.appendChild(reservationContainer);
    });
  } else {
    // Si no existen reservas, mostrar un mensaje
    // modalRestauranteReservations.innerHTML =
    //   "<p>No hay números disponibles.</p>";
    modalRestauranteReservations.style.display = "none";
  }
  // Recommendation
  const modalHoteleriaRecommendation = document.getElementById(
    "modalHoteleria-recommendations"
  );
  if (Array.isArray(recommendations)) {
    modalHoteleriaRecommendation.innerHTML = `
    <h2 class="modalHoteleria__title">Recomendaciones</h2>
    ${recommendations
      .map((recommendation) => `<p>- ${recommendation}</p>`)
      .join("")}
  `;
  } else {
    modalHoteleriaRecommendation.style.display = "none";
  }
  // LOCATION
  const modalRestauranteAddress = document.getElementById(
    "restaurante-location__address"
  );
  const modalRestauranteBtnMap = document.getElementById(
    "modalRestaurante-btnMap"
  );

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
  // --------
  modalRestaurante.style.display = "flex";
}

// Función para cerrar el modal
function closeModalRestaurante() {
  document.body.style.overflow = "auto";
  const modalRestaurante = document.getElementById("modalRestaurante");
  modalRestaurante.style.display = "none";
}
