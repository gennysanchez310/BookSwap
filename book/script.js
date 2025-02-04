document.addEventListener("DOMContentLoaded", () => {
    // Hacer funcionales los botones de categorías
    document.querySelectorAll(".category-item").forEach(button => {
        button.addEventListener("click", () => {
            alert(`Has seleccionado la categoría: ${button.textContent}`);
        });
    });

    // Funcionalidad para ver detalles del libro
    document.querySelectorAll(".book-item").forEach(book => {
        book.addEventListener("click", () => {
            document.getElementById("modal-title").textContent = book.getAttribute("data-title");
            document.getElementById("modal-author").textContent = book.getAttribute("data-author");
            document.getElementById("modal-description").textContent = book.getAttribute("data-description");
            
            document.getElementById("book-modal").style.display = "block";
        });
    });

    // Cerrar el modal
    document.querySelector(".close").addEventListener("click", () => {
        document.getElementById("book-modal").style.display = "none";
    });

    window.onclick = function(event) {
        let modal = document.getElementById("book-modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

// Función para hacer scroll a "Nuevos Lanzamientos"
function scrollToNewReleases() {
    document.getElementById("new-releases").scrollIntoView({ behavior: "smooth" });
}

// Función para el botón "Intercambiar Ahora"
function intercambiarLibro() {
    alert("Has solicitado un intercambio para 'Fabricante de Lágrimas'");
}
