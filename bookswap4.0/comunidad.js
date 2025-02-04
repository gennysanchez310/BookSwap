// Abre el modal con el contenido de la publicación
function openPostModal(title, author, content) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalAuthor").innerText = "Autor: " + author;
    document.getElementById("modalContent").innerText = content;

    document.getElementById("postModal").style.display = "block";  // Muestra el modal
}

// Cierra el modal
function closeModal() {
    document.getElementById("postModal").style.display = "none";  // Oculta el modal
}

// Redirige a otras páginas
function redirectTo(page) {
    window.location.href = page;
}

// Agregar evento a cada publicación para abrir el modal con el contenido
document.querySelectorAll('.post').forEach(post => {
  post.addEventListener('click', function() {
    const title = this.querySelector('h3').textContent;
    const author = this.querySelector('strong').textContent;
    const content = this.querySelector('p').textContent;

    openPostModal(title, author, content);
  });
});

// Cierra el modal cuando se haga clic en la 'X'
document.querySelector('.close').addEventListener('click', closeModal);

// Cierra el modal si se hace clic fuera del contenido del modal
window.onclick = function(event) {
  const modal = document.getElementById('postModal');
  if (event.target === modal) {
    closeModal();
  }
};
