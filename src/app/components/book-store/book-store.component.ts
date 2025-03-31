import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BookService } from 'src/app/services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css'],
})
export class BookStoreComponent implements OnInit, OnDestroy {
  books: any[] = [];
  isProfileDropdownOpen: boolean = false;
  searchTerm: string = '';
  filteredBooks: any[] = [];
  isModalOpen = false; // Controla si el modal está abierto
  selectedISBN!: string; // Guarda el ISBN del libro seleccionado
  selectedUserUID!: string;
  currentUserUID: any;
  private routerEventsSubscription!: Subscription;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private googleBooksApiService: BookService,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService
  ) {
    this.getData();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserUID = user.uid;
      }
    });
  }

  ngOnInit(): void {
    // Nos suscribimos a los eventos de navegación para asegurarnos de que el scroll se reactive al cambiar de ruta
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Reactiva el scroll cuando termina la navegación
        this.checkAndRestoreScroll();
      }
    });
  }

  ngOnDestroy(): void {
    // Nos desuscribimos de los eventos del router para evitar posibles fugas de memoria
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  noAction() {
    // No hacer nada, literalmente es para no mover nada
  }

  getData() {
    const bookInstance = collection(this.firestore, 'books');
    getDocs(bookInstance).then((res) => {
      this.books = res.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });

      // Fetch detalles adicionales de los libros, como la imagen de portada
      this.books.forEach((book) => {
        this.googleBooksApiService
          .getBookDetailsByISBN(book.isbn)
          .subscribe((data) => {
            const volumeInfo = data.items[0].volumeInfo;
            book.coverImage = volumeInfo.imageLinks?.thumbnail;
          });
      });

      this.filteredBooks = this.books.filter((book) => {
        return book.userUID !== this.currentUserUID;
      });
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.signOut().then(() => {
          this.currentUserUID = null;
          Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente.', 'success');
          this.router.navigate(['/']); // Redirige a la página de inicio
        });
      }
    });
  }  
  

  searchBooks() {
    // Filtra los libros en base al término de búsqueda
    this.filteredBooks = this.books.filter((book) => {
      const titleMatch = book.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const authorMatch = book.author
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return (
        (titleMatch || authorMatch) && book.userUID !== this.currentUserUID
      );
    });
  }

  openBookDetailsModal(isbn: string, userUID: string) {
    this.selectedISBN = isbn;
    this.selectedUserUID = userUID;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Bloquea el scroll
    console.log('Modal abierto para el ISBN:', isbn);
  }

  closeModal() {
    this.isModalOpen = false;
    this.checkAndRestoreScroll();
  }

  profileManagement() {
    this.closeModal(); // Asegúrate de cerrar el modal antes de navegar
    this.router.navigate(['/profile', this.currentUserUID]);
  }

  private checkAndRestoreScroll() {
    // Verifica si hay algún modal abierto antes de restaurar el scroll
    if (!this.isModalOpen) {
      document.body.style.overflow = 'auto'; // Reactiva el scroll
    }
  }
}
