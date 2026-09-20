import { Component } from '@angular/core';
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

  async onLogout() {
    await this.auth.logout();
    this.snackBar.open('Déconnexion réussie', 'Fermer', { duration: 3000 });
    this.router.navigate(['/home']);
  }

}
