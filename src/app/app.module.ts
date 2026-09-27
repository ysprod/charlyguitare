import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/compat/analytics'; // <-- Ajout Analytics
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import 'firebase/compat/auth';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { AdminComponent } from './admin/admin.component';
import { AdmincontactComponent } from './admin/admincontact/admincontact.component';
import { AdmindocumentsComponent } from './admin/admindocuments/admindocuments.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminusersComponent } from './adminusers/adminusers.component';

@NgModule({
  declarations: [
    AppComponent,      
    LoginComponent, 
    RegisterComponent, 
    AdminComponent,
    AdmincontactComponent,
    AdmindocumentsComponent,
    AdminusersComponent
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
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireAnalyticsModule, // <-- Ajout Analytics dans les imports
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    CookieService, 
    ScreenTrackingService, // <-- Suivi automatique de la navigation de page
    UserTrackingService   // <-- Suivi automatique de la connexion utilisateur
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }