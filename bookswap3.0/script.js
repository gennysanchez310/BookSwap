// Función para redirigir a otras páginas
function redirectTo(page) {
  window.location.href = page;
}

// Lógica del carrusel de libros
let currentIndex = 0;
const carousel = document.getElementById('carousel');
const books = [
  { title: 'El Principe Cruel', img: 'img/El príncipe cruel - Holly Black.jpg' },
  { title: 'Fabricante De Lagrimas', img: 'img/Fabricante de lágrimas (Spanish Edition).jpg' },
  { title: 'La Cancion Del Cuervo', img: 'img/RAVENSONG, LA CANCION DEL CUERVO.jpg' },
  { title: 'Boulevard', img: 'img/BOULEVARD 🌈🚬💫.jpg' },
  // Agregar más libros aquí
];

function renderCarousel() {
  carousel.innerHTML = ''; 
  const book = books[currentIndex];
  const bookElement = document.createElement('div');
  bookElement.classList.add('carousel-item');
  bookElement.innerHTML = `
    <img src="${book.img}" alt="${book.title}">
    <h4>${book.title}</h4>
  `;
  carousel.appendChild(bookElement);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % books.length;
  renderCarousel();
}

// Cambia la diapositiva cada 3 segundos
setInterval(nextSlide, 3000);

// Inicializa el carrusel
renderCarousel();
