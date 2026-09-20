import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Imports des composants
import { AccueilComponent } from './accueil/accueil.component';
import { EvenementsComponent } from './academie/evenements/evenements.component';
import { AnnoncesComponent } from './academie/annonces/annonces.component';
import { CoursprivesComponent } from './academie/coursprives/coursprives.component';
import { BoutiqueComponent } from './academie/boutique/boutique.component';
import { MasterclassComponent } from './academie/masterclass/masterclass.component';
import { ApprendreComponent } from './academie/apprendre/apprendre.component';
import { DocumentsComponent } from './academie/documents/documents.component';
import { EncemomentComponent } from './live/encemoment/encemoment.component';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { OffolandComponent } from './offoland/offoland.component';
import { AcademieComponent } from './academie/academie.component';
import { LiveComponent } from './live/live.component';
import { HomeComponent } from './home/home.component';
import { CharlyguitaregameComponent } from './univers/charlyguitaregame/charlyguitaregame.component';
import { RougeComponent } from './univers/rouge/rouge.component';
import { VertComponent } from './univers/vert/vert.component';
import { BleuComponent } from './univers/bleu/bleu.component';
import { BlancComponent } from './univers/blanc/blanc.component';
import { NoirComponent } from './univers/noir/noir.component';
import { PlayComponent } from './play/play.component';
import { GardienComponent } from './play/gardien/gardien.component';
import { TictactoeComponent } from './game/tictactoe/tictactoe.component';
import { CardgameComponent } from './cardgame/cardgame.component';
import { KronosComponent } from './game/kronos/kronos.component';
import { AgainComponent } from './play/again/again.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  // Page de connexion (Accessible sans authentification)
  { path: 'login', component: LoginComponent },
  //routes publiques
  { path: 'accueil', component: AccueilComponent },
  { path: 'play', component: PlayComponent },
  { path: 'offoland', component: OffolandComponent },
  { path: 'home', component: HomeComponent },
  { path: 'game', component: CharlyguitaregameComponent },
  // Ensemble des routes protégées par AuthGuard

  { path: 'academie', component: AcademieComponent, canActivate: [AuthGuard] },
  { path: 'coursprives', component: CoursprivesComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard] },
  { path: 'evenements', component: EvenementsComponent, canActivate: [AuthGuard] },
  { path: 'annonces', component: AnnoncesComponent, canActivate: [AuthGuard] },
  { path: 'boutique', component: BoutiqueComponent, canActivate: [AuthGuard] },
  { path: 'master', component: MasterclassComponent, canActivate: [AuthGuard] },
  { path: 'apprendre', component: ApprendreComponent, canActivate: [AuthGuard] },
  { path: 'encemoment', component: EncemomentComponent, canActivate: [AuthGuard] },
  { path: 'abonnement', component: AbonnementComponent, canActivate: [AuthGuard] },
  { path: 'live', component: LiveComponent, canActivate: [AuthGuard] },
  { path: 'rouge', component: RougeComponent, canActivate: [AuthGuard] },
  { path: 'vert', component: VertComponent, canActivate: [AuthGuard] },
  { path: 'bleu', component: BleuComponent, canActivate: [AuthGuard] },
  { path: 'blanc', component: BlancComponent, canActivate: [AuthGuard] },
  { path: 'noir', component: NoirComponent, canActivate: [AuthGuard] },
  { path: 'gardien', component: GardienComponent, canActivate: [AuthGuard] },
  { path: 'tictac', component: TictactoeComponent, canActivate: [AuthGuard] },
  { path: 'cards', component: CardgameComponent, canActivate: [AuthGuard] },
  { path: 'kronos', component: KronosComponent, canActivate: [AuthGuard] },
  { path: 'again', component: AgainComponent, canActivate: [AuthGuard] },

  // Redirections par défaut
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }