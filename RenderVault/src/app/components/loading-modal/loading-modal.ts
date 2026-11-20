import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-loading-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-modal.html',
  styleUrl: './loading-modal.css'
})
export class LoadingModal {
  protected readonly loadingService = inject(LoadingService);
}
