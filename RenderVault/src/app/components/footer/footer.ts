import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  activeModal: string | null = null;

  openModal(modalType: string) {
    this.activeModal = modalType;
    document.body.style.overflow = 'hidden'; // Bloquea el scroll de la página
  }

  closeModal() {
    this.activeModal = null;
    document.body.style.overflow = 'auto'; // Restaura el scroll
  }
}
