import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  currentUser: any = null;
  isDropdownOpen = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateCartCount();
    this.loadUserSession();
  }

  @HostListener('window:cart-updated')
  onCartUpdated() {
    this.updateCartCount();
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'rendervault_cart') {
      this.updateCartCount();
    }
    if (event.key === 'rendervault_session') {
      this.loadUserSession();
    }
  }

  loadUserSession() {
    const session = localStorage.getItem('rendervault_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('rendervault_session');
    this.currentUser = null;
    this.isDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  @HostListener('window:session-expired')
  onSessionExpired() {
    this.currentUser = null;
    this.isDropdownOpen = false;
  }
}
