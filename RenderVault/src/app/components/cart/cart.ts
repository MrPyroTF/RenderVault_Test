import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import emailjs from '@emailjs/browser';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  fileType: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  // Control del modal de compra completada
  showSuccessModal = false;
  completedOrderId = '';
  completedOrderEmail = '';
  isProcessingCheckout = false;

  private readonly localModelsMap: { [key: string]: string } = {
    '1': 'models/ShockWaveFOCBoneless.glb',
    '2': 'models/GutterManBoneless.glb',
    '3': 'models/DoomSShotgun.glb',
    '4': 'models/ChomperBoneless.glb',
    '5': 'models/Cassetera.glb',
    '6': 'models/ArbolCartoon.glb',
    '7': 'models/DoomToy.glb',
    '8': 'models/LanciaStratos.glb',
    '9': 'models/Laptop Predator.glb',
    '10': 'models/GameBoy.glb'
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const savedCart = localStorage.getItem('rendervault_cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
      } catch (e) {
        this.cartItems = [];
      }
    }
  }

  saveCart() {
    localStorage.setItem('rendervault_cart', JSON.stringify(this.cartItems));
    window.dispatchEvent(new Event('cart-updated'));
  }

  getModelUrl(item: CartItem): string {
    return this.localModelsMap[item.productId] || 'models/ArbolCartoon.glb';
  }

  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  get iva(): number {
    return this.subtotal * 0.16;
  }

  get total(): number {
    return this.subtotal + this.iva;
  }

  get totalItems(): number {
    return this.cartItems.length;
  }

  removeItem(id: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.saveCart();
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  goToMyPurchases() {
    this.showSuccessModal = false;
    this.router.navigate(['/mis-compras']);
  }

  async checkout() {
    if (this.cartItems.length === 0 || this.isProcessingCheckout) {
      return;
    }

    const sessionRaw = localStorage.getItem('rendervault_session');
    let sessionUser: any = null;
    if (sessionRaw) {
      try {
        sessionUser = JSON.parse(sessionRaw);
      } catch (e) {
        sessionUser = null;
      }
    }

    const userEmail = sessionUser?.email?.trim();

    if (!userEmail || !userEmail.includes('@')) {
      alert('Debes iniciar sesión con una cuenta válida para completar la compra.');
      this.router.navigate(['/login']);
      return;
    }

    this.isProcessingCheckout = true;

    const orderId = 'RV-' + Math.floor(100000 + Math.random() * 900000);
    const purchaseDate = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const summaryParams = {
      email: userEmail,
      order_id: orderId,
      orders: this.cartItems.map(item => ({
        name: item.title,
        units: item.fileType,
        price: item.price.toFixed(2)
      })),
      cost: {
        subtotal: this.subtotal.toFixed(2),
        iva: this.iva.toFixed(2),
        total: this.total.toFixed(2)
      }
    };

    const productDatabase: { [key: string]: { fbx: string, glb: string, obj: string } } = {
      '1': {
        fbx: 'https://drive.google.com/file/d/19Ux3W1MHTXVGjQVZjybOko-FkhsxnDZq/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1Nu2p-fU5AN_VpZ0ruDJX8q1jL5xolxAP/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/12SUvksB5w9HLtTgp7DOGA6Fy9CQSrL_r/view?usp=sharing'
      },
      '2': {
        fbx: 'https://drive.google.com/file/d/1I80XFLi_wSqhYG8oPPpvepFyEwDO4rhw/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1ZUz5qOJj4r-nvVIcdWXozOUBY4vy5bb8/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1vb99Wkg3473y97072NH0-Xd9gFR1Ryce/view?usp=sharing'
      },
      '3': {
        fbx: 'https://drive.google.com/file/d/1q99tue_XXy5nOWAYWmcJ84a_Xildb4Nx/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1N-8znGT8QvoVSzTtLHbAILJdfTitB5h_/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1AmPfXuSGQzdilASEsxUrpywSuUTeg_ds/view?usp=sharing'
      },
      '4': {
        fbx: 'https://drive.google.com/file/d/1mJCGk-gmAqUktoDZ3nTjHe3YAABEkQQ2/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1X8kNo6s8FTSn9eJ2-K4VsNAw8U202LnI/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/13asI5FXYth2M-uA8J9LMwct-pAb19ayk/view?usp=sharing'
      },
      '5': {
        fbx: 'https://drive.google.com/file/d/1EkH_wsZSdfw_0afR9pc_JwBbkU0DOJEF/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1QyIDcaseHUYA-py4gHEqbXo65wgdcAxA/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1wQ2L_UJ0oCNH0_yTKAncIaSwJX-UlZ4P/view?usp=sharing'
      },
      '6': {
        fbx: 'https://drive.google.com/file/d/15Wvs3vmZchYrVamesiKy-QG68joYX4tD/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1CxAuISgPD94VMsHL1GuyWPrm6rL4qBFN/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1FXy3-LgpWh1Xu2uk2AeUWLisZi8RWrIE/view?usp=sharing'
      },
      '7': {
        fbx: 'https://drive.google.com/file/d/1PoyvFV3Sju0J2tSOBFPIVdSd5yuN5n2L/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1VFyrDawxr8GHpDN3uNIn0NWks_cDk_HR/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1IQsFDphyiBNJubAos8BVsCupdKdtoAya/view?usp=sharing'
      },
      '8': {
        fbx: 'https://drive.google.com/file/d/125A4JdPYzvaDO4h40Q-caYQ61X3n-dVF/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1TgRZMQ5tRlR9xZsY6oiz_xXhKUYq8oTB/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1-mR_TLQCyPAhuQWiUzib9yzA3P1FaNl-/view?usp=sharing'
      },
      '9': {
        fbx: 'https://drive.google.com/file/d/1GNuWrk5THrdSQ26YjLbwpscC9ksDPWjc/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1D_CNfpNr4Ex29XWCkSw0JJNPFe_xdWtv/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1_dBYyOD9s0W5ka0dH8xxloHeT5YGYDmB/view?usp=sharing'
      },
      '10': {
        fbx: 'https://drive.google.com/file/d/1Jk9YNhUj3lSbuCQ1g1fpKt85asfXcdtq/view?usp=sharing',
        glb: 'https://drive.google.com/file/d/1Ud7ydjXMaItI48rn_S6WkPPj6nfBPdtv/view?usp=sharing',
        obj: 'https://drive.google.com/file/d/1UvqUN0u5FXOGV1G5mQwXKdn-AQsrB45B/view?usp=sharing'
      }
    };

    const purchasedItemsToSave = this.cartItems.map(item => {
      const product = productDatabase[item.productId];
      let fileLink = '';

      if (product) {
        const format = item.fileType.toLowerCase();
        if (format === 'fbx') fileLink = product.fbx;
        if (format === 'glb') fileLink = product.glb;
        if (format === 'obj') fileLink = product.obj;
      }

      return {
        purchaseId: `${orderId}-${item.id}`,
        orderId: orderId,
        productId: item.productId,
        title: item.title,
        price: item.price,
        fileType: item.fileType,
        purchaseDate: purchaseDate,
        category: 'general',
        downloadUrl: fileLink,
        modelSrc: this.getModelUrl(item)
      };
    });

    const SERVICE_ID = 'service_xj4fn7q';
    const PUBLIC_KEY = 'lxcAsElzwVw3ve67E';
    const TEMPLATE_SUMMARY_ID = 'template_vjf6evd';

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_SUMMARY_ID, summaryParams, PUBLIC_KEY);

      const accountIdentifier = userEmail.toLowerCase();
      const userKey = `rendervault_purchases_${accountIdentifier}`;

      const existingPurchasesRaw = localStorage.getItem(userKey);
      const existingPurchases = existingPurchasesRaw ? JSON.parse(existingPurchasesRaw) : [];
      localStorage.setItem(
        userKey,
        JSON.stringify([...purchasedItemsToSave, ...existingPurchases])
      );

      this.completedOrderId = orderId;
      this.completedOrderEmail = userEmail;
      this.cartItems = [];
      this.saveCart();
      this.showSuccessModal = true;

    } catch (err) {
      console.error('Error al procesar el correo de compra:', err);
      alert('Hubo un problema al enviar el recibo de compra.');
    } finally {
      this.isProcessingCheckout = false;
    }
  }
}
