// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
  window.location.href = page;
}

// Función de validación del formulario de registro
document.getElementById("register-form")?.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  
  // Validación de campos vacíos
  if (!username || !email || !password || !confirmPassword) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  
  // Validación de contraseñas coincidentes
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }
  
  // Si todo es válido, simula el registro
  alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
  // Aquí puedes agregar la lógica para enviar los datos al servidor
});

// Función de validación para el inicio de sesión
document.querySelector("form")?.addEventListener("submit", function(event) {
  event.preventDefault();

  const usernameOrEmail = document.querySelector("input[type='text']").value;
  const password = document.querySelector("input[type='password']").value;

  // Validación de campos vacíos
  if (!usernameOrEmail || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Lógica de inicio de sesión (simulada aquí)
  alert("¡Inicio de sesión exitoso!");
  // Aquí se validaría con un servidor
});

// Función para mostrar mensajes de alerta cuando el usuario navega por el sitio
document.querySelectorAll('.cta').forEach(function(button) {
  button.addEventListener('click', function(event) {
    const page = event.target.closest('button').querySelector('span').textContent;
    alert(`Estás navegando a la sección: ${page}`);
  });
});

// Función de redirección cuando el usuario hace clic en el botón "Iniciar sesión"
document.querySelector('.login-btn')?.addEventListener('click', function() {
  redirectTo('login.html');
});

// Función de redirección cuando el usuario hace clic en "Registrarse" desde el login
document.querySelector('.register-btn')?.addEventListener('click', function() {
  redirectTo('registro.html');
});

// Función de redirección cuando el usuario hace clic en "Volver al login" desde el registro
document.querySelector('.back-to-login')?.addEventListener('click', function() {
  redirectTo('login.html');
});

// Agregar event listeners a los enlaces de navegación en el footer
document.querySelectorAll('footer a').forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const page = event.target.getAttribute('href');
    alert(`Estás navegando a la página: ${page}`);
    redirectTo(page);
  });
});



// Función para mostrar el modal de alerta
function showAlert(message) {
  const modal = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");
  
  alertMessage.textContent = message;
  modal.style.display = "flex"; // Mostrar el modal
}

// Cerrar el modal al hacer clic en el botón de cierre
document.querySelector(".close-btn")?.addEventListener("click", function() {
  const modal = document.getElementById("custom-alert");
  modal.style.display = "none"; // Ocultar el modal
});

// Función de validación del formulario de registro
document.getElementById("register-form")?.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  
  // Validación de campos vacíos
  if (!username || !email || !password || !confirmPassword) {
    showAlert("Por favor, completa todos los campos.");
    return;
  }
  
  // Validación de contraseñas coincidentes
  if (password !== confirmPassword) {
    showAlert("Las contraseñas no coinciden.");
    return;
  }
  
  // Si todo es válido, simula el registro
  showAlert("¡Registro exitoso! Ahora puedes iniciar sesión.");
  // Aquí puedes agregar la lógica para enviar los datos al servidor
});

// Función de validación para el inicio de sesión
document.querySelector("form")?.addEventListener("submit", function(event) {
  event.preventDefault();

  const usernameOrEmail = document.querySelector("input[type='text']").value;
  const password = document.querySelector("input[type='password']").value;

  // Validación de campos vacíos
  if (!usernameOrEmail || !password) {
    showAlert("Por favor, completa todos los campos.");
    return;
  }

  // Lógica de inicio de sesión (simulada aquí)
  showAlert("¡Inicio de sesión exitoso!");
  // Aquí se validaría con un servidor
});

// Función para mostrar mensajes de alerta cuando el usuario navega por el sitio
document.querySelectorAll('.cta').forEach(function(button) {
  button.addEventListener('click', function(event) {
    const page = event.target.closest('button').querySelector('span').textContent;
    showAlert(`Estás navegando a la sección: ${page}`);
  });
});

// Función de redirección cuando el usuario hace clic en el botón "Iniciar sesión"
document.querySelector('.login-btn')?.addEventListener('click', function() {
  showAlert("Redirigiendo a la página de inicio de sesión.");
  redirectTo('login.html');
});

// Función de redirección cuando el usuario hace clic en "Registrarse" desde el login
document.querySelector('.register-btn')?.addEventListener('click', function() {
  showAlert("Redirigiendo a la página de registro.");
  redirectTo('registro.html');
});

// Función de redirección cuando el usuario hace clic en "Volver al login" desde el registro
document.querySelector('.back-to-login')?.addEventListener('click', function() {
  showAlert("Redirigiendo al login.");
  redirectTo('login.html');
});
