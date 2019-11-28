import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminGuardService } from './services/admin-guard.service';

import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const APP_ROUTES: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [ AuthGuardService, AdminGuardService ] },
	{ path: 'users', component: UsersComponent, canActivate: [ AuthGuardService, AdminGuardService ] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent, canActivate: [ AuthGuardService, AdminGuardService ] },
	{ path: '**', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
