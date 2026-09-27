import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
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
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;
    this.clearMessages();

    try {
      await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      await this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      this.errorMessage = this.getFrenchErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.loading = true;
    this.clearMessages();

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

  async onForgotPassword(): Promise<void> {
    if (!this.email) {
      this.errorMessage = 'Entrez votre e-mail pour recevoir un lien de réinitialisation.';
      return;
    }

    this.loading = true;
    this.clearMessages();

    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      this.successMessage = 'Un e-mail de réinitialisation vous a été envoyé.';
    } catch (error: any) {
      this.errorMessage = this.getFrenchErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private getFrenchErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou mot de passe incorrect.';
      case 'auth/invalid-email':
        return 'Adresse e-mail invalide.';
      case 'auth/user-disabled':
        return 'Ce compte a été désactivé.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives échouées. Réessayez plus tard.';
      case 'auth/network-request-failed':
        return 'Problème de connexion réseau. Vérifiez votre internet.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}