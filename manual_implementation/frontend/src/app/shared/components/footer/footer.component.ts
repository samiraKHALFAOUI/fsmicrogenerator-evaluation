import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <p>&copy; 2025 Inventory Management System</p>
          </div>
          
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-100);
      padding: var(--space-4) 0;
      margin-top: auto;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-info p {
      margin: 0;
      color: var(--neutral-700);
    }
    
    .footer-links {
      display: flex;
      gap: var(--space-3);
    }
    
    .footer-links a {
      color: var(--neutral-700);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links a:hover {
      color: var(--primary-500);
    }
    
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: var(--space-3);
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
}