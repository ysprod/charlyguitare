import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdmincontactComponent } from './admin/admincontact/admincontact.component';
import { AdmindocumentsComponent } from './admin/admindocuments/admindocuments.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminusersComponent } from './adminusers/adminusers.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'contact', pathMatch: 'full' }, // Redirige /admin vers /admin/contact
      { path: 'contact', component: AdmincontactComponent },
      { path: 'documents', component: AdmindocumentsComponent },
      { path: 'users', component: AdminusersComponent }
    ]
  },
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }