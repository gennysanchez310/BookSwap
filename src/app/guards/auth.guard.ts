import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.toastr.error(
            'Se requiere autenticación para acceder a esta página.',
            'Autenticación requerida'
          );
          this.router.navigate(['/login']);  // Redirigir a la página de login
          return false;
        }
      }),
      catchError((error) => {
        this.toastr.error(
          'Ocurrió un error al verificar la autenticación.',
          'Error de autenticación'
        );
        this.router.navigate(['/']);  // Redirigir a la página de inicio
        return of(false);
      })
    );
  }
}
