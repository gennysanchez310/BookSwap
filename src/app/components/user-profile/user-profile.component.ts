import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import {
  Firestore,
  collection,
  getDocs,
  where,
  query,
  QuerySnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { LocationSuggestionsService } from '../../services/location-suggestions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {

  private validateAndFormatBirthday(rawBirthday: string): string | null {
    // Verifica que el formato sea válido (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(rawBirthday)) {
      return null; // Retorna null si el formato es incorrecto
    }
  
    const date = new Date(rawBirthday);
    if (isNaN(date.getTime())) {
      return null; // Si la fecha no es válida, retorna null
    }
  
    return rawBirthday; // Retorna la fecha en formato correcto si todo está bien
  }  

  private isValidName(name: string): boolean {
    // Validar que no contenga caracteres no permitidos (números, símbolos, etc.)
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  }

  private isValidSummaryAndLocation(value: string, maxLength: number): boolean {
    // Verificar que no exceda la longitud máxima permitida
    return value.length <= maxLength;
  }

  private isValidSocialMediaId(id: string): boolean {
    // Asegurar que no tenga espacios ni caracteres especiales
    const idRegex = /^[a-zA-Z0-9_]+$/;
    return idRegex.test(id);
  }

  user: any;
  showUpdateModal: boolean = false;
  showDeleteModal = false;
  currentUserUID!: string;
  locationSuggestions: any[] = [];
  isContactModalOpen = false;
  selectedBookForExchange: any;
  receiverEmail: string = '';
  bookToDelete: any;
  proposedBook: any = {
    title: '',
    author: '',
  };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: Firestore,
    private route: ActivatedRoute,
    private locationSuggestionsService: LocationSuggestionsService,
    private googleBooksApiService: BookService,
    private toastr: ToastrService
  ) {
    this.retrieveUserData();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserUID = user.uid;
      }
    });
  }

  onLocationInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query) {
      this.locationSuggestionsService.getLocationSuggestions(query).subscribe(
        (data: any) => {
          this.locationSuggestions = data;
        },
        (error) => {
          console.error('Error fetching location suggestions:', error);
        }
      );
    } else {
      this.locationSuggestions = [];
    }
  }

  selectLocation(suggestion: any) {
    this.user.location = suggestion.display_name;
    this.locationSuggestions = [];
  }

  private retrieveUserData() {
    this.route.paramMap.subscribe((params) => {
      const userUID = params.get('uid');
      if (userUID) {
        const userCollectionRef = collection(this.firestore, 'users');
        const q = query(userCollectionRef, where('userUID', '==', userUID));

        getDocs(q)
          .then((querySnapshot: QuerySnapshot<any>) => {
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              this.user = userDoc.data();

              // Fetch user's listed books
              const booksCollectionRef = collection(this.firestore, 'books');
              const bookQuery = query(
                booksCollectionRef,
                where('userUID', '==', userUID)
              );

              getDocs(bookQuery)
                .then((bookSnapshot: QuerySnapshot<any>) => {
                  if (!bookSnapshot.empty) {
                    this.user.listedBooks = bookSnapshot.docs.map((doc) => {
                      const bookData = doc.data();
                      return { ...bookData, id: doc.id };
                    });
                    // Fetch cover images for listed books
                    this.user.listedBooks.forEach(
                      (book: { isbn: string; coverImage: string }) => {
                        this.googleBooksApiService
                          .getBookDetailsByISBN(book.isbn)
                          .subscribe((data) => {
                            const volumeInfo = data.items[0].volumeInfo;
                            book.coverImage = volumeInfo.imageLinks?.thumbnail;
                          });
                      }
                    );
                  } else {
                    this.user.listedBooks = [];
                  }
                })
                .catch((error) => {
                  console.error("Error fetching user's listed books:", error);
                  this.toastr.error(
                    "An error occurred while fetching user's listed books",
                    'Error'
                  );
                });
            } else {
              console.log('There is no such user in the database!');
              this.toastr.warning(
                'There is no such user in the database!',
                'Warning'
              );
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            this.toastr.error(
              'An error occurred while fetching user data',
              'Error'
            );
          });
      }
    });
  }

  // Toggle the update modal
  toggleUpdateModal() {
    this.showUpdateModal = !this.showUpdateModal;
  }

  isCurrentUserProfile(): boolean {
    return this.currentUserUID === this.user.userUID;
  }

  showDeleteConfirmationModal(book: any) {
    this.bookToDelete = book; // Store the book to delete
    this.showDeleteModal = true;
  }

  // Method to hide the delete confirmation modal
  hideDeleteModal() {
    this.bookToDelete = null; // Reset the book to delete
    this.showDeleteModal = false;
  }

  proposeBookTrade(book: any) {
    this.proposedBook.title = book.title;
    this.proposedBook.author = book.author;
    const subject = `Book Exchange Proposal: ${this.proposedBook.title}`;
    this.receiverEmail = this.user.userEmail;

    const userCollectionRef = collection(this.firestore, 'users');
    const q = query(
      userCollectionRef,
      where('userUID', '==', this.currentUserUID)
    );

    getDocs(q)
      .then((querySnapshot: QuerySnapshot<any>) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const currentUser = userDoc.data();

          // Construct the message
          const senderName = `${currentUser.firstName} ${currentUser.lastName}`;
          const receiverName = `${this.user.firstName} ${this.user.lastName}`;

          // Construct the message
          const message = `
          Hola ${receiverName},
          
          Me encontré con tu libro, "${this.proposedBook.title}" de "${this.proposedBook.author}" listado en BookSwap, y me encantaría intercambiar libros contigo.
          
          Aquí están los detalles del libro que estoy dispuesto a ofrecer a cambio:
          Título: [Título de tu libro]
          Autor: [Autor de tu libro]
          ISBN: [ISBN de tu libro]
          
          Por favor, avísame si estás interesado/a en este intercambio.
          
          Saludos cordiales,
          ${senderName}
          `;
          
          const encodedSubject = encodeURIComponent(subject);
          const encodedMessage = encodeURIComponent(message);

          const mailtoLink = `mailto:${this.receiverEmail}?subject=${encodedSubject}&body=${encodedMessage}`;

          // Open the user's default email client with the mailto link
          window.location.href = mailtoLink;
        }
      })
      .catch((error) => {
        console.error('Error fetching current user data:', error);
        this.toastr.error(
          'An error occurred while fetching current user data',
          'Error'
        );
      });
  }

  // Update user details
  async updateDetails(updateForm: NgForm) {
    const rawBirthday = updateForm.value.birthday;
    const firstName = updateForm.value.firstName;
    const lastName = updateForm.value.lastName;
    const summary = updateForm.value.summary;
    const location = updateForm.value.location;
    const instaId = updateForm.value.instaId;
    const twitterId = updateForm.value.twitterId;

      // Validación de nombre y apellido
    if (!this.isValidName(firstName)) {
      this.toastr.error('El nombre contiene caracteres no válidos', 'Error');
      return;
    }
    if (!this.isValidName(lastName)) {
      this.toastr.error('El apellido contiene caracteres no válidos', 'Error');
      return;
    }

        // Validación de resumen y ubicación
    if (!this.isValidSummaryAndLocation(summary, 200)) {  // Limitar a 200 caracteres para resumen
      this.toastr.error('El resumen es demasiado largo', 'Error');
      return;
    }
    if (!this.isValidSummaryAndLocation(location, 100)) {  // Limitar a 100 caracteres para ubicación
      this.toastr.error('La ubicación es demasiado larga', 'Error');
      return;
    }

      // Validar instaId y twitterId (si no están vacíos)
  const validSocialMediaRegex = /^[a-zA-Z0-9_]+$/; // Solo letras, números y guiones bajos
  if (updateForm.value.instaId && !validSocialMediaRegex.test(updateForm.value.instaId)) {
    this.toastr.error('El Instagram ID solo puede contener letras, números y guiones bajos', 'Error');
    return;
  }

  if (updateForm.value.twitterId && !validSocialMediaRegex.test(updateForm.value.twitterId)) {
    this.toastr.error('El Twitter ID solo puede contener letras, números y guiones bajos', 'Error');
    return;
  }


    // Validar la fecha de nacimiento
    const formattedBirthday = this.validateAndFormatBirthday(rawBirthday);
    if (!formattedBirthday) {
      this.toastr.error('La fecha de nacimiento es inválida', 'Error');
      return;
    }


    const newUserData = {
      firstName,
      lastName,
      gender: updateForm.value.gender,
      location,
      birthday: formattedBirthday,
      summary,
      instaId,
      twitterId,
    };

    this.route.paramMap.subscribe((params) => {
      const userUID = params.get('uid');
      if (userUID) {
        // Find the user's document based on their userUID
        const userCollectionRef = collection(this.firestore, 'users');
        const q = query(userCollectionRef, where('userUID', '==', userUID));

        getDocs(q)
          .then((querySnapshot: QuerySnapshot<any>) => {
            if (!querySnapshot.empty) {
              // Assuming there is only one matching document
              const userDoc = querySnapshot.docs[0];
              const userDocRef = doc(this.firestore, 'users', userDoc.id);

              // Update the user's document
              updateDoc(userDocRef, newUserData)
              .then(() => {
                console.log('User details updated successfully');
                this.toastr.success('Perfil actualizado con éxito', 'Éxito');
                this.toggleUpdateModal();
              })
              .catch((error) => {
                console.error('Error updating user details:', error);
                this.toastr.error(
                  'Ocurrió un error al actualizar los datos',
                  'Error'
                );
              });
            } else {
              this.toastr.warning('Usuario no encontrado', 'Advertencia');
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            this.toastr.error('Error al obtener datos del usuario', 'Error');
          });
      }
    });
  }

  async deleteBook(book: any) {
    console.log('Deleting book:', book.id);
    try {
      // Remove the book from the user's displayed list
      this.user.listedBooks = this.user.listedBooks.filter(
        (b: any) => b !== book
      );
      // Delete the book document from Firestore
      const bookDocRef = doc(this.firestore, 'books', book.id);
      await deleteDoc(bookDocRef);
      console.log(`"${book.title}" has been deleted.`);
      this.toastr.success('The book has been deleted successfully', 'Success');
    } catch (error) {
      console.error(`Error deleting "${book.title}":`, error);
      this.toastr.error('An error occurred while deleting the book', 'Error');
    }
  }

  confirmDelete() {
    if (this.bookToDelete) {
      this.deleteBook(this.bookToDelete);
      this.hideDeleteModal();
    }
  }
}
