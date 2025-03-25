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

  // ✅ Método para obtener el ID del usuario autenticado
  getCurrentUserId(): string | null {
    const user = firebase.auth().currentUser;
    return user ? user.uid : null;
  }

  // ✅ Modificado: Comprobar si hay un usuario autenticado correctamente
  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.afAuth.authState.subscribe((user) => {
        observer.next(!!user);
      });
    });
  }

  // Obtener información del usuario actual
  getCurrentUser(): Observable<firebase.User | null> {
    return this.user$;
  }

  // Cerrar sesión
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
