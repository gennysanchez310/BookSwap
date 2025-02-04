// Redirige a otras páginas
function redirectTo(page) {
    window.location.href = page;
}

// Abre el modal con el contenido del artículo
function openPostModal(title, author, content) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalAuthor").innerText = "Autor: " + author;
    document.getElementById("modalContent").innerText = content;

    document.getElementById("postModal").style.display = "block";
}

// Cierra el modal
function closeModal() {
    document.getElementById("postModal").style.display = "none";
}
