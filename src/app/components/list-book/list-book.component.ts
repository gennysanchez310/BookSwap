import { Component, OnDestroy } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css'],
})
export class ListBookComponent implements OnDestroy {
  bookForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    description: [''],
    condition: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
  });

  private authStateSubscription: Subscription | undefined;
  bookPreview: any = null;
  isLoading = false;

  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private bookService: BookService
  ) {}

  searchBookByISBN() {
    const isbn = this.bookForm.get('isbn')?.value;
    if (!isbn || !/^\d{10,13}$/.test(isbn)) {
      this.toastr.error('Ingrese un ISBN válido de 10 a 13 dígitos.', 'Error');
      return;
    }
    
    this.isLoading = true;
    this.bookService.getBookDetailsByISBN(isbn).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.items && response.items.length > 0) {
          const bookData = response.items[0].volumeInfo;
          this.bookPreview = {
            title: bookData.title,
            author: bookData.authors ? bookData.authors.join(', ') : 'Desconocido',
            image: bookData.imageLinks?.thumbnail || '',
            description: bookData.description || 'Sin descripción disponible.',
          };
          this.bookForm.patchValue({
            title: this.bookPreview.title,
            author: this.bookPreview.author,
            description: this.bookPreview.description,
          });
        } else {
          this.toastr.warning('No se encontraron resultados para este ISBN.', 'Aviso');
          this.bookPreview = null;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al buscar el libro:', error);
        this.toastr.error('Ocurrió un error al buscar el libro.', 'Error');
        this.bookPreview = null;
      }
    );
  }

  addBook() {
    if (this.bookForm.invalid) {
      this.toastr.error(
        'Por favor, rellene todos los campos obligatorios y corrija cualquier error.',
        'Error'
      );
      return;
    }

    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }

    this.authStateSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userUID = user.uid;
        const bookDataWithUID = { ...this.bookForm.value, userUID };
        const bookInstance = collection(this.firestore, 'books');
        addDoc(bookInstance, bookDataWithUID)
          .then(() => {
            console.log('Data Added Successfully');
            this.toastr.success('Libro agregado exitosamente', 'Éxito');
            this.bookForm.reset();
            this.bookPreview = null;
          })
          .catch((err) => {
            console.log(err.message);
            this.toastr.error(
              'Se produjo un error al agregar el libro.',
              'Error'
            );
          })
          .finally(() => {
            if (this.authStateSubscription) {
              this.authStateSubscription.unsubscribe();
            }
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }
}
