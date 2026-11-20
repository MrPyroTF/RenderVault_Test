import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly activeCount = signal(0);
  private readonly messageSignal = signal('Cargando...');

  readonly isLoading = computed(() => this.activeCount() > 0);
  readonly message = this.messageSignal.asReadonly();

  show(message: string = 'Cargando...') {
    this.messageSignal.set(message);
    this.activeCount.update(count => count + 1);
  }

  hide() {
    this.activeCount.update(count => Math.max(0, count - 1));
    if (this.activeCount() === 0) {
      this.messageSignal.set('Cargando...');
    }
  }
}
