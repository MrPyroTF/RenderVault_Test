import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { LoadingModal } from './components/loading-modal/loading-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingModal],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('rendervault');

  private inactivityTime = 0; // Minutos acumulados de inactividad
  private checkInterval: any = null;
  private hasActivity = false;
  private boundHandleActivity: any;

  constructor(private router: Router) { }

  ngOnInit() {
    // Escucha eventos globales de interacción del usuario
    this.boundHandleActivity = () => this.registerActivity();

    window.addEventListener('mousemove', this.boundHandleActivity);
    window.addEventListener('keydown', this.boundHandleActivity);
    window.addEventListener('click', this.boundHandleActivity);
    window.addEventListener('scroll', this.boundHandleActivity);
    window.addEventListener('touchstart', this.boundHandleActivity);

    // Inicia el ciclo de verificación de 1 minuto por rendimiento
    this.checkInterval = setInterval(() => {
      this.evaluateInactivity();
    }, 60000); // 60,000 ms = 1 minuto
  }

  ngOnDestroy() {
    // Limpia los listeners y el intervalo al destruir el componente raíz
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.boundHandleActivity) {
      window.removeEventListener('mousemove', this.boundHandleActivity);
      window.removeEventListener('keydown', this.boundHandleActivity);
      window.removeEventListener('click', this.boundHandleActivity);
      window.removeEventListener('scroll', this.boundHandleActivity);
      window.removeEventListener('touchstart', this.boundHandleActivity);
    }
  }

  private registerActivity() {
    this.hasActivity = true;
  }

  private evaluateInactivity() {
    // Solo evalúa si hay una sesión activa en el sistema
    const session = localStorage.getItem('rendervault_session');
    if (!session) {
      this.inactivityTime = 0;
      return;
    }

    if (this.hasActivity) {
      // Si hubo interacción en el último minuto, reiniciamos el contador y la pausa
      this.inactivityTime = 0;
      this.hasActivity = false;
    } else {
      // Si no hubo interacción, sumamos 1 minuto a la cuenta regresiva
      this.inactivityTime++;

      // Al cumplirse los 10 minutos totales sin interacción
      if (this.inactivityTime >= 10) {
        this.logoutDueToInactivity();
      }
    }
  }

  private logoutDueToInactivity() {
    localStorage.removeItem('rendervault_session');
    this.inactivityTime = 0;
    alert('Tu sesión ha expirado por inactividad.');
    this.router.navigate(['/login']);
  }
}
