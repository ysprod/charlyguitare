import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable contenant l'état de l'utilisateur (null si déconnecté)
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  // Connexion via la fenêtre surgissante Google
  async loginWithGoogle(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    // Force la sélection du compte Google à chaque clic
    provider.setCustomParameters({ prompt: 'select_account' });
    return this.afAuth.signInWithPopup(provider);
  }

  // Déconnexion
  async logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
