import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  year: number = new Date().getFullYear();

  constructor(private router: Router) {}

  goToSection(event: Event, section: string): void {
    event.preventDefault(); // Previene la acción de navegación por defecto.

    // Verificar si estamos en la landing page
    const currentUrl = this.router.url;

    // Si estamos en la landing page ("/" o cualquier ruta de la página de inicio)
    if (currentUrl === '/' || currentUrl === '') {
      switch (section) {
        case 'home':
          window.scrollTo(0, 0); // Desplazarse al inicio de la página
          break;
        case 'about':
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'contact':
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          break;
      }
    }
  }
}
