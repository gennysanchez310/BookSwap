// Función para redirigir a otras páginas
function redirectTo(page) {
  window.location.href = page;
}

// Manejo de la búsqueda en la barra de búsqueda en la sección hero
document.querySelector('.search-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Evitar el comportamiento por defecto del formulario
  const searchTerm = document.querySelector('.search-form input').value.trim().toLowerCase();
  
  if (searchTerm) {
    // Aquí podrías redirigir a una página de resultados con la búsqueda realizada
    window.location.href = `resultados.html?q=${searchTerm}`;
  } else {
    // Si el campo está vacío, muestra un mensaje o alerta
    alert("Por favor, ingresa un término de búsqueda.");
  }
});

// Manejo de la redirección para los botones de navegación en el header
document.querySelectorAll('.cta').forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = button.querySelector('span').textContent.trim().toLowerCase();
    
    // Redirige según el texto del botón
    switch (buttonText) {
      case 'explorar libros':
        redirectTo('explorar.html');
        break;
      case 'perfil':
        redirectTo('perfil.html');
        break;
      case 'comunidad':
        redirectTo('comunidad.html');
        break;
      case 'blog':
        redirectTo('blog.html');
        break;
      case 'iniciar sesión':
        redirectTo('login.html');
        break;
      case 'regístrate':
        redirectTo('registro.html');
        break;
      default:
        console.log("Botón no reconocido");
    }
  });
});

// Función para manejar el redireccionamiento de los botones de acción (cta) en la sección "Únete a nuestra comunidad"
document.querySelector('.cta.button-primary').addEventListener('click', function() {
  redirectTo('registro.html');
});

// Función para manejar la redirección de los enlaces en el footer
document.querySelectorAll('.footer-links a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar que el enlace se abra de forma predeterminada
    const href = link.getAttribute('href');
    
    // Redirigir según el href del enlace
    switch (href) {
      case 'contacto.html':
        redirectTo('contacto.html');
        break;
      case 'terminos.html':
        redirectTo('terminos.html');
        break;
      case 'privacidad.html':
        redirectTo('privacidad.html');
        break;
      default:
        console.log("Enlace no reconocido");
    }
  });
});
