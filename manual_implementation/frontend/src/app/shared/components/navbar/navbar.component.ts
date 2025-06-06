import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span>Inventory Management System</span>
        </a>
        
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul class="navbar-nav" [class.active]="mobileMenuOpen">
          <li class="nav-item">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Dashboard</a>
          </li>
          <li class="nav-item">
            <a routerLink="/products" routerLinkActive="active" class="nav-link">Products</a>
          </li>
          <li class="nav-item">
            <a routerLink="/suppliers" routerLinkActive="active" class="nav-link">Suppliers</a>
          </li>
          <li class="nav-item">
            <a routerLink="/customers" routerLinkActive="active" class="nav-link">Customers</a>
          </li>
          <li class="nav-item">
            <a routerLink="/listTransactions" routerLinkActive="active" class="nav-link">Transaction</a>
          </li>
          <li class="nav-item">
            <a routerLink="/inventory" routerLinkActive="active" class="nav-link">Inventory Movements</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) 0;
    }
    
    .navbar-brand {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-500);
      text-decoration: none;
    }
    
    .navbar-nav {
      display: flex;
      flex-direction :row;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-item {
      margin-left: var(--space-3);
    }
    
    .nav-link {
      color: var(--neutral-700);
      text-decoration: none;
      padding: var(--space-2);
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .nav-link:hover, .nav-link.active {
      color: var(--primary-500);
      background-color: var(--primary-50);
    }
    
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    
    .mobile-menu-btn span {
      width: 100%;
      height: 3px;
      background-color: var(--neutral-700);
      transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }
      
      .navbar-nav {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        flex-direction: column;
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: var(--space-2) 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      .navbar-nav.active {
        max-height: 300px;
      }
      
      .nav-item {
        margin: 0;
        width: 100%;
      }
      
      .nav-link {
        display: block;
        padding: var(--space-2) var(--space-3);
      }
    }
  `]
})
export class NavbarComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}