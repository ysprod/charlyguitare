import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  ui!: firebaseui.auth.AuthUI;

  constructor(private afAuth: AngularFireAuth) {}

  ngAfterViewInit(): void {
    this.afAuth.app.then(app => {
      // Utilisation directe de firebase.auth(app) pour éviter les incohérences de prototype
      const auth = firebase.auth(app);
      
      this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

      this.ui.start('#firebaseui-auth-container', {
        signInFlow: 'popup',
        signInSuccessUrl: '/academie',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      });
    });
  }

  ngOnDestroy(): void {
    if (this.ui) {
      this.ui.reset();
    }
  }
}