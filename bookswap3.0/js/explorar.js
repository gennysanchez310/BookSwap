// Función para redirigir a otras páginas
function redirectTo(page) {
    window.location.href = page;
  }
  
  // Función para manejar la búsqueda de libros
  document.querySelector('.search-bar button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-bar input').value.trim().toLowerCase();
    
    if (searchTerm) {
      // Filtramos las tarjetas de libros basándonos en el término de búsqueda
      const bookCards = document.querySelectorAll('.book-card');
      
      bookCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
  
        // Si el título o el autor contienen el término de búsqueda, mostramos la tarjeta
        if (title.includes(searchTerm) || author.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    } else {
      // Si no hay término de búsqueda, mostramos todas las tarjetas
      const bookCards = document.querySelectorAll('.book-card');
      bookCards.forEach(card => {
        card.style.display = 'block';
      });
    }
  });
  
  // Opcional: Limpiar la búsqueda al hacer clic fuera del campo
  document.querySelector('.search-bar input').addEventListener('focus', function() {
    this.value = ''; // Limpiar el campo de búsqueda al hacer foco
  });
  