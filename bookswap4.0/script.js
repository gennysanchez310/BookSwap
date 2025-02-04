// Función para redirigir a otra página
function redirectTo(page) {
  window.location.href = page;
}

// Función para mostrar detalles del libro en el modal
function showModal(bookDetails) {
  const modal = document.getElementById('bookModal');
  const modalContent = document.getElementById('modalContent');
  modal.style.display = 'flex'; // Mostrar el modal
  modalContent.innerHTML = `
    <h3>${bookDetails.title}</h3>
    <p><strong>Autor:</strong> ${bookDetails.author}</p>
    <p><strong>Descripción:</strong> ${bookDetails.description}</p>
    <p><strong>Lo que se pide a cambio:</strong> ${bookDetails.trade}</p>
    <button onclick="closeModal()">Cerrar</button>
  `;
}

// Función para cerrar el modal
function closeModal() {
  const bookModal = document.getElementById('bookModal');
  const postModal = document.getElementById('postModal');
  if (bookModal) bookModal.style.display = 'none'; // Ocultar el modal del libro
  if (postModal) postModal.style.display = 'none'; // Ocultar el modal de la publicación
}

// Función para abrir la ventana de registro
function openRegistration() {
  redirectTo('registro.html');
}

// Función para abrir la ventana de inicio de sesión
function openLogin() {
  redirectTo('login.html');
}

// Función para redirigir a la página de comunidad
function openComunidad() {
  redirectTo('comunidad.html');
}

// Función para redirigir a la página del perfil
function openPerfil() {
  redirectTo('perfil.html');
}

// Función para mostrar los detalles del libro
function showBookDetails(title, author, description, request) {
  document.getElementById('bookTitle').textContent = title;
  document.getElementById('bookAuthor').textContent = author;
  document.getElementById('bookDescription').textContent = description;
  document.getElementById('bookRequest').textContent = request;
  document.getElementById('bookModal').style.display = 'block';
}

// Función para mostrar el contenido de una publicación en el modal
function openPostModal(title, author, content) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalAuthor").innerText = "Autor: " + author;
  document.getElementById("modalContent").innerText = content;
  document.getElementById("postModal").style.display = "block";  // Muestra el modal
}

// Función para asignar eventos dinámicos a los botones "Ver más"
document.addEventListener('DOMContentLoaded', () => {
  const viewMoreButtons = document.querySelectorAll('.view-more-btn');
  viewMoreButtons.forEach(button => {
      button.addEventListener('click', function () {
          const bookTitle = this.closest('.book-card').querySelector('h4').textContent;
          const bookAuthor = this.closest('.book-card').querySelector('p').textContent;
          const bookDescription = "Aquí va la descripción del libro."; // Descripción dinámica
          const bookRequest = "Lo que se busca a cambio del libro.";  // Intercambio solicitado

          showBookDetails(bookTitle, bookAuthor, bookDescription, bookRequest);
      });
  });

  const loginButton = document.querySelector('.login-btn');
  if (loginButton) {
      loginButton.addEventListener('click', openLogin);
  }

  const registerButton = document.querySelector('.register-btn');
  if (registerButton) {
      registerButton.addEventListener('click', openRegistration);
  }

  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(button => {
      button.addEventListener('click', () => {
          const page = button.getAttribute('data-page');
          redirectTo(page);
      });
  });

  const posts = document.querySelectorAll('.post');
  posts.forEach(post => {
      post.addEventListener('click', function() {
          const title = this.querySelector('h3').textContent;
          const author = this.querySelector('strong').textContent;
          const content = this.querySelector('p').textContent;

          openPostModal(title, author, content);
      });
  });

  const closeButton = document.querySelector('.close');
  if (closeButton) {
      closeButton.addEventListener('click', closeModal);
  }

  window.onclick = function(event) {
      const postModal = document.getElementById('postModal');
      if (event.target === postModal) {
          closeModal();
      }
  };
});
