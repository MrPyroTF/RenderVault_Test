import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  errorMessage = ''; // Variable para controlar el mensaje de error

  constructor(private router: Router) { }

  onLogin() {
    this.errorMessage = ''; // Limpiar error previo

    const existingUsers = JSON.parse(localStorage.getItem('rendervault_users') || '[]');

    const foundUser = existingUsers.find(
      (u: any) => u.email === this.email && u.password === this.password
    );

    if (foundUser) {
      localStorage.setItem('rendervault_session', JSON.stringify(foundUser));
      this.router.navigate(['/']);
    } else {
      // Asignar el mensaje de error visual en lugar de un alert molesto
      this.errorMessage = 'Correo o contraseña incorrectos. Verifica tus datos.';
    }
  }
}
