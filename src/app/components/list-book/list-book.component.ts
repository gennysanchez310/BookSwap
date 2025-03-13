import { Component, OnDestroy } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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

  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    
  }

  addBook() {
    if (this.bookForm.invalid) {
      this.toastr.error(
        'Por favor, rellene todos los campos obligatorios y corrija cualquier error..',
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
