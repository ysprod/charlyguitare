import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

// Firebase Compat Globals (Empêche l'erreur app.auth is not a function)
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants
import { AccueilComponent } from './accueil/accueil.component';
import { BlancComponent } from './univers/blanc/blanc.component';
import { BleuComponent } from './univers/bleu/bleu.component';
import { CardgameComponent } from './cardgame/cardgame.component';
import { GamecardComponent } from './cardgame/gamecard/gamecard.component';
import { CharlyguitaregameComponent } from './univers/charlyguitaregame/charlyguitaregame.component';
import { LemenuComponent } from './features/lemenu/lemenu.component';
import { LesliensComponent } from './features/lesliens/lesliens.component';
import { LvideoComponent } from './lvideo/lvideo.component';
import { NoirComponent } from './univers/noir/noir.component';
import { AgainComponent } from './play/again/again.component';
import { CinqComponent } from './play/cinq/cinq.component';
import { DeuxComponent } from './play/deux/deux.component';
import { GardienComponent } from './play/gardien/gardien.component';
import { PlayComponent } from './play/play.component';
import { QuatreComponent } from './play/quatre/quatre.component';
import { TroisComponent } from './play/trois/trois.component';
import { UnComponent } from './play/un/un.component';
import { RougeComponent } from './univers/rouge/rouge.component';
import { TictactoeComponent } from './game/tictactoe/tictactoe.component';
import { VertComponent } from './univers/vert/vert.component';
import { RdialogComponent } from './cardgame/rdialog/rdialog.component';
import { HomeComponent } from './home/home.component';
import { KronosComponent } from './game/kronos/kronos.component';
import { LiveComponent } from './live/live.component';
import { AcademieComponent } from './academie/academie.component';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { OffolandComponent } from './offoland/offoland.component';
import { FooterComponent } from './features/footer/footer.component';
import { EncemomentComponent } from './live/encemoment/encemoment.component';
import { DocumentsComponent } from './academie/documents/documents.component';
import { ApprendreComponent } from './academie/apprendre/apprendre.component';
import { MasterclassComponent } from './academie/masterclass/masterclass.component';
import { EvenementsComponent } from './academie/evenements/evenements.component';
import { BoutiqueComponent } from './academie/boutique/boutique.component';
import { CoursprivesComponent } from './academie/coursprives/coursprives.component';
import { AnnoncesComponent } from './academie/annonces/annonces.component';
import { LoginComponent } from './login/login.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

// Firebase Modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

// Services & Environment
import { GameService } from './services/game.service';
import { TictactoeserviceService } from './services/tictactoeservice.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    CharlyguitaregameComponent,
    RougeComponent,
    VertComponent,
    BleuComponent,
    BlancComponent,
    NoirComponent,
    PlayComponent,
    UnComponent,
    DeuxComponent,
    TroisComponent,
    QuatreComponent,
    CinqComponent,
    AgainComponent,
    LesliensComponent,
    LemenuComponent,
    LvideoComponent,
    TictactoeComponent,
    GardienComponent,
    CardgameComponent,
    GamecardComponent,
    RdialogComponent,
    KronosComponent,
    HomeComponent,
    LiveComponent,
    AcademieComponent,
    AbonnementComponent,
    OffolandComponent,
    FooterComponent,
    EncemomentComponent,
    DocumentsComponent,
    ApprendreComponent,
    MasterclassComponent,
    EvenementsComponent,
    BoutiqueComponent,
    CoursprivesComponent,
    AnnoncesComponent,
    LoginComponent,
    ProfilComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
      MatMenuModule,
    MatDividerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [CookieService, TictactoeserviceService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }