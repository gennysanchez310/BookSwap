import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { generateUsername } from 'unique-username-generator';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {
  //Validacion de Gmail o Email.
  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  
  
  // Método para emitir el cierre del modal
  closeModalOnOutsideClick(event: MouseEvent): void {
    const modal = document.getElementById('authentication-modal');
    if (modal && event.target === modal) {
      this.closeModal.emit();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal.emit();
    }
  }

  emailLogin = '';
  passwordLogin = '';
  emailRegister = '';
  passwordRegister = '';
  confirmPassword = '';
  name = '';
  showPassword: boolean = false;
  isFocused1: boolean = false;
  isFocused2: boolean = false;
  @Input() showModal!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore,
    private toastr: ToastrService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  }

  async generateRandomUsernameAndAvatar() {
    const username = generateUsername('', 0, 10);
    let avatarUrl = '';

    try {
      const avatarResponse = await axios.get(
        `https://api.dicebear.com/7.x/micah/svg?flip=true&backgroundType=gradientLinear&backgroundRotation[]&baseColor=f9c9b6,ac6651&earringsProbability=15&facialHair=scruff&facialHairProbability=30&hair=dannyPhantom,fonze,full,pixie,turban,mrClean&hairProbability=95&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${username}`
      );
      avatarUrl = avatarResponse.request.responseURL;
    } catch (error) {
      console.error('API request failed:', error);
      avatarUrl =
        'https://res.cloudinary.com/dnp36kqdc/image/upload/v1694805447/user_s2emcd.png';
    }
    return { username, avatarUrl };
  }

  async register() {
    if (!this.validateEmail(this.emailRegister)) {
      this.toastr.warning('Por favor ingresa un correo electrónico válido.', 'Error');
      return;
    }

    if (this.passwordRegister !== this.confirmPassword) {
      this.toastr.warning('Las contraseñas no coinciden.', 'Error');
      return;
    }

    if (!this.validatePassword(this.passwordRegister)) {
      this.toastr.warning('La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial como !@#$%^&*().', 'Error');
      return;
    }    

    const { emailRegister, passwordRegister } = this;
    try {
    // Registro de usuario con Firebase Authentication
      const userCredential = await this.authService.register(
        emailRegister,
        passwordRegister
      );

      if (userCredential && userCredential.user) {
        const userUID = userCredential.user.uid;
        const userEmail = userCredential.user.email;

        const { username, avatarUrl } =
          await this.generateRandomUsernameAndAvatar();

         // Guardar datos de usuario en Firestore
        const userData = {
          username,
          avatarUrl,
          userUID,
          userEmail,
          firstName: '',
          lastName: '',
          gender: '',
          location: '',
          birthday: '',
          summary: '',
          instaId: '',
          twitterId: '',
        };

        // Store user data in Firestore's 'users' collection
        const userInstance = collection(this.firestore, 'users');
        await addDoc(userInstance, userData);

        console.log(
          'Usuario registrado exitosamente con nombre de usuario y avatar aleatorios.'
        );
        this.toastr.success('¡Usuario registrado exitosamente!', 'Éxito');
        this.handleAuthResult(userCredential, 'Registro');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      this.toastr.error('Ocurrió un error al registrar el usuario', 'Error');
    }
  }

  async login() {
    if (!this.validateEmail(this.emailLogin)) {
      this.toastr.warning('Por favor ingresa un correo electrónico válido.', 'Error');
      return;
    }

    const { emailLogin, passwordLogin } = this;
    const userCredential = await this.authService.login(
      emailLogin,
      passwordLogin
    );
    this.handleAuthResult(userCredential, 'Inicio de sesión');
  }

  async signUpWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Inicio de sesión con Google exitoso:', result);

      // Check if the user is new (just registered)
      if (result.additionalUserInfo?.isNewUser) {
        const user = result.user;

        if (user) {
          const { username, avatarUrl } =
            await this.generateRandomUsernameAndAvatar();

          const userEmail = user.email;
          // Store user data in Firestore
          const userData = {
            username,
            avatarUrl,
            userUID: user.uid,
            userEmail,
            firstName: '',
            lastName: '',
            gender: '',
            location: '',
            birthday: '',
            summary: '',
            instaId: '',
            twitterId: '',
          };

          // Store user data in Firestore's 'users' collection
          const userInstance = collection(this.firestore, 'users');
          await addDoc(userInstance, userData);

          console.log(
            'Usuario registrado con Google con nombre de usuario y avatar aleatorios.'
          );
          this.toastr.success(
            'Usuario registrado exitosamente con Google',
            'Éxito'
          );
        }
        this.router.navigate(['/bookStore']);
      }
    } catch (error) {
      console.error('Error en el registro con Google:', error);
      this.toastr.error('Error en el registro con Google', 'Error');
    }
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Inicio de sesión con Google exitoso:', result);
      this.router.navigate(['/bookStore']);
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
      this.toastr.error('Error en el inicio de sesión con Google', 'Error');
    }
  }

  private handleAuthResult(userCredential: any, action: string) {
    if (userCredential) {
      console.log(`${action} exitoso:`, userCredential.user);
      this.router.navigate(['/bookStore']);
    } else {
      console.error(`${action} fallido.`);
      this.toastr.error('Algo salió mal', 'Error');
    }
  }
}