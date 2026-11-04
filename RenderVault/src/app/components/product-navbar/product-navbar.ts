import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-navbar.html',
  styleUrls: ['./product-navbar.css']
})
export class ProductNavbar implements OnInit {
  isMenuOpen = false;
  cartItemCount = 0;

  ngOnInit() {
    this.updateCartCount();
  }

  updateCartCount() {
    const savedCart = localStorage.getItem('rendervault_cart');
    if (savedCart) {
      try {
        const cartItems: any[] = JSON.parse(savedCart);
        this.cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      } catch (e) {
        this.cartItemCount = 0;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
