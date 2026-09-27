import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CHARLY GUITARE';
  currentYear: number = new Date().getFullYear();

constructor(
    public auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  isMobileMenuOpen = false;
  isScrolled = false;

  

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onLogout(): void {
    this.closeMobileMenu();
    this.auth.logout();
    
    this.snackBar.open('Déconnexion réussie', 'Fermer', { duration: 3000 });
    this.router.navigate(['/home']); // Ajustez selon la méthode de votre service auth
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  async onGoogleLogin() {
    try {
      const result = await this.auth.loginWithGoogle();
      if (result.user) {
        this.snackBar.open(`Bienvenue ${result.user.displayName} !`, 'Fermer', { duration: 3000 });
        // Optionnel : rediriger l'utilisateur vers l'Académie après connexion
        this.router.navigate(['/academie']);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Google :', error);
      this.snackBar.open('Échec de la connexion Google', 'Fermer', { duration: 3000 });
    }
  }

  // async onLogout() {
  //   await this.auth.logout();
  //   this.snackBar.open('Déconnexion réussie', 'Fermer', { duration: 3000 });
  //   this.router.navigate(['/home']);
  // }

}
