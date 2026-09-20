import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  navigateTo(targetRoute: string): void {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        // Utilisateur connecté : redirection vers la route cible
        this.router.navigate([targetRoute]);
      } else {
        // Utilisateur non connecté : redirection vers le composant de connexion
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
  }

}
