AOS.init({
  disable: false, // 🔁 Permitir en móviles
  duration: 700,
  easing: "ease-in-out",
  once: true, // Solo una vez
  offset: 0, // El número en píxeles determina qué tan antes se activa el efecto
  delay: 600,
  startEvent: "load",
  // startEvent: "DOMContentLoaded", // Utiliza el evento 'scroll' para iniciar las animaciones
  // startEvent: "scroll", // Utiliza el evento 'scroll' para iniciar las animaciones
  initClassName: 'aos-init'
});
