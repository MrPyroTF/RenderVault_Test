import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

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
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

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
  }

  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  get totalItems(): number {
    return this.cartItems.length;
  }

  removeItem(id: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.saveCart();
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const userEmail = prompt('Ingresa el correo electrónico para pruebas:', 'tucorreo@ejemplo.com');

    if (!userEmail || !userEmail.includes('@')) {
      alert('Debes ingresar un correo electrónico válido para continuar.');
      return;
    }

    const orderId = 'RV-' + Math.floor(100000 + Math.random() * 900000);

    const summaryParams = {
      email: userEmail,
      order_id: orderId,
      orders: this.cartItems.map(item => ({
        name: item.title,
        units: item.fileType,
        price: item.price.toFixed(2)
      })),
      cost: {
        total: this.subtotal.toFixed(2)
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

    const downloadParams = {
      email: userEmail,
      order_id: orderId,
      orders: this.cartItems.map(item => {
        const product = productDatabase[item.productId];
        let fileLink = 'ENLACE_NO_DISPONIBLE';

        if (product) {
          const format = item.fileType.toLowerCase();
          if (format === 'fbx') fileLink = product.fbx;
          if (format === 'glb') fileLink = product.glb;
          if (format === 'obj') fileLink = product.obj;
        }

        return {
          name: `${item.title} (${item.fileType})`,
          drive_link: fileLink
        };
      })
    };

    const SERVICE_ID = 'service_xj4fn7q';
    const PUBLIC_KEY = 'lxcAsElzwVw3ve67E';
    const TEMPLATE_SUMMARY_ID = 'template_vjf6evd';
    const TEMPLATE_DOWNLOAD_ID = 'template_k88w4pa';

    try {
      //Envio correo de resumen
      console.log('Enviando resumen de compra...');
      await emailjs.send(SERVICE_ID, TEMPLATE_SUMMARY_ID, summaryParams, PUBLIC_KEY);
      console.log('Resumen de compra enviado con éxito.');

      // Pausa de seguridad de 1.2 segundos para evitar bloqueo por saturación de EmailJS
      await new Promise(resolve => setTimeout(resolve, 1200));

      //Envio de correo de enlaces de descarga
      console.log('Enviando enlaces de descarga...');
      await emailjs.send(SERVICE_ID, TEMPLATE_DOWNLOAD_ID, downloadParams, PUBLIC_KEY);
      console.log('Enlaces de descarga enviados con éxito.');

      alert(`¡Proceso de pago simulado con éxito! Se han enviado dos correos a: ${userEmail}`);

      this.cartItems = [];
      this.saveCart();

    } catch (err) {
      console.error('Error al enviar los correos:', err);
      alert('Hubo un problema al enviar los correos de confirmación. Revisa la consola para más detalles.');
    }
  }
}
