import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';

  isLoadingModalOpen = false;
  isSuccessView = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  async hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  async onSubmitNewPassword() {
    this.errorMessage = '';

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('rendervault_users') || '[]');
    const userIndex = existingUsers.findIndex((u: any) => u.resetToken === this.token);

    if (userIndex === -1) {
      this.errorMessage = 'El enlace de recuperación es inválido o ya expiró.';
      return;
    }

    this.isLoadingModalOpen = true;
    this.cdr.detectChanges();

    try {
      const hashedNewPass = await this.hashPassword(this.newPassword);

      setTimeout(() => {
        existingUsers[userIndex].password = hashedNewPass;
        delete existingUsers[userIndex].resetToken;
        localStorage.setItem('rendervault_users', JSON.stringify(existingUsers));

        this.isLoadingModalOpen = false;
        this.isSuccessView = true;
        this.cdr.detectChanges();
      }, 1500);

    } catch (error) {
      this.isLoadingModalOpen = false;
      this.errorMessage = 'Ocurrió un error inesperado al actualizar la contraseña. Inténtalo de nuevo.';
      this.cdr.detectChanges();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
