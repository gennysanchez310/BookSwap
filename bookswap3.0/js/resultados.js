// Función para redirigir a otras páginas
function redirectTo(page) {
    window.location.href = page;
  }
  
  // Obtener el término de búsqueda desde la URL
  function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';  // Devuelve el término de búsqueda o una cadena vacía si no existe
  }
  
  // Mostrar los resultados
  function displayResults(query) {
    const searchQueryElement = document.getElementById('searchQuery');
    const resultCardsElement = document.getElementById('resultCards');
    
    searchQueryElement.textContent = query;
  
    // Simulamos algunos resultados de búsqueda
    const exampleBooks = [
      { title: 'El visitante', author: 'Steven King', exchangeFor: 'La Reina Roja', img: 'img/30 libros de terror y novela negra para una noche de miedo.jpg' },
      { title: 'Boulevard', author: 'Flor M. Salvador', exchangeFor: 'Bajo La Misma Estrella', img: 'img/BOULEVARD 🌈🚬💫.jpg' },
      { title: 'El Jardín De Las Mariposas', author: 'Dot Hutchinson', exchangeFor: 'El Niño Con El Pijama De Rayas', img: 'img/El Jardín De Las Mariposas.jpg' },
    ];
  
    // Filtramos los libros que coinciden con el término de búsqueda (en este ejemplo simulamos un filtro)
    const filteredBooks = exampleBooks.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
  
    // Si no hay resultados, mostramos un mensaje
    if (filteredBooks.length === 0) {
      resultCardsElement.innerHTML = '<p>No se encontraron resultados para tu búsqueda.</p>';
    } else {
      // Mostramos los resultados en tarjetas
      resultCardsElement.innerHTML = filteredBooks.map(book => {
        return `
          <div class="book-card">
            <img src="${book.img}" alt="Portada del libro">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <p>Intercambio por: ${book.exchangeFor}</p>
            <button>Ver más</button>
          </div>
        `;
      }).join('');
    }
  }
  
  // Al cargar la página, obtenemos el término de búsqueda de la URL y mostramos los resultados
  window.onload = function() {
    const searchQuery = getSearchQuery();
    displayResults(searchQuery);
  
    // Manejo de la barra de búsqueda
    document.querySelector('.search-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const newSearchQuery = document.getElementById('searchInput').value.trim();
      if (newSearchQuery) {
        window.location.href = `resultados.html?q=${newSearchQuery}`;
      }
    });
  };
  