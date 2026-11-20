import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  isSubmitting = false;

  private readonly apiUrl = 'http://localhost:5299/api/Usuario';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onRegister() {
    if (!this.fullName.trim() || !this.email.trim() || !this.password) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const emailNormalizado = this.email.trim().toLowerCase();

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (usuarios) => {
        const userExists = (usuarios || []).some(
          (u) => (u.correo ?? u.email ?? '').toLowerCase() === emailNormalizado
        );

        if (userExists) {
          this.isSubmitting = false;
          alert('Este correo electrónico ya está registrado.');
          return;
        }

        const payload = {
          usuarioId: 0,
          nombreCompleto: this.fullName.trim(),
          nombreUsuario: this.username.trim(),
          telefono: this.phone.trim(),
          correo: emailNormalizado,
          contrasena: this.password,
          tipoUsuario: this.userType === 'seller' ? 'Vendedor' : 'Comprador',
          aceptaComisiones: this.userType === 'seller' ? this.acceptCommissions : false
        };

        this.http.post<any>(this.apiUrl, payload).subscribe({
          next: () => {
            this.isSubmitting = false;
            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.isSubmitting = false;
            console.error('Error al guardar usuario en la API:', err);
            alert('No se pudo crear la cuenta en la base de datos.');
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al consultar usuarios existentes:', err);
        alert('No se pudo conectar con el servidor para validar el registro.');
      }
    });
  }
}