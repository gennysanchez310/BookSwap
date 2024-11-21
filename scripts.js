//-------------------------------INDEX-----------------------------------

// Función para redirigir a una página específica
function redirectTo(page) {
    if (page) {
      window.location.href = page;
    } else {
      console.error("No se ha proporcionado una página válida para redirigir.");
    }
  }
  
  let currentIndex = 0;
  const carouselContainer = document.getElementById('carousel-container');
  const images = document.querySelectorAll('.carousel-image');
  
  function moveToNextImage() {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0; // Reinicia al inicio
    }
    const offset = -currentIndex * (images[0].clientWidth + 10); // Ancho de la imagen más margen
    carouselContainer.style.transform = `translateX(${offset}px)`;
  }
  
  // Cambia la imagen cada 3 segundos (3000 milisegundos)
  setInterval(moveToNextImage, 3000);
  


//----------------------------EXPLORAR---------------------------------------

function redirectTo(page) {
    window.location.href = page;
  }
  
  function filterByGenre(genre) {
    const bookItems = document.querySelectorAll('.book-item');
    
    bookItems.forEach(item => {
      if (genre === 'Todos' || item.getAttribute('data-genre') === genre) {
        item.style.display = 'block'; // Muestra el libro
      } else {
        item.style.display = 'none'; // Oculta el libro
      }
    });
  }
  
  function showBookDetails(title, author, description, price = '') {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-author').innerText = author;
    document.getElementById('modal-description').innerText = description;
    document.getElementById('modal-price').innerText = price ? `Precio: ${price}` : '';
    document.getElementById('bookModal').style.display = 'block'; // Muestra el modal
  }
  
  function closeModal() {
    document.getElementById('bookModal').style.display = 'none'; // Oculta el modal
  }
  
  // Cierra el modal cuando se hace clic fuera del contenido
  window.onclick = function(event) {
    const modal = document.getElementById('bookModal');
    if (event.target === modal) {
      closeModal();
    }
  };


//-------------------------------PERFIL-------------------------------------------------

function redirectTo(page) {
    window.location.href = page;
}

//-------------------------------Comunidad-------------------------------------------------

function redirectTo(page) {
    window.location.href = page;
}

//-------------------------------FOROS-------------------------------------------------

function redirectTo(page) {
    window.location.href = page;
}

//-------------------------------REGISTRO-------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('registro-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Formulario enviado.'); // Puedes cambiar esto por una lógica real de envío
        form.reset();
    });
});

//-------------------------------PUBLICAR-------------------------------------------------

function redirectTo(page) {
    window.location.href = page;
}

function togglePriceOrExchange(select) {
    const exchangeBook = document.getElementById('exchange-book');
    const sellBook = document.getElementById('sell-book');

    if (select.value === 'exchange') {
        exchangeBook.style.display = 'block';
        sellBook.style.display = 'none';
    } else {
        exchangeBook.style.display = 'none';
        sellBook.style.display = 'block';
    }
}

//-------------------------------EDITAR-------------------------------------------------

function redirectTo(page) {
    window.location.href = page;
}
