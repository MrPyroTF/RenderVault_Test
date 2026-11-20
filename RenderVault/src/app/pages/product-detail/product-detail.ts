import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductNavbar } from '../../components/product-navbar/product-navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductNavbar, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  private readonly apiBase = 'http://localhost:5299/api';

  product: any = null;
  currentProductId: string | null = null;
  selectedFileType: string = 'fbx';

  // Estado para el sistema de reseñas
  reviews: any[] = [];
  selectedRating: number = 0;
  hoverRating: number = 0;
  newComment: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentProductId = params.get('id');
      if (this.currentProductId) {
        const idNum = Number(this.currentProductId);
        this.cargarProducto(idNum);
        this.loadReviews(idNum);
      }
    });
  }

  private cargarProducto(id: number): void {
    this.http.get<any>(`${this.apiBase}/Producto/${id}`).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res[0] : res;

        if (!data) {
          this.product = null;
          this.cdr.detectChanges();
          return;
        }

        const glb = data.enlaceGlb ?? data.EnlaceGlb ?? '';
        const fbx = data.enlaceFbx ?? data.EnlaceFbx ?? '';
        const obj = data.enlaceObj ?? data.EnlaceObj ?? '';

        const modelo3d =
          data.modelSrc ||
          glb ||
          fbx ||
          obj ||
          'models/ShockWaveFOCBoneless.glb';

        const titulo = data.titulo ?? data.Titulo ?? data.title ?? `Producto ${id}`;
        const descripcion = data.descripcion ?? data.Descripcion ?? data.description ?? '';
        const precio = Number(data.precio ?? data.Precio ?? data.price ?? 0);

        this.product = {
          ...data,
          id: data.productoId ?? data.ProductoId ?? data.id ?? id,
          title: titulo,
          badge: data.badge ?? 'Modelo 3D',
          price: precio,
          description: descripcion,
          seller: data.vendedorNombre ?? data.VendedorNombre ?? data.seller ?? 'RenderVault',
          visits: data.visitas ?? data.Visitas ?? 0,
          polygons: data.poligonos ?? data.Poligonos ?? 0,
          modelSrc: modelo3d,
          alt: titulo
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar producto desde la API:', err);
        this.product = null;
        this.cdr.detectChanges();
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFileType = event.target.value;
  }

  loadReviews(productId?: number) {
    const idNum = productId ?? Number(this.currentProductId);
    if (!idNum) return;

    this.http.get<any[]>(`${this.apiBase}/Review`).subscribe({
      next: (allReviews) => {
        const filtradas = (allReviews || []).filter(
          (r) => Number(r.productoId ?? r.ProductoId) === idNum
        );
        this.reviews = filtradas.map((r) => ({
          rating: r.calificacion ?? r.Calificacion ?? r.rating ?? 5,
          comment: r.comentario ?? r.Comentario ?? r.comment ?? '',
          date: r.fechaResena ?? r.FechaResena ?? r.date ?? ''
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reseñas desde la API:', err);
        this.reviews = [];
        this.cdr.detectChanges();
      }
    });
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

    let usuarioId = 1;
    const rawSession =
      localStorage.getItem('rendervault_session') ||
      localStorage.getItem('usuario') ||
      localStorage.getItem('cliente');
    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession);
        usuarioId = Number(parsed.usuarioId ?? parsed.id ?? 1) || 1;
      } catch {
        usuarioId = 1;
      }
    }

    const payload = {
      productoId: Number(this.currentProductId),
      usuarioId,
      calificacion: this.selectedRating,
      comentario: this.newComment.trim()
    };

    this.http.post<any>(`${this.apiBase}/Review`, payload).subscribe({
      next: () => {
        this.selectedRating = 0;
        this.newComment = '';
        this.loadReviews(Number(this.currentProductId));
        this.cdr.detectChanges();
        alert('¡Reseña añadida con éxito!');
      },
      error: (err) => {
        console.error('Error al guardar reseña en la API:', err);
        alert('No fue posible enviar la reseña.');
      }
    });
  }

  private appendSelectedProductToCart(): boolean {
    if (!this.product || !this.currentProductId) return false;

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

    const existingIndex = cartItems.findIndex((item) => item.id === productToAdd.id);

    if (existingIndex === -1) {
      cartItems.push(productToAdd);
      localStorage.setItem('rendervault_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cart-updated'));
      return true;
    }

    return false;
  }

  addToCart() {
    this.appendSelectedProductToCart();
  }

  buyNow() {
    this.appendSelectedProductToCart();
    this.router.navigate(['/carrito']);
  }
}