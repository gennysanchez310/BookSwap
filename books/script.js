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

document.addEventListener("DOMContentLoaded", () => {
    const registerModal = document.getElementById("register-modal");
    const openRegisterModal = document.getElementById("open-register-modal");
    const closeRegisterModal = document.getElementById("close-register-modal");

    openRegisterModal.addEventListener("click", () => {
        registerModal.style.display = "block";
    });

    closeRegisterModal.addEventListener("click", () => {
        registerModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    });

    document.getElementById("register-form").addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Registro exitoso");
        registerModal.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const bookItems = document.querySelectorAll(".book-item");
    const bookModal = document.getElementById("book-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalAuthor = document.getElementById("modal-author");
    const modalStatus = document.getElementById("modal-status");
    const modalDescription = document.getElementById("modal-description");
    const closeModalButtons = document.querySelectorAll(".close");

    bookItems.forEach(item => {
        item.addEventListener("click", () => {
            modalTitle.textContent = item.dataset.title;
            modalAuthor.textContent = item.dataset.author;
            modalStatus.textContent = item.dataset.status;
            modalDescription.textContent = item.dataset.description;
            bookModal.style.display = "block";
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
        });
    });

    window.addEventListener("click", (event) => {
        document.querySelectorAll(".modal").forEach(modal => {
            if (event.target === modal) modal.style.display = "none";
        });
    });
});