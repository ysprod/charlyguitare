import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  loading = false;
  showPassword = false;
  returnUrl = '/academie';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/academie';
  }

  async handleSubmit(): Promise<void> {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        this.email,
        this.password
      );
      
      // Envoi de l'email de vérification
      await credential.user?.sendEmailVerification();
      
      // Redirection vers l'espace demandé
      await this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      this.errorMessage = this.getFrenchErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  async signUpWithGoogle(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await this.afAuth.signInWithPopup(provider);
      await this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        this.errorMessage = this.getFrenchErrorMessage(error.code);
      }
    } finally {
      this.loading = false;
    }
  }

  private getFrenchErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Cette adresse e-mail est déjà utilisée par un autre compte.';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères.';
      case 'auth/invalid-email':
        return 'Adresse e-mail invalide.';
      case 'auth/network-request-failed':
        return 'Problème de connexion réseau. Vérifiez votre internet.';
      default:
        return 'Une erreur est survenue lors de l\'inscription.';
    }
  }
}
