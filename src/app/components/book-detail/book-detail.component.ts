import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit, OnChanges {
  @Input() isbn!: string;
  @Input() ownerUid!: string;
  @Output() closeModalEvent = new EventEmitter<void>();

  bookDetails: any;
  isModalOpen: boolean = true;
  ownerAvatarUrl: string = '';
  ownerUsername: string = '';

  private previousIsbn: string = '';
  private previousOwnerUid: string = '';
  isLoading: boolean = false;  // Estado de carga

  constructor(
    private googleBooksApiService: BookService,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.loadBookDetailsAndOwnerData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo recarga si el isbn o ownerUid han cambiado
    if (changes['isbn'] && this.isbn !== this.previousIsbn) {
      this.loadBookDetailsAndOwnerData();
      this.previousIsbn = this.isbn;
    }

    if (changes['ownerUid'] && this.ownerUid !== this.previousOwnerUid) {
      this.fetchOwnerData();
      this.previousOwnerUid = this.ownerUid;
    }
  }

  // Función para cargar los detalles del libro y los datos del propietario
  async loadBookDetailsAndOwnerData(): Promise<void> {
    this.isLoading = true;  // Activamos la carga

    try {
      await this.fetchBookDetails();
      await this.fetchOwnerData();
    } catch (error) {
      console.error('Error al cargar los datos', error);
    } finally {
      this.isLoading = false;  // Desactivamos la carga una vez todo esté listo
    }
  }

  // Cargar los detalles del libro
  async fetchBookDetails(): Promise<void> {
    try {
      const data = await this.googleBooksApiService.getBookDetailsByISBN(this.isbn).toPromise();
      this.bookDetails = data.items[0];
    } catch (error) {
      console.error('Error al obtener detalles del libro:', error);
    }
  }

  // Cargar los datos del propietario
  async fetchOwnerData(): Promise<void> {
    try {
      const userCollectionRef = collection(this.firestore, 'users');
      const q = query(userCollectionRef, where('userUID', '==', this.ownerUid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        this.ownerAvatarUrl = userData['avatarUrl'];
        this.ownerUsername = userData['username'];
      } else {
        console.log('No se encontró al propietario en la base de datos');
      }
    } catch (error) {
      console.error('Error al obtener datos del propietario:', error);
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
    
    // Asegurarse de desbloquear el scroll en el body cuando el modal se cierre
    setTimeout(() => {
      document.body.style.overflow = 'auto';  // Permitir el scroll del fondo
    }, 300);  // Esperar 300ms antes de restaurar el scroll
  }
  
  ngOnDestroy() {
    // Asegúrate de desbloquear el scroll si el componente se destruye o navegas
    document.body.style.overflow = 'auto';
  }
  
  viewUser() {
    // Cerrar el modal y restaurar el scroll antes de navegar
    this.closeModal(); // Cerrar el modal
    this.router.navigate(['/profile', this.ownerUid]).then(() => {
      // Restaurar el scroll cuando ya se haya navegado
      document.body.style.overflow = 'auto';
    });
  }
  
}
