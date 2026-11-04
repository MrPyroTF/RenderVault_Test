import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  cartCount = 0;

  ngOnInit() {
    this.updateCartCount();
  }

  updateCartCount() {
    const savedCart = localStorage.getItem('rendervault_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        this.cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
      } catch (e) {
        this.cartCount = 0;
      }
    } else {
      this.cartCount = 0;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
