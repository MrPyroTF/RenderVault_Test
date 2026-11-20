import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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

  currentUser: any = null;
  userInitials = '';
  isUserDropdownOpen = false;

  userRoleText = 'COMPRADOR';
  isSeller = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateCartCount();
    this.checkUserSession();
  }

  @HostListener('window:cart-updated')
  onCartUpdated() {
    this.updateCartCount();
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'rendervault_session' || event.key === 'rendervault_cart') {
      this.checkUserSession();
      this.updateCartCount();
    }
  }

  checkUserSession() {
    const session = localStorage.getItem('rendervault_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);

        const nameToUse = this.currentUser.username || this.currentUser.fullName || this.currentUser.email || 'U';
        this.userInitials = nameToUse.charAt(0).toUpperCase();

        const rawRole = (this.currentUser.userType || this.currentUser.role || this.currentUser.tipo || 'comprador').toLowerCase();

        if (rawRole === 'seller' || rawRole === 'vendedor') {
          this.isSeller = true;
          this.userRoleText = 'VENDEDOR';
        } else {
          this.isSeller = false;
          this.userRoleText = 'COMPRADOR';
        }

      } catch (e) {
        this.currentUser = null;
        this.userInitials = '';
        this.isSeller = false;
      }
    } else {
      this.currentUser = null;
      this.userInitials = '';
      this.isSeller = false;
    }
  }

  updateCartCount() {
    const savedCart = localStorage.getItem('rendervault_cart');
    if (savedCart) {
      try {
        const cartItems: any[] = JSON.parse(savedCart);
        this.cartItemCount = Array.isArray(cartItems)
          ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
          : 0;
      } catch (e) {
        this.cartItemCount = 0;
      }
    } else {
      this.cartItemCount = 0;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  logout() {
    localStorage.removeItem('rendervault_session');
    this.currentUser = null;
    this.isSeller = false;
    this.isUserDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  @HostListener('window:session-expired')
  onSessionExpired() {
    this.currentUser = null;
    this.isSeller = false;
    this.isUserDropdownOpen = false;
    this.userInitials = '';
  }
}
