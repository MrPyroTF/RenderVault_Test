import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductNavbar } from '../../components/product-navbar/product-navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductNavbar, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  product: any = null;
  currentProductId: string | null = null;
  selectedFileType: string = 'fbx';

  // Estado para el sistema de reseñas
  reviews: any[] = [];
  selectedRating: number = 0;
  hoverRating: number = 0;
  newComment: string = '';

  productsDatabase: { [key: string]: any } = {
    '1': {
      title: 'Shockwave Fall Of Cybertron',
      seller: 'HighMoon',
      badge: 'Modelo 3D',
      price: 500.00,
      modelSrc: 'models/ShockWaveFOCBoneless.glb',
      description: 'Modelo 3D de alta precisión de Shockwave de Fall Of Cybertron, totalmente optimizado para animación, renders e integración en motores de videojuegos.'
    },
    '2': {
      title: 'Gutterman',
      seller: 'Hakita',
      badge: 'Modelo 3D',
      price: 350.00,
      modelSrc: 'models/GutterManBoneless.glb',
      description: 'Robot bipedo diseñado para animaciones, renders y juegos violentos, incluye rig y un extraño secreto en su vientre de metal.'
    },
    '3': {
      title: 'Doom: Super Shotgun',
      seller: 'ID Software',
      badge: 'Modelo 3D',
      price: 150.00,
      modelSrc: 'models/DoomSShotgun.glb',
      description: 'Modelo detallado de la mitica Super Shotgun del producto audiovisual DOOM (2016), que esperas para imprimir esta bellesa y decurar tu habitacion con la extrema violencia que esta representa.'
    },
    '4': {
      title: 'Chomper',
      seller: 'Pop-Cap',
      badge: 'Modelo 3D',
      price: 600.99,
      modelSrc: 'models/ChomperBoneless.glb',
      description: 'Modelo optimizado para animacion, renders, decorado 3D y videojuegos de jardineria.'
    },
    '5': {
      title: 'Casetera sospechosa',
      seller: 'Hasbro',
      badge: 'Modelo 3D',
      price: 254.86,
      modelSrc: 'models/Cassetera.glb',
      description: 'Modelo 3D de una casetera con algo que esconder, perfecta para mecanicas de espias en videojuegos y con su diseño bajo en vertices y poligonos (debido a que es mayoritariamente un cubo), podras gozar de una magnifica optimizacion!.'
    },
    '6': {
      title: 'Árbol low-poly',
      seller: 'Lo-Fy Creations',
      badge: 'Modelo 3D',
      price: 30.60,
      modelSrc: 'models/ArbolCartoon.glb',
      description: 'Te gustaria adornar los fondos de tus renders con algo un poco mas natural?, pues aprovecha este adorable arbol de una sola perspectiva con una optimizacion tan absurda que podras crear un bosque con el <3, ademas de estar en un precio bajo para que todos puedan disfrutarlo.'
    },
    '7': {
      title: 'Doom Toy',
      seller: 'ID Software',
      badge: 'Modelo 3D',
      price: 100.00,
      modelSrc: 'models/DoomToy.glb',
      description: 'Adorable modelo decorativo perfecto para renders o impresion 3D, llevate este modelo del mini DOOM GUY para demostrar tu fanatismo por la franquisia.'
    },
    '8': {
      title: 'Lancia Stratos',
      seller: 'RalleyFan',
      badge: 'Modelo 3D',
      price: 600.00,
      modelSrc: 'models/LanciaStratos.glb',
      description: 'Modelo detallado y a escala del Famoso Lancia Stratos, perfecto para animaciones, impresion y renders.'
    },
    '9': {
      title: 'Laptop Predator',
      seller: 'Gamerguy777',
      badge: 'Modelo 3D',
      price: 600.00,
      modelSrc: 'models/Laptop Predator.glb',
      description: 'Modelo detallado de la Laptop Predator de la marca Alienware, diseñado para decorar tus animaciones, juegos etc.'
    },
    '10': {
      title: 'Game Boy',
      seller: 'Gamerguy777',
      badge: 'Modelo 3D',
      price: 600.00,
      modelSrc: 'models/GameBoy.glb',
      description: 'Este modelo de la famosa Game Boy de la marca Nintendo, esta diseñado a la perfeccion para tus renders retro-nostalgicos.'
    }
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentProductId = params.get('id');
      if (this.currentProductId && this.productsDatabase[this.currentProductId]) {
        this.product = this.productsDatabase[this.currentProductId];
      } else {
        this.product = {
          title: 'Producto ' + this.currentProductId,
          seller: 'RenderVault Creator',
          badge: 'Modelo 3D',
          price: 0.00,
          description: 'Detalles generales de este modelo 3D seleccionado.'
        };
      }
      this.loadReviews();
    });
  }

  onFileChange(event: any) {
    this.selectedFileType = event.target.value;
  }

  loadReviews() {
    if (!this.currentProductId) return;
    const allReviewsData = localStorage.getItem('rendervault_reviews');
    if (allReviewsData) {
      try {
        const reviewsMap = JSON.parse(allReviewsData);
        this.reviews = reviewsMap[this.currentProductId] || [];
      } catch (e) {
        this.reviews = [];
      }
    } else {
      this.reviews = [];
    }
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  setHoverRating(rating: number) {
    this.hoverRating = rating;
  }

  clearHoverRating() {
    this.hoverRating = 0;
  }

  submitReview() {
    if (this.selectedRating === 0) {
      alert('Por favor selecciona al menos una estrella.');
      return;
    }
    if (!this.currentProductId) return;

    const newReview = {
      rating: this.selectedRating,
      comment: this.newComment.trim(),
      date: new Date().toLocaleDateString()
    };

    const allReviewsData = localStorage.getItem('rendervault_reviews');
    let reviewsMap: { [key: string]: any[] } = allReviewsData ? JSON.parse(allReviewsData) : {};

    if (!reviewsMap[this.currentProductId]) {
      reviewsMap[this.currentProductId] = [];
    }

    reviewsMap[this.currentProductId].unshift(newReview);
    localStorage.setItem('rendervault_reviews', JSON.stringify(reviewsMap));

    // Resetear formulario y recargar
    this.reviews = reviewsMap[this.currentProductId];
    this.selectedRating = 0;
    this.newComment = '';
    alert('¡Reseña añadida con éxito!');
  }

  addToCart() {
    if (!this.product || !this.currentProductId) return;

    const uniqueCartId = `${this.currentProductId}-${this.selectedFileType}`;
    const productToAdd = {
      id: uniqueCartId,
      productId: this.currentProductId,
      title: this.product.title,
      price: this.product.price,
      fileType: this.selectedFileType.toUpperCase(),
      quantity: 1
    };

    const savedCart = localStorage.getItem('rendervault_cart');
    let cartItems: any[] = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cartItems.findIndex(item => item.id === productToAdd.id);

    if (existingIndex === -1) {
      cartItems.push(productToAdd);
      localStorage.setItem('rendervault_cart', JSON.stringify(cartItems));
      alert('¡Producto añadido al carrito con éxito!');
    } else {
      alert('Este producto con este formato ya está en tu carrito.');
    }
  }
}
