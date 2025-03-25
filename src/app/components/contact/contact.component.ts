import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    issueType: ['', [Validators.required]],
    message: ['', [Validators.required]],
    priority: ['normal']
  });

  issueTypes = [
    { value: 'password', label: 'Problemas con contraseña' },
    { value: 'account', label: 'Problemas con la cuenta' },
    { value: 'exchange', label: 'Problemas con intercambios' },
    { value: 'technical', label: 'Problemas técnicos' },
    { value: 'payment', label: 'Problemas con pagos' },
    { value: 'shipping', label: 'Problemas con envíos' },
    { value: 'other', label: 'Otro' }
  ];

  supportInfo = {
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturdays: '10:00 AM - 2:00 PM',
      sundays: 'Cerrado'
    },
    contact: {
      email: 'support@bookswap.com',
      phone: '+1 (555) 123-4567'
    },
    responseTime: '24-48 horas',
    faq: '/faq',
    guide: '/guide'
  };

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el tipo de problema desde los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['issue']) {
        this.contactForm.patchValue({
          issueType: params['issue']
        });
      }
    });
  }

  submitForm() {
    if (this.contactForm.invalid) {
      this.toastr.error(
        'Por favor, completa todos los campos requeridos y corrige los errores.',
        'Error'
      );
      return;
    }

    const formData = {
      ...this.contactForm.value,
      timestamp: new Date(),
      status: 'pending'
    };

    const messageInstance = collection(this.firestore, 'support_messages');
    addDoc(messageInstance, formData)
      .then(() => {
        console.log('Mensaje enviado exitosamente');
        this.toastr.success('¡Mensaje enviado exitosamente!', 'Éxito');
        this.contactForm.reset();
      })
      .catch((err) => {
        console.log(err.message);
        this.toastr.error(
          'Ocurrió un error al enviar el mensaje.',
          'Error'
        );
      });
  }

  getSupportHours() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (day === 0) { // Domingo
      return 'Cerrado';
    } else if (day === 6) { // Sábado
      if (hour >= 10 && hour < 14) {
        return 'Abierto';
      }
      return 'Cerrado';
    } else { // Lunes a Viernes
      if (hour >= 9 && hour < 18) {
        return 'Abierto';
      }
      return 'Cerrado';
    }
  }

  isSupportOpen() {
    return this.getSupportHours() === 'Abierto';
  }
}
