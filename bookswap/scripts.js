// Función para buscar libros (para explorar.html)
function buscarLibro() {
  const query = document.getElementById('search-input').value;
  const librosLista = document.getElementById('libros-lista');

  if (query) {
    // Simular búsqueda (aquí puedes agregar tu lógica de búsqueda)
    librosLista.innerHTML = `<p>Resultados para: "${query}"</p>`;
  } else {
    alert('Por favor, ingrese un término de búsqueda.');
  }
}

// Placeholder para la función de perfil (para perfil.html)
function verHistorialIntercambios() {
  alert('Función de ver historial de intercambios aún no implementada.');
}

// Placeholder para la función de comunidad (para comunidad.html)
function visitarForos() {
  alert('Función de visitar foros aún no implementada.');
}

// Placeholder para funciones del blog (para blog.html)
function leerBlog() {
  alert('Función de leer el blog aún no implementada.');
}

// Funciones comunes para mostrar secciones o elementos
function mostrarSeccion(seccionId) {
  const secciones = document.querySelectorAll('section');
  secciones.forEach(seccion => {
    if (seccion.id === seccionId) {
      seccion.classList.add('seccion-activa');
      seccion.classList.remove('seccion');
    } else {
      seccion.classList.remove('seccion-activa');
      seccion.classList.add('seccion');
    }
  });
}
// Mostrar la sección seleccionada y ocultar las demás
function mostrarSeccion(seccionId) {
  const secciones = document.querySelectorAll('section');
  secciones.forEach(seccion => {
    if (seccion.id === seccionId) {
      seccion.classList.add('seccion-activa');
      seccion.classList.remove('seccion');
    } else {
      seccion.classList.remove('seccion-activa');
      seccion.classList.add('seccion');
    }
  });
}

// Manejar el envío del formulario de perfil
document.getElementById('form-perfil').addEventListener('submit', function(event) {
  event.preventDefault();
  // Aquí puedes agregar lógica para guardar los cambios del perfil
  alert('Perfil actualizado con éxito.');
});

// Manejar el envío del formulario de agregar libro
document.getElementById('form-libro').addEventListener('submit', function(event) {
  event.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const tipo = document.getElementById('tipo').value;

  const li = document.createElement('li');
  li.textContent = `${titulo} por ${autor}`;

  if (tipo === 'ofrecido') {
    document.getElementById('libros-ofrecidos').appendChild(li);
  } else {
    document.getElementById('libros-deseados').appendChild(li);
  }

  // Limpiar el formulario
  document.getElementById('form-libro').reset();
});
