import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Imports de vos composants
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
  { path: 'accueil', component: AccueilComponent },
{ path: 'login', component: LoginComponent },
{ path: 'academie', component: AcademieComponent, canActivate: [AuthGuard] },
  { path: 'coursprives', component: CoursprivesComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard] },


  { path: 'evenements', component: EvenementsComponent },
  { path: 'annonces', component: AnnoncesComponent },
   { path: 'boutique', component: BoutiqueComponent },
  { path: 'master', component: MasterclassComponent },
  { path: 'apprendre', component: ApprendreComponent },
   { path: 'encemoment', component: EncemomentComponent },
  { path: 'abonnement', component: AbonnementComponent },
  { path: 'offoland', component: OffolandComponent },
   { path: 'live', component: LiveComponent },
  { path: 'home', component: HomeComponent },
  { path: 'game', component: CharlyguitaregameComponent },
  { path: 'rouge', component: RougeComponent },
  { path: 'vert', component: VertComponent },
  { path: 'bleu', component: BleuComponent },
  { path: 'blanc', component: BlancComponent },
  { path: 'noir', component: NoirComponent },
  { path: 'play', component: PlayComponent },
  { path: 'gardien', component: GardienComponent },
  { path: 'tictac', component: TictactoeComponent },
  { path: 'cards', component: CardgameComponent },
  { path: 'kronos', component: KronosComponent },
  { path: 'again', component: AgainComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
