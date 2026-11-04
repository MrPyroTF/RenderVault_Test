import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fullName = '';
  username = '';
  phone = '';
  email = '';
  password = '';
  userType = 'buyer';
  acceptCommissions = false;

  constructor(private router: Router) { }

  onRegister() {
    // Crear objeto de usuario de prueba
    const newUser = {
      fullName: this.fullName,
      username: this.username,
      phone: this.phone,
      email: this.email,
      password: this.password,
      userType: this.userType,
      acceptCommissions: this.acceptCommissions
    };

    // Obtenemos usuarios previos o inicializamos array vacío
    const existingUsers = JSON.parse(localStorage.getItem('rendervault_users') || '[]');

    // Verificamos si el correo ya existe
    const userExists = existingUsers.some((u: any) => u.email === this.email);
    if (userExists) {
      alert('Este correo electrónico ya está registrado.');
      return;
    }

    // Guardar nuevo usuario
    existingUsers.push(newUser);
    localStorage.setItem('rendervault_users', JSON.stringify(existingUsers));

    alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
    this.router.navigate(['/login']);
  }
}
