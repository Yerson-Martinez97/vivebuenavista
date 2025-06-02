const buttons = document.querySelectorAll(".filter-btn");
const listItems = document.querySelectorAll(".options-list li");
const cards = document.querySelectorAll("#linkHoteleria .card");
const selectedOption = document.querySelector(".selected-option");
const optionsList = document.querySelector(".options-list");

// function applyFilter(category) {
//   cards.forEach((card) => {
//     const cat = card.getAttribute("data-category");
//     card.style.display =
//       category === "all" || cat === category ? "block" : "none";
//   });
// }

function applyFilter(category) {
  cards.forEach((card) => {
    const cat = card.getAttribute("data-category");
    const shouldShow = category === "all" || cat === category;

    if (shouldShow) {
      // Mostrar con fade-in
      card.style.display = "block";
      // Pequeño timeout para que la transición funcione
      setTimeout(() => card.classList.remove("hidden-card"), 10);
    } else {
      // Fade-out
      card.classList.add("hidden-card");
      // Al terminar la transición, ocultar con display:none
      card.addEventListener(
        "transitionend",
        () => {
          if (card.classList.contains("hidden-card")) {
            card.style.display = "none";
          }
        },
        { once: true }
      );
    }
  });
}

function toggleDropdown() {
  optionsList.style.display =
    optionsList.style.display === "block" ? "none" : "block";
}

listItems.forEach((li) => {
  li.addEventListener("click", () => {
    const filter = li.dataset.filter;

    applyFilter(filter);
    selectedOption.innerHTML = `<i class="fa-solid fa-chevron-down"></i> ${li.textContent}`;
    optionsList.style.display = "none";

    listItems.forEach((i) => i.classList.remove("active"));
    li.classList.add("active");

    buttons.forEach((b) => b.classList.remove("active"));
    document
      .querySelector(`.filter-btn[data-filter="${filter}"]`)
      ?.classList.add("active");
  });
});

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    applyFilter(filter);

    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    listItems.forEach((i) => i.classList.remove("active"));
    const li = document.querySelector(
      `.options-list li[data-filter="${filter}"]`
    );
    li?.classList.add("active");
    selectedOption.innerHTML = `<i class="fa-solid fa-chevron-down"></i> ${
      li?.textContent ?? "Todos"
    }`;
  });
});

// Cierra el menú si se hace clic fuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-select-mobile")) {
    optionsList.style.display = "none";
  }
});
