import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import emailjs from '@emailjs/browser';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  isForgotModalOpen = false;
  forgotEmail = '';
  forgotMessage = '';
  isForgotError = false;
  isSendingEmail = false;

  private readonly apiUrl = 'http://localhost:5299/api/Usuario';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      correo: this.email.trim(),
      contrasena: this.password
    };

    this.http.post<any>(`${this.apiUrl}/login`, payload).subscribe({
      next: (foundUser) => {
        const sessionData = {
          ...foundUser,
          id: foundUser.usuarioId,
          fullName: foundUser.nombreCompleto,
          username: foundUser.nombreUsuario,
          email: foundUser.correo,
          userType: foundUser.tipoUsuario
        };

        localStorage.setItem('rendervault_session', JSON.stringify(sessionData));
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos. Verifica tus datos.';
        } else {
          const detalle =
            typeof err.error === 'string'
              ? err.error
              : err.error?.mensaje || err.error?.title || err.message || '';
          this.errorMessage = `Error ${err.status || 'de red'}: ${detalle || 'Revisa la consola del backend.'}`;
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Métodos del Modal de Recuperación
  openForgotModal(event: Event) {
    event.preventDefault();
    this.isForgotModalOpen = true;
    this.forgotEmail = '';
    this.forgotMessage = '';
    this.isForgotError = false;
  }

  closeForgotModal() {
    this.isForgotModalOpen = false;
    this.isSendingEmail = false;
  }

  sendResetEmail() {
    this.forgotMessage = '';
    this.isForgotError = false;

    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.isForgotError = true;
      this.forgotMessage = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    const emailBuscado = this.forgotEmail.trim().toLowerCase();

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: async (usuarios) => {
        const foundUser = (usuarios || []).find(
          (u: any) => (u.correo ?? u.email ?? '').toLowerCase() === emailBuscado
        );

        if (!foundUser) {
          this.isForgotError = true;
          this.forgotMessage = 'No existe ninguna cuenta registrada con este correo.';
          this.cdr.detectChanges();
          return;
        }

        this.isSendingEmail = true;
        this.cdr.detectChanges();

        const resetToken = 'TOKEN-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        const resetLink = `http://localhost:4200/forgot-password?token=${resetToken}`;
        const templateParams = {
          email: emailBuscado,
          username: foundUser.nombreUsuario || foundUser.username || 'Usuario',
          reset_link: resetLink
        };

        const SERVICE_ID = 'service_e8wy7fq';
        const TEMPLATE_ID = 'template_q3bs9tp';
        const PUBLIC_KEY = 'q17bMGrzbo1KZQPYS';

        try {
          await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
          this.isSendingEmail = false;
          this.isForgotError = false;
          this.forgotMessage = '¡Correo enviado con éxito! Revisa tu bandeja de entrada.';
        } catch (err) {
          console.error('Error al enviar EmailJS:', err);
          this.isSendingEmail = false;
          this.isForgotError = true;
          this.forgotMessage = 'Hubo un error al enviar el correo. Inténtalo de nuevo.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al verificar correo en la API:', err);
        this.isForgotError = true;
        this.forgotMessage = 'No se pudo conectar con el servidor.';
        this.cdr.detectChanges();
      }
    });
  }
}