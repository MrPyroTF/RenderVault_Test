import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
export class Home implements OnInit {
  featuredProducts: any[] = [];
  isLoading = true;

  private readonly apiUrl = 'http://localhost:5299/api/Producto';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.featuredProducts = (data || []).map((p, index) => {
          const glb = p.enlaceGlb ?? p.EnlaceGlb ?? '';
          const fbx = p.enlaceFbx ?? p.EnlaceFbx ?? '';
          const obj = p.enlaceObj ?? p.EnlaceObj ?? '';

          return {
            id: String(p.productoId ?? p.ProductoId ?? index + 1),
            title: p.titulo ?? p.Titulo ?? 'Modelo 3D',
            seller: p.vendedorNombre ?? p.VendedorNombre ?? 'RenderVault',
            badge: 'Modelo 3D',
            price: Number(p.precio ?? p.Precio ?? 0),
            imageUrl: '',
            modelSrc: glb || fbx || obj || 'models/GutterManBoneless.glb',
            description: p.descripcion ?? p.Descripcion ?? '',
            visits: p.visitas ?? p.Visitas ?? 0,
            polygons: p.poligonos ?? p.Poligonos ?? 0
          };
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener productos desde la API:', err);
        this.featuredProducts = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

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