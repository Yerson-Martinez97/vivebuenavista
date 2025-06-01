function renderRating(estrellasContainer, ratingNumberElement, puntuacion) {
  const llenas = Math.floor(puntuacion);
  const decimal = puntuacion - llenas;
  const media = decimal >= 0.25 && decimal < 0.75 ? 1 : 0;
  const vacias = 5 - llenas - media;

  estrellasContainer.innerHTML = "";

  // Llenas
  for (let i = 0; i < llenas; i++) {
    const estrella = document.createElement("i");
    estrella.classList.add("fas", "fa-star", "filled");
    estrellasContainer.appendChild(estrella);
  }

  // Media
  if (media === 1) {
    const mediaEstrella = document.createElement("i");
    mediaEstrella.classList.add("fas", "fa-star-half-stroke");
    estrellasContainer.appendChild(mediaEstrella);
  }

  // Vacías
  for (let i = 0; i < vacias; i++) {
    const estrella = document.createElement("i");
    estrella.classList.add("far", "fa-star");
    estrellasContainer.appendChild(estrella);
  }

  ratingNumberElement.textContent = puntuacion.toFixed(1);
}

// Aplica la función a todas las tarjetas con data-star
document.querySelectorAll(".card").forEach((card) => {
  const rating = parseFloat(card.dataset.star);
  const estrellasContainer = card.querySelector(".estrellas");
  const ratingNumberElement = card.querySelector(".rating-number");

  if (!isNaN(rating) && estrellasContainer && ratingNumberElement) {
    renderRating(estrellasContainer, ratingNumberElement, rating);
  }
});
