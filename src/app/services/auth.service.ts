import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    // Establecer un observable para el estado del usuario
    this.user$ = afAuth.authState as Observable<firebase.User | null>;
  }

  async register(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential | null> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential | null> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Verificar si el usuario está autenticado usando un observable
  isAuthenticated(): Observable<boolean> {
    return new Observable((observer) => {
      this.afAuth.authState.subscribe((user) => {
        observer.next(!!user); // Si hay un usuario, devuelve true, sino false
        observer.complete();
      });
    });
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return this.afAuth.currentUser;
  }

  // Cerrar sesión
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
