import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

export interface PurchasedModel {
  purchaseId: string;
  orderId: string;
  productId: string;
  title: string;
  price: number;
  fileType: string;
  purchaseDate: string;
  category: 'general' | 'commission';
  downloadUrl: string;
  modelSrc: string;
}

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './my-purchases.html',
  styleUrls: ['./my-purchases.css']
})
export class MyPurchasesComponent implements OnInit {
  generalPurchases: PurchasedModel[] = [];
  commissionPurchases: PurchasedModel[] = [];

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    // Obtenemos la sesión activa del usuario actual
    const sessionRaw = localStorage.getItem('rendervault_session');
    if (!sessionRaw) {
      this.generalPurchases = [];
      this.commissionPurchases = [];
      return;
    }

    try {
      const sessionUser = JSON.parse(sessionRaw);
      const userEmail = (sessionUser.email || sessionUser.username || '').toLowerCase().trim();

      if (!userEmail) return;

      // Llave específica para este usuario
      const userKey = `rendervault_purchases_${userEmail}`;
      const saved = localStorage.getItem(userKey);

      if (saved) {
        const allPurchases: PurchasedModel[] = JSON.parse(saved);
        this.generalPurchases = allPurchases.filter(p => p.category !== 'commission');
        this.commissionPurchases = allPurchases.filter(p => p.category === 'commission');
      } else {
        this.generalPurchases = [];
        this.commissionPurchases = [];
      }
    } catch (e) {
      this.generalPurchases = [];
      this.commissionPurchases = [];
    }
  }

  downloadModel(item: PurchasedModel): void {
    if (!item.downloadUrl) {
      alert('El enlace de descarga para este archivo no está disponible.');
      return;
    }

    let directUrl = item.downloadUrl;
    const driveMatch = item.downloadUrl.match(/\/file\/d\/([^/]+)\//);
    if (driveMatch && driveMatch[1]) {
      directUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }

    const link = document.createElement('a');
    link.href = directUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
