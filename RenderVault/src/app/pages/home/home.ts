import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ProductCard
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  featuredProducts = [
    {
      id: '1',
      title: 'Shockwave FOC',
      seller: 'Aero Studio',
      price: 500.00,
      imageUrl: '',
      modelSrc: 'models/ShockWaveFOCBoneless.glb'
    },
    {
      id: '2',
      title: 'Gutterman',
      seller: 'Hakita',
      badge: 'Modelo 3D',
      price: 350.00,
      modelSrc: 'models/GutterManBoneless.glb',
      description: 'Robot bipedo diseñado para animaciones, renders y juegos violentos, incluye rig y un extraño secreto en su vientre de metal.'
    },
    {
      id: '3',
      title: 'Doom: Super Shotgun',
      seller: 'ID Software',
      badge: 'Modelo 3D',
      price: 150.00,
      modelSrc: 'models/DoomSShotgun.glb',
      description: 'Modelo detallado de la mitica Super Shotgun del producto audiovisual DOOM (2016), que esperas para imprimir esta bellesa y decurar tu habitacion con la extrema violencia que esta representa.'
    },
    {
      id: '4',
      title: 'Chomper',
      seller: 'Pop-Cap',
      badge: 'Modelo 3D',
      price: 600.99,
      modelSrc: 'models/ChomperBoneless.glb',
      description: 'Modelo optimizado para animacion, renders, decorado 3D y videojuegos de jardineria.'
    },
    {
      id: '5',
      title: 'Casetera sospechosa',
      seller: 'Hasbro',
      badge: 'Modelo 3D',
      price: 254.86,
      modelSrc: 'models/Cassetera.glb',
      description: '.'
    },
    {
      id: '6',
      title: 'Árbol low-poly',
      seller: 'Lo-Fy Creations',
      badge: 'Modelo 3D',
      price: 30.60,
      modelSrc: 'models/ArbolCartoon.glb',
      description: 'Te gustaria adornar los fondos de tus renders con algo un poco mas natural?, pues aprovecha este adorable arbol de una sola perspectiva con una optimizacion tan absurda que podras crear un bosque con el <3, ademas de estar en un precio bajo para que todos puedan disfrutarlo.'
    },
    {
      id: '7',
      title: 'Doom Toy',
      seller: 'ID Software',
      badge: 'Modelo 3D',
      price: 100.00,
      modelSrc: 'models/DoomToy.glb',
      description: 'Adorable modelo decorativo perfecto para renders o impresion 3D, llevate este modelo del mini DOOM GUY para demostrar tu fanatismo por la franquisia.'
    },
    {
      id: '8',
      title: 'Lancia Stratos',
      seller: 'RalleyFan',
      badge: 'Modelo 3D',
      price: 600.00,
      modelSrc: 'models/LanciaStratos.glb',
      description: 'Modelo detallado y a escala del Famoso Lancia Stratos, perfecto para animaciones, impresion y renders.'
    },
    {
      id: '9',
      title: 'Laptop Predator',
      seller: 'Gamerguy777',
      badge: 'Modelo 3D',
      price: 600.00,
      modelSrc: 'models/Laptop Predator.glb',
      description: 'Modelo detallado de la Laptop Predator de la marca Alienware, diseñado para decorar tus animaciones, juegos etc.'
    },
    {
      id: '10',
      title: 'Game Boy',
      seller: 'Gamerguy777',
      badge: 'Modelo 3D',
      price: 600.00,
      modelSrc: 'models/GameBoy.glb',
      description: 'Este modelo de la famosa Game Boy de la marca Nintendo, esta diseñado a la perfeccion para tus renders retro-nostalgicos.'
    }
  ];

  addToCart(product: any) {
    const defaultFileType = 'FBX';
    const uniqueCartId = `${product.id}-${defaultFileType.toLowerCase()}`;

    const productToAdd = {
      id: uniqueCartId,
      productId: product.id,
      title: product.title,
      price: product.price,
      fileType: defaultFileType,
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
